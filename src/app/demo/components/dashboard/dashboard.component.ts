import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ClubTableSetup, InventoryItem, InventoryService } from 'src/app/modules/application/inventory/inventory.service';
import { formatUaeDateInput, formatUaeDisplayDate, getUaeDateParts, parseApiDateAsUae, parseUaeDateTimeLocal } from 'src/app/shared/uae-date-time';

type DashboardFilter = string;

interface TableSummary {
    key: DashboardFilter;
    label: string;
    games: number;
    earning: number;
    color: 'slate' | 'red' | 'green' | 'blue' | 'gold';
    icon: string;
}

interface SessionHistoryRow {
    sr: number;
    recordType: 'Session' | 'CounterSale';
    tableSessionId: number;
    inventorySaleId: number;
    receiptNo: string;
    tableNo: number;
    tableName: string;
    tableType: string;
    customerName: string;
    players: string;
    startTime?: Date;
    endTime?: Date;
    totalTime: string;
    games: number;
    tableAmount: number;
    inventoryAmount: number;
    discountAmount: number;
    cashAmount: number;
    cardAmount: number;
    paidAmount: number;
    dueAmount: number;
    netAmount: number;
    status: string;
    inventoryItems: string;
}

interface DailySaleSummary {
    dateKey: string;
    date: Date;
    records: SessionHistoryRow[];
    games: number;
    sales: number;
    totalAmount: number;
    cashAmount: number;
    cardAmount: number;
    paidAmount: number;
    dueAmount: number;
}

@Component({
    templateUrl: './dashboard.component.html',
    providers: [ConfirmationService, MessageService]
})
export class DashboardComponent implements OnInit, OnDestroy {
    selectedFilter: DashboardFilter = 'All';
    fromDate = '';
    toDate = '';
    searchTerm = '';
    pageSize = 10;
    currentPage = 1;
    editDialog = false;
    dailySaleDialog = false;
    isDashboardLoading = false;
    isDailySaleLoading = false;
    editRow: SessionHistoryRow | null = null;
    selectedDailySale: DailySaleSummary | null = null;
    inventoryItems: InventoryItem[] = [];
    selectedInventoryItemId: number | null = null;
    inventoryQty = 1;
    tableSummaries: TableSummary[] = [];
    allRows: SessionHistoryRow[] = [];
    filteredRows: SessionHistoryRow[] = [];
    configuredTables: ClubTableSetup[] = [];
    private historySubscription?: Subscription;

    constructor(
        private inventoryService: InventoryService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.setCurrentMonthFilter();
        this.loadInventoryItems();
        this.loadClubTables();
        this.loadDashboard();
    }

    ngOnDestroy(): void {
        this.historySubscription?.unsubscribe();
    }

    selectFilter(filter: DashboardFilter): void {
        this.selectedFilter = filter;
        this.currentPage = 1;
        this.applyFilter();
    }

    applyDateFilter(): void {
        this.currentPage = 1;
        this.loadDashboard();
    }

    clearDateFilter(): void {
        this.setCurrentMonthFilter();
        this.currentPage = 1;
        this.loadDashboard();
    }

    onSearchChange(): void {
        this.currentPage = 1;
    }

    changePage(page: number): void {
        this.currentPage = Math.min(Math.max(page, 1), this.totalPages);
    }

    openEdit(row: SessionHistoryRow): void {
        this.editRow = { ...row };
        this.selectedInventoryItemId = null;
        this.inventoryQty = 1;
        this.editDialog = true;
    }

    openDailySales(): void {
        const sales = this.dailySales;
        this.selectedDailySale = sales.find(day => day.records.length) || sales[0] || null;
        this.isDailySaleLoading = this.isDashboardLoading;
        this.dailySaleDialog = true;
    }

    selectDailySale(day: DailySaleSummary): void {
        this.selectedDailySale = day;
    }

    saveEdit(): void {
        if (!this.editRow) {
            return;
        }

        this.recalculateEditRow();
        this.syncEditedRow();

        this.editDialog = false;
        this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Dashboard row updated'
        });
    }

    deleteRow(row: SessionHistoryRow): void {
        const recordName = row.recordType === 'CounterSale' ? 'counter sale' : 'session';
        this.confirmationService.confirm({
            header: row.recordType === 'CounterSale' ? 'Delete Counter Sale' : 'Delete Session',
            message: `Are you sure you want to delete this ${recordName} for ${row.customerName}?`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.confirmDeleteRow(row)
        });
    }

    private confirmDeleteRow(row: SessionHistoryRow): void {
        const removeLocal = () => {
            this.allRows = this.allRows.filter(item => !this.isSameHistoryRow(item, row));
            this.buildSummaries();
            this.applyFilter();
            this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: row.recordType === 'CounterSale' ? 'Counter sale deleted' : 'Session removed from dashboard'
            });
        };

        if (row.recordType === 'CounterSale') {
            if (!row.inventorySaleId) {
                removeLocal();
                return;
            }

            this.inventoryService.deleteInventorySale(row.inventorySaleId).subscribe({
                next: () => removeLocal(),
                error: error => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Delete Failed',
                        detail: this.getApiErrorMessage(error, 'Unable to delete this counter sale')
                    });
                }
            });
            return;
        }

        if (!row.tableSessionId) {
            removeLocal();
            return;
        }

        this.inventoryService.deleteTableSession(row.tableSessionId).subscribe({
            next: () => removeLocal(),
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Delete Failed',
                    detail: this.getApiErrorMessage(error, 'Unable to delete this session')
                });
            }
        });
    }

    private getApiErrorMessage(error: any, fallback: string): string {
        const apiMessage = error?.error?.message || error?.error?.Message || error?.error?.title || error?.error?.Title || error?.message;
        const statusText = error?.status ? `Status ${error.status}` : '';

        return [apiMessage || fallback, statusText].filter(Boolean).join(' - ');
    }

    private isSameHistoryRow(item: SessionHistoryRow, row: SessionHistoryRow): boolean {
        if (row.recordType === 'CounterSale') {
            return item.recordType === 'CounterSale' && item.inventorySaleId === row.inventorySaleId;
        }

        return item.recordType === 'Session' && item.tableSessionId === row.tableSessionId;
    }

    addInventoryToEditRow(): void {
        if (!this.editRow || !this.editRow.tableSessionId || !this.selectedInventoryItemId || this.inventoryQty <= 0) {
            return;
        }

        const item = this.inventoryItems.find(x => x.id === Number(this.selectedInventoryItemId));

        if (!item) {
            return;
        }

        if (item.stock < this.inventoryQty) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Stock',
                detail: 'Stock is not enough'
            });
            return;
        }

        const quantity = this.inventoryQty;
        const amount = item.price * quantity;

        this.inventoryService.addInventoryItemToSession(this.editRow.tableSessionId, item.id, quantity).subscribe({
            next: () => {
                this.editRow!.inventoryAmount += amount;
                this.recalculateEditRow();
                this.syncEditedRow();
                this.selectedInventoryItemId = null;
                this.inventoryQty = 1;
                this.loadInventoryItems();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Inventory Added',
                    detail: `${item.name} added to bill`
                });
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Inventory',
                    detail: error?.error?.message || error?.message || 'Unable to add inventory'
                });
            }
        });
    }

    printRow(row: SessionHistoryRow): void {
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
                        body { margin: 0; font-family: Consolas, "Courier New", monospace; color: #111; }
                        .receipt { width: 72mm; margin: 0 auto; }
                        .head { text-align: center; border-bottom: 1px dashed #111; padding-bottom: 8px; margin-bottom: 8px; }
                        .logo { margin: 0 auto 6px; width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; background: #111; color: #fff; font-weight: 900; }
                        h2 { margin: 0; font-size: 20px; }
                        .row, .total { display: flex; justify-content: space-between; gap: 8px; padding: 3px 0; font-size: 12px; }
                        .section { border-top: 1px dashed #111; margin-top: 8px; padding-top: 8px; }
                        .total { font-size: 14px; font-weight: 900; }
                        .note { text-align: center; margin-top: 10px; padding-top: 8px; border-top: 1px dashed #111; font-size: 11px; }
                    </style>
                </head>
                <body>
                    <div class="receipt">
                        <div class="head">
                            <div class="logo">NS</div>
                            <h2>NEXT SHOT</h2>
                            <div>Snooker & Billiards</div>
                        </div>
                        <div class="row"><span>Table</span><strong>${row.tableName}</strong></div>
                        <div class="row"><span>Type</span><strong>${this.getRecordTypeLabel(row)}</strong></div>
                        <div class="row"><span>Receipt</span><strong>${row.receiptNo || '-'}</strong></div>
                        <div class="row"><span>Date</span><strong>${formatUaeDisplayDate(row.endTime)}</strong></div>
                        <div class="row"><span>Customer</span><strong>${row.customerName}</strong></div>
                        <div class="row"><span>Players</span><strong>${row.players}</strong></div>
                        <div class="row"><span>Total Time</span><strong>${row.totalTime}</strong></div>
                        <div class="section">
                            <div class="row"><span>Games</span><strong>${row.games}</strong></div>
                            <div class="row"><span>Table</span><strong>AED ${row.tableAmount.toFixed(2)}</strong></div>
                            <div class="row"><span>Inventory</span><strong>AED ${row.inventoryAmount.toFixed(2)}</strong></div>
                            <div class="row"><span>Items</span><strong>${row.inventoryItems || '-'}</strong></div>
                            <div class="row"><span>Discount</span><strong>AED ${row.discountAmount.toFixed(2)}</strong></div>
                            <div class="row"><span>Cash</span><strong>AED ${row.cashAmount.toFixed(2)}</strong></div>
                            <div class="row"><span>Card</span><strong>AED ${row.cardAmount.toFixed(2)}</strong></div>
                            <div class="row"><span>Paid</span><strong>AED ${row.paidAmount.toFixed(2)}</strong></div>
                            <div class="row"><span>Due</span><strong>AED ${row.dueAmount.toFixed(2)}</strong></div>
                            <div class="total"><span>Total</span><strong>AED ${row.netAmount.toFixed(2)}</strong></div>
                        </div>
                        <div class="note">Good Game • Good Time<br>Thank you for playing</div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }

    get totalGames(): number {
        return this.getSessionRecordCountForRows(this.allRows);
    }

    get totalRecords(): number {
        return this.allRows.length;
    }

    get totalCounterSales(): number {
        return this.allRows.filter(row => row.recordType === 'CounterSale').length;
    }

    get totalEarning(): number {
        return this.allRows.reduce((total, row) => total + row.netAmount, 0);
    }

    get totalDue(): number {
        return this.allRows.reduce((total, row) => total + row.dueAmount, 0);
    }

    get totalReceived(): number {
        return this.allRows.reduce((total, row) => total + row.paidAmount, 0);
    }

    get totalCashReceived(): number {
        return this.allRows.reduce((total, row) => total + row.cashAmount, 0);
    }

    get totalCardReceived(): number {
        return this.allRows.reduce((total, row) => total + row.cardAmount, 0);
    }

    get dailySales(): DailySaleSummary[] {
        const now = getUaeDateParts();
        const currentYear = now.year;
        const currentMonth = now.month;
        const today = now.day;
        const days: DailySaleSummary[] = [];

        for (let day = 1; day <= today; day++) {
            const date = parseUaeDateTimeLocal(`${currentYear}-${currentMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T12:00`);
            const dateKey = this.toDateKey(date);
            const records = this.allRows.filter(row => row.endTime && this.getBusinessDateKey(row.endTime) === dateKey);

            days.push({
                dateKey,
                date,
                records,
                games: this.getSessionRecordCountForRows(records),
                sales: records.filter(row => row.recordType === 'CounterSale').length,
                totalAmount: records.reduce((total, row) => total + row.netAmount, 0),
                cashAmount: records.reduce((total, row) => total + row.cashAmount, 0),
                cardAmount: records.reduce((total, row) => total + row.cardAmount, 0),
                paidAmount: records.reduce((total, row) => total + row.paidAmount, 0),
                dueAmount: records.reduce((total, row) => total + row.dueAmount, 0)
            });
        }

        return days.sort((a, b) => b.date.getTime() - a.date.getTime());
    }

    get selectedDailyRows(): SessionHistoryRow[] {
        return this.selectedDailySale?.records || [];
    }

    get selectedFilterLabel(): string {
        if (this.selectedFilter === 'All') {
            return 'All Table';
        }

        return this.tableSummaries.find(summary => summary.key === this.selectedFilter)?.label || this.selectedFilter.split('|').pop() || this.selectedFilter;
    }

    get searchedRows(): SessionHistoryRow[] {
        const search = this.searchTerm.trim().toLowerCase();

        if (!search) {
            return this.filteredRows;
        }

        return this.filteredRows.filter(row => [
            row.tableName,
            row.tableType,
            row.customerName,
            row.players,
            row.recordType,
            row.receiptNo,
            row.status,
            row.totalTime,
            row.inventoryItems,
            row.endTime ? formatUaeDisplayDate(row.endTime, { dateStyle: 'short', timeStyle: undefined }) : '',
            row.games,
            row.tableAmount,
            row.inventoryAmount,
            row.discountAmount,
            row.cashAmount,
            row.cardAmount,
            row.netAmount,
            row.paidAmount,
            row.dueAmount
        ].join(' ').toLowerCase().includes(search));
    }

    get pagedRows(): SessionHistoryRow[] {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.searchedRows.slice(start, start + this.pageSize);
    }

    get totalPages(): number {
        return Math.max(1, Math.ceil(this.searchedRows.length / this.pageSize));
    }

    get pageStart(): number {
        if (!this.searchedRows.length) {
            return 0;
        }

        return (this.currentPage - 1) * this.pageSize + 1;
    }

    get pageEnd(): number {
        return Math.min(this.currentPage * this.pageSize, this.searchedRows.length);
    }

    private loadDashboard(): void {
        this.historySubscription?.unsubscribe();
        this.isDashboardLoading = true;
        if (this.dailySaleDialog) {
            this.isDailySaleLoading = true;
        }
        this.historySubscription = this.inventoryService.getTableSessionHistory(this.fromDate, this.toDate).subscribe({
            next: sessions => {
                this.allRows = this.mapHistoryRows(sessions);
                this.buildSummaries();
                this.applyFilter();
                if (this.dailySaleDialog) {
                    const sales = this.dailySales;
                    this.selectedDailySale = this.selectedDailySale
                        ? sales.find(day => day.dateKey === this.selectedDailySale?.dateKey) || sales.find(day => day.records.length) || sales[0] || null
                        : sales.find(day => day.records.length) || sales[0] || null;
                }
                this.isDashboardLoading = false;
                this.isDailySaleLoading = false;
            },
            error: () => {
                this.allRows = [];
                this.buildSummaries();
                this.applyFilter();
                this.isDashboardLoading = false;
                this.isDailySaleLoading = false;
            }
        });
    }

    private setCurrentMonthFilter(): void {
        const today = getUaeDateParts();
        this.fromDate = `${today.year}-${today.month.toString().padStart(2, '0')}-01`;
        this.toDate = formatUaeDateInput();
    }

    private toInputDateValue(date: Date): string {
        return formatUaeDateInput(date);
    }

    private loadInventoryItems(): void {
        this.inventoryService.getItems().subscribe({
            next: items => this.inventoryItems = items,
            error: () => this.inventoryItems = []
        });
    }

    private recalculateEditRow(): void {
        if (!this.editRow) {
            return;
        }

        this.editRow.netAmount = Math.max(0, this.editRow.tableAmount + this.editRow.inventoryAmount - this.editRow.discountAmount);
        this.editRow.dueAmount = Math.max(0, this.editRow.netAmount - this.editRow.paidAmount);
    }

    private syncEditedRow(): void {
        if (!this.editRow) {
            return;
        }

        const index = this.allRows.findIndex(row => row.tableSessionId === this.editRow!.tableSessionId);

        if (index > -1) {
            this.allRows[index] = { ...this.editRow };
            this.buildSummaries();
            this.applyFilter();
        }
    }

    private buildSummaries(): void {
        const tableCards = this.getDashboardTables();

        this.tableSummaries = [
            this.createSummary('All', 'Total Tables', 'pi pi-th-large', 'slate'),
            ...tableCards.map((table, index) =>
                this.createSummary(
                    this.getTableFilterKey(table.tableNo, table.tableName),
                    table.tableName,
                    table.tableType === 'Billiard' ? 'pi pi-circle-fill' : 'pi pi-circle',
                    this.getSummaryColor(index)
                )
            ),
            this.createSummary('CounterSale', 'Counter Sales', 'pi pi-shopping-bag', 'gold')
        ];
    }

    private createSummary(key: DashboardFilter, label: string, icon: string, color: TableSummary['color']): TableSummary {
        const rows = key === 'All' ? this.allRows : this.allRows.filter(row => this.isTableMatch(row, key));

        return {
            key,
            label,
            icon,
            color,
            games: key === 'CounterSale'
                ? rows.length
                : this.getSessionRecordCountForRows(rows),
            earning: rows.reduce((total, row) => total + row.netAmount, 0)
        };
    }

    private applyFilter(): void {
        this.filteredRows = this.selectedFilter === 'All'
            ? [...this.allRows]
            : this.allRows.filter(row => this.isTableMatch(row, this.selectedFilter));

        this.filteredRows = this.filteredRows.map((row, index) => ({ ...row, sr: index + 1 }));
        this.currentPage = Math.min(this.currentPage, this.totalPages);
    }

    private mapHistoryRows(sessions: any[]): SessionHistoryRow[] {
        return (sessions || []).map((session, index) => {
            const inventorySaleId = Number(session.inventorySaleId ?? session.InventorySaleId ?? 0);
            const tableSessionId = Number(session.tableSessionId ?? session.TableSessionId ?? 0);
            const paymentType = (session.paymentType ?? session.PaymentType ?? '').toString();
            const recordType: SessionHistoryRow['recordType'] = inventorySaleId > 0 || paymentType.toLowerCase().includes('inventory') || paymentType.toLowerCase().includes('counter')
                ? 'CounterSale'
                : 'Session';
            const startTimeValue = session.startTime ?? session.StartTime;
            const endTimeValue = session.endTime ?? session.EndTime;
            const startTime = parseApiDateAsUae(startTimeValue);
            const createdOnValue = session.createdOn ?? session.CreatedOn;
            const endTime = parseApiDateAsUae(endTimeValue) || parseApiDateAsUae(createdOnValue);
            const players = session.tableSessionPlayers ?? session.TableSessionPlayers ?? [];
            const games = recordType === 'CounterSale' ? 0 : Number(session.gameCount ?? session.GameCount ?? (session.tableSessionGames ?? session.TableSessionGames ?? []).length ?? 0);
            const inventoryItems = this.mapInventoryItemText(session.inventoryItems ?? session.InventoryItems ?? session.tableSessionInventoryItems ?? session.TableSessionInventoryItems ?? session.inventorySaleItems ?? session.InventorySaleItems ?? []);
            const tableAmount = recordType === 'CounterSale' ? 0 : Number(session.tableAmount ?? session.TableAmount ?? session.tableTimeAmount ?? session.TableTimeAmount ?? 0);
            const inventoryAmount = Number(session.inventoryAmount ?? session.InventoryAmount ?? (recordType === 'CounterSale' ? session.totalAmount ?? session.TotalAmount ?? 0 : 0));
            const discountAmount = Number(session.discountAmount ?? session.DiscountAmount ?? 0);
            const paymentRows = session.customerPayments ?? session.CustomerPayments ?? session.clubCustomerPayments ?? session.ClubCustomerPayments ?? session.payments ?? session.Payments ?? [];
            let cashAmount = this.getPaymentSplitAmount(session, paymentRows, 'cash');
            let cardAmount = this.getPaymentSplitAmount(session, paymentRows, 'card');
            const rawPaidAmount = Number(session.paidAmount ?? session.PaidAmount ?? (cashAmount + cardAmount));
            const rawDueAmount = Number(session.dueAmount ?? session.DueAmount ?? 0);
            const calculatedNetAmount = Math.max(0, tableAmount + inventoryAmount - discountAmount);
            const rawNetAmount = Number(session.netAmount ?? session.NetAmount ?? session.totalAmount ?? session.TotalAmount ?? calculatedNetAmount);
            const paidAmount = Math.max(0, rawPaidAmount || (cashAmount + cardAmount));
            const dueAmount = Math.max(0, rawDueAmount);
            const netAmount = Math.max(0, rawNetAmount, calculatedNetAmount, paidAmount + dueAmount);

            if (!cashAmount && !cardAmount && paidAmount > 0) {
                const paymentMethod = this.getPaymentMethod(session, paymentRows);

                if (paymentMethod === 'card') {
                    cardAmount = paidAmount;
                } else if (paymentMethod === 'cash') {
                    cashAmount = paidAmount;
                }
            }

            return {
                sr: index + 1,
                recordType,
                tableSessionId,
                inventorySaleId,
                receiptNo: session.receiptNo ?? session.ReceiptNo ?? '',
                tableNo: recordType === 'CounterSale' ? 0 : Number(session.tableNo ?? session.TableNo ?? 0),
                tableName: recordType === 'CounterSale' ? 'Counter Sale' : this.normalizeTableName(session.tableName ?? session.TableName, Number(session.tableNo ?? session.TableNo ?? 0)),
                tableType: recordType === 'CounterSale' ? 'Inventory' : session.tableType ?? session.TableType ?? '-',
                customerName: session.customerName ?? session.CustomerName ?? 'Walk-in Customer',
                players: this.mapPlayers(players),
                startTime,
                endTime,
                totalTime: recordType === 'CounterSale' ? '-' : (session.totalTime ?? session.TotalTime ?? this.getDuration(startTime, endTime)),
                games,
                tableAmount,
                inventoryAmount,
                discountAmount,
                cashAmount,
                cardAmount,
                paidAmount,
                dueAmount,
                netAmount,
                status: session.status ?? session.Status ?? session.paymentStatus ?? session.PaymentStatus ?? '-',
                inventoryItems
            };
        });
    }

    private isTableMatch(row: SessionHistoryRow, key: DashboardFilter): boolean {
        if (key === 'All') {
            return true;
        }

        if (key === 'CounterSale') {
            return row.recordType === 'CounterSale';
        }

        const [tableNo, ...nameParts] = key.split('|');
        const keyTableNo = Number(tableNo);
        const keyTableName = nameParts.join('|');

        return row.recordType === 'Session' && (row.tableNo === keyTableNo || row.tableName === keyTableName || row.tableName === key);
    }

    private normalizeTableName(tableName: string | undefined, tableNo: number): string {
        const configuredTable = this.configuredTables.find(table => table.tableNo === tableNo);
        return tableName || configuredTable?.tableName || `Table ${tableNo || '-'}`;
    }

    private mapPlayers(players: any[]): string {
        const names = (players || [])
            .map(player => player.playerName ?? player.PlayerName)
            .filter(Boolean);

        return names.length ? names.join(' vs ') : '-';
    }

    getRecordTypeLabel(row: SessionHistoryRow): string {
        return row.recordType === 'CounterSale' ? 'Counter Sale' : 'Table Session';
    }

    private getRowGameCount(row: SessionHistoryRow): number {
        return row.recordType === 'Session' ? Math.max(0, Number(row.games) || 0) : 0;
    }

    private getGameCountForRows(rows: SessionHistoryRow[]): number {
        const sessionGames = new Map<string, number>();
        let looseGameCount = 0;

        rows
            .filter(row => row.recordType === 'Session')
            .forEach(row => {
                const gameCount = this.getRowGameCount(row);

                if (row.tableSessionId > 0) {
                    const key = row.tableSessionId.toString();
                    sessionGames.set(key, Math.max(sessionGames.get(key) || 0, gameCount));
                    return;
                }

                looseGameCount += gameCount;
            });

        return Array.from(sessionGames.values()).reduce((total, games) => total + games, 0) + looseGameCount;
    }

    private getSessionRecordCountForRows(rows: SessionHistoryRow[]): number {
        const sessionIds = new Set<string>();
        let looseRowCount = 0;

        rows
            .filter(row => row.recordType === 'Session')
            .forEach(row => {
                if (row.tableSessionId > 0) {
                    sessionIds.add(row.tableSessionId.toString());
                    return;
                }

                looseRowCount++;
            });

        return sessionIds.size + looseRowCount;
    }

    private sumNestedAmount(items: any[], keys: string[]): number {
        const rows = Array.isArray(items) ? items : [];

        return rows.reduce((total, item) => {
            const key = keys.find(name => item?.[name] !== undefined && item?.[name] !== null);
            return total + Number(key ? item[key] : 0);
        }, 0);
    }

    private getPaymentSplitAmount(session: any, paymentRows: any[], type: 'cash' | 'card'): number {
        const explicitKeys = type === 'cash'
            ? [
                'cashAmount', 'CashAmount',
                'cashReceived', 'CashReceived',
                'cashReceivedAmount', 'CashReceivedAmount',
                'receivedCash', 'ReceivedCash',
                'cashPaid', 'CashPaid',
                'cashPayment', 'CashPayment',
                'totalCashAmount', 'TotalCashAmount',
                'cash', 'Cash'
            ]
            : [
                'cardAmount', 'CardAmount',
                'cardReceived', 'CardReceived',
                'cardReceivedAmount', 'CardReceivedAmount',
                'receivedCard', 'ReceivedCard',
                'cardPaid', 'CardPaid',
                'cardPayment', 'CardPayment',
                'totalCardAmount', 'TotalCardAmount',
                'card', 'Card'
            ];

        const directAmount = this.readFirstNumber(session, explicitKeys);

        if (directAmount > 0) {
            return directAmount;
        }

        const rows = Array.isArray(paymentRows) ? paymentRows : [];
        const nestedExplicitAmount = rows.reduce((total, row) => total + this.readFirstNumber(row, explicitKeys), 0);

        if (nestedExplicitAmount > 0) {
            return nestedExplicitAmount;
        }

        const flexibleAmount = this.findFlexibleAmount(session, type) + rows.reduce((total, row) => total + this.findFlexibleAmount(row, type), 0);
        return Math.max(0, flexibleAmount);
    }

    private readFirstNumber(source: any, keys: string[]): number {
        if (!source) {
            return 0;
        }

        for (const key of keys) {
            const value = source[key];
            const amount = Number(value);

            if (value !== undefined && value !== null && !Number.isNaN(amount) && amount > 0) {
                return amount;
            }
        }

        return 0;
    }

    private findFlexibleAmount(source: any, type: 'cash' | 'card'): number {
        if (!source || typeof source !== 'object') {
            return 0;
        }

        return Object.keys(source).reduce((total, key) => {
            const normalizedKey = key.toLowerCase();
            const value = source[key];
            const amount = Number(value);
            const isMoneyKey = normalizedKey.includes(type) &&
                (
                    normalizedKey.includes('amount') ||
                    normalizedKey.includes('received') ||
                    normalizedKey.includes('paid') ||
                    normalizedKey.includes('payment') ||
                    normalizedKey === type
                );

            return isMoneyKey && !Number.isNaN(amount) && amount > 0
                ? total + amount
                : total;
        }, 0);
    }

    private getPaymentMethod(session: any, paymentRows: any[]): 'cash' | 'card' | '' {
        const values = [
            session.paymentMethod,
            session.PaymentMethod,
            session.paymentMode,
            session.PaymentMode,
            session.paymentType,
            session.PaymentType,
            ...(Array.isArray(paymentRows)
                ? paymentRows.flatMap(row => [row.paymentMethod, row.PaymentMethod, row.paymentMode, row.PaymentMode, row.paymentType, row.PaymentType])
                : [])
        ];

        const text = values.filter(Boolean).join(' ').toLowerCase();

        if (text.includes('card')) {
            return 'card';
        }

        if (text.includes('cash')) {
            return 'cash';
        }

        return '';
    }

    private mapInventoryItemText(items: any[]): string {
        const rows = Array.isArray(items) ? items : [];
        const text = rows
            .map(item => {
                const name = item.name ?? item.Name ?? item.itemName ?? item.ItemName;
                const quantity = Number(item.quantity ?? item.Quantity ?? 1);
                const buyerName = item.buyerName ?? item.BuyerName;

                if (!name) {
                    return '';
                }

                return `${name} x ${quantity}${buyerName ? ' - ' + buyerName : ''}`;
            })
            .filter(Boolean);

        return text.length ? text.join(', ') : '-';
    }

    private getBusinessDateKey(date: Date): string {
        const parts = getUaeDateParts(date);
        const businessDate = parseUaeDateTimeLocal(`${parts.year}-${parts.month.toString().padStart(2, '0')}-${parts.day.toString().padStart(2, '0')}T12:00`);

        if (parts.hour < 6) {
            businessDate.setDate(businessDate.getDate() - 1);
        }

        return this.toDateKey(businessDate);
    }

    private toDateKey(date: Date): string {
        return formatUaeDateInput(date);
    }

    private getDuration(startTime?: Date, endTime?: Date): string {
        if (!startTime || !endTime) {
            return '00:00:00';
        }

        const elapsedSeconds = Math.max(0, Math.floor((endTime.getTime() - startTime.getTime()) / 1000));
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;

        return [hours, minutes, seconds].map(value => value.toString().padStart(2, '0')).join(':');
    }

    private loadClubTables(): void {
        this.inventoryService.getClubTables().subscribe({
            next: tables => {
                this.configuredTables = tables.filter(table => table.isActive).sort((a, b) => a.tableNo - b.tableNo);
                this.allRows = this.allRows.map(row => ({
                    ...row,
                    tableName: this.normalizeTableName(row.tableName, row.tableNo)
                }));
                this.buildSummaries();
                this.applyFilter();
            },
            error: () => {
                this.configuredTables = [];
                this.buildSummaries();
                this.applyFilter();
            }
        });
    }

    private getDashboardTables(): Array<{ tableNo: number; tableName: string; tableType: string }> {
        if (this.configuredTables.length) {
            return this.configuredTables.map(table => ({
                tableNo: table.tableNo,
                tableName: table.tableName,
                tableType: table.tableType
            }));
        }

        const historyTables = this.allRows
            .filter(row => row.tableNo || row.tableName)
            .reduce((tables, row) => {
                const key = this.getTableFilterKey(row.tableNo, row.tableName);
                if (!tables.some(table => this.getTableFilterKey(table.tableNo, table.tableName) === key)) {
                    tables.push({
                        tableNo: row.tableNo,
                        tableName: row.tableName,
                        tableType: row.tableType
                    });
                }
                return tables;
            }, [] as Array<{ tableNo: number; tableName: string; tableType: string }>)
            .sort((a, b) => a.tableNo - b.tableNo);

        if (historyTables.length) {
            return historyTables;
        }

        return [
            { tableNo: 1, tableName: 'Snooker Table 1', tableType: 'Snooker' },
            { tableNo: 2, tableName: 'Snooker Table 2', tableType: 'Snooker' },
            { tableNo: 3, tableName: 'Snooker Table 3', tableType: 'Snooker' },
            { tableNo: 4, tableName: 'Billiard Table', tableType: 'Billiard' }
        ];
    }

    private getTableFilterKey(tableNo: number, tableName: string): DashboardFilter {
        return `${tableNo}|${tableName}`;
    }

    private getSummaryColor(index: number): TableSummary['color'] {
        const colors: TableSummary['color'][] = ['red', 'green', 'blue', 'gold'];
        return colors[index % colors.length];
    }
}
