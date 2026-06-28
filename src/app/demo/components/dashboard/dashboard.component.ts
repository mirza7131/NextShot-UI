import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ApiService } from 'src/Services/api.service';
import { Router } from '@angular/router';
import { el } from '@fullcalendar/core/internal-common';
import { Table } from 'primeng/table';
import { ApplicationService } from 'src/app/modules/application/application.service';

@Component({
    templateUrl: './dashboard.component.html',
    providers: [MessageService],
    
})
export class DashboardComponent implements OnInit, OnDestroy {
    @ViewChild('table', { static: true }) table: Table;
     displayRegisterDialog:boolean = true;
    items!: MenuItem[];
    products!: Product[];
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;

    public applications: any = [];
    public dashboard: any = [];
    public user : any = {};
    public selectedDrop: any;
    public AffliationType: any = [];

    public filename : string = 'Submitted Invoices';

    public OriginalApplications: any = [];

    cols: any[] = [];
    allInvoices: any;
    allInvoiceswithStatus: any[]= [];
    activeInvoiceCount: number;
    approvedInvoiceCount: number;
    rejectedInvoiceCount: number;
    reissuedInvoiceCount: number;
    pendingInvoiceCount: number;
   // stockcheckFilter: any;




Medicines: string[] = [];
  showBatchDetail: boolean = false;
  showBatchDetailchecks: boolean = false;
  IsShowBatchDetailchecks: boolean = false;
  showNearestExpiry: boolean = false;
  showCalender: boolean = false;
  showExpiryOnly: boolean = false;
  showNotExpiryOnly: boolean = false;
  showExpirycalendar: boolean = false;
  IsShowExpired: boolean = false;
  IsShowNotExpired: boolean = false;
  TonearestExpiryDate: Date | null = null;
  FromnearestExpiryDate: Date | null = null;
  Toexpirydate: Date | null = null;
  Fromexpirydate: Date | null = null;

  BranchID: any;
  public loginUserDetail: any = {};
  medicineList: any[] = [];
  dashboardCount: any = {};
  public medicineObject: any = {};
  public medicineListdata: any = {};
  public ViewInvoiceObj:any ={};
  public MedicineId: any;
  public GuidId: any;
  currentDate: Date;
  stockValue: number = 0;

  IsDueAmount: boolean = false;; 
  IsTotalAmount: boolean = false;; 
  IsAllAmount: boolean = false;; 
  PageNumber:number = 1;
  PageSize:number = 10; 

  deleteUserDialog: boolean = false;
  viewInvoiceDialog: boolean = false;
  BillToName:string;
  InvoiceMasterId:string;
  @ViewChild('invoiceContent') invoiceContent: ElementRef;

  stockcheckFilter:GetStockCheckboxCheckFilter = new GetStockCheckboxCheckFilter()
  public minimumDate = new Date();
  public minDate = new Date();

  @ViewChild('table', { static: false }) table1: ElementRef;

  selectedMedicine: any;
  filteredMedicineData: any[] = [];













    constructor(
        private productService: ProductService,
        public layoutService: LayoutService,
        private apiService: ApiService,
        private appService:ApplicationService,
        private router: Router) {
        this.subscription = this.layoutService.configUpdate$
        .pipe(debounceTime(25))
        .subscribe((config) => {
            this.initChart();
        });
    }

