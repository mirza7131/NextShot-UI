import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { an, el } from '@fullcalendar/core/internal-common';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { FileUpload, UploadEvent } from 'primeng/fileupload';
import { ApiService } from 'src/Services/api.service';
import { Employee } from './employee.model';

import { EmployeeListForInvoice, InsertComments, SaveEmployeeDTO, SpInvoice } from './spInvoice.model';
import { DatePipe } from '@angular/common';
import { ApplicationService } from './application.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  providers: [MessageService,DatePipe],
  styleUrl: './application.component.scss'
})
export class ApplicationComponent implements AfterViewInit{


  invoice: SpInvoice = new SpInvoice();
  partTime: SaveEmployeeDTO = new SaveEmployeeDTO
  empList: EmployeeListForInvoice = new EmployeeListForInvoice();
  insertComments: InsertComments = new InsertComments();
  createAndEditInvoice?: CreateAndEditInvoice = new CreateAndEditInvoice();
  invoiceMasterDto?: InvoiceMaster = new InvoiceMaster();


  
  SpEmployees = [];
  SpContractEmployees:any[];
  AllEmployees = [];
  FreeEmployees:any[];
  invoiceNumber:string;
  divisions = [];
  allDistricts =[];
  districts=[];
  hfTypes=[];
  healthFacilities=[];
  services:[];
  selectedDivision:string;
  selectedDistrict:string;
  selectedFacility:string;
  dueDate:Date;
  toDate:Date;
  fromDate:Date;
  allInvoices =[];
  
  //currentDate: Date;
  routeItems: MenuItem[] = [];
  currentStep: number = 0;
  fieldErrors:any;
  selectedDesignation : any;
  selectedShift: any;
  newInvoice:any;
  invoiceEmpList:any;
  editInvoice: any
  SelectedEmployee: any[];
  public user : any = {};
  public ApAdditionalInfoFiles: any[] = [];
  loading = false;
  Additionalinfo: any = {};
  currentDate1: Date;
  selectedDate: Date;
  public currentDate = new Date();
  public deadlineover = false;
  @ViewChild('head') head!: ElementRef;
  @ViewChild('EmpList') EmpList!: ElementRef;
  @ViewChild('additional') additional!: ElementRef;

  @ViewChild('labelLine1') labelLine1!: ElementRef;
  @ViewChild('labelLine2') labelLine2!: ElementRef;
  @ViewChild('labelLine3') labelLine3!: ElementRef;
  displayPastAffliation : boolean = false;
  displayTotalIncome: boolean = false;
  displayEditEmployee: boolean = false;
  private observer!: MutationObserver;
  InvoiceId: string;
  selectedMonth: Date;
  invoiceForm!: FormGroup;
  billToError: boolean = false;
  invoiceMasterDropdownDto: any[];
  invoiceItemDropdownDto: any[];
  invoiceReqDocumentDropdownDto: any[];
  invoiceTermAndConDropdownDto: any[];

  invoiceMasterDropdownDtoFilter: any[];
  invoiceItemDropdownDtoFilter: any[];
  invoiceReqDocumentDropdownDtoFilter: any[];
  invoiceTermAndConDropdownDtoFilter: any[];

  today: Date = new Date();

  public itemName:string = '';
  public quantity:number;
  public price:number;
  public receivedFrom: string;
  public manfacturDate: Date;
  public expiryDate: Date;
  public billTo:any;
  public mobileNo:number;
  public MedStockList: any[] = [];
  public countries: any[];
  public billToList: any[];
  filteredCountries: any[];
  filteredCountriesOne: any[];
  public medicineList: any[] = [];
  public medicineListData: any[] = [];
  public billList: any[] = [];
  public netAmount:number;
  public disAmount:number;
  public maxLimit:number;
  // public InvoiceId:number = 1;
  public totalPrice:number;
  public objj:any;
  public invoicecustomer:any;
  public invoiceSlip: any[] = [];
  public myDate = new Date();
public invoiceDate:string | null;
public inId:any;
public quent:boolean=false;
public medName:string;
public cusName:string;
public medId:number;
public discount:number;

public applyDis:number;
public notesName:any;
public notesNameList:any[] = [];

public termAndCondition:any;

public receivedAmount:number;
public applyDueAmt:number;
public dueAmount:number;
public PrintByFullName:string;
public totalAmount:number;
public invoiceNumberGama:string;
  private readonly draftStorageKey = 'gama-invoice-draft';
logoBase64: string = '';

  constructor(
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private appService:ApplicationService,
    private datePipe: DatePipe,
    private renderer: Renderer2,
    private fb: FormBuilder) {}
 
  ngOnInit() 
  {
      this.getBase64ImageFromUrl('assets/demo/images/gama.jpeg');

   this.invoiceNumberGama = this.generateInvoiceNumberGama();
   this.getBillToAndItemAutoComplete();


    this.user = JSON.parse(localStorage.getItem('response') || '{}');
    this.PrintByFullName = this.user.FullName
    this.user.token = localStorage.getItem('token');
    this.user.username = localStorage.getItem('username');
    // this.user.roles = JSON.parse(localStorage.getItem('roles') || '[]');
    this.user.email = localStorage.getItem('email');
    this.user.UserId = localStorage.getItem('userId');
    this.invoiceNumber = localStorage.getItem('InvoiceNumber');
    this.loadDraft();
  
  

   // this.invoiceNumber = 'GZG-16507-RT'
     const storedInvoice = localStorage.getItem('selectedRow');
     if(storedInvoice){
      this.editInvoice = JSON.parse(localStorage.getItem('selectedRow'));
      console.log('this.editInvoice',this.editInvoice)
      debugger
      
       
      if(this.editInvoice){
        this.invoice.invoiceId = this.editInvoice.InvoiceId;
        this.invoice.invoiceNumber = this.editInvoice.InvoiceNumber;
        this.invoiceNumber=this.editInvoice.InvoiceNumber;
        this.invoice.hfId = this.editInvoice.HfId;
        this.invoice.serviceTypeId = this.editInvoice.ServiceTypeId;
        
        this.selectedDivision = this.editInvoice.DivisionCode;
        this.selectedDistrict = this.editInvoice.DistrictCode;
        this.selectedFacility = this.editInvoice.HealthFacilityTypeCode;
        this.selectedDate = new Date(this.editInvoice.DueDate);
  
        const [monthName, year] = this.editInvoice.Month.split(', ');
        const currentCenturyYear = '20' + year; // Convert "24" to "2024"
        const monthIndex = new Date(`${monthName} 1, ${currentCenturyYear}`).getMonth();
        this.selectedMonth = new Date(parseInt(currentCenturyYear, 10), monthIndex);
        const formattedMonth = this.datePipe.transform(this.selectedMonth, 'MMMM, yy');
        this.invoice.month = formattedMonth;
        console.log('Formatted Month:', this.invoice.month); // This will display "November, 24"
        console.log('Selected Month as Date:', this.selectedMonth); 
        this.invoice.dueDate = this.selectedDate
      }
     }
    
 
  }
  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }


    ngAfterViewChecked(): void {
      this.cdr.detectChanges();  // Manually trigger change detection
      if (this.head && this.EmpList && this.additional) {
        this.updateLabelHeights();
      }
    }
  
    private updateLabelHeights(): void {
      const headHeight = this.head.nativeElement.offsetHeight;
      const empListHeight = this.EmpList.nativeElement.offsetHeight;
      const additionalHeight = this.additional.nativeElement.offsetHeight;
  
      // Dynamically set the height of label lines
      this.renderer.setStyle(this.labelLine1.nativeElement, 'height', `${headHeight}px`);
      this.renderer.setStyle(this.labelLine2.nativeElement, 'height', `${empListHeight}px`);
      this.renderer.setStyle(this.labelLine3.nativeElement, 'height', `${additionalHeight}px`);
    }
  
    ngOnDestroy(): void {
      if (this.observer) {
        this.observer.disconnect();
      }
    }
  
    
 


  PreventTyping(event: KeyboardEvent): void {
    event.preventDefault();
  }

  openChoosedFile(file: File)
  {
    const fileUrl = URL.createObjectURL(file);
    window.open(fileUrl, '_blank');
  }

  getTrustedPdfUrl(file: File): SafeResourceUrl {
    const fileUrl = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  }

  safurl(url: string)
  {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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


  onStepChange(event: any) {
    this.currentStep = event.index;
  }

 

  onclick() {
    debugger
this.objj = {
  BillInvoiceCustomer : {
  invoiceId: this.InvoiceId,
  billTo: this.billTo,
  customerMobile: this.mobileNo,
  inviceDate: this.myDate,
  netAmount: this.netAmount
  },

  BillInvoiceMedList:[]

}

  }

  
getPrice(event)
{
  debugger
  this.price = event.value?.price;
  this.medId = event.value?.id;

}

searchCountry(event: any) {
  debugger;

  // Make sure event.query is defined and not empty
  let query = event?.query?.trim() || ''; // Trim the query to remove leading/trailing spaces
  let filtered: any[] = [];

  if (query.length > 0) {
    // Loop through the invoiceMasterDropdownDto array and filter based on the query
    for (let i = 0; i < this.invoiceMasterDropdownDto?.length; i++) {
      let country = this.invoiceMasterDropdownDto[i];
      if (country.BillToName && country.BillToName.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(country);
      }
    }
  }

  // Update the filtered results
  this.invoiceMasterDropdownDtoFilter = filtered;
}

getBillTo(event)
{
  debugger
  this.billTo = event.BillToName;
}

searchCountryOne(event: any) {
  debugger;

  // Make sure event.query is defined and not empty
  let query = event?.query?.trim() || ''; // Trim the query to remove leading/trailing spaces
  let filtered: any[] = [];

  if (query.length > 0) {
    // Loop through the invoiceMasterDropdownDto array and filter based on the query
    for (let i = 0; i < this.invoiceItemDropdownDto?.length; i++) {
      let country = this.invoiceItemDropdownDto[i];
      if (country.ItemName && country.ItemName.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(country);
      }
    }
  }

  // Update the filtered results
  this.invoiceItemDropdownDtoFilter = filtered;
}

moveToQty(event: KeyboardEvent, qtyInput: any) {
  event.preventDefault();

  setTimeout(() => {
    const input = qtyInput?.el?.nativeElement?.querySelector('input');
    if (input) {
      input.focus();
    }
  }, 100);
}

searchCountryDocument(event: any) {
  debugger;

  // Make sure event.query is defined and not empty
  let query = event?.query?.trim() || ''; // Trim the query to remove leading/trailing spaces
  let filtered: any[] = [];

  if (query.length > 0) {
    // Loop through the invoiceMasterDropdownDto array and filter based on the query
    for (let i = 0; i < this.invoiceReqDocumentDropdownDto?.length; i++) {
      let country = this.invoiceReqDocumentDropdownDto[i];
      if (country.DocumentName && country.DocumentName.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(country);
      }
    }
  }

  // Update the filtered results
  this.invoiceReqDocumentDropdownDtoFilter = filtered;
}


searchCountryTermAndCondition(event: any) {
  debugger;

  // Make sure event.query is defined and not empty
  let query = event?.query?.trim() || ''; // Trim the query to remove leading/trailing spaces
  let filtered: any[] = [];

  if (query.length > 0) {
    // Loop through the invoiceMasterDropdownDto array and filter based on the query
    for (let i = 0; i < this.invoiceTermAndConDropdownDto?.length; i++) {
      let country = this.invoiceTermAndConDropdownDto[i];
      if (country.TermAndCondition && country.TermAndCondition.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(country);
      }
    }
  }

  // Update the filtered results
  this.invoiceTermAndConDropdownDtoFilter = filtered;
}





getItemName(event)
{
  debugger
  this.itemName = event.ItemName;
}

getDocumentName(event)
{
  debugger
  this.notesName = event?.DocumentName;
}


fillMed(){
  debugger
    this.totalPrice = this.quantity*this.price; 

    var obj = {
      id: this.getNextId(),
  price : this.price,
  quantity : this.quantity,
  itemName: this.itemName,
  totalPrice: this.totalPrice,
  // medId: this.medId
    }
    this.billList.push(obj);
    this.itemName = "";
      this.quantity = null;
      this.price = null;
      this.receivedFrom = "";
      this.manfacturDate = null;
      this.expiryDate = null;
  
     // this.netAmount = this.billList.sum('price');
      this.totalAmount = this.billList.map(o => o.totalPrice).reduce((a, c) => { return a + c });
      this.netAmount = this.totalAmount;
      this.dueAmount = this.netAmount;
      this.applyDis = null;
      this.disAmount =  null;
      this.discount = null;
      this.receivedAmount = null;
      this.applyDueAmt = null;
  }


  removeRow(val){
    debugger
    let item = this.billList.filter( h => h.id == val.id);
    this.billList = this.billList.filter( h => h.id !== val.id);
    const index: number = this.billList.indexOf(val.id);
    if (index !== -1) {
        this.billList.splice(index, 1);
    } 

    if(this.billList?.length > 0){
      this.totalAmount = this.billList.map(o => o.totalPrice).reduce((a, c) => { return a + c });
      this.netAmount = this.totalAmount;
      this.dueAmount = this.netAmount;
  
      // this.netAmount = this.netAmount - item[0].totalPrice;
      // this.dueAmount = this.netAmount;
      this.applyDis = null;
      this.disAmount =  null;
      this.discount = null;
      this.receivedAmount = null;
      this.applyDueAmt = null;
    }
    else{
      this.totalAmount = null;
      this.netAmount = null;
      this.dueAmount = null
      this.applyDis = null;
      this.disAmount =  null;
      this.discount = null;
      this.receivedAmount = null;
      this.applyDueAmt = null;

    }

   
      }


       getNextId = () => {
        if (this.billList.length === 0) {
          return 1; // If the list is empty, start with 1
        }
      
        // Find the maximum id in the current list
        let existingIds = this.billList.map((item) => item.id);
        let nextId = 1;
      
        // Find the first missing id in sequence
        for (let i = 1; i <= Math.max(...existingIds) + 1; i++) {
          if (!existingIds.includes(i)) {
            nextId = i;
            break;
          }
        }
      
        return nextId;
      };


      applyDiscount(){
        this.applyDis = this.discount
        this.netAmount =  this.totalAmount - this.applyDis;
        this.dueAmount = this.netAmount;
        this.discount = null;
        this.applyDueAmt = null;

      }

      checkDiscountLimit(): void {
        debugger
        this.maxLimit = this.netAmount.toString().length;

        if (this.discount !== null) {
          if (this.discount < 0) {
            this.discount = 0; // Enforce minimum value
          } else if (this.discount > this.netAmount) {
            this.discount = this.netAmount; // Enforce maximum value
          }
        }

        if (this.receivedAmount !== null) {
          if (this.receivedAmount < 0) {
            this.receivedAmount = 0; // Enforce minimum value
          } else if (this.receivedAmount > this.netAmount) {
            this.receivedAmount = this.netAmount; // Enforce maximum value
          }
        }
      }

      addNote(val){
            debugger

console.log(typeof(this.notesName));

        if(typeof(this.notesName) == "object")
        {
          var obj = {
            id: this.getNextNoteId(),
            notesName : this.notesName?.DocumentName
          }
        }
        else
        {
          var obj = {
            id: this.getNextNoteId(),
            notesName : this.notesName
          }
        }

            // if(val == "enter")
            // {
            //   var obj = {
            //     id: this.getNextNoteId(),
            //     notesName : this.notesName?.DocumentName
            //   }
            // }
            // else{
            //   var obj = {
            //     id: this.getNextNoteId(),
            //     notesName : this.notesName
            //   }
            // }
      

        this.notesNameList.push(obj);
        this.notesName = null;
      }

      
      removeNote(val){
        debugger
        let item = this.notesNameList.filter( h => h.id == val.id);
        this.notesNameList = this.notesNameList.filter( h => h.id !== val.id);
        const index: number = this.notesNameList.indexOf(val.id);
        if (index !== -1) {
            this.notesNameList.splice(index, 1);
        }  
        this.notesName = null;
          }



          getNextNoteId = () => {
            if (this.notesNameList.length === 0) {
              return 1; // If the list is empty, start with 1
            }
          
            // Find the maximum id in the current list
            let existingIds = this.notesNameList.map((item) => item.id);
            let nextId = 1;
          
            // Find the first missing id in sequence
            for (let i = 1; i <= Math.max(...existingIds) + 1; i++) {
              if (!existingIds.includes(i)) {
                nextId = i;
                break;
              }
            }
          
            return nextId;
          };

           receivedAmt(){

            // if(this.disAmount){
            //   this.applyDueAmt = this.receivedAmount
            //   this.dueAmount = this.disAmount - this.receivedAmount;
            //   this.receivedAmount = null;
            // }else{
           this.applyDueAmt = this.receivedAmount
           this.dueAmount = this.netAmount - this.receivedAmount;
           this.receivedAmount = null;
          //  }
         }
         generateInvoiceNumberGama(): string {
          const now = new Date();
          const yearMonth = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
          const randomDigits = Math.floor(100000 + Math.random() * 900000);
        
          // Combine and convert to number
          return String(`${yearMonth}${randomDigits}`);
        }

       

        saveDraft(): void {
          const draft = {
            invoiceNumberGama: this.invoiceNumberGama,
            billTo: this.billTo,
            billList: this.billList,
            notesNameList: this.notesNameList,
            termAndCondition: this.termAndCondition,
            totalAmount: this.totalAmount,
            applyDis: this.applyDis,
            netAmount: this.netAmount,
            applyDueAmt: this.applyDueAmt,
            dueAmount: this.dueAmount,
            printBy: this.PrintByFullName
          };

          localStorage.setItem(this.draftStorageKey, JSON.stringify(draft));
          this.showSuccessViaToast('Draft Saved', 'Invoice draft saved locally.');
        }

        loadDraft(): void {
          const draft = localStorage.getItem(this.draftStorageKey);
          if (!draft) {
            return;
          }

          try {
            const parsedDraft = JSON.parse(draft);
            this.invoiceNumberGama = parsedDraft.invoiceNumberGama || this.invoiceNumberGama;
            this.billTo = parsedDraft.billTo || null;
            this.billList = parsedDraft.billList || [];
            this.notesNameList = parsedDraft.notesNameList || [];
            this.termAndCondition = parsedDraft.termAndCondition || null;
            this.totalAmount = parsedDraft.totalAmount || null;
            this.applyDis = parsedDraft.applyDis || null;
            this.netAmount = parsedDraft.netAmount || null;
            this.applyDueAmt = parsedDraft.applyDueAmt || null;
            this.dueAmount = parsedDraft.dueAmount || null;
          } catch (error) {
            console.error('Unable to load invoice draft', error);
          }
        }

        clearInvoiceForm(): void {
          localStorage.removeItem(this.draftStorageKey);
          this.invoiceNumberGama = this.generateInvoiceNumberGama();
          this.billTo = null;
          this.itemName = '';
          this.quantity = null;
          this.price = null;
          this.discount = null;
          this.receivedAmount = null;
          this.dueAmount = null;
          this.billList = [];
          this.totalAmount = null;
          this.applyDis = null;
          this.netAmount = null;
          this.applyDueAmt = null;
          this.notesName = null;
          this.notesNameList = [];
          this.termAndCondition = null;
          this.billToError = false;
        }

        async downloadPdf(): Promise<void> {
          const printableContent = document.getElementById('printableDiv');
          if (!printableContent) {
            return;
          }

          const canvas = await html2canvas(printableContent, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
          });

          const imageData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

          pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('invoice-' + this.invoiceNumberGama + '.pdf');
        }
        saveInvoiceGama(): void {
          debugger
          if (!this.billTo || this.billTo.trim() === '') {
            this.billToError = true; // Show error
            return; // Stop the save operation
          }


          if (!this.createAndEditInvoice) {
            this.createAndEditInvoice = {};
          }
          
          this.createAndEditInvoice.invoiceMasterDto.invoiceMasterId = null;
          this.createAndEditInvoice.invoiceMasterDto.invoiceNumber = this.invoiceNumberGama;
          this.createAndEditInvoice.invoiceMasterDto.billToName = this.billTo;
          this.createAndEditInvoice.invoiceMasterDto.printBy = this.PrintByFullName;
          this.createAndEditInvoice.invoiceMasterDto.applyDiscount = this.applyDis;
          this.createAndEditInvoice.invoiceMasterDto.receivedAmount = this.applyDueAmt;
          this.createAndEditInvoice.invoiceMasterDto.totalAmount = this.totalAmount;
          this.createAndEditInvoice.invoiceMasterDto.dueAmount = this.dueAmount;
          this.createAndEditInvoice.invoiceMasterDto.netAmount = this.netAmount;
          this.createAndEditInvoice.invoiceMasterDto.termAndCondition = this.termAndCondition;
          
          this.createAndEditInvoice.invoiceItemListDto = this.billList.map(b => ({
            itemName: b.itemName,
            quantity: b.quantity,
            rate: b.price,
            itemTotalAmount: b.totalPrice
          }));
          this.createAndEditInvoice.invoiceDocumentListDto = this.notesNameList.map(n => ({
            documentName: n.notesName
          }));
          console.log("this.createAndEditInvoice",this.createAndEditInvoice);

        
          this.billToError = false; // Reset the error if valid
       
          this.appService.saveInvoiceGama(this.createAndEditInvoice).subscribe({
            next: (response) => {
              console.log('Invoice saved successfully', response);
              this.showSuccessViaToast("Success", response.Message);
              // Optionally clear or reset form
              
              this.printDiv()
              this.clearInvoiceForm();
             //  localStorage.setItem("empList", JSON.stringify(this.empList));
            
            },
            error: (error) => {
              console.error('Error saving invoice', error);
              this.showErrorViaToast("Error", "Something Went Wrong !") 
            }
          });
        }



        printDiv() {
          const printableContent = document.getElementById('printableDiv');
        
          if (printableContent) {
            const printWindow = window.open('', '_blank', 'width=1024,height=900');
            const printableMarkup = printableContent.innerHTML;
            printWindow?.document.open();
            printWindow?.document.write(
              '<html>' +
              '<head>' +
              '<title>Print Invoice</title>' +
              '<style>' +
              'body{margin:0;padding:24px;background:#f5f7fb;font-family:Arial,sans-serif;}' +
              '.print-hide{display:none!important;}' +
              '.invoice-sheet{background:#ffffff;border-radius:24px;padding:32px;box-shadow:none;}' +
              '.invoice-sheet__header,.invoice-sheet__details,.total-row{display:flex;justify-content:space-between;gap:24px;}' +
              '.brand-block{display:flex;align-items:center;gap:16px;}' +
              '.brand-logo{width:88px;height:88px;object-fit:cover;border-radius:20px;}' +
              '.brand-copy{font-size:26px;font-weight:700;line-height:1.1;}' +
              '.preview-table{width:100%;border-collapse:collapse;margin-top:24px;}' +
              '.preview-table th,.preview-table td{border:1px solid #dbe4f0;padding:12px;text-align:left;}' +
              '.preview-table th{background:#12335b;color:#ffffff;}' +
              '.totals-panel{margin-top:24px;margin-left:auto;max-width:320px;}' +
              '.notes-block{margin-top:24px;}' +
              '@media print{@page{size:A4;margin:12mm;}body{padding:0;background:#ffffff;}}' +
              '</style>' +
              '</head>' +
              '<body>' + printableMarkup + '</body>' +
              '</html>'
            );
            printWindow?.document.close();
            printWindow?.focus();
            printWindow?.print();
        
            setTimeout(() => {
              printWindow?.close();
            }, 1500);
          }
        }
        getBillToAndItemAutoComplete() {
          debugger
          this.appService.getBillToAndItemAutoComplete().subscribe((response: any) => {
            if (response) {
              debugger
              this.invoiceMasterDropdownDto = response.invoiceMasterDropdownDto;
              this.invoiceItemDropdownDto = response.invoiceItemDropdownDto;
              this.invoiceReqDocumentDropdownDto = response.invoiceReqDocumentDropdownDto;
              this.invoiceTermAndConDropdownDto = response.invoiceTermAndConDropdownDto;
              
              console.log("getInvoiceDD===> ", response)
              
            }
          })
        }





        addEmptyRow() {
  this.billList.push({
    itemName: '',
    quantity: 1,
    price: 0,
    totalPrice: 0
  });
}

