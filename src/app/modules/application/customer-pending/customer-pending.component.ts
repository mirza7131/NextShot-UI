import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CustomerPendingPayment, CustomerPendingPaymentHistory, InventoryService } from '../inventory/inventory.service';

@Component({
  selector: 'app-customer-pending',
  standalone: false,
  templateUrl: './customer-pending.component.html',
  styleUrl: './customer-pending.component.scss',
  providers: [MessageService]
})
export class CustomerPendingComponent implements OnInit {
  records: CustomerPendingPayment[] = [];
  filteredRecords: CustomerPendingPayment[] = [];
  searchText = '';
  payDialog = false;
  historyDialog = false;
  selectedCustomer: CustomerPendingPayment | null = null;
  historyRecords: CustomerPendingPaymentHistory[] = [];
  paidAmount = 0;
  today = new Date();
  isLoading = false;
  isHistoryLoading = false;
  isSaving = false;
  pageNumber = 1;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private inventoryService: InventoryService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPending();
  }

  get totalDueAmount(): number {
    return this.filteredRecords.reduce((total, row) => total + row.dueAmount, 0);
  }

  loadPending(): void {
    this.isLoading = true;
    this.inventoryService.getCustomerPendingPayments().subscribe({
      next: records => {
        this.records = records;
        this.applySearch();
        this.isLoading = false;
      },
      error: error => {
        this.records = [];
        this.filteredRecords = [];
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Customer Pending',
          detail: error?.error?.message || error?.message || 'Unable to load pending customers'
        });
      }
    });
  }

  applySearch(): void {
    const search = this.searchText.trim().toLowerCase();
    this.filteredRecords = this.records.filter(row =>
      !search ||
      row.customerName.toLowerCase().includes(search) ||
      row.phoneNo?.toLowerCase().includes(search)
    );
    this.pageNumber = 1;
  }

  get pagedRecords(): CustomerPendingPayment[] {
    const startIndex = (this.pageNumber - 1) * this.pageSize;
    return this.filteredRecords.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRecords.length / this.pageSize));
  }

  get pageStart(): number {
    return this.filteredRecords.length ? (this.pageNumber - 1) * this.pageSize + 1 : 0;
  }

  get pageEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.filteredRecords.length);
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

  openPay(row: CustomerPendingPayment): void {
    this.selectedCustomer = row;
    this.paidAmount = row.dueAmount;
    this.payDialog = true;
  }

  openHistory(row: CustomerPendingPayment): void {
    this.selectedCustomer = row;
    this.historyRecords = [];
    this.historyDialog = true;
    this.isHistoryLoading = true;

    this.inventoryService.getCustomerPendingPaymentHistory(row.clubCustomerId).subscribe({
      next: records => {
        this.historyRecords = records;
        this.isHistoryLoading = false;
      },
      error: error => {
        this.isHistoryLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'History',
          detail: error?.error?.message || error?.message || 'Unable to load customer history'
        });
      }
    });
  }

  get historyTotalDue(): number {
    return this.historyRecords.reduce((total, row) => total + row.dueAmount, 0);
  }

  get historyTotalPaid(): number {
    return this.historyRecords.reduce((total, row) => total + row.paidAmount, 0);
  }

  getInventoryText(row: CustomerPendingPaymentHistory): string {
    if (!row.inventoryItems?.length) {
      return row.inventoryAmount ? `AED ${row.inventoryAmount.toFixed(2)}` : '-';
    }

    return row.inventoryItems
      .map(item => `${item.name} x ${item.quantity}${item.buyerName ? ' - ' + item.buyerName : ''}`)
      .join(', ');
  }

  getPlayersText(row: CustomerPendingPaymentHistory): string {
    return row.players || '-';
  }

  getPaymentTypeLabel(row: CustomerPendingPaymentHistory): string {
    const type = (row.paymentType || '').toLowerCase();

    if (type.includes('counter') || type.includes('inventory')) {
      return 'Counter Sale';
    }

    return 'Table Session';
  }

  getReceiptLabel(row: CustomerPendingPaymentHistory): string {
    if (row.receiptNo) {
      return row.receiptNo;
    }

    if (row.inventorySaleId) {
      return `Sale ${row.inventorySaleId}`;
    }

    return `Session ${row.tableSessionId || '-'}`;
  }

  printPendingSlip(): void {
    const slip = document.querySelector('.pending-slip') as HTMLElement;

    if (!slip) {
      return;
    }

    const printWindow = window.open('', '_blank', 'width=380,height=720');

    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Next Shot Pending Slip</title>
          <style>
            body{margin:0;background:#fff;font-family:"Courier New",monospace;color:#111}
            .pending-slip{width:300px;margin:0 auto;padding:12px}
            .slip-head{text-align:center;border-bottom:1px dashed #111;padding-bottom:8px;margin-bottom:8px}
            .slip-head h2{margin:4px 0;font-size:20px}
            .slip-row{display:flex;justify-content:space-between;gap:12px;padding:4px 0;font-size:13px}
            .slip-row strong{text-align:right}
            .slip-detail{display:block;font-size:12px;line-height:1.35;padding:2px 0;color:#222}
            .slip-items{border-top:1px dashed #111;border-bottom:1px dashed #111;margin:8px 0;padding:6px 0}
            .slip-total{font-size:16px;font-weight:900;border-top:1px dashed #111;margin-top:8px;padding-top:8px}
            .slip-note{text-align:center;margin-top:10px;font-size:12px}
          </style>
        </head>
        <body>${slip.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  payAmount(): void {
    if (!this.selectedCustomer || this.paidAmount <= 0) {
      return;
    }

    const amount = Math.min(this.paidAmount, this.selectedCustomer.dueAmount);
    this.isSaving = true;
    this.inventoryService.payCustomerPendingAmount(this.selectedCustomer.clubCustomerId, amount).subscribe({
      next: () => {
        this.isSaving = false;
        this.payDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Payment Saved',
          detail: 'Pending amount updated successfully'
        });
        this.loadPending();
      },
      error: error => {
        this.isSaving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Payment',
          detail: error?.error?.message || error?.message || 'Unable to save payment'
        });
      }
    });
  }
}
