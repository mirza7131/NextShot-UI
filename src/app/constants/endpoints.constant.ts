export class EndPointConstant {

    //#region Menu
    static Invoice: any =
        {
            Controller: '/Invoice/',
            GetAllDivisions: () => this.Invoice.Controller + 'GetAllDivisions',
            GetAllDistricts: () => this.Invoice.Controller + 'GetAllDistricts',
            GetHfTypes: () => this.Invoice.Controller + 'GetHfTypes',
            GetHealthFacilities: () => this.Invoice.Controller + 'GetHealthFacilities',
            GetServiceTypes: () => this.Invoice.Controller + 'GetServiceTypes',
            CreateOrEdit:() =>this.Invoice.Controller + 'CreateOrEdit',
            GetInvoices:()=> this.Invoice.Controller + 'GetInvoices',
            GetEmployeeListForInvoice:()=> this.Invoice.Controller + 'GetEmployeeListForInvoice',
            SavePartimeEmployee:()=>this.Invoice.Controller + 'SavePartimeEmployee',
            GetAllEmployeList:()=>this.Invoice.Controller + 'GetAllEmployeList',
            GetEmployeeToEdit:()=>this.Invoice.Controller + 'GetEmployeeToEdit',
            GetInvoiceById:()=>this.Invoice.Controller + 'GetInvoiceById',
            GetAllInvoiceStatus:()=>this.Invoice.Controller + 'GetAllInvoiceStatus',
            AddNotes:()=> this.Invoice.Controller + 'AddNotes',
            GetInvoiceStatusCount:()=> this.Invoice.Controller +'GetInvoiceStatusCount',
            getInvoiceDetailByGuidId:()=> this.Invoice.Controller + 'getInvoiceDetailByGuidId',
            GetAllWithPagination:()=> this.Invoice.Controller + 'GetAllWithPagination',
            GetInvoiceDetailById:()=>  this.Invoice.Controller + 'GetInvoiceDetailById',
            Delete:()=>  this.Invoice.Controller + 'Delete',
            GetViewInvoiceById:()=>  this.Invoice.Controller + 'GetViewInvoiceById',
            getBillToAndItemAutoComplete:()=>  this.Invoice.Controller +  'getBillToAndItemAutoComplete',
            updateDueAmount:()=>  this.Invoice.Controller +  'updateDueAmount',
            GetInventoryItems:()=> this.Invoice.Controller + 'GetInventoryItems',
            GetInventoryItemById:()=> this.Invoice.Controller + 'GetInventoryItemById',
            CreateInventoryItem:()=> this.Invoice.Controller + 'CreateInventoryItem',
            UpdateInventoryItem:()=> this.Invoice.Controller + 'UpdateInventoryItem',
            DeleteInventoryItem:()=> this.Invoice.Controller + 'DeleteInventoryItem',
            ChangeInventoryStatus:()=> this.Invoice.Controller + 'ChangeInventoryStatus',
            ReduceInventoryStock:()=> this.Invoice.Controller + 'ReduceInventoryStock',
            StartTableSession:()=> this.Invoice.Controller + 'StartTableSession',
            EndTableSession:()=> this.Invoice.Controller + 'EndTableSession',
            GetRunningTableSessions:()=> this.Invoice.Controller + 'GetRunningTableSessions',
            GetTableSessionById:()=> this.Invoice.Controller + 'GetTableSessionById',
            GetTableSessionHistory:()=> this.Invoice.Controller + 'GetTableSessionHistory',
            CancelTableSession:()=> this.Invoice.Controller + 'CancelTableSession',
            AddInventoryItemToSession:()=> this.Invoice.Controller + 'AddInventoryItemToSession',
            GetSessionInventoryItems:()=> this.Invoice.Controller + 'GetSessionInventoryItems',
            RemoveSessionInventoryItem:()=> this.Invoice.Controller + 'RemoveSessionInventoryItem',
            CreateCustomer:()=> this.Invoice.Controller + 'CreateCustomer',
            CreateClubCustomer:()=> this.Invoice.Controller + 'CreateClubCustomer',
            UpdateClubCustomer:()=> this.Invoice.Controller + 'UpdateClubCustomer',
            DeleteClubCustomer:()=> this.Invoice.Controller + 'DeleteClubCustomer',
            SearchClubCustomers:()=> this.Invoice.Controller + 'SearchClubCustomers',
            AddPlayerToSession:()=> this.Invoice.Controller + 'AddPlayerToSession',
            AddGameToSession:()=> this.Invoice.Controller + 'AddGameToSession',
            GetClubTables:()=> this.Invoice.Controller + 'GetClubTables',
            CreateClubTable:()=> this.Invoice.Controller + 'CreateClubTable',
            UpdateClubTable:()=> this.Invoice.Controller + 'UpdateClubTable',
            DeleteClubTable:()=> this.Invoice.Controller + 'DeleteClubTable'
        }

    //#endregion
    static ServiceProvider: any =
        {
            Controller: '/ServiceProvider/',
            RegisterCompany: () => this.ServiceProvider.Controller + 'RegisterCompany',
           
        }
}