    ngOnInit() {

        debugger
      this.user.token = localStorage.getItem('token');
      this.user.username = localStorage.getItem('username');
      // this.user.roles = JSON.parse(localStorage.getItem('roles') || '[]');
      this.user.email = localStorage.getItem('email');
      this.user.userId = localStorage.getItem('userId');
      // this.getApplication();

      this.currentDate = new Date();
    // this.loginUserDetail = this._AuthService.getLoginUser();
    // this.BranchID = this.loginUserDetail?.MimsBranchId
    this.getStockByBrachOrByMedicine();
     this.getAllMedicineOfHealthFacilityInInventory();
    }
    GetAllInvoiceStatus(){
        this.appService.GetAllInvoiceStatus().subscribe(res => {
            debugger
            this.allInvoiceswithStatus = res.data && Array.isArray(res.data) ? res.data : []; 
        });
    }
    GetAllInvoices() {
        this.appService.GetInvoiceStatusCount().subscribe(res => {
            debugger
            this.allInvoices = res.data[0] ; 
            console.log('this.allInvoices',this.allInvoices)
           
        });
    }
    onSelect(app) {
     debugger
     localStorage.setItem("selectedRow", JSON.stringify(app));
        // localStorage.setItem("InvoiceNumber",app.InvoiceNumber );
        // localStorage.setItem("IssuedOn",app.IssuedOn );
        // localStorage.setItem("DueDate",app.DueDate );
        // localStorage.setItem("Division",app.Division );
        // localStorage.setItem("District",app.District );
        // localStorage.setItem("HFType",app.HFType );
        // localStorage.setItem("HealthFacilityName",app.HealthFacilityName );
        // localStorage.setItem("Service",app.Service );
        // localStorage.setItem("Month",app.Month );
        
        this.router.navigate(["/application/"]);
      }
      goToRegister() {
        this.router.navigate(['/application/RegisterCompany']);
      }
    // exportToExcel() {
    //     // Define the columns you want to export
    //     const columnsToExport = ['InstituteName', 'PrincipalName', 'Mobile', 'Email', 'OwnerName', 'ApplicationStatus'];
      
    //     // Set the visible columns in the table
    //     this.table.columns = this.cols.filter(col => columnsToExport.includes(col.field));
      
    //     // Transform the 'ApplicationStatus' values before exporting
    //     const transformedData = this.table.value.map(row => {
    //       return {
    //         ...row,
    //         ApplicationStatus: row.ApplicationStatus == 1 ? 'Submitted' : 'Incomplete'
    //       };
    //     });
      
    //     // Set the transformed data to the table (assuming your table has a 'value' property)
    //     this.table.value = transformedData;
      
    //     // Export the CSV with the visible columns and transformed data
      
    //     this.table.exportCSV();
      
    //     // Reset the visible columns to the original state if needed
    //     this.table.columns = this.cols;
    // }
      
 
    exportToExcel() {
        // Define the columns you want to export
        const columnsToExport = ['InstituteName', 'PrincipalName', 'Mobile', 'Email', 'OwnerName', 'ApplicationStatus'];
    
        // Set the visible columns in the table
        this.table.columns = this.cols.filter(col => columnsToExport.includes(col.field));
    
        // Transform the 'ApplicationStatus' values before exporting
        const transformedData = this.table.value.map(row => {
            return {
                ...row,
                ApplicationStatus: row.IsLocked ? 'Submitted' : 'Incomplete'
            };
        });
    
        // Set the transformed data to the table (assuming your table has a 'value' property)
        this.table.value = transformedData;
    
        // Export the CSV with the visible columns and transformed data
        this.table.exportCSV();
    
        // Reset the visible columns to the original state if needed
        this.table.columns = this.cols;
    }
    
    
      

   
      


    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    GetCounts()
    {
        this.apiService.get('Application', 'MainDashboard', null).subscribe(response => {
            if(response)
            {
              this.dashboard = response;
            }
        });
    }

  
    getApplication()
    {
        let TypeId = null;
        if(this.selectedDrop)
        {
            TypeId = this.selectedDrop.id ;
            this.apiService.get('Application', 'GetApplications', {TypeId: TypeId}).subscribe(response => {
                if(response)
                {
                  debugger
                  this.applications = response;
                  this.OriginalApplications = response;
                }
             });
        }
        else
        {
            this.apiService.get('Application', 'GetApplications', null).subscribe(response => {
                if(response)
                {
                  debugger
                  this.applications = response;
                  this.OriginalApplications = response;
                }
             });
        }
        
    }
    

    FilterStatus(statusId: number)
    {
        debugger
        this.table.first = 0;
        if(statusId == 1)
        {
            this.applications = this.OriginalApplications;
        }

        if(statusId == 2)
        {
            this.applications = this.OriginalApplications.filter(x=> x.IsLocked == true);
        }
       
        if(statusId == 3)
        {
            this.applications = this.OriginalApplications.filter(x=> x.IsLocked == false || x.IsLocked == null);
        }
        
    }

    navigateToDetails(grantApplicationId: string, userId: string): void {
        debugger
        // Use the Router to navigate to the DetailsComponent with parameters
        // this.router.navigate(['dashboard/details', grantApplicationId]);

        const url = this.router.serializeUrl(this.router.createUrlTree(['dashboard/details', grantApplicationId], { queryParams: { userId } }));

        // Open the URL in a new tab
       window.open(url, '_blank');

    }

    onDropdownChange(event: any): void {
        let TypeId = null;
        this.table.first = 0;
        if(this.selectedDrop)
        {
            TypeId = this.selectedDrop.id ;
            this.apiService.get('Application', 'GetApplications', {TypeId: TypeId}).subscribe(response => {
                if(response)
                {
                  debugger
                  this.applications = response;
                  this.OriginalApplications = response;
                }
             });
        }
        else
        {
            this.GetCounts();
            this.apiService.get('Application', 'GetApplications', null).subscribe(response => {
                if(response)
                {
                  debugger
                  this.applications = response;
                  this.OriginalApplications = response;
                }
             });
        }
    }











    getStockByBrachOrByMedicine() {
        debugger
    
        if (this.showBatchDetailchecks) {
          this.IsShowBatchDetailchecks = true
        }
        else {
          this.IsShowBatchDetailchecks = false
        }
        if(!this.medicineListdata){
          this.MedicineId = null;
        }
        this.stockcheckFilter.MimsBranchId = this.BranchID
        this.stockcheckFilter.IsBatchWise = this.showBatchDetailchecks;
        this.stockcheckFilter.MedicineId = this.MedicineId;
        this.stockcheckFilter.ToNearestExpire = this.TonearestExpiryDate;
        this.stockcheckFilter.FromNearestExpire = this.FromnearestExpiryDate;
        this.stockcheckFilter.ToExpired = this.Toexpirydate;
        this.stockcheckFilter.FromExpired = this.Fromexpirydate;
        this.stockcheckFilter.IsShowExpired = this.IsShowExpired;
        this.stockcheckFilter.IsShowNotExpired = this.IsShowNotExpired;
    
        this.stockcheckFilter.GuidId = this.GuidId; 
        this.stockcheckFilter.IsDueAmount = this.IsDueAmount; 
        this.stockcheckFilter.IsTotalAmount = this.IsTotalAmount; 
        this.stockcheckFilter.IsAllAmount = this.IsAllAmount; 
    
        // let date = new Date(this.TonearestExpiryDate);
        // date.setTime(date.getTime() + (5 * 60 * 60 * 1000));
        // this.TonearestExpiryDate = date;
    
        // let dateO = new Date(this.FromnearestExpiryDate);
        // date.setTime(date.getTime() + (5 * 60 * 60 * 1000));
        // this.TonearestExpiryDate = dateO;
    
        this.stockcheckFilter.FromDate = this.TonearestExpiryDate; 
        this.stockcheckFilter.ToDate = this.FromnearestExpiryDate; 
    
        this.stockcheckFilter.PageNumber = this.PageNumber; 
        this.stockcheckFilter.PageSize = this.PageSize; 
    
        this.appService.getInvoiceDetailList(this.stockcheckFilter).subscribe((response: any) => {
          if (response) {
            debugger
            this.medicineList = response.invoiceMaster;
            this.dashboardCount = response.invoiceDashboardCountDto[0];
            console.log("Medcine List: ", response)
          }
        })
      }
    
      getAllMedicineOfHealthFacilityInInventory() {
        debugger
        this.stockcheckFilter.MimsBranchId = this.BranchID
        this.appService.getInvoiceDetailByGuidId().subscribe((response: any) => {
          if (response) {
            debugger
            this.medicineObject = response
            this.medicineListdata = response
            this.medicineListdata = this.medicineListdata.map(item => ({
              ...item,
              BillToName: item.BillToName ? item.BillToName.toString() : ''
            }));
            console.log("medicineListdata List: ", this.medicineListdata)
            
          }
        })
      }


