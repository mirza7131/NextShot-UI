import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EndPointConstant } from 'src/app/constants/endpoints.constant';
import { parseApiDateAsUae } from 'src/app/shared/uae-date-time';
import { environment } from 'src/environments/environment';

export interface InventoryItem {
  id: number;
  inventoryItemId: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  stockQty: number;
}

export interface ClubTableSetup {
  id: number;
  clubTableId: number;
  tableNo: number;
  tableName: string;
  tableType: 'Snooker' | 'Billiard';
  hourlyRate: number;
  minuteRate: number;
  gameRate: number;
  doubleHourlyRate: number;
  doubleMinuteRate: number;
  doubleGameRate: number;
  isActive: boolean;
}

export interface BillItem {
  itemId: number;
  name: string;
  price: number;
  quantity: number;
  buyerName?: string;
  clubCustomerId?: number;
}

export interface ClubCustomer {
  clubCustomerId: number;
  customerName: string;
  phoneNo: string;
  balanceAmount: number;
}

export interface SessionPlayer {
  tableSessionPlayerId?: number;
  clubCustomerId?: number;
  playerName: string;
  phoneNo?: string;
  isWalkIn: boolean;
}

export interface CustomerPendingPayment {
  clubCustomerId: number;
  customerName: string;
  phoneNo: string;
  dueAmount: number;
  lastPaymentDate?: string | Date;
  paymentCount?: number;
}

export interface CustomerPendingPaymentHistory {
  customerPaymentId: number;
  clubCustomerId: number;
  customerName: string;
  phoneNo: string;
  tableSessionId?: number;
  inventorySaleId?: number;
  receiptNo?: string;
  players?: string;
  totalTime?: string;
  tableTimeAmount?: number;
  inventoryAmount?: number;
  inventoryItems?: BillItem[];
  totalAmount: number;
  paidAmount: number;
  discountAmount: number;
  dueAmount: number;
  paymentStatus: string;
  paymentType?: string;
  createdOn?: string | Date;
}

export interface RunningTableSession {
  tableSessionId: number;
  tableNo: number;
  tableName: string;
  tableType: string;
  clubCustomerId?: number;
  customerName?: string;
  customerPhone?: string;
  playerCount?: number;
  sessionMode: string;
  minuteRate?: number;
  hourlyRate?: number;
  gameRate?: number;
  playType?: 'Single' | 'Double';
  startTime: string | Date;
  receiptNo?: string;
  status: string;
  tableSessionPlayers?: SessionPlayer[];
  tableSessionInventoryItems?: any[];
  tableSessionGames?: any[];
}

export interface CustomerRequest {
  customerName: string;
  phoneNo: string;
}

export interface InventorySaleRequest {
  clubCustomerId?: number;
  customerName: string;
  phoneNo?: string;
  inventoryItemId: number;
  quantity: number;
  price: number;
  items?: Array<{
    inventoryItemId: number;
    itemName: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  discountAmount: number;
  cashAmount: number;
  cardAmount: number;
  paidAmount: number;
  dueAmount: number;
  createdOn?: string;
}

export interface StartTableSessionRequest {
  tableNo: number;
  tableName: string;
  tableType: string;
  clubCustomerId?: number;
  customerName: string;
  customerPhone?: string;
  playerCount: number;
  sessionMode: string;
  playType?: 'Single' | 'Double';
  hourlyRate: number;
  gameRate?: number;
  minuteRate?: number;
  startTime?: string;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  constructor(private http: HttpClient) {}

  private get apiBaseUrl(): string {
    return environment.apiURL || environment.apiUrl;
  }

  getItems(): Observable<InventoryItem[]> {
    const params = new HttpParams()
      .set('PageNumber', 1)
      .set('PageSize', 100);

    return this.http
      .get<any>(`${this.apiBaseUrl}${EndPointConstant.Invoice.GetInventoryItems()}`, { params })
      .pipe(map(response => this.mapInventoryList(response)));
  }

