import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EndPointConstant } from 'src/app/constants/endpoints.constant';
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
  isActive: boolean;
}

export interface BillItem {
  itemId: number;
  name: string;
  price: number;
  quantity: number;
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

export interface StartTableSessionRequest {
  tableNo: number;
  tableName: string;
  tableType: string;
  clubCustomerId?: number;
  customerName: string;
  customerPhone?: string;
  playerCount: number;
  sessionMode: string;
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
        gameRate: table.gameRate,
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
        gameRate: table.gameRate,
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

  addInventoryItemToSession(tableSessionId: number, inventoryItemId: number, quantity: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}${EndPointConstant.Invoice.AddInventoryItemToSession()}`,
      { tableSessionId, inventoryItemId, quantity }
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
    const hourlyRate = Number(item.hourlyRate ?? item.HourlyRate ?? 30);
    const gameRate = Number(item.gameRate ?? item.GameRate ?? 15);

    return {
      id,
      clubTableId: id,
      tableNo: Number(item.tableNo ?? item.TableNo ?? id),
      tableName: item.tableName ?? item.TableName ?? `Table ${id}`,
      tableType: item.tableType ?? item.TableType ?? 'Snooker',
      hourlyRate,
      minuteRate: Number(item.minuteRate ?? item.MinuteRate ?? hourlyRate / 60),
      gameRate,
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