      printDiv() {
        const printableContent = document.getElementById('printableDiv');
      
        if (printableContent) {
          const printWindow = window.open('', '_blank', 'width=800,height=900');
          printWindow?.document.open();
          printWindow?.document.write(`
            <html>
              <head>
                <title>Print Invoice</title>
                <style>
                  /* General print styles */
                  @media print {
                    @page {
                      size: A4; /* Ensures content is sized for A4 page */
                      margin: 0; /* Removes page margins */
                    }
                    body {
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                      font-family: Arial, sans-serif;
                    }
                    #content {
                      width: 100%;
                      page-break-inside: avoid; /* Prevents content from breaking */
                    }
                   
                   
                    /* Ensure no elements break unnecessarily */
                    .header, .total, .details, .notes {
                      page-break-before: avoid;
                      page-break-after: avoid;
                    }
                  }
                </style>
              </head>
              <body>
                <div id="content">
                  ${printableContent.innerHTML}
                </div>
              </body>
            </html>
          `);
          printWindow?.document.close();
          printWindow?.print();
      
          setTimeout(() => {
            printWindow?.close();
          }, 1000);
          
        }
      }
      

      selectMedicine(e: any) {
        debugger
        if (e.value) {
          this.GuidId = e.value;
        }
        else {
          this.GuidId = null
        }
      }
      // onChangeDate(val: any) {
      //   debugger
      //   this.NearestExpirationDate = val
      //   console.log("Nearest Expiration: ", this.NearestExpirationDate)
      // }
    
      submitFilter() {
        debugger
        this.getStockByBrachOrByMedicine();
      }
      clearFilter() {
       // this.medicineListdata = [];
        this.selectedMedicine = null;
        this.MedicineId = null;
        this.showBatchDetail = false;
        this.showBatchDetailchecks = false;
        this.showCalender = false;
        this.showExpirycalendar = false;
        this.showNearestExpiry = false;
        this.showExpiryOnly = false;
        this.FromnearestExpiryDate = null;
        this.TonearestExpiryDate = null;
        this.Toexpirydate = null;
        this.Fromexpirydate = null;
        this.IsShowExpired = false;
        this.IsShowNotExpired = false;
        this.showNotExpiryOnly = false;
    
        this.GuidId  = null;
        this.IsDueAmount = null;; 
        this.IsTotalAmount = null;; 
       this.IsAllAmount = null;; 
        this.getStockByBrachOrByMedicine();
        this.getAllMedicineOfHealthFacilityInInventory();
      }
    
      checkshowBatchDetail(val: any) {
        debugger
        if (val.length >= 1) {
          this.showBatchDetailchecks = true;
          this.IsShowExpired = false;
          this.IsShowNotExpired = false;
    
    
        }
        else if (val = []) {
          this.showBatchDetailchecks = false;
          this.showCalender = false;
          this.showExpirycalendar = false;
          this.showNearestExpiry = false;
          this.showExpiryOnly = false;
          this.FromnearestExpiryDate = null;
          this.TonearestExpiryDate = null;
          this.Toexpirydate = null;
          this.Fromexpirydate = null;
          this.IsShowExpired = false;
          this.IsShowNotExpired = false;
          this.showNotExpiryOnly = false;
    
        }
      }
      onNearestExpiryChange(value: any) {
        debugger
        if (value.length >= 1) {
    
            this.IsAllAmount = true;
            this.IsTotalAmount = false;
            this.IsDueAmount = false
    
        }
        else if (value = []) {
          this.IsAllAmount = false;
          this.IsTotalAmount = false;
          this.IsDueAmount = false
    
        }
    
      }
    
