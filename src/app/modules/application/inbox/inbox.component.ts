import { Component, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/Services/api.service';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'app-inbox',
  standalone: false,
  providers: [MessageService],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss'
})

export class InboxComponent {
  Applications!: any[];
  public user : any = {};
  display: boolean = false;

  appDetails: any = {};


//From Aneeb
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
  editInvoiceDialog: boolean = false;
  BillToName:string;
  InvoiceMasterId:string;
  @ViewChild('invoiceContent') invoiceContent: ElementRef;

  stockcheckFilter:GetStockCheckboxCheckFilter = new GetStockCheckboxCheckFilter()
  public minimumDate = new Date();
  public minDate = new Date();

  @ViewChild('table', { static: false }) table: ElementRef;

  selectedMedicine: any;
  filteredMedicineData: any[] = [];
  public maxLimit:number;


  dueAmountPay:number;
  dueAmount:number;

logoBase64: string = '';



  constructor(private messageService: MessageService,private apiService: ApiService, private appService:ApplicationService,) {}

  ngOnInit()
    {
        this.getBase64ImageFromUrl('assets/demo/images/gama.jpeg');
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

  getApplication()
    {
      debugger
      this.apiService.get('Application', 'GetApplicationList', {UserId: this.user.userId}).subscribe(response => {
        if(response)
        {
          debugger
          this.Applications = response;
        }
      });
  }

  applicationdetails(app: any)
  {
    this.appDetails = app;
  }
  


  showInfoViaToast(summary: string, detail: string) {
    this.messageService.add({ key: 'tst', severity: 'info', summary, detail });
 }

  showWarnViaToast(summary: string, detail: string) {
    this.messageService.add({ key: 'tst', severity: 'warn', summary, detail });
  }

  showErrorViaToast(summary: string, detail: string) {
    this.messageService.add({ key: 'tst', severity: 'error', summary, detail });
  }

  showSuccessViaToast(summary: string, detail: string) {
    this.messageService.add({ key: 'tst', severity: 'success', summary, detail });
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

 
getBase64ImageFromUrl(url: string) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0);

    this.logoBase64 = canvas.toDataURL('image/png');
  };

  img.src = url;
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
editInvoice(medicine){
  this.editInvoiceDialog = true;
  this.appService.GetViewInvoiceById(medicine?.InvoiceMasterId || '').subscribe((data: any) => {
    if (data) {
      debugger
      this.ViewInvoiceObj = data
      console.log("ViewInvoiceObj : ", this.ViewInvoiceObj)
      
    }
   
    });
}
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



checkDiscountLimit(val): void {
  debugger

  this.dueAmount = this.ViewInvoiceObj?.DueAmount;
  // this.ViewInvoiceObj.DueAmount = this.ViewInvoiceObj?.DueAmount - val;


  this.maxLimit = this.dueAmount.toString().length;


  if (this.dueAmountPay !== null) {
    if (this.dueAmountPay < 0) {
      this.dueAmountPay = 0; // Enforce minimum value
    } else if (this.dueAmountPay > this.dueAmount) {
      this.dueAmountPay = this.dueAmount; // Enforce maximum value
    }
  }
}

receivedAmt(){

console.log("dueAmountPay==>",this.dueAmountPay)
var obj = {
  InvoiceMasterId: this.ViewInvoiceObj?.InvoiceMasterId,
  DueAmountPay: this.dueAmountPay
}

this.appService.updateDueAmount(obj).subscribe((data: any) => {
  if (data) {
    debugger
    this.ViewInvoiceObj.DueAmount = this.ViewInvoiceObj?.DueAmount - this.dueAmountPay;
    this.ViewInvoiceObj.ReceivedAmount = this.ViewInvoiceObj?.ReceivedAmount + this.dueAmountPay;
    this.dueAmountPay = null;
    this.getStockByBrachOrByMedicine();
    this.showSuccessViaToast("Success", "Update Successfully DueAmount...! ");

    
  }
 
  });
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
    }, 2000);
    
  }
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