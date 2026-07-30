import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { BillItem, ClubCustomer, ClubTableSetup, InventoryItem, InventoryService, SessionPlayer } from '../inventory/inventory.service';

type TableStatus = 'Available' | 'Running';
type TableType = 'Snooker' | 'Billiard';
type SessionMode = 'Time' | 'Game';

interface GameBillItem {
  amount: number;
  createdOn: Date;
  gameNo?: number;
  winnerName?: string;
  loserName?: string;
  matchLabel?: string;
  billToName?: string;
}

interface ClubTable {
  id: number;
  name: string;
  type: TableType;
  felt: 'green' | 'blue';
  minuteRate: number;
  gameRate: number;
  status: TableStatus;
  startTime?: Date;
  receiptNo?: string;
  customerId?: number;
  customerName?: string;
  customerPhone?: string;
  playerCount?: number;
  sessionMode?: SessionMode;
  players?: SessionPlayer[];
  billItems?: BillItem[];
  gameItems?: GameBillItem[];
  tableSessionId?: number;
}

interface InvoicePreview {
  receiptNo: string;
  tableName: string;
  customerName: string;
  customerPhone: string;
  players: string;
  startTime?: Date;
  endTime: Date;
  totalTime: string;
  timeAmount: number;
  gameAmount: number;
  inventoryAmount: number;
  discountAmount: number;
  paidAmount: number;
  dueAmount: number;
  totalAmount: number;
  billItems: BillItem[];
  gameItems: GameBillItem[];
  playerBills: Array<{ playerName: string; amount: number }>;
}

@Component({
  selector: 'app-inbox',
  standalone: false,
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss',
  providers: [ConfirmationService]
})
export class InboxComponent implements OnInit, OnDestroy {
  tables: ClubTable[] = [];

  selectedTable: ClubTable | null = null;
  sessionDialog = false;
  customerName = '';
  customerPhone = '';
  customerId?: number;
  playerCustomer: ClubCustomer | null = null;
  playerSuggestions: ClubCustomer[] = [];
  walkInPlayerName = '';
  sessionPlayers: SessionPlayer[] = [];
  sessionMode: SessionMode = 'Time';
  startTimeMode: 'Auto' | 'Custom' = 'Auto';
  customStartTime = '';
  discountAmount = 0;
  paidAmount = 0;
  currentTime = new Date();
  inventoryItems: InventoryItem[] = [];
  selectedInventoryItemId: number | null = null;
  inventoryQty = 1;
  invoicePreview: InvoicePreview | null = null;
  isSaving = false;
  isTableFloorLoading = true;
  loserDialog = false;
  loserDialogMode: 'add' | 'end' = 'add';
  selectedLoserName = '';
  private clockTimer: ReturnType<typeof setInterval>;
  private editedPlayerCache = new Map<number, ClubCustomer>();

  constructor(
    private inventoryService: InventoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadInventoryItems();
    this.loadClubTables();
    this.clockTimer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.clockTimer) {
      clearInterval(this.clockTimer);
    }
  }

  openTable(table: ClubTable): void {
    this.selectedTable = table;
    this.customerId = table.customerId;
    this.customerName = table.customerName || '';
    this.customerPhone = table.customerPhone || '';
    this.sessionPlayers = [...(table.players || [])];
    this.playerCustomer = null;
    this.walkInPlayerName = '';
    this.sessionMode = table.sessionMode || 'Time';
    this.startTimeMode = 'Auto';
    this.customStartTime = '';
    this.discountAmount = 0;
    this.paidAmount = this.getReceiptAmount(table);
    this.invoicePreview = null;
    this.sessionDialog = true;
  }

  saveCustomer(): void {
    if (!this.selectedTable || !this.customerName.trim()) {
      return;
    }

    const request = {
      customerName: this.customerName.trim(),
      phoneNo: this.customerPhone.trim()
    };
    const saveRequest = this.customerId
      ? this.inventoryService.updateClubCustomer({ ...request, clubCustomerId: this.customerId })
      : this.inventoryService.saveCustomer(request);

    saveRequest.subscribe(response => {
      const data = response?.data || response;
      const savedCustomerName = this.customerName.trim();
      const savedCustomerPhone = this.customerPhone.trim();
      const editedCustomerId = this.customerId;
      this.customerId = Number(data?.clubCustomerId || data?.ClubCustomerId || data?.customerId || data?.CustomerId || data?.id || data?.Id || editedCustomerId) || undefined;
      this.selectedTable!.customerId = this.customerId;
      this.selectedTable!.customerName = savedCustomerName;
      this.selectedTable!.customerPhone = savedCustomerPhone;
      this.applyEditedPlayerToDropdown(this.customerId, savedCustomerName, savedCustomerPhone);
      this.customerName = '';
      this.customerPhone = '';
      this.messageService.add({
        severity: 'success',
        summary: editedCustomerId ? 'Customer Updated' : 'Customer Added',
        detail: editedCustomerId ? 'Customer updated successfully' : 'Customer added successfully'
      });
    });
  }

  editSelectedCustomer(): void {
    if (!this.selectedTable?.customerName) {
      return;
    }

    this.customerId = this.selectedTable.customerId;
    this.customerName = this.selectedTable.customerName || '';
    this.customerPhone = this.selectedTable.customerPhone || '';

    this.messageService.add({
      severity: 'info',
      summary: 'Edit Customer',
      detail: 'Customer loaded for edit'
    });
  }

  deleteSelectedCustomer(): void {
    if (!this.selectedTable) {
      return;
    }

    this.selectedTable.customerId = undefined;
    this.selectedTable.customerName = undefined;
    this.selectedTable.customerPhone = undefined;
    this.customerId = undefined;
    this.customerName = '';
    this.customerPhone = '';

    this.messageService.add({
      severity: 'success',
      summary: 'Customer Removed',
      detail: 'Customer removed from this table'
    });
  }

  editDropdownPlayer(customer: ClubCustomer, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.customerId = customer.clubCustomerId;
    this.customerName = customer.customerName || '';
    this.customerPhone = customer.phoneNo || '';
    this.playerCustomer = null;

    this.messageService.add({
      severity: 'info',
      summary: 'Edit Player',
      detail: 'Player loaded in customer fields'
    });
  }

  deleteDropdownPlayer(customer: ClubCustomer, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${customer.customerName}?`,
      header: 'Delete Player',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.inventoryService.deleteClubCustomer(customer.clubCustomerId).subscribe({
          next: () => {
            this.removeDeletedPlayer(customer.clubCustomerId);
            this.messageService.add({
              severity: 'success',
              summary: 'Player Deleted',
              detail: 'Player deleted successfully'
            });
          },
          error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Delete Player',
              detail: error?.error?.message || error?.message || 'Unable to delete player'
            });
          }
        });
      }
    });
  }

  searchPlayerCustomers(event: { query: string }): void {
    const query = (event.query || '').trim();

    this.inventoryService.searchClubCustomers(query)
      .subscribe({
        next: customers => this.playerSuggestions = customers.map(customer => this.getEditedPlayer(customer)),
        error: error => {
          this.playerSuggestions = [];
          this.messageService.add({
            severity: 'error',
            summary: 'Player Search',
            detail: error?.error?.message || error?.message || 'Unable to load players'
          });
        }
      });
  }

  addCustomerPlayer(): void {
    if (!this.playerCustomer) {
      return;
    }

    const player: SessionPlayer = {
      clubCustomerId: this.playerCustomer.clubCustomerId,
      playerName: this.playerCustomer.customerName,
      phoneNo: this.playerCustomer.phoneNo,
      isWalkIn: false
    };

    this.addPlayer(player);
    this.playerCustomer = null;
  }

  addWalkInPlayer(): void {
    const name = this.walkInPlayerName.trim();
    if (!name) {
      return;
    }

    this.addPlayer({ playerName: name, isWalkIn: true });
    this.walkInPlayerName = '';
  }

  removePlayer(index: number): void {
    this.sessionPlayers.splice(index, 1);
    if (this.selectedTable) {
      this.selectedTable.players = [...this.sessionPlayers];
      this.selectedTable.playerCount = this.sessionPlayers.length;
    }
  }

  startSession(): void {
    const firstPlayer = this.sessionPlayers[0];
    const sessionCustomerName = this.customerName.trim() || this.selectedTable?.customerName || firstPlayer?.playerName || '';
    const sessionCustomerPhone = this.customerPhone.trim() || this.selectedTable?.customerPhone || firstPlayer?.phoneNo || '';

    if (!this.selectedTable || !sessionCustomerName) {
      return;
    }

    const requestedStartTime = this.getRequestedStartTime();
    if (this.isCustomStartTimeInFuture()) {
      this.messageService.add({ severity: 'warn', summary: 'Invalid start time', detail: 'Custom start time cannot be in the future.' });
      return;
    }

    this.ensureSessionPlayers(sessionCustomerName, sessionCustomerPhone);
    this.isSaving = true;

    this.inventoryService.startTableSession({
      tableNo: this.selectedTable.id,
      tableName: this.selectedTable.name,
      tableType: this.selectedTable.type,
      clubCustomerId: this.customerId,
      customerName: sessionCustomerName,
      customerPhone: sessionCustomerPhone,
      playerCount: this.sessionPlayers.length,
      sessionMode: this.sessionMode,
      hourlyRate: this.selectedTable.minuteRate * 60,
      minuteRate: this.selectedTable.minuteRate,
      gameRate: this.selectedTable.gameRate,
      startTime: requestedStartTime?.toISOString()
    }).pipe(
      switchMap(response => {
        const data = response?.data || response;
        const tableSessionId = Number(data?.tableSessionId || data?.TableSessionId || data?.id || data?.Id);
        this.applyStartedSession(this.selectedTable!, tableSessionId, requestedStartTime || data?.startTime || data?.StartTime, sessionCustomerName, sessionCustomerPhone);

        const playerCalls = this.sessionPlayers.map(player =>
          this.inventoryService.addPlayerToSession(tableSessionId, player).pipe(catchError(() => of(null)))
        );
        const sessionCalls = [...playerCalls];

        if (this.sessionMode === 'Game' && tableSessionId) {
          sessionCalls.push(
            this.inventoryService.addGameToSession(tableSessionId, this.selectedTable!.gameRate).pipe(catchError(() => of(null)))
          );
          this.selectedTable!.gameItems = [{ amount: this.selectedTable!.gameRate, createdOn: new Date(), gameNo: 1 }];
          this.paidAmount = this.getNetAmount(this.selectedTable!);
        }

        if (!sessionCalls.length) {
          return of([]);
        }

        return forkJoin(sessionCalls);
      })
    ).subscribe({
      next: () => {
        this.isSaving = false;
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }

  addGame(): void {
    if (!this.selectedTable || !this.selectedTable.tableSessionId) {
      return;
    }

    if (this.selectedTable.sessionMode === 'Game') {
      this.openLoserDialog('add');
      return;
    }

    this.addGameCharge();
  }

  confirmGameLoser(): void {
    if (!this.selectedTable || !this.selectedLoserName) {
      return;
    }

    this.applyGameResult(this.selectedLoserName);
    this.loserDialog = false;

    if (this.loserDialogMode === 'end') {
      this.finishSession();
      return;
    }

    this.addGameCharge();
  }

  getGameHistory(table: { gameItems?: GameBillItem[] }): GameBillItem[] {
    return (table.gameItems || []).filter(game => game.loserName || game.winnerName);
  }

  getPlayerGameBills(table: ClubTable): Array<{ playerName: string; amount: number }> {
    const players = (table.players || []).map(player => player.playerName).filter(Boolean);

    return players.map(playerName => ({
      playerName,
      amount: (table.gameItems || [])
        .filter(game => game.billToName === playerName)
        .reduce((total, game) => total + game.amount, 0)
    }));
  }

  getFinalBillTo(table: ClubTable): string {
    const bills = this.getPlayerGameBills(table);
    const highestBill = bills.sort((a, b) => b.amount - a.amount)[0];
    return highestBill?.amount > 0 ? highestBill.playerName : table.customerName || this.customerName || 'Walk-in Customer';
  }

  getLoserDialogTitle(): string {
    const gameNo = this.getCurrentGameNo();
    const matchLabel = this.getMatchLabel(gameNo);
    return this.loserDialogMode === 'end'
      ? `${matchLabel} - Select Final Loser`
      : `${matchLabel} - Who Lost?`;
  }

  getWinnerForLoser(loserName: string): string {
    return this.sessionPlayers.find(player => player.playerName !== loserName)?.playerName || 'Winner';
  }

  getGameButtonLabel(): string {
    return `Add Game AED ${this.selectedTable?.gameRate || 0}`;
  }

  setStartTimeMode(mode: 'Auto' | 'Custom'): void {
    this.startTimeMode = mode;
    if (mode === 'Custom' && !this.customStartTime) {
      this.customStartTime = this.toDateTimeLocalValue(new Date());
    }
  }

  onCustomStartTimeChange(): void {
    if (!this.isCustomStartTimeInFuture()) {
      return;
    }

    this.customStartTime = this.getMaxStartTimeValue();
    this.messageService.add({ severity: 'warn', summary: 'Invalid start time', detail: 'Custom start time cannot be in the future.' });
  }

  getMaxStartTimeValue(): string {
    return this.toDateTimeLocalValue(new Date());
  }

  isStartGameDisabled(): boolean {
    const hasCustomerOrPlayer = !!(this.customerName || this.selectedTable?.customerName || this.sessionPlayers.length);
    return !hasCustomerOrPlayer || this.isSaving || this.isCustomStartTimeInFuture();
  }

  private addGameCharge(): void {
    if (!this.selectedTable || !this.selectedTable.tableSessionId) {
      return;
    }

    const amount = this.selectedTable.gameRate;
    this.inventoryService.addGameToSession(this.selectedTable.tableSessionId, amount).subscribe(() => {
      this.selectedTable!.gameItems = this.selectedTable!.gameItems || [];
      this.selectedTable!.gameItems.push({
        amount,
        createdOn: new Date(),
        gameNo: this.selectedTable!.gameItems.length + 1
      });
      this.paidAmount = this.getNetAmount(this.selectedTable!);
    });
  }

  endSession(): void {
    if (!this.selectedTable) {
      return;
    }

    if (this.selectedTable.sessionMode === 'Game' && this.hasUnrecordedGameResult(this.selectedTable)) {
      this.openLoserDialog('end');
      return;
    }

    this.finishSession();
  }

  private finishSession(): void {
    if (!this.selectedTable) {
      return;
    }

    const invoice = this.createInvoicePreview(this.selectedTable);
    const tableSessionId = this.selectedTable.tableSessionId;

    const closeSession = () => {
      this.invoicePreview = invoice;
      this.resetTable(this.selectedTable!);
    };

    if (!tableSessionId) {
      closeSession();
      return;
    }

    this.inventoryService.endTableSession({
      tableSessionId,
      discountAmount: this.discountAmount || 0,
      paidAmount: this.paidAmount || 0
    }).subscribe(() => closeSession());
  }

  closeInvoice(): void {
    this.invoicePreview = null;
    this.sessionDialog = false;
  }

  printReceipt(): void {
    const receipt = document.querySelector('.thermal-receipt') as HTMLElement;

    if (!receipt) {
      return;
    }

    const printWindow = window.open('', '_blank', 'width=380,height=720');

    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Next Shot Receipt</title>
          <style>
            @page { size: 80mm auto; margin: 4mm; }
            * { box-sizing: border-box; }
            body { margin: 0; background: #fff; color: #111; font-family: Consolas, "Courier New", monospace; }
            .thermal-receipt { width: 72mm; margin: 0 auto; padding: 0; border: 0; box-shadow: none; }
            .thermal-logo { margin: 0 auto 6px; width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; background: #111; color: #fff; font-weight: 900; }
            .thermal-head { text-align: center; border-bottom: 1px dashed #111; padding-bottom: 8px; margin-bottom: 8px; }
            .thermal-head h2 { margin: 0; font-size: 20px; letter-spacing: 0; }
            .thermal-head span { display: block; font-size: 11px; }
            .thermal-row, .thermal-total-row { display: flex; justify-content: space-between; gap: 8px; padding: 3px 0; font-size: 12px; }
            .thermal-items, .thermal-summary { border-top: 1px dashed #111; margin-top: 8px; padding-top: 8px; }
            .thermal-total-row { font-size: 14px; font-weight: 900; border-top: 1px dashed #111; margin-top: 8px; padding-top: 8px; }
            .thermal-note { margin-top: 10px; padding-top: 8px; border-top: 1px dashed #111; text-align: center; font-size: 11px; }
          </style>
        </head>
        <body>${receipt.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }

  getDuration(startTime?: Date, endTime: Date = new Date()): string {
    if (!startTime) {
      return '00:00:00';
    }

    const elapsedSeconds = Math.max(0, Math.floor((endTime.getTime() - startTime.getTime()) / 1000));
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    return [hours, minutes, seconds].map(value => value.toString().padStart(2, '0')).join(':');
  }

  getElapsedTime(table: ClubTable): string {
    if (!table.startTime) {
      return '00:00:00';
    }

    const elapsedSeconds = this.getElapsedSeconds(table);
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    return [hours, minutes, seconds].map(value => value.toString().padStart(2, '0')).join(':');
  }

  addInventoryToBill(): void {
    if (!this.selectedTable || !this.selectedInventoryItemId || this.inventoryQty <= 0 || !this.selectedTable.tableSessionId) {
      return;
    }

    const item = this.inventoryItems.find(x => x.id === Number(this.selectedInventoryItemId));
    if (!item || item.stock < this.inventoryQty) {
      return;
    }

    const quantity = this.inventoryQty;
    this.inventoryService.addInventoryItemToSession(this.selectedTable.tableSessionId, item.id, quantity)
      .subscribe(() => {
        this.selectedTable!.billItems = this.selectedTable!.billItems || [];
        const existingItem = this.selectedTable!.billItems.find(x => x.itemId === item.id);

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          this.selectedTable!.billItems.push({ itemId: item.id, name: item.name, price: item.price, quantity });
        }

        this.selectedInventoryItemId = null;
        this.inventoryQty = 1;
        this.paidAmount = this.getNetAmount(this.selectedTable!);
        this.loadInventoryItems();
      });
  }

  getInventoryTotal(table: ClubTable): number {
    return (table.billItems || []).reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getGameTotal(table: ClubTable): number {
    return (table.gameItems || []).reduce((total, item) => total + item.amount, 0);
  }

  getTimeCharge(table: ClubTable): number {
    if (!table.startTime || table.sessionMode === 'Game') {
      return 0;
    }

    const billedMinutes = Math.max(1, Math.ceil(this.getElapsedSeconds(table) / 60));
    return billedMinutes * table.minuteRate;
  }

  getReceiptAmount(table: ClubTable): number {
    return this.getTimeCharge(table) + this.getGameTotal(table) + this.getInventoryTotal(table);
  }

  getNetAmount(table: ClubTable): number {
    return Math.max(0, this.getReceiptAmount(table) - (this.discountAmount || 0));
  }

  getDueAmount(table: ClubTable): number {
    return Math.max(0, this.getNetAmount(table) - (this.paidAmount || 0));
  }

  getPlayerNames(table: ClubTable): string {
    const names = (table.players || []).map(player => player.playerName).filter(Boolean);
    return names.length ? names.join(' vs ') : '-';
  }

  get availableTables(): number {
    return this.tables.filter(table => table.status === 'Available').length;
  }

  get runningTables(): number {
    return this.tables.filter(table => table.status === 'Running').length;
  }

  private addPlayer(player: SessionPlayer): void {
    const normalizedName = player.playerName.trim().toLowerCase();
    const duplicate = this.sessionPlayers.some(x => x.playerName.trim().toLowerCase() === normalizedName);

    if (duplicate) {
      return;
    }

    this.sessionPlayers.push(player);

    if (this.selectedTable) {
      this.selectedTable.players = [...this.sessionPlayers];
      this.selectedTable.playerCount = this.sessionPlayers.length;
    }

    if (this.selectedTable?.tableSessionId) {
      this.inventoryService.addPlayerToSession(this.selectedTable.tableSessionId, player).subscribe();
    }
  }

  private openLoserDialog(mode: 'add' | 'end'): void {
    if (!this.selectedTable) {
      return;
    }

    if (this.sessionPlayers.length < 2) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Game Result',
        detail: 'Add at least two players before selecting loser'
      });
      return;
    }

    this.loserDialogMode = mode;
    this.selectedLoserName = '';
    this.loserDialog = true;
  }

  private applyGameResult(loserName: string): void {
    if (!this.selectedTable) {
      return;
    }

    this.selectedTable.gameItems = this.selectedTable.gameItems || [];
    const gameNo = this.getCurrentGameNo();
    const matchLabel = this.getMatchLabel(gameNo);
    const winnerName = this.getWinnerForLoser(loserName);
    const pendingGame = this.selectedTable.gameItems.find(game => !game.loserName && !game.winnerName);

    if (pendingGame) {
      pendingGame.gameNo = pendingGame.gameNo || gameNo;
      pendingGame.loserName = loserName;
      pendingGame.winnerName = winnerName;
      pendingGame.matchLabel = matchLabel;
    }

    this.recalculateGameBills(this.selectedTable);
    this.selectedTable.customerName = this.getFinalBillTo(this.selectedTable);
    this.customerName = this.selectedTable.customerName;
    this.messageService.add({
      severity: 'success',
      summary: 'Game Result Saved',
      detail: `${winnerName} won, ${loserName} lost`
    });
  }

  private getCurrentGameNo(): number {
    const games = this.selectedTable?.gameItems || [];
    const pendingGame = games.find(game => !game.loserName && !game.winnerName);
    return pendingGame?.gameNo || games.length || 1;
  }

  private getMatchLabel(gameNo: number): string {
    if (gameNo >= 3 && gameNo % 2 === 1) {
      return `Best of ${gameNo}`;
    }

    return `Game ${gameNo}`;
  }

  private recalculateGameBills(table: ClubTable): void {
    const gameItems = table.gameItems || [];
    const decidedOddGames = gameItems
      .filter(game => game.gameNo && game.gameNo >= 3 && game.gameNo % 2 === 1 && game.loserName)
      .sort((a, b) => (b.gameNo || 0) - (a.gameNo || 0));
    const latestDecision = decidedOddGames[0];

    gameItems.forEach(game => {
      game.billToName = game.loserName;
    });

    if (!latestDecision?.gameNo || !latestDecision.loserName) {
      return;
    }

    gameItems.forEach(game => {
      if ((game.gameNo || 0) <= latestDecision.gameNo!) {
        game.billToName = latestDecision.loserName;
      }
    });
  }

  private hasUnrecordedGameResult(table: ClubTable): boolean {
    return table.sessionMode === 'Game' && !!(table.gameItems || []).some(game => !game.loserName && !game.winnerName);
  }

  private getRequestedStartTime(): Date | undefined {
    if (this.sessionMode !== 'Time' || this.startTimeMode !== 'Custom' || !this.customStartTime) {
      return undefined;
    }

    const date = new Date(this.customStartTime);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  private isCustomStartTimeInFuture(): boolean {
    if (this.sessionMode !== 'Time' || this.startTimeMode !== 'Custom' || !this.customStartTime) {
      return false;
    }

    const date = new Date(this.customStartTime);
    return !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
  }

  private toDateTimeLocalValue(date: Date): string {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 16);
  }

  private applyEditedPlayerToDropdown(customerId: number | undefined, customerName: string, phoneNo: string): void {
    if (!customerId) {
      return;
    }

    const editedCustomer: ClubCustomer = {
      clubCustomerId: customerId,
      customerName,
      phoneNo,
      balanceAmount: this.editedPlayerCache.get(customerId)?.balanceAmount || 0
    };

    this.editedPlayerCache.set(customerId, editedCustomer);
    this.playerSuggestions = this.playerSuggestions.map(customer =>
      customer.clubCustomerId === customerId ? editedCustomer : customer
    );
    this.sessionPlayers = this.sessionPlayers.map(player =>
      player.clubCustomerId === customerId
        ? { ...player, playerName: customerName, phoneNo }
        : player
    );

    if (this.selectedTable) {
      this.selectedTable.players = [...this.sessionPlayers];
    }
  }

  private getEditedPlayer(customer: ClubCustomer): ClubCustomer {
    return this.editedPlayerCache.get(customer.clubCustomerId) || customer;
  }

  private removeDeletedPlayer(customerId: number): void {
    this.playerSuggestions = this.playerSuggestions.filter(item => item.clubCustomerId !== customerId);
    this.sessionPlayers = this.sessionPlayers.filter(player => player.clubCustomerId !== customerId);
    this.editedPlayerCache.delete(customerId);

    if (this.playerCustomer?.clubCustomerId === customerId) {
      this.playerCustomer = null;
    }

    if (this.customerId === customerId) {
      this.customerId = undefined;
      this.customerName = '';
      this.customerPhone = '';
    }

    if (this.selectedTable?.customerId === customerId) {
      this.selectedTable.customerId = undefined;
      this.selectedTable.customerName = undefined;
      this.selectedTable.customerPhone = undefined;
    }

    if (this.selectedTable) {
      this.selectedTable.players = [...this.sessionPlayers];
      this.selectedTable.playerCount = this.sessionPlayers.length;
    }
  }

  private ensureSessionPlayers(customerName: string, customerPhone: string): void {
    if (!this.sessionPlayers.length) {
      this.sessionPlayers.push({
        clubCustomerId: this.customerId,
        playerName: customerName,
        phoneNo: customerPhone,
        isWalkIn: !this.customerId
      });
    }

    if (this.sessionPlayers.length === 1) {
      this.sessionPlayers.push({
        playerName: 'Walk-in Player',
        isWalkIn: true
      });
    }

    if (this.selectedTable) {
      this.selectedTable.players = [...this.sessionPlayers];
      this.selectedTable.playerCount = this.sessionPlayers.length;
    }
  }

  private createInvoicePreview(table: ClubTable): InvoicePreview {
    const timeAmount = this.getTimeCharge(table);
    const gameAmount = this.getGameTotal(table);
    const inventoryAmount = this.getInventoryTotal(table);
    const totalAmount = timeAmount + gameAmount + inventoryAmount;
    const discountAmount = this.discountAmount || 0;
    const paidAmount = this.paidAmount || 0;
    const endTime = new Date();

    return {
      receiptNo: table.receiptNo || this.createReceiptNo(table.id),
      tableName: table.name,
      customerName: table.sessionMode === 'Game' ? this.getFinalBillTo(table) : table.customerName || this.customerName || 'Walk-in Customer',
      customerPhone: table.customerPhone || this.customerPhone || '',
      players: this.getPlayerNames(table),
      startTime: table.startTime,
      endTime,
      totalTime: this.getDuration(table.startTime, endTime),
      timeAmount,
      gameAmount,
      inventoryAmount,
      discountAmount,
      paidAmount,
      dueAmount: Math.max(0, totalAmount - discountAmount - paidAmount),
      totalAmount: Math.max(0, totalAmount - discountAmount),
      billItems: [...(table.billItems || [])],
      gameItems: [...(table.gameItems || [])],
      playerBills: table.sessionMode === 'Game' ? this.getPlayerGameBills(table) : []
    };
  }

  private getElapsedSeconds(table: ClubTable): number {
    return Math.max(0, Math.floor((this.currentTime.getTime() - table.startTime!.getTime()) / 1000));
  }

  private createReceiptNo(tableId: number): string {
    const timestamp = Date.now().toString().slice(-6);
    return `NS-${tableId}-${timestamp}`;
  }

  private loadInventoryItems(): void {
    this.inventoryService.getItems().subscribe(items => {
      this.inventoryItems = items;
    });
  }

  private loadClubTables(): void {
    this.isTableFloorLoading = true;
    this.tables = [];

    this.inventoryService.getClubTables().subscribe({
      next: tables => {
        const activeTables = tables.filter(table => table.isActive);
        this.tables = activeTables.map(table => this.mapSetupTableToFloorTable(table));
        this.loadRunningSessions(() => {
          this.isTableFloorLoading = false;
        });
      },
      error: () => {
        this.tables = [];
        this.isTableFloorLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Tables',
          detail: 'Unable to load club tables'
        });
      }
    });
  }

  private mapSetupTableToFloorTable(table: ClubTableSetup): ClubTable {
    return {
      id: table.tableNo,
      name: table.tableName,
      type: table.tableType,
      felt: table.tableType === 'Billiard' ? 'blue' : 'green',
      minuteRate: Number(table.minuteRate || table.hourlyRate / 60),
      gameRate: Number(table.gameRate || 15),
      status: 'Available'
    };
  }

  private loadRunningSessions(onComplete?: () => void): void {
    this.inventoryService.getRunningTableSessions().subscribe({
      next: sessions => {
        sessions.forEach(session => {
          const table = this.tables.find(item => item.id === Number(session.tableNo));
          if (!table) {
            return;
          }

          table.status = 'Running';
          table.tableSessionId = session.tableSessionId;
          table.startTime = new Date(session.startTime);
          table.receiptNo = session.receiptNo || this.createReceiptNo(table.id);
          table.customerId = session.clubCustomerId;
          table.customerName = session.customerName;
          table.customerPhone = session.customerPhone;
          table.playerCount = session.playerCount;
          table.sessionMode = (session.sessionMode || 'Time') as SessionMode;
          table.minuteRate = Number(session.minuteRate || table.minuteRate);
          table.gameRate = Number(session.gameRate || table.gameRate);
          table.players = (session.tableSessionPlayers || []).map((player: any) => ({
            tableSessionPlayerId: player.tableSessionPlayerId ?? player.TableSessionPlayerId,
            clubCustomerId: player.clubCustomerId ?? player.ClubCustomerId,
            playerName: player.playerName ?? player.PlayerName,
            phoneNo: player.phoneNo ?? player.PhoneNo,
            isWalkIn: player.isWalkIn ?? player.IsWalkIn ?? false
          }));
          table.billItems = (session.tableSessionInventoryItems || []).map((item: any) => ({
            itemId: item.inventoryItemId ?? item.InventoryItemId,
            name: item.itemName ?? item.ItemName ?? item.name ?? item.Name,
            price: item.price ?? item.Price ?? item.unitPrice ?? item.UnitPrice ?? 0,
            quantity: item.quantity ?? item.Quantity ?? 1
          }));
          table.gameItems = (session.tableSessionGames || []).map((game: any) => ({
            amount: game.gameRate ?? game.GameRate ?? 0,
            createdOn: new Date(game.createdOn ?? game.CreatedOn ?? new Date()),
            gameNo: game.gameNo ?? game.GameNo,
            winnerName: game.winnerName ?? game.WinnerName,
            loserName: game.loserName ?? game.LoserName,
            matchLabel: game.matchLabel ?? game.MatchLabel
          }));
          this.recalculateGameBills(table);
        });
        onComplete?.();
      },
      error: () => {
        onComplete?.();
      }
    });
  }

  private applyStartedSession(table: ClubTable, tableSessionId: number, apiStartTime?: string | Date, customerName?: string, customerPhone?: string): void {
    const startTime = apiStartTime ? new Date(apiStartTime) : new Date();

    table.status = 'Running';
    table.startTime = startTime;
    table.receiptNo = table.receiptNo || this.createReceiptNo(table.id);
    table.customerId = this.customerId;
    table.customerName = customerName || this.customerName.trim();
    table.customerPhone = customerPhone || this.customerPhone.trim();
    table.playerCount = this.sessionPlayers.length;
    table.sessionMode = this.sessionMode;
    table.players = [...this.sessionPlayers];
    table.gameItems = [];
    table.billItems = [];
    table.tableSessionId = Number(tableSessionId) || undefined;
  }

  private resetTable(table: ClubTable): void {
    table.status = 'Available';
    table.startTime = undefined;
    table.receiptNo = undefined;
    table.customerId = undefined;
    table.customerName = undefined;
    table.customerPhone = undefined;
    table.playerCount = undefined;
    table.sessionMode = undefined;
    table.players = [];
    table.billItems = [];
    table.gameItems = [];
    table.tableSessionId = undefined;
  }
}