      onExpiryOnlyChange(val: any) {
        debugger
        if (val.length >= 1) {
          this.IsAllAmount = false;
          this.IsTotalAmount = true;
          this.IsDueAmount = false
        }
        else if (val = []) {
          this.IsAllAmount = false;
          this.IsTotalAmount = false;
          this.IsDueAmount = false
        }
      }
      onNotExpiryOnlyChange(val: any) {
        debugger
        if (val.length >= 1) {
          // this.showNotExpiryOnly = true
          this.IsAllAmount = false;
          this.IsTotalAmount = false;
          this.IsDueAmount = true
    
        }
        else if (val = []) {
          this.IsAllAmount = false;
          this.IsTotalAmount = false;
          this.IsDueAmount = false
        }
      }
      isExpired(expDate: string): boolean {
        const medicineExpDate = new Date(expDate);
        return medicineExpDate <= this.currentDate;
      }
      get totalStockValue(): number {
        if (!this.IsShowBatchDetailchecks) {
          return this.medicineList.reduce((sum, medicine) => sum + ((medicine.AvailableQty + medicine.BatchHoldQty) * medicine.UnitPrice), 0);
        }
        return this.medicineList.reduce((sum, medicine) => sum + (medicine.AvailableQty * medicine.UnitPrice), 0);
      }
      updateFromDateMin() {
        this.resetFromNearestExpiryDate();
        if (this.TonearestExpiryDate) {
          this.minimumDate = new Date(this.TonearestExpiryDate);
        } else {
          this.minimumDate = new Date(); // Reset to current date if TonearestExpiryDate is null
        }
      }
      updateFromDateMinforExpire() {
        this.resetFromNearestExpiryDate();
        if (this.Toexpirydate) {
          this.minimumDate = new Date(this.Toexpirydate);
        } else {
          this.minimumDate = new Date(); // Reset to current date if TonearestExpiryDate is null
        }
      }
      resetFromNearestExpiryDate() {
        this.FromnearestExpiryDate = null;
        this.Fromexpirydate = null
      }
      
    
      // Utility function to format date (similar to Angular date pipe)
      formatDate(date: any) {
        if (!date) {
          return 'Invalid Date';
        }
        try {
          const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
          return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
        } catch (error) {
          console.error('Error formatting date:', error);
          return 'Invalid Date';
        }
      }
    
      // Utility function to check if a date is expired
      isExpireds(expDate: any) {
        if (!expDate) {
          return false;
        }
        const today = new Date();
        const expiryDate = new Date(expDate);
        return today > expiryDate;
      }
    
    
      deleteInvoice(medicine){
    this.deleteUserDialog = true;
    this.BillToName = medicine.BillToName;  
    this.InvoiceMasterId = medicine?.InvoiceMasterId;
      }
    editInvoice(medicine){}
    viewInvoice(medicine){
      debugger
      this.viewInvoiceDialog = true
      this.appService.GetViewInvoiceById(medicine?.InvoiceMasterId || '').subscribe((data: any) => {
        if (data) {
          debugger
          this.ViewInvoiceObj = data
          console.log("ViewInvoiceObj : ", this.ViewInvoiceObj)
          
        }
       
        });
    }
    
    
    confirmDelete() {
    
      this.deleteUserDialog = false;
    
      this.appService.delete(this.InvoiceMasterId || '').subscribe((data: any) => {
      this.getStockByBrachOrByMedicine();
        // this.users = this.users.filter(val => val.UserId !== this.user.UserId);
        this.user = {};
      });
    
    }
    

}



export class GetStockCheckboxCheckFilter{
    MedicineId?: number;
    MimsBranchId: string;
    IsBatchWise:boolean;
    ToNearestExpire?:Date| null = null;
    FromNearestExpire?:Date| null = null;
    ToExpired?:Date| null = null;
    FromExpired?:Date| null = null;
    IsShowExpired:boolean;
    IsShowNotExpired:boolean;
  
    GuidId?: string| null = null; 
    IsDueAmount?:boolean| null = null; 
    IsTotalAmount?:boolean| null = null; 
    IsAllAmount?:boolean| null = null; 
    PageNumber?: number; 
    PageSize?: number; 
    FromDate?:Date| null = null;
    ToDate?:Date| null = null;
  }