  addItem(item: Omit<InventoryItem, 'id' | 'inventoryItemId' | 'stockQty'>): Observable<InventoryItem[]> {
    const payload = {
      name: item.name,
      category: item.category,
      price: item.price,
      stockQty: item.stock
    };

    return this.http
      .post<any>(`${this.apiBaseUrl}${EndPointConstant.Invoice.CreateInventoryItem()}`, payload)
      .pipe(map(() => []));
  }

  updateItem(item: InventoryItem): Observable<any> {
    const payload = {
      inventoryItemId: item.inventoryItemId || item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      stockQty: item.stock
    };

    return this.http.put<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.UpdateInventoryItem()}`,
      payload
    );
  }

  deleteItem(itemId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.DeleteInventoryItem()}?id=${itemId}`
    );
  }

  saveCustomer(request: CustomerRequest): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.CreateClubCustomer()}`,
      request
    );
  }

  updateClubCustomer(request: CustomerRequest & { clubCustomerId: number }): Observable<any> {
    return this.http.put<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.UpdateClubCustomer()}`,
      request
    );
  }

  deleteClubCustomer(clubCustomerId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.DeleteClubCustomer()}?id=${clubCustomerId}&clubCustomerId=${clubCustomerId}`,
      { id: clubCustomerId, clubCustomerId }
    );
  }

  getClubTables(): Observable<ClubTableSetup[]> {
    return this.http
      .get<any>(`${this.apiBaseUrl}${EndPointConstant.Invoice.GetClubTables()}`)
      .pipe(map(response => this.mapClubTables(response)));
  }

  createClubTable(table: Omit<ClubTableSetup, 'id' | 'clubTableId' | 'minuteRate'>): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.CreateClubTable()}`,
      {
        tableNo: table.tableNo,
        tableName: table.tableName,
        tableType: table.tableType,
        hourlyRate: table.hourlyRate,
        singleHourlyRate: table.hourlyRate,
        gameRate: table.gameRate,
        singleGameRate: table.gameRate,
        doubleHourlyRate: table.doubleHourlyRate,
        doubleGameRate: table.doubleGameRate,
        isActive: table.isActive
      }
    );
  }

  updateClubTable(table: ClubTableSetup): Observable<any> {
    return this.http.put<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.UpdateClubTable()}`,
      {
        clubTableId: table.clubTableId || table.id,
        tableNo: table.tableNo,
        tableName: table.tableName,
        tableType: table.tableType,
        hourlyRate: table.hourlyRate,
        singleHourlyRate: table.hourlyRate,
        gameRate: table.gameRate,
        singleGameRate: table.gameRate,
        doubleHourlyRate: table.doubleHourlyRate,
        doubleGameRate: table.doubleGameRate,
        isActive: table.isActive
      }
    );
  }

  deleteClubTable(clubTableId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.DeleteClubTable()}?id=${clubTableId}&clubTableId=${clubTableId}`,
      { id: clubTableId, clubTableId }
    );
  }

  searchClubCustomers(search: string): Observable<ClubCustomer[]> {
    const params = new HttpParams().set('search', search || '');

    return this.http
      .get<any>(`${this.apiBaseUrl}${EndPointConstant.Invoice.SearchClubCustomers()}`, { params })
      .pipe(map(response => this.mapClubCustomers(response)));
  }

  reduceStock(itemId: number, quantity: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.ReduceInventoryStock()}`,
      { inventoryItemId: itemId, quantity }
    );
  }

  createInventorySale(request: InventorySaleRequest): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.CreateInventorySale()}`,
      request
    );
  }

  deleteInventorySale(inventorySaleId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.DeleteInventorySale()}?inventorySaleId=${inventorySaleId}&InventorySaleId=${inventorySaleId}&id=${inventorySaleId}&Id=${inventorySaleId}`,
      { inventorySaleId, InventorySaleId: inventorySaleId, id: inventorySaleId, Id: inventorySaleId }
    );
  }

  startTableSession(request: StartTableSessionRequest): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.StartTableSession()}`,
      request
    );
  }

  getRunningTableSessions(): Observable<RunningTableSession[]> {
    return this.http
      .get<any>(`${this.apiBaseUrl}${EndPointConstant.Invoice.GetRunningTableSessions()}`)
      .pipe(map(response => this.mapRunningSessions(response)));
  }

  getTableSessionHistory(fromDate?: string, toDate?: string): Observable<any[]> {
    let params = new HttpParams();

    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }

    if (toDate) {
      params = params.set('toDate', toDate);
    }

    return this.http
      .get<any>(`${this.apiBaseUrl}${EndPointConstant.Invoice.GetTableSessionHistory()}`, { params })
      .pipe(map(response => {
        const data = response?.data || response;
        return data?.list || data?.List || data || [];
      }));
  }

  getCustomerPendingPayments(): Observable<CustomerPendingPayment[]> {
    return this.http
      .get<any>(`${this.apiBaseUrl}${EndPointConstant.Invoice.GetCustomerPendingPayments()}`)
      .pipe(map(response => this.mapCustomerPendingPayments(response)));
  }

  getCustomerPendingPaymentHistory(clubCustomerId: number): Observable<CustomerPendingPaymentHistory[]> {
    const params = new HttpParams().set('clubCustomerId', clubCustomerId);

    return this.http
      .get<any>(`${this.apiBaseUrl}${EndPointConstant.Invoice.GetCustomerPendingPaymentHistory()}`, { params })
      .pipe(map(response => this.mapCustomerPendingPaymentHistory(response)));
  }

  payCustomerPendingAmount(clubCustomerId: number, paidAmount: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.PayCustomerPendingAmount()}`,
      { clubCustomerId, paidAmount }
    );
  }

  addPlayerToSession(tableSessionId: number, player: SessionPlayer): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.AddPlayerToSession()}`,
      {
        tableSessionId,
        clubCustomerId: player.clubCustomerId,
        playerName: player.playerName,
        phoneNo: player.phoneNo,
        isWalkIn: player.isWalkIn
      }
    );
  }

  endTableSession(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.EndTableSession()}`,
      payload
    );
  }

  addGameToSession(tableSessionId: number, amount: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.AddGameToSession()}`,
      { tableSessionId, gameRate: amount }
    );
  }

  addInventoryItemToSession(tableSessionId: number, inventoryItemId: number, quantity: number, buyerName?: string, clubCustomerId?: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.AddInventoryItemToSession()}`,
      { tableSessionId, inventoryItemId, quantity, buyerName, clubCustomerId }
    );
  }

  deleteTableSession(tableSessionId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.CancelTableSession()}?tableSessionId=${tableSessionId}&id=${tableSessionId}`,
      { tableSessionId, id: tableSessionId }
    );
  }

  private mapInventoryList(response: any): InventoryItem[] {
    const data = response?.data || response;
    const list = data?.list || data?.List || data || [];

    return list.map((item: any) => this.mapInventoryItem(item));
  }

  private mapInventoryItem(item: any): InventoryItem {
    const id = item.inventoryItemId ?? item.InventoryItemId ?? item.id ?? item.Id;
    const stockQty = item.stockQty ?? item.StockQty ?? item.stock ?? item.Stock ?? 0;

    return {
      id,
      inventoryItemId: id,
      name: item.name ?? item.Name,
      category: item.category ?? item.Category,
      price: item.price ?? item.Price ?? 0,
      stock: stockQty,
      stockQty
    };
  }

  private mapClubTables(response: any): ClubTableSetup[] {
    const data = response?.data || response;
    const list = data?.list || data?.List || data || [];

    return list.map((item: any) => this.mapClubTable(item));
  }

  private mapClubTable(item: any): ClubTableSetup {
    const id = item.clubTableId ?? item.ClubTableId ?? item.id ?? item.Id;
    const hourlyRate = Number(item.hourlyRate ?? item.HourlyRate ?? item.singleHourlyRate ?? item.SingleHourlyRate ?? 30);
    const gameRate = Number(item.gameRate ?? item.GameRate ?? item.singleGameRate ?? item.SingleGameRate ?? 15);
    const doubleHourlyRate = Number(item.doubleHourlyRate ?? item.DoubleHourlyRate ?? hourlyRate);
    const doubleGameRate = Number(item.doubleGameRate ?? item.DoubleGameRate ?? gameRate);

    return {
      id,
      clubTableId: id,
      tableNo: Number(item.tableNo ?? item.TableNo ?? id),
      tableName: item.tableName ?? item.TableName ?? `Table ${id}`,
      tableType: item.tableType ?? item.TableType ?? 'Snooker',
      hourlyRate,
      minuteRate: Number(item.minuteRate ?? item.MinuteRate ?? hourlyRate / 60),
      gameRate,
      doubleHourlyRate,
      doubleMinuteRate: Number(item.doubleMinuteRate ?? item.DoubleMinuteRate ?? doubleHourlyRate / 60),
      doubleGameRate,
      isActive: item.isActive ?? item.IsActive ?? true
    };
  }

  private mapClubCustomers(response: any): ClubCustomer[] {
    const data = response?.data || response;
    const list = data?.list || data?.List || data || [];

    return list.map((item: any) => ({
      clubCustomerId: item.clubCustomerId ?? item.ClubCustomerId ?? item.customerId ?? item.CustomerId,
      customerName: item.customerName ?? item.CustomerName ?? '',
      phoneNo: item.phoneNo ?? item.PhoneNo ?? '',
      balanceAmount: item.balanceAmount ?? item.BalanceAmount ?? 0
    }));
  }

  private mapCustomerPendingPayments(response: any): CustomerPendingPayment[] {
    const data = response?.data || response;
    const list = data?.list || data?.List || data?.items || data?.Items || data?.records || data?.Records || data?.customerPendingPayments || data?.CustomerPendingPayments || data || [];
    const rows = Array.isArray(list) ? list : [list];

    return rows.map((item: any) => ({
      clubCustomerId: Number(item.clubCustomerId ?? item.ClubCustomerId ?? item.customerId ?? item.CustomerId ?? item.id ?? item.Id ?? 0),
      customerName: item.customerName ?? item.CustomerName ?? item.clubCustomerName ?? item.ClubCustomerName ?? item.name ?? item.Name ?? item.playerName ?? item.PlayerName ?? '',
      phoneNo: item.phoneNo ?? item.PhoneNo ?? '',
      dueAmount: Number(item.dueAmount ?? item.DueAmount ?? item.totalDueAmount ?? item.TotalDueAmount ?? item.pendingAmount ?? item.PendingAmount ?? item.balanceAmount ?? item.BalanceAmount ?? 0),
      lastPaymentDate: parseApiDateAsUae(item.lastPaymentDate ?? item.LastPaymentDate ?? item.createdOn ?? item.CreatedOn ?? item.updatedOn ?? item.UpdatedOn),
      paymentCount: item.paymentCount ?? item.PaymentCount ?? item.totalRecords ?? item.TotalRecords ?? item.count ?? item.Count ?? 0
    })).filter((item: CustomerPendingPayment) => item.clubCustomerId > 0 || item.customerName || item.dueAmount > 0);
  }

  private mapCustomerPendingPaymentHistory(response: any): CustomerPendingPaymentHistory[] {
    const data = response?.data || response;
    const list = data?.list || data?.List || data?.items || data?.Items || data?.records || data?.Records || data || [];
    const rows = Array.isArray(list) ? list : [list];

    return rows.map((item: any) => ({
      customerPaymentId: Number(item.customerPaymentId ?? item.CustomerPaymentId ?? item.id ?? item.Id ?? 0),
      clubCustomerId: Number(item.clubCustomerId ?? item.ClubCustomerId ?? item.customerId ?? item.CustomerId ?? 0),
      customerName: item.customerName ?? item.CustomerName ?? item.name ?? item.Name ?? '',
      phoneNo: item.phoneNo ?? item.PhoneNo ?? '',
      tableSessionId: item.tableSessionId ?? item.TableSessionId,
      inventorySaleId: item.inventorySaleId ?? item.InventorySaleId,
      receiptNo: item.receiptNo ?? item.ReceiptNo ?? '',
      players: item.players ?? item.Players ?? item.playerNames ?? item.PlayerNames ?? '',
      totalTime: item.totalTime ?? item.TotalTime ?? item.sessionTime ?? item.SessionTime ?? '',
      tableTimeAmount: Number(item.tableTimeAmount ?? item.TableTimeAmount ?? item.tableAmount ?? item.TableAmount ?? item.timeAmount ?? item.TimeAmount ?? 0),
      inventoryAmount: Number(item.inventoryAmount ?? item.InventoryAmount ?? 0),
      inventoryItems: this.mapHistoryInventoryItems(item.inventoryItems ?? item.InventoryItems ?? item.tableSessionInventoryItems ?? item.TableSessionInventoryItems ?? []),
      totalAmount: Number(item.totalAmount ?? item.TotalAmount ?? item.amount ?? item.Amount ?? 0),
      paidAmount: Number(item.paidAmount ?? item.PaidAmount ?? 0),
      discountAmount: Number(item.discountAmount ?? item.DiscountAmount ?? 0),
      dueAmount: Number(item.dueAmount ?? item.DueAmount ?? 0),
      paymentStatus: item.paymentStatus ?? item.PaymentStatus ?? '',
      paymentType: item.paymentType ?? item.PaymentType ?? '',
      createdOn: parseApiDateAsUae(item.createdOn ?? item.CreatedOn)
    })).filter((item: CustomerPendingPaymentHistory) => item.customerPaymentId > 0 || item.dueAmount > 0);
  }

  private mapHistoryInventoryItems(value: any): BillItem[] {
    if (!value) {
      return [];
    }

    const rows = Array.isArray(value) ? value : [];

    return rows.map((item: any) => ({
      itemId: item.itemId ?? item.ItemId ?? item.inventoryItemId ?? item.InventoryItemId ?? 0,
      name: item.name ?? item.Name ?? item.itemName ?? item.ItemName ?? '',
      price: Number(item.price ?? item.Price ?? 0),
      quantity: Number(item.quantity ?? item.Quantity ?? 1),
      buyerName: item.buyerName ?? item.BuyerName ?? '',
      clubCustomerId: item.clubCustomerId ?? item.ClubCustomerId
    }));
  }

  private mapRunningSessions(response: any): RunningTableSession[] {
    const data = response?.data || response;
    const list = data?.list || data?.List || data || [];

    return list.map((item: any) => ({
      tableSessionId: item.tableSessionId ?? item.TableSessionId,
      tableNo: item.tableNo ?? item.TableNo,
      tableName: item.tableName ?? item.TableName,
      tableType: item.tableType ?? item.TableType,
      clubCustomerId: item.clubCustomerId ?? item.ClubCustomerId,
      customerName: item.customerName ?? item.CustomerName,
      customerPhone: item.customerPhone ?? item.CustomerPhone,
      playerCount: item.playerCount ?? item.PlayerCount,
      sessionMode: item.sessionMode ?? item.SessionMode ?? 'Time',
      playType: item.playType ?? item.PlayType ?? 'Single',
      minuteRate: item.minuteRate ?? item.MinuteRate,
      hourlyRate: item.hourlyRate ?? item.HourlyRate,
      gameRate: item.gameRate ?? item.GameRate,
      startTime: item.startTime ?? item.StartTime,
      receiptNo: item.receiptNo ?? item.ReceiptNo,
      status: item.status ?? item.Status,
      tableSessionPlayers: item.tableSessionPlayers ?? item.TableSessionPlayers ?? [],
      tableSessionInventoryItems: item.tableSessionInventoryItems ?? item.TableSessionInventoryItems ?? [],
      tableSessionGames: item.tableSessionGames ?? item.TableSessionGames ?? []
    }));
  }
}
