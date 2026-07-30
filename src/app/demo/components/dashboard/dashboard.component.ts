import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ClubTableSetup, InventoryItem, InventoryService } from 'src/app/modules/application/inventory/inventory.service';

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
    tableSessionId: number;
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
    paidAmount: number;
    dueAmount: number;
    netAmount: number;
    status: string;
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
    editRow: SessionHistoryRow | null = null;
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
        this.fromDate = '';
        this.toDate = '';
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
        this.confirmationService.confirm({
            header: 'Delete Session',
            message: `Are you sure you want to delete ${row.tableName} session for ${row.customerName}?`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.confirmDeleteRow(row)
        });
    }

    private confirmDeleteRow(row: SessionHistoryRow): void {
        const removeLocal = () => {
            this.allRows = this.allRows.filter(item => item.tableSessionId !== row.tableSessionId);
            this.buildSummaries();
            this.applyFilter();
            this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Session removed from dashboard'
            });
        };

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
                    detail: error?.error?.message || error?.message || 'Unable to delete this session'
                });
            }
        });
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
                        <div class="row"><span>Date</span><strong>${row.endTime ? row.endTime.toLocaleString() : '-'}</strong></div>
                        <div class="row"><span>Customer</span><strong>${row.customerName}</strong></div>
                        <div class="row"><span>Players</span><strong>${row.players}</strong></div>
                        <div class="row"><span>Total Time</span><strong>${row.totalTime}</strong></div>
                        <div class="section">
                            <div class="row"><span>Games</span><strong>${row.games}</strong></div>
                            <div class="row"><span>Table</span><strong>AED ${row.tableAmount.toFixed(2)}</strong></div>
                            <div class="row"><span>Inventory</span><strong>AED ${row.inventoryAmount.toFixed(2)}</strong></div>
                            <div class="row"><span>Discount</span><strong>AED ${row.discountAmount.toFixed(2)}</strong></div>
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
        return this.allRows.length;
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
            row.status,
            row.totalTime,
            row.endTime ? row.endTime.toLocaleDateString() : '',
            row.games,
            row.tableAmount,
            row.inventoryAmount,
            row.discountAmount,
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
        this.historySubscription = this.inventoryService.getTableSessionHistory(this.fromDate, this.toDate).subscribe({
            next: sessions => {
                this.allRows = this.mapHistoryRows(sessions);
                this.buildSummaries();
                this.applyFilter();
            },
            error: () => {
                this.allRows = [];
                this.buildSummaries();
                this.applyFilter();
            }
        });
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
            )
        ];
    }

    private createSummary(key: DashboardFilter, label: string, icon: string, color: TableSummary['color']): TableSummary {
        const rows = key === 'All' ? this.allRows : this.allRows.filter(row => this.isTableMatch(row, key));

        return {
            key,
            label,
            icon,
            color,
            games: rows.length,
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
            const startTimeValue = session.startTime ?? session.StartTime;
            const endTimeValue = session.endTime ?? session.EndTime;
            const startTime = startTimeValue ? new Date(startTimeValue) : undefined;
            const endTime = endTimeValue ? new Date(endTimeValue) : undefined;
            const players = session.tableSessionPlayers ?? session.TableSessionPlayers ?? [];
            const games = Number(session.gameCount ?? session.GameCount ?? (session.tableSessionGames ?? session.TableSessionGames ?? []).length ?? 0);
            const tableAmount = Number(session.tableAmount ?? session.TableAmount ?? 0);
            const inventoryAmount = Number(session.inventoryAmount ?? session.InventoryAmount ?? 0);
            const discountAmount = Number(session.discountAmount ?? session.DiscountAmount ?? 0);
            const paidAmount = Number(session.paidAmount ?? session.PaidAmount ?? 0);
            const dueAmount = Number(session.dueAmount ?? session.DueAmount ?? 0);
            const netAmount = Number(session.netAmount ?? session.NetAmount ?? session.totalAmount ?? session.TotalAmount ?? tableAmount + inventoryAmount - discountAmount);

            return {
                sr: index + 1,
                tableSessionId: Number(session.tableSessionId ?? session.TableSessionId ?? 0),
                tableNo: Number(session.tableNo ?? session.TableNo ?? 0),
                tableName: this.normalizeTableName(session.tableName ?? session.TableName, Number(session.tableNo ?? session.TableNo ?? 0)),
                tableType: session.tableType ?? session.TableType ?? '-',
                customerName: session.customerName ?? session.CustomerName ?? 'Walk-in Customer',
                players: this.mapPlayers(players),
                startTime,
                endTime,
                totalTime: this.getDuration(startTime, endTime),
                games,
                tableAmount,
                inventoryAmount,
                discountAmount,
                paidAmount,
                dueAmount,
                netAmount,
                status: session.status ?? session.Status ?? '-'
            };
        });
    }

    private isTableMatch(row: SessionHistoryRow, key: DashboardFilter): boolean {
        if (key === 'All') {
            return true;
        }

        const [tableNo, ...nameParts] = key.split('|');
        const keyTableNo = Number(tableNo);
        const keyTableName = nameParts.join('|');

        return row.tableNo === keyTableNo || row.tableName === keyTableName || row.tableName === key;
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
