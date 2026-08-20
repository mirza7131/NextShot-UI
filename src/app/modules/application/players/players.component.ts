import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClubCustomer, CustomerPendingPayment, InventoryService } from '../inventory/inventory.service';

@Component({
  selector: 'app-players',
  standalone: false,
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class PlayersComponent implements OnInit {
  players: ClubCustomer[] = [];
  playerName = '';
  phoneNo = '';
  editingPlayer: ClubCustomer | null = null;
  searchText = '';
  pageNumber = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];
  isLoading = false;
  isSaving = false;

  constructor(
    private inventoryService: InventoryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPlayers();
  }

  savePlayer(): void {
    const customerName = this.playerName.trim();
    const phoneNo = this.normalizePhone(this.phoneNo);

    if (!customerName) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Player',
        detail: 'Player name is required'
      });
      return;
    }

    if (phoneNo && !this.isValidUaePhone(phoneNo)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Phone Number',
        detail: 'Enter UAE number only, like 0501234567 or 971501234567'
      });
      return;
    }

    const request = { customerName, phoneNo };

    if (!this.editingPlayer) {
      this.isSaving = true;
      this.inventoryService.searchClubCustomers(phoneNo || customerName).subscribe({
        next: players => {
          const existingPlayer = this.findExistingPlayer(players, customerName, phoneNo);

          if (existingPlayer) {
            this.isSaving = false;
            this.messageService.add({
              severity: 'warn',
              summary: 'Player Already Exists',
              detail: `${existingPlayer.customerName} already exists`
            });
            return;
          }

          this.createOrUpdatePlayer(request);
        },
        error: () => this.createOrUpdatePlayer(request)
      });
      return;
    }

    this.createOrUpdatePlayer(request);
  }

  private createOrUpdatePlayer(request: { customerName: string; phoneNo: string }): void {
    this.isSaving = true;
    const saveRequest = this.editingPlayer
      ? this.inventoryService.updateClubCustomer({ ...request, clubCustomerId: this.editingPlayer.clubCustomerId })
      : this.inventoryService.saveCustomer(request);

    saveRequest.subscribe({
      next: () => {
        this.isSaving = false;
        this.messageService.add({
          severity: 'success',
          summary: this.editingPlayer ? 'Player Updated' : 'Player Added',
          detail: this.editingPlayer ? 'Player updated successfully' : 'Player added successfully'
        });
        this.clearForm();
        this.loadPlayers();
      },
      error: error => {
        this.isSaving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Player',
          detail: error?.error?.message || error?.message || 'Unable to save player'
        });
      }
    });
  }

  editPlayer(player: ClubCustomer): void {
    this.editingPlayer = player;
    this.playerName = player.customerName;
    this.phoneNo = this.normalizePhone(player.phoneNo || '');
  }

  deletePlayer(player: ClubCustomer): void {
    this.confirmationService.confirm({
      header: 'Delete Player',
      message: `Are you sure you want to delete ${player.customerName}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.inventoryService.deleteClubCustomer(player.clubCustomerId).subscribe({
          next: () => {
            if (this.editingPlayer?.clubCustomerId === player.clubCustomerId) {
              this.clearForm();
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Player Deleted',
              detail: 'Player deleted successfully'
            });
            this.loadPlayers();
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

  clearForm(): void {
    this.editingPlayer = null;
    this.playerName = '';
    this.phoneNo = '';
  }

  onPhoneInput(): void {
    this.phoneNo = this.normalizePhone(this.phoneNo).slice(0, 12);
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];

    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  applySearch(): void {
    this.pageNumber = 1;
  }

  changePageSize(): void {
    this.pageNumber = 1;
  }

  previousPage(): void {
    this.pageNumber = Math.max(1, this.pageNumber - 1);
  }

  nextPage(): void {
    this.pageNumber = Math.min(this.totalPages, this.pageNumber + 1);
  }

  get filteredPlayers(): ClubCustomer[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.players;
    }

    return this.players.filter(player =>
      player.customerName.toLowerCase().includes(search) ||
      player.phoneNo?.toLowerCase().includes(search)
    );
  }

  get pagedPlayers(): ClubCustomer[] {
    const startIndex = (this.pageNumber - 1) * this.pageSize;
    return this.filteredPlayers.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredPlayers.length / this.pageSize));
  }

  get pageStart(): number {
    return this.filteredPlayers.length ? (this.pageNumber - 1) * this.pageSize + 1 : 0;
  }

  get pageEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.filteredPlayers.length);
  }

  private loadPlayers(): void {
    this.isLoading = true;
    forkJoin({
      players: this.inventoryService.searchClubCustomers(''),
      pending: this.inventoryService.getCustomerPendingPayments().pipe(catchError(() => of([] as CustomerPendingPayment[])))
    }).subscribe({
      next: ({ players, pending }) => {
        const pendingMap = new Map<number, number>();
        pending.forEach(row => pendingMap.set(row.clubCustomerId, row.dueAmount || 0));

        this.players = players
          .map(player => ({
            ...player,
            balanceAmount: pendingMap.get(player.clubCustomerId) || 0
          }))
          .sort((a, b) => a.customerName.localeCompare(b.customerName));
        this.isLoading = false;

        if (this.pageNumber > this.totalPages) {
          this.pageNumber = this.totalPages;
        }
      },
      error: error => {
        this.players = [];
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Players',
          detail: error?.error?.message || error?.message || 'Unable to load players'
        });
      }
    });
  }

  private normalizePhone(value: string): string {
    return (value || '').replace(/\D/g, '');
  }

  private findExistingPlayer(players: ClubCustomer[], customerName: string, phoneNo: string): ClubCustomer | undefined {
    const normalizedName = this.normalizeText(customerName);
    const normalizedPhone = this.normalizePhone(phoneNo);

    return (players || []).find(player => {
      const playerPhone = this.normalizePhone(player.phoneNo || '');
      const playerName = this.normalizeText(player.customerName || '');

      return normalizedPhone
        ? playerPhone === normalizedPhone
        : playerName === normalizedName;
    });
  }

  private normalizeText(value: string): string {
    return (value || '').trim().toLowerCase();
  }

  private isValidUaePhone(phoneNo: string): boolean {
    return /^05\d{8}$/.test(phoneNo) || /^9715\d{8}$/.test(phoneNo) || /^0[234679]\d{7}$/.test(phoneNo) || /^971[234679]\d{7}$/.test(phoneNo);
  }
}
