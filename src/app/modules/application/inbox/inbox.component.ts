import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { BillItem, ClubCustomer, ClubTableSetup, InventoryItem, InventoryService, SessionPlayer } from '../inventory/inventory.service';

type TableStatus = 'Available' | 'Running';
type TableType = 'Snooker' | 'Billiard';
type SessionMode = 'Time' | 'Game';
type PlayType = 'Single' | 'Double';

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
  singleMinuteRate: number;
  singleGameRate: number;
  doubleMinuteRate: number;
  doubleGameRate: number;
  minuteRate: number;
  gameRate: number;
  playType?: PlayType;
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
  playType: PlayType;
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
  playerBills: PlayerPayment[];
}

interface PlayerPayment {
  clubCustomerId?: number;
  playerName: string;
  gameCount: number;
  timeAmount?: number;
  inventoryAmount: number;
  amount: number;
  discountAmount: number;
  cashAmount: number;
  cardAmount: number;
  paidAmount: number;
  dueAmount: number;
}

interface CounterSaleReceipt {
  receiptNo: string;
  customerName: string;
  customerPhone: string;
  items: BillItem[];
  totalAmount: number;
  discountAmount: number;
  cashAmount: number;
  cardAmount: number;
  paidAmount: number;
  dueAmount: number;
  createdOn: Date;
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
  playType: PlayType = 'Single';
  startTimeMode: 'Auto' | 'Custom' = 'Auto';
  customStartTime = '';
  endTimeMode: 'Auto' | 'Custom' = 'Auto';
  customEndTime = '';
  discountAmount = 0;
  paidAmount = 0;
  currentTime = new Date();
  inventoryItems: InventoryItem[] = [];
  selectedInventoryItemId: number | null = null;
  selectedInventoryBuyer = '';
  inventoryQty = 1;
  counterSaleDialog = false;
  counterSaleCustomerId?: number;
  counterSaleCustomer: ClubCustomer | null = null;
  counterSaleSuggestions: ClubCustomer[] = [];
  counterSaleCustomerName = '';
  counterSalePhone = '';
  counterSaleInventoryItemId: number | null = null;
  counterSaleQty = 1;
  counterSaleItems: BillItem[] = [];
  counterSaleDiscount = 0;
  counterSaleCash = 0;
  counterSaleCard = 0;
  counterSaleReceipt: CounterSaleReceipt | null = null;
  invoicePreview: InvoicePreview | null = null;
  isSaving = false;
  isTableFloorLoading = true;
  loserDialog = false;
  loserDialogMode: 'add' | 'end' = 'add';
  selectedLoserName = '';
  paymentDialog = false;
  playerPayments: PlayerPayment[] = [];
  generatedSlipPlayers: string[] = [];
  hourlyBillPayerName = '';
  hourlyBillPayerNames: string[] = [];
  private clockTimer: ReturnType<typeof setInterval>;
  private editedPlayerCache = new Map<number, ClubCustomer>();
  private generatedSlipSessionMap = new Map<number, string[]>();

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
    this.hourlyBillPayerName = this.sessionPlayers[0]?.playerName || table.customerName || this.customerName || '';
    this.hourlyBillPayerNames = this.hourlyBillPayerName ? [this.hourlyBillPayerName] : [];
    this.playType = table.playType || 'Single';
    this.applyPlayTypeRates(table, this.playType);
    this.startTimeMode = 'Auto';
    this.customStartTime = '';
    this.endTimeMode = 'Auto';
    this.customEndTime = '';
    this.selectedInventoryBuyer = this.getDefaultInventoryBuyer(table);
    this.discountAmount = 0;
    this.paidAmount = this.getReceiptAmount(table);
    this.invoicePreview = null;
    this.generatedSlipPlayers = table.tableSessionId ? [...(this.generatedSlipSessionMap.get(table.tableSessionId) || [])] : [];
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
      this.ensureInventoryBuyerSelection(this.selectedTable);
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
      playType: this.playType,
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
      this.openPaymentDialog();
      return;
    }

    this.addGameCharge();
  }

  getGameHistory(table: { gameItems?: GameBillItem[] }): GameBillItem[] {
    return (table.gameItems || []).filter(game => game.loserName || game.winnerName);
  }

  getPlayerGameBills(table: ClubTable): PlayerPayment[] {
    const players = (table.players || []).map(player => player.playerName).filter(Boolean);

    return players.map(playerName => {
      const player = (table.players || []).find(item => item.playerName === playerName);
      const gameAmount = (table.gameItems || [])
        .filter(game => game.billToName === playerName)
        .reduce((total, game) => total + Number(game.amount || table.gameRate || 0), 0);
      const inventoryAmount = (table.billItems || [])
        .filter(item => item.buyerName === playerName)
        .reduce((total, item) => total + item.price * item.quantity, 0);

      return {
        clubCustomerId: player?.clubCustomerId,
        playerName,
        gameCount: Math.round(gameAmount / (table.gameRate || 1)),
        inventoryAmount,
        amount: gameAmount + inventoryAmount,
        discountAmount: 0,
        cashAmount: gameAmount + inventoryAmount,
        cardAmount: 0,
        paidAmount: gameAmount + inventoryAmount,
        dueAmount: 0
      };
    });
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

  setPlayType(type: PlayType): void {
    this.playType = type;
    if (!this.selectedTable || this.selectedTable.status === 'Running') {
      return;
    }

    this.applyPlayTypeRates(this.selectedTable, type);
    this.paidAmount = this.getNetAmount(this.selectedTable);
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

    this.openPaymentDialog();
  }

  confirmEndPayments(): void {
    this.playerPayments = this.playerPayments.map(payment => this.recalculatePlayerPayment(payment));
    this.discountAmount = this.getPaymentDiscountTotal();
    this.paidAmount = this.getPaymentPaidTotal();
    this.paymentDialog = false;
    this.finishSession(false);
  }

  generatePlayerSlip(payment: PlayerPayment): void {
    if (!this.selectedTable) {
      return;
    }

    const calculatedPayment = this.recalculatePlayerPayment(payment);
    payment.discountAmount = calculatedPayment.discountAmount;
    payment.cashAmount = calculatedPayment.cashAmount;
    payment.cardAmount = calculatedPayment.cardAmount;
    payment.paidAmount = calculatedPayment.paidAmount;
    payment.dueAmount = calculatedPayment.dueAmount;
    this.invoicePreview = this.createInvoicePreview(this.selectedTable, calculatedPayment);
    if (!this.generatedSlipPlayers.includes(payment.playerName)) {
      this.generatedSlipPlayers.push(payment.playerName);
    }
    if (this.selectedTable.tableSessionId) {
      this.generatedSlipSessionMap.set(this.selectedTable.tableSessionId, [...this.generatedSlipPlayers]);
    }
    this.paymentDialog = false;
  }

  isPlayerSlipGenerated(payment: PlayerPayment): boolean {
    return this.generatedSlipPlayers.includes(payment.playerName);
  }

  areAllPlayerSlipsGenerated(): boolean {
    return this.playerPayments.length > 0 && this.playerPayments.every(payment => this.isPlayerSlipGenerated(payment));
  }

  getSlipStatusMessage(): string {
    const generatedCount = this.playerPayments.filter(payment => this.isPlayerSlipGenerated(payment)).length;
    return `${generatedCount} of ${this.playerPayments.length} slips generated`;
  }

  updatePlayerPayment(payment: PlayerPayment): void {
    const calculated = this.recalculatePlayerPayment(payment);
    payment.amount = calculated.amount;
    payment.discountAmount = calculated.discountAmount;
    payment.cashAmount = calculated.cashAmount;
    payment.cardAmount = calculated.cardAmount;
    payment.paidAmount = calculated.paidAmount;
    payment.dueAmount = calculated.dueAmount;
    this.generatedSlipPlayers = this.generatedSlipPlayers.filter(playerName => playerName !== payment.playerName);
  }

  getGameCountOptions(): number[] {
    return Array.from({ length: 21 }, (_, index) => index);
  }

  getPlayerPaymentNet(payment: PlayerPayment): number {
    return Math.max(0, payment.amount - (payment.discountAmount || 0));
  }

  getPaymentGrossTotal(): number {
    return this.playerPayments.reduce((total, payment) => total + payment.amount, 0);
  }

  getPaymentDiscountTotal(): number {
    return this.playerPayments.reduce((total, payment) => total + (payment.discountAmount || 0), 0);
  }

  getPaymentCashTotal(): number {
    return this.playerPayments.reduce((total, payment) => total + (payment.cashAmount || 0), 0);
  }

  getPaymentCardTotal(): number {
    return this.playerPayments.reduce((total, payment) => total + (payment.cardAmount || 0), 0);
  }

  getPaymentPaidTotal(): number {
    return this.playerPayments.reduce((total, payment) => total + (payment.paidAmount || 0), 0);
  }

  getPaymentDueTotal(): number {
    return this.playerPayments.reduce((total, payment) => total + (payment.dueAmount || 0), 0);
  }

  private finishSession(showFinalSlip = false): void {
    if (!this.selectedTable) {
      return;
    }

    const invoice = showFinalSlip ? this.createInvoicePreview(this.selectedTable) : null;
    const tableSessionId = this.selectedTable.tableSessionId;

    const closeSession = () => {
      if (tableSessionId) {
        this.generatedSlipSessionMap.delete(tableSessionId);
      }
      this.invoicePreview = invoice;
      this.resetTable(this.selectedTable!);
      if (!invoice) {
        this.sessionDialog = false;
      }
    };

    if (!tableSessionId) {
      closeSession();
      return;
    }

    this.inventoryService.endTableSession({
      tableSessionId,
      endTime: this.toDateTimeLocalValue(this.getSelectedEndTime()),
      playType: this.selectedTable.playType || this.playType,
      hourlyRate: this.selectedTable.minuteRate * 60,
      minuteRate: this.selectedTable.minuteRate,
      gameRate: this.selectedTable.gameRate,
      discountAmount: this.discountAmount || 0,
      paidAmount: this.paidAmount || 0,
      playerPayments: this.playerPayments
    }).subscribe(() => closeSession());
  }

  closeInvoice(): void {
    this.invoicePreview = null;
    if (this.selectedTable?.status === 'Running' && this.playerPayments.length) {
      this.paymentDialog = true;
      return;
    }

    this.sessionDialog = false;
  }

  openCounterSale(): void {
    this.counterSaleDialog = true;
    this.counterSaleReceipt = null;
    this.counterSaleCustomerId = undefined;
    this.counterSaleCustomer = null;
    this.counterSaleSuggestions = [];
    this.counterSaleCustomerName = '';
    this.counterSalePhone = '';
    this.counterSaleInventoryItemId = null;
    this.counterSaleQty = 1;
    this.counterSaleItems = [];
    this.counterSaleDiscount = 0;
    this.counterSaleCash = 0;
    this.counterSaleCard = 0;
  }

  searchCounterSaleCustomers(event: { query: string }): void {
    const query = (event.query || '').trim();

    this.inventoryService.searchClubCustomers(query).subscribe({
      next: customers => this.counterSaleSuggestions = customers.map(customer => this.getEditedPlayer(customer)),
      error: error => {
        this.counterSaleSuggestions = [];
        this.messageService.add({
          severity: 'error',
          summary: 'Customer Search',
          detail: error?.error?.message || error?.message || 'Unable to load customers'
        });
      }
    });
  }

  useCounterSaleCustomer(): void {
    if (!this.counterSaleCustomer) {
      return;
    }

    this.counterSaleCustomerId = this.counterSaleCustomer.clubCustomerId;
    this.counterSaleReceipt = null;
  }

  clearCounterSaleCustomer(): void {
    this.counterSaleCustomerId = undefined;
    this.counterSaleCustomer = null;
    this.counterSaleReceipt = null;
  }

  saveCounterSaleCustomer(): void {
    if (!this.counterSaleCustomerName.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Customer',
        detail: 'Customer name is required'
      });
      return;
    }

    const request = {
      customerName: this.counterSaleCustomerName.trim(),
      phoneNo: this.counterSalePhone.trim()
    };

    const saveRequest = this.counterSaleCustomerId
      ? this.inventoryService.updateClubCustomer({ ...request, clubCustomerId: this.counterSaleCustomerId })
      : this.inventoryService.saveCustomer(request);

    saveRequest.subscribe({
      next: response => {
        const data = response?.data || response || {};
        this.counterSaleCustomerId = Number(data?.clubCustomerId || data?.ClubCustomerId || this.counterSaleCustomerId) || undefined;
        this.applyEditedPlayerToDropdown(this.counterSaleCustomerId, request.customerName, request.phoneNo);
        this.messageService.add({
          severity: 'success',
          summary: this.counterSaleCustomerId ? 'Customer Saved' : 'Customer Added',
          detail: 'Customer saved successfully'
        });
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Customer',
          detail: error?.error?.message || error?.message || 'Unable to save customer'
        });
      }
    });
  }

  getCounterSaleItem(): InventoryItem | undefined {
    return this.inventoryItems.find(item => item.id === Number(this.counterSaleInventoryItemId));
  }

  getCounterSaleGross(): number {
    return this.counterSaleItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getCounterSaleNet(): number {
    return Math.max(0, this.getCounterSaleGross() - (Number(this.counterSaleDiscount) || 0));
  }

  getCounterSalePaid(): number {
    return Math.min(this.getCounterSaleNet(), (Number(this.counterSaleCash) || 0) + (Number(this.counterSaleCard) || 0));
  }

  getCounterSaleDue(): number {
    return Math.max(0, this.getCounterSaleNet() - this.getCounterSalePaid());
  }

  getCounterSaleCustomerName(): string {
    return this.counterSaleCustomer?.customerName || this.counterSaleCustomerName.trim() || 'Walk-in Customer';
  }

  getCounterSaleCustomerPhone(): string {
    return this.counterSaleCustomer?.phoneNo || this.counterSalePhone.trim();
  }

  isCounterSalePaymentOverPaid(): boolean {
    return ((Number(this.counterSaleCash) || 0) + (Number(this.counterSaleCard) || 0)) > this.getCounterSaleNet();
  }

  isCounterSaleDueWithoutCustomer(): boolean {
    return this.getCounterSaleDue() > 0 && !this.counterSaleCustomerId;
  }

  isCounterSaleInvalid(): boolean {
    return !this.getCounterSaleCustomerName().trim()
      || !this.counterSaleItems.length
      || this.isCounterSalePaymentOverPaid()
      || this.isCounterSaleDueWithoutCustomer()
      || !!this.counterSaleReceipt;
  }

  isCounterSaleItemInvalid(): boolean {
    const item = this.getCounterSaleItem();
    const existingQty = this.counterSaleItems
      .filter(cartItem => cartItem.itemId === (item?.inventoryItemId || item?.id))
      .reduce((total, cartItem) => total + cartItem.quantity, 0);

    return !item || this.counterSaleQty <= 0 || item.stock < existingQty + this.counterSaleQty;
  }

  addCounterSaleItem(): void {
    const item = this.getCounterSaleItem();

    if (!item || this.isCounterSaleItemInvalid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Inventory',
        detail: 'Select a valid item and quantity'
      });
      return;
    }

    const itemId = item.inventoryItemId || item.id;
    const existing = this.counterSaleItems.find(cartItem => cartItem.itemId === itemId);

    if (existing) {
      existing.quantity += this.counterSaleQty;
    } else {
      this.counterSaleItems.push({
        itemId,
        name: item.name,
        price: item.price,
        quantity: this.counterSaleQty,
        buyerName: this.getCounterSaleCustomerName(),
        clubCustomerId: this.counterSaleCustomerId
      });
    }

    this.counterSaleReceipt = null;
    this.counterSaleInventoryItemId = null;
    this.counterSaleQty = 1;
  }

  removeCounterSaleItem(index: number): void {
    this.counterSaleItems.splice(index, 1);
    this.counterSaleReceipt = null;
  }

  saveCounterSale(): void {
    if (this.isCounterSaleInvalid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Counter Sale',
        detail: this.isCounterSalePaymentOverPaid()
          ? 'Cash and card amount cannot be greater than net bill'
          : this.isCounterSaleDueWithoutCustomer()
          ? 'Select a saved customer before saving pending amount'
          : !this.getCounterSaleCustomerName().trim()
          ? 'Customer name is required'
          : 'Select a valid item and quantity'
      });
      return;
    }

    const totalAmount = this.getCounterSaleGross();
    const discountAmount = Math.min(Math.max(0, Number(this.counterSaleDiscount) || 0), totalAmount);
    const netAmount = Math.max(0, totalAmount - discountAmount);
    const cashAmount = Math.max(0, Number(this.counterSaleCash) || 0);
    const cardAmount = Math.max(0, Number(this.counterSaleCard) || 0);
    const paidAmount = cashAmount + cardAmount;
    const dueAmount = Math.max(0, netAmount - paidAmount);

    const firstItem = this.counterSaleItems[0];

    this.isSaving = true;
    this.inventoryService.createInventorySale({
      customerName: this.getCounterSaleCustomerName(),
      phoneNo: this.getCounterSaleCustomerPhone(),
      clubCustomerId: this.counterSaleCustomerId,
      inventoryItemId: firstItem.itemId,
      quantity: firstItem.quantity,
      price: firstItem.price,
      items: this.counterSaleItems.map(item => ({
        inventoryItemId: item.itemId,
        itemName: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount,
      discountAmount,
      cashAmount,
      cardAmount,
      paidAmount,
      dueAmount
    }).subscribe({
      next: response => {
        const data = response?.data || response || {};
        this.isSaving = false;
        this.counterSaleReceipt = {
          receiptNo: data.receiptNo || data.ReceiptNo || this.createReceiptNo(0),
          customerName: this.getCounterSaleCustomerName(),
          customerPhone: this.getCounterSaleCustomerPhone(),
          items: this.counterSaleItems.map(item => ({ ...item })),
          totalAmount: netAmount,
          discountAmount,
          cashAmount,
          cardAmount,
          paidAmount,
          dueAmount,
          createdOn: new Date()
        };
        this.loadInventoryItems();
        this.messageService.add({
          severity: 'success',
          summary: 'Counter Sale',
          detail: 'Sale saved successfully'
        });
      },
      error: error => {
        this.isSaving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Counter Sale',
          detail: error?.error?.message || error?.message || 'Unable to save counter sale'
        });
      }
    });
  }

  printCounterSaleReceipt(): void {
    const receipt = document.querySelector('.counter-sale-receipt') as HTMLElement;

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
          <title>Next Shot Counter Sale</title>
          <style>
            body{margin:0;background:#fff;font-family:"Courier New",monospace;color:#111}
            .counter-sale-receipt{width:300px;margin:0 auto;padding:12px}
            .thermal-head{text-align:center;border-bottom:1px dashed #111;padding-bottom:8px;margin-bottom:8px}
            .thermal-logo{display:none}
            .thermal-head h2{margin:4px 0;font-size:20px}
            .thermal-head span,.thermal-head small{display:block;font-size:12px}
            .thermal-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;padding:4px 0;font-size:13px;line-height:1.3}
            .thermal-row span{min-width:0;overflow-wrap:anywhere}
            .thermal-row strong{text-align:right;white-space:nowrap}
            .thermal-items,.thermal-summary{border-top:1px dashed #111;margin-top:8px;padding-top:8px}
            .thermal-total-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;font-size:16px;font-weight:900;border-top:1px dashed #111;margin-top:8px;padding-top:8px}
            .thermal-total-row strong{text-align:right;white-space:nowrap}
            .thermal-note{text-align:center;margin-top:10px;font-size:12px}
            .thermal-note strong,.thermal-note span{display:block}
          </style>
        </head>
        <body>${receipt.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
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
    const buyerName = this.getSelectedInventoryBuyerName();
    const buyerCustomerId = this.getSelectedInventoryBuyerCustomerId(buyerName);
    this.inventoryService.addInventoryItemToSession(this.selectedTable.tableSessionId, item.id, quantity, buyerName, buyerCustomerId)
      .subscribe(() => {
        this.selectedTable!.billItems = this.selectedTable!.billItems || [];
        const existingItem = this.selectedTable!.billItems.find(x => x.itemId === item.id && (x.buyerName || '') === buyerName);

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          this.selectedTable!.billItems.push({ itemId: item.id, name: item.name, price: item.price, quantity, buyerName, clubCustomerId: buyerCustomerId });
        }

        this.selectedInventoryItemId = null;
        this.selectedInventoryBuyer = this.getDefaultInventoryBuyer(this.selectedTable!);
        this.inventoryQty = 1;
        this.paidAmount = this.getNetAmount(this.selectedTable!);
        this.loadInventoryItems();
      });
  }

  getInventoryTotal(table: ClubTable): number {
    return (table.billItems || []).reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getPlayerInventoryDetails(payment: PlayerPayment): BillItem[] {
    if (!this.selectedTable?.billItems?.length) {
      return [];
    }

    return this.selectedTable.billItems.filter(item =>
      (payment.clubCustomerId && item.clubCustomerId === payment.clubCustomerId) ||
      item.buyerName === payment.playerName
    );
  }

  getGameTotal(table: ClubTable): number {
    return (table.gameItems || []).reduce((total, item) => total + item.amount, 0);
  }

  getTimeCharge(table: ClubTable, endTime: Date = this.currentTime): number {
    if (!table.startTime || table.sessionMode === 'Game') {
      return 0;
    }

    const elapsedSeconds = Math.max(0, Math.floor((endTime.getTime() - table.startTime.getTime()) / 1000));
    const billedMinutes = Math.max(1, Math.ceil(elapsedSeconds / 60));
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

  getInventoryBuyerOptions(table: ClubTable): Array<{ label: string; value: string }> {
    const playerOptions = (table.players || [])
      .map(player => player.playerName)
      .filter(Boolean)
      .map(playerName => ({ label: playerName, value: playerName }));

    if (table.customerName && !playerOptions.some(option => option.value === table.customerName)) {
      playerOptions.unshift({ label: table.customerName, value: table.customerName });
    }

    return playerOptions.length ? playerOptions : [{ label: 'Walk-in Customer', value: 'Walk-in Customer' }];
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
      this.ensureInventoryBuyerSelection(this.selectedTable);
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

  private openPaymentDialog(): void {
    if (!this.selectedTable) {
      return;
    }

    if (this.selectedTable.sessionMode === 'Time') {
      this.endTimeMode = 'Auto';
      this.customEndTime = this.toDateTimeLocalValue(new Date());
    }

    const playerBills = this.selectedTable.sessionMode === 'Game'
      ? this.getPlayerGameBills(this.selectedTable)
      : [];

    const assignedPlayerNames = playerBills.map(payment => payment.playerName);
    const unassignedInventory = (this.selectedTable.billItems || [])
      .filter(item => !item.buyerName || !assignedPlayerNames.includes(item.buyerName))
      .reduce((total, item) => total + item.price * item.quantity, 0);

    if (this.selectedTable.sessionMode !== 'Game') {
      this.playerPayments = this.getHourlyPlayerPayments(this.selectedTable);
    } else {
      const payments = playerBills.map(payment => ({ ...payment }));
      if (unassignedInventory > 0) {
        const firstPayment = payments[0];
        firstPayment.amount += unassignedInventory;
      }
      this.playerPayments = payments.map(payment => this.recalculatePlayerPayment(payment));
    }

    this.paymentDialog = true;
  }

  setEndTimeMode(mode: 'Auto' | 'Custom'): void {
    this.endTimeMode = mode;
    if (mode === 'Custom' && !this.customEndTime) {
      this.customEndTime = this.toDateTimeLocalValue(new Date());
    }
    this.recalculateHourlyPaymentsForEndTime();
  }

  onCustomEndTimeChange(): void {
    if (this.isCustomEndTimeInvalid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid end time',
        detail: 'Custom end time must be after start time.'
      });
      return;
    }

    this.recalculateHourlyPaymentsForEndTime();
  }

  private recalculateHourlyPaymentsForEndTime(): void {
    if (!this.selectedTable || this.selectedTable.sessionMode !== 'Time' || !this.paymentDialog) {
      return;
    }

    this.playerPayments = this.getHourlyPlayerPayments(this.selectedTable).map(payment => this.recalculatePlayerPayment(payment));
    this.syncGeneratedSlipSession();
  }

  getHourlyPayerOptions(): PlayerPayment[] {
    const table = this.selectedTable;
    const players = (table?.players || []).length
      ? table!.players!
      : [{
          clubCustomerId: table?.customerId,
          playerName: table?.customerName || this.customerName || 'Walk-in Customer',
          phoneNo: table?.customerPhone || this.customerPhone,
          isWalkIn: !table?.customerId
        }];

    const options = new Map<string, PlayerPayment>();

    players.forEach(player => {
      if (!player.playerName) {
        return;
      }

      options.set(player.playerName, {
        clubCustomerId: player.clubCustomerId,
        playerName: player.playerName,
        gameCount: 0,
        timeAmount: 0,
        inventoryAmount: 0,
        amount: 0,
        discountAmount: 0,
        cashAmount: 0,
        cardAmount: 0,
        paidAmount: 0,
        dueAmount: 0
      });
    });

    return Array.from(options.values());
  }

  onHourlyBillPayerChange(): void {
    if (!this.selectedTable || this.selectedTable.sessionMode !== 'Time') {
      return;
    }

    this.playerPayments = this.getHourlyPlayerPayments(this.selectedTable).map(payment => this.recalculatePlayerPayment(payment));
    this.syncGeneratedSlipSession();
  }

  private syncGeneratedSlipSession(): void {
    if (this.selectedTable?.tableSessionId) {
      this.generatedSlipSessionMap.set(this.selectedTable.tableSessionId, [...this.generatedSlipPlayers]);
    }
  }

  toggleHourlyBillPayer(playerName: string): void {
    if (this.hourlyBillPayerNames.includes(playerName)) {
      this.hourlyBillPayerNames = this.hourlyBillPayerNames.filter(name => name !== playerName);
    } else {
      this.hourlyBillPayerNames = [...this.hourlyBillPayerNames, playerName];
    }

    this.onHourlyBillPayerChange();
  }

  selectAllHourlyBillPayers(): void {
    this.hourlyBillPayerNames = this.getHourlyPayerOptions().map(player => player.playerName);
    this.onHourlyBillPayerChange();
  }

  private getHourlyPlayerPayments(table: ClubTable): PlayerPayment[] {
    const players = (table.players || []).length
      ? [...(table.players || [])]
      : [{
          clubCustomerId: table.customerId,
          playerName: table.customerName || this.customerName || 'Walk-in Customer',
          phoneNo: table.customerPhone || this.customerPhone,
          isWalkIn: !table.customerId
        }];

    const inventoryByPlayer = (table.billItems || []).reduce((map, item) => {
      const buyerName = item.buyerName || players[0]?.playerName || table.customerName || this.customerName || 'Walk-in Customer';
      map.set(buyerName, (map.get(buyerName) || 0) + item.price * item.quantity);
      return map;
    }, new Map<string, number>());

    const payerNames = new Set<string>(players.map(player => player.playerName).filter(Boolean));
    inventoryByPlayer.forEach((_amount, buyerName) => payerNames.add(buyerName));

    const availablePayers = players.map(player => player.playerName).filter(Boolean);
    this.hourlyBillPayerNames = this.hourlyBillPayerNames.filter(name => availablePayers.includes(name));

    if (!this.hourlyBillPayerNames.length) {
      const defaultPayer = this.hourlyBillPayerName || availablePayers[0] || table.customerName || this.customerName || 'Walk-in Customer';
      this.hourlyBillPayerNames = [defaultPayer].filter(Boolean);
    }

    const timeAmount = this.getTimeCharge(table, this.getSelectedEndTime());
    const splitPayers = this.hourlyBillPayerNames.length ? this.hourlyBillPayerNames : [players[0]?.playerName || table.customerName || this.customerName || 'Walk-in Customer'];
    const splitTimeAmount = splitPayers.length ? timeAmount / splitPayers.length : timeAmount;

    return Array.from(payerNames).map(playerName => {
      const player = players.find(item => item.playerName === playerName);
      const payerTimeAmount = splitPayers.includes(playerName) ? splitTimeAmount : 0;
      const inventoryAmount = inventoryByPlayer.get(playerName) || 0;
      const amount = payerTimeAmount + inventoryAmount;

      return {
        clubCustomerId: player?.clubCustomerId || (playerName === table.customerName ? table.customerId : undefined),
        playerName,
        gameCount: 0,
        timeAmount: payerTimeAmount,
        inventoryAmount,
        amount,
        discountAmount: 0,
        cashAmount: amount,
        cardAmount: 0,
        paidAmount: amount,
        dueAmount: 0
      };
    }).filter(payment => payment.amount > 0 || splitPayers.includes(payment.playerName));
  }

  private recalculatePlayerPayment(payment: PlayerPayment): PlayerPayment {
    const gameRate = this.selectedTable?.gameRate || 0;
    const gameCount = Math.max(0, Number(payment.gameCount) || 0);
    const timeAmount = Number(payment.timeAmount) || 0;
    const inventoryAmount = Number(payment.inventoryAmount) || 0;
    const amount = this.selectedTable?.sessionMode === 'Time'
      ? timeAmount + inventoryAmount
      : gameCount * gameRate + inventoryAmount;
    const discountAmount = Math.max(0, Math.min(Number(payment.discountAmount) || 0, amount));
    const netAmount = Math.max(0, amount - discountAmount);
    const cashAmount = Math.max(0, Number(payment.cashAmount ?? payment.paidAmount) || 0);
    const cardAmount = Math.max(0, Number(payment.cardAmount) || 0);
    const paidAmount = Math.max(0, Math.min(cashAmount + cardAmount, netAmount));

    return {
      ...payment,
      gameCount,
      timeAmount,
      inventoryAmount,
      amount,
      discountAmount,
      cashAmount,
      cardAmount,
      paidAmount,
      dueAmount: Math.max(0, netAmount - paidAmount)
    };
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
    if (this.isBestOfDecisionGame(gameNo)) {
      return `Best of ${gameNo}`;
    }

    return `Game ${gameNo}`;
  }

  private isBestOfDecisionGame(gameNo: number): boolean {
    if (gameNo < 3 || gameNo % 2 === 0 || !this.selectedTable) {
      return false;
    }

    const previousGames = (this.selectedTable.gameItems || [])
      .filter(game => (game.gameNo || 0) < gameNo && game.loserName);

    if (previousGames.length !== gameNo - 1) {
      return false;
    }

    const playerNames = (this.selectedTable.players || []).map(player => player.playerName).filter(Boolean);
    if (playerNames.length !== 2) {
      return false;
    }

    const firstLosses = previousGames.filter(game => game.loserName === playerNames[0]).length;
    const secondLosses = previousGames.filter(game => game.loserName === playerNames[1]).length;

    return firstLosses === secondLosses;
  }

  private recalculateGameBills(table: ClubTable): void {
    this.ensureGameAmounts(table);
    const gameItems = table.gameItems || [];
    const decidedOddGames = gameItems
      .filter(game => game.matchLabel?.startsWith('Best of') && game.loserName)
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

  private ensureGameAmounts(table: ClubTable): void {
    const fallbackAmount = Number(table.gameRate || (table.playType === 'Double' ? table.doubleGameRate : table.singleGameRate) || 0);

    (table.gameItems || []).forEach(game => {
      game.amount = Number(game.amount || fallbackAmount || 0);
      game.billToName = game.billToName || game.loserName;
    });
  }

  private hasUnrecordedGameResult(table: ClubTable): boolean {
    return table.sessionMode === 'Game' && !!(table.gameItems || []).some(game => !game.loserName && !game.winnerName);
  }

  private getDefaultInventoryBuyer(table: ClubTable): string {
    return table.players?.[0]?.playerName || table.customerName || this.customerName || 'Walk-in Customer';
  }

  private getSelectedInventoryBuyerName(): string {
    if (!this.selectedTable) {
      return 'Walk-in Customer';
    }

    return this.selectedInventoryBuyer || this.getDefaultInventoryBuyer(this.selectedTable);
  }

  private getSelectedInventoryBuyerCustomerId(buyerName: string): number | undefined {
    return this.selectedTable?.players?.find(player => player.playerName === buyerName)?.clubCustomerId
      || (this.selectedTable?.customerName === buyerName ? this.selectedTable.customerId : undefined);
  }

  private ensureInventoryBuyerSelection(table: ClubTable): void {
    const options = this.getInventoryBuyerOptions(table).map(option => option.value);
    if (!options.includes(this.selectedInventoryBuyer)) {
      this.selectedInventoryBuyer = options[0] || 'Walk-in Customer';
    }
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

  private getSelectedEndTime(): Date {
    if (!this.selectedTable || this.selectedTable.sessionMode !== 'Time' || this.endTimeMode !== 'Custom' || !this.customEndTime) {
      return new Date();
    }

    const date = this.parseDateTimeLocalValue(this.customEndTime);
    return Number.isNaN(date.getTime()) ? new Date() : date;
  }

  isCustomEndTimeInvalid(): boolean {
    if (!this.selectedTable || this.selectedTable.sessionMode !== 'Time' || this.endTimeMode !== 'Custom' || !this.customEndTime) {
      return false;
    }

    const date = this.parseDateTimeLocalValue(this.customEndTime);
    if (Number.isNaN(date.getTime())) {
      return true;
    }

    if (!this.selectedTable.startTime) {
      return false;
    }

    return this.toMinuteTimestamp(date) < this.toMinuteTimestamp(this.selectedTable.startTime);
  }

  private toDateTimeLocalValue(date: Date): string {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 16);
  }

  private parseDateTimeLocalValue(value: string): Date {
    const [datePart, timePart = '00:00'] = value.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);

    if (!year || !month || !day || Number.isNaN(hour) || Number.isNaN(minute)) {
      return new Date(NaN);
    }

    return new Date(year, month - 1, day, hour, minute, 0, 0);
  }

  private toMinuteTimestamp(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0, 0).getTime();
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
      this.ensureInventoryBuyerSelection(this.selectedTable);
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
      this.ensureInventoryBuyerSelection(this.selectedTable);
    }
  }

  private createInvoicePreview(table: ClubTable, playerPayment?: PlayerPayment): InvoicePreview {
    const endTime = this.getSelectedEndTime();
    const timeAmount = this.getTimeCharge(table, endTime);
    const gameAmount = this.getGameTotal(table);
    const inventoryAmount = this.getInventoryTotal(table);
    const totalAmount = timeAmount + gameAmount + inventoryAmount;
    const discountAmount = playerPayment ? (playerPayment.discountAmount || 0) : (this.discountAmount || 0);
    const paidAmount = playerPayment ? (playerPayment.paidAmount || 0) : (this.paidAmount || 0);
    const slipAmount = playerPayment ? playerPayment.amount : totalAmount;
    const playerBillItems = playerPayment
      ? (table.billItems || []).filter(item => item.buyerName === playerPayment.playerName)
      : [...(table.billItems || [])];
    const playerGameItems = playerPayment
      ? (table.gameItems || []).filter(game => game.billToName === playerPayment.playerName)
      : [...(table.gameItems || [])];

    return {
      receiptNo: table.receiptNo || this.createReceiptNo(table.id),
      tableName: table.name,
      playType: table.playType || this.playType,
      customerName: playerPayment?.playerName || (table.sessionMode === 'Game' ? this.getFinalBillTo(table) : table.customerName || this.customerName || 'Walk-in Customer'),
      customerPhone: table.customerPhone || this.customerPhone || '',
      players: this.getPlayerNames(table),
      startTime: table.startTime,
      endTime,
      totalTime: this.getDuration(table.startTime, endTime),
      timeAmount: playerPayment ? (playerPayment.timeAmount || 0) : timeAmount,
      gameAmount: playerPayment ? (playerPayment.gameCount || 0) * table.gameRate : gameAmount,
      inventoryAmount: playerPayment ? playerBillItems.reduce((total, item) => total + item.price * item.quantity, 0) : inventoryAmount,
      discountAmount,
      paidAmount,
      dueAmount: playerPayment ? playerPayment.dueAmount : Math.max(0, totalAmount - discountAmount - paidAmount),
      totalAmount: Math.max(0, slipAmount - discountAmount),
      billItems: playerBillItems,
      gameItems: playerGameItems,
      playerBills: playerPayment ? [{ ...playerPayment }] : (this.playerPayments.length ? this.playerPayments.map(payment => ({ ...payment })) : (table.sessionMode === 'Game' ? this.getPlayerGameBills(table) : []))
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
      singleMinuteRate: Number(table.minuteRate || table.hourlyRate / 60),
      singleGameRate: Number(table.gameRate || 15),
      doubleMinuteRate: Number(table.doubleMinuteRate || table.doubleHourlyRate / 60 || table.minuteRate || table.hourlyRate / 60),
      doubleGameRate: Number(table.doubleGameRate || table.gameRate || 15),
      minuteRate: Number(table.minuteRate || table.hourlyRate / 60),
      gameRate: Number(table.gameRate || 15),
      playType: 'Single',
      status: 'Available'
    };
  }

  private applyPlayTypeRates(table: ClubTable, type: PlayType): void {
    table.playType = type;
    table.minuteRate = type === 'Double' ? table.doubleMinuteRate : table.singleMinuteRate;
    table.gameRate = type === 'Double' ? table.doubleGameRate : table.singleGameRate;
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
          table.playType = (session.playType || 'Single') as PlayType;
          table.minuteRate = Number(session.minuteRate || table.minuteRate);
          table.gameRate = Number(session.gameRate || (table.playType === 'Double' ? table.doubleGameRate : table.singleGameRate) || table.gameRate);
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
            quantity: item.quantity ?? item.Quantity ?? 1,
            buyerName: item.buyerName ?? item.BuyerName ?? item.customerName ?? item.CustomerName,
            clubCustomerId: item.clubCustomerId ?? item.ClubCustomerId
          }));
          table.gameItems = (session.tableSessionGames || []).map((game: any) => ({
            amount: Number(game.amount ?? game.Amount ?? game.gameRate ?? game.GameRate ?? game.rate ?? game.Rate ?? table.gameRate ?? 0),
            createdOn: new Date(game.createdOn ?? game.CreatedOn ?? new Date()),
            gameNo: game.gameNo ?? game.GameNo,
            winnerName: game.winnerName ?? game.WinnerName,
            loserName: game.loserName ?? game.LoserName,
            matchLabel: game.matchLabel ?? game.MatchLabel,
            billToName: game.billToName ?? game.BillToName ?? game.loserName ?? game.LoserName
          }));
          this.ensureGameAmounts(table);
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
    table.playType = this.playType;
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
    table.playType = 'Single';
    this.applyPlayTypeRates(table, 'Single');
    table.players = [];
    table.billItems = [];
    table.gameItems = [];
    table.tableSessionId = undefined;
  }
}
