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
            updateDueAmount:()=>  this.Invoice.Controller +  'updateDueAmount'
        }

    //#endregion
    static ServiceProvider: any =
        {
            Controller: '/ServiceProvider/',
            RegisterCompany: () => this.ServiceProvider.Controller + 'RegisterCompany',
           
        }
}