calculateRow(item: any) {
  item.totalPrice = (item.quantity || 0) * (item.price || 0);
  this.calculateTotals();
}

calculateTotals() {
  this.totalAmount = this.billList.reduce(
    (sum: number, item: any) => sum + (item.totalPrice || 0),
    0
  );

  this.netAmount = this.totalAmount - (this.discount || 0);
  this.dueAmount = this.netAmount - (this.receivedAmount || 0);
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
}



export class CreateAndEditInvoice {
  invoiceMasterDto?: InvoiceMaster;
  invoiceDocumentListDto?: InvoiceDocument[];
  invoiceItemListDto?: InvoiceItem[];

  constructor() {
    this.invoiceMasterDto = new InvoiceMaster();
    this.invoiceDocumentListDto = [];
    this.invoiceItemListDto = [];
  }
}

export class InvoiceMaster {
  invoiceMasterId?: string; // Use string to represent GUID
  invoiceNumber?: string;
  billToName?: string;
  printBy?: string;
  applyDiscount?: number;
  receivedAmount?: number;
  healthFacilityId?: number;
  totalAmount?: number;
  dueAmount?: number;
  netAmount?: number;
  termAndCondition?: string;
}

export class InvoiceDocument {
 // invoiceDocumentId?: string; // Use string to represent GUID
//  invoiceMasterId?: string;
  documentName?: string;
}

export class InvoiceItem {
 // itemListId?: string; // Use string to represent GUID
//  invoiceMasterId?: string;
  itemName?: string;
  quantity?: number;
  rate?: number;
  itemTotalAmount?: number;
}




