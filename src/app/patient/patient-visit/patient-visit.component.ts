import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/core/auth/auth.service';
import { RoleConstant } from 'src/app/core/constants/Role.constant';
// import { RoleConstant } from 'src/app/core/constants/role.constant';
import { PaginatorModel } from 'src/app/core/models/PaginatorModel';
import { EventEmitterService } from '../../common/commonservices/event-emitter.service';
// import { HealthFacility } from 'src/app/modules/ums/health-facility/health-facility';
import { User } from 'src/app/modules/ums/user/user';
import { UserService } from 'src/app/modules/ums/user/user.service';
import { PatientsService } from '../patients.service';
import { PatientVisit } from './patient-visit';
import { PatientVisitFilter } from './patient-visit-filter';
import { PatientVisitService } from './patient-visit.service';
import { debug } from 'console';
import { fromTypeConstant } from 'src/app/core/constants/fromType.constants';


@Component({
  selector: 'app-patient-visit',
  templateUrl: './patient-visit.component.html',
  styleUrls: ['./patient-visit.component.scss']
})
export class PatientVisitComponent implements OnInit {

  // This property is bound using its original name.
  @Input() patientCnic?: string;
  @Input() isPopup: boolean = false;
  @Input() filterModel: any = new PatientVisitFilter();
  @Input() showFilters: boolean = true;
  @Input() showDoctorReciept: boolean = false;

  //#region Class Fields & Propertities

  roleConstant:RoleConstant=new RoleConstant();

  index: number = 0;

  patientVisits: PatientVisit[] = [];

  cols: any = [];

  patientVisitDialog: boolean = false;

  deletePatientVisitDialog: boolean = false;

  submitted: boolean = false;

  patientVisit: PatientVisit = {};

  formData: PatientVisit = {};

  userExist: boolean = false;

  userList: any[] = [];

  public patientvitals:any[]=[];

  public patientvitalslastIndex:any={};

  public calculatedAgeSlip: any = {years: 0, months: 0, days: 0};

  public DobAge:any;
  public HealthFacilityId = 0;
  public IsPatientFromVisitList :boolean =false;
  // PatientVisit Form Group
  patientVisitForm = new FormGroup({

    PatientOpenVisitId: new FormControl('', Validators.required),
    IsActive: new FormControl(),

  });

  formInitialValues: any = {};



  patientHistory: boolean = false;
  patientVisitIdGen: any ;


  patientPreviousRecordData: any = {};

  public urduPrescription: any = {
    thankyou: `ڈسٹرکٹ ہیڈ کوارٹر ہسپتال بہاول نگر تشریف آوری کا شکریہ۔`,
    meds: `ہسپتال سے آپ کو مندرجہ ذیل ادویات مفت فراہم کی گئی ہیں۔`,
    privateMed: ` پرائیویٹ فارمیسی سے درج ذیل ادویات حاصل کرنے کا مشورہ دیاگیا ہے۔`,
    help: `کسی بھی ایمرجنسی کی صورت میں ہیلپ لائن 1033 پر رابطہ کریں۔ شکریہ۔`,
    thanksFromPSH: `منجانب: پرائمری اینڈ سیکنڈری ہیلتھ کیئر ڈیپارٹمنٹ،حکومت پنجاب۔`,
    Internalpharmacy1: `آپ کو ہسپتال کی فارمیسی سے درج ذیل دوائیں تجویز کی گئی ہیں۔`,
    Internalpharmacy2: `آپ سے گزارش ہے کہ ہسپتال کی فارمیسی سے مفت ادویات حاصل کریں ۔اور ادویات ڈاکٹر کی دی گئی ہدایات کے مطابق استعمال کریں۔`,
    Externalpharmacy: `:تجویزکندہ دوائی`,
    Externalpharmacy1: `آپ کو پرائیویٹ فارمیسی سے درج ذیل ادویات تجویز کی گیؑ ہیں ۔`,
    Externalpharmacy2: `دوا ہسپتال کی فارمیسی میں موجود نہیں۔
    `,
    Externalpharmacy3: `آپ خود ہسپتال کی فارمیسی سے دوالینے کے خواہش مند نھیں ہیں۔`,
    Externalpharmacy4: `
     تجویز کندہ دوائی ھسپتال میں مفت فراہم کی جانے والی ادویات کی فہرست میں شامل نہ ہیں۔
     `,
    Externalpharmacy5: `آپ سے گزارش ہے کہ کسی بھی پرائیویٹ فارمیسی سے ادویات خرید کر ڈاکٹر کی دی گئی ہدایات کے مطابق استعمال کریں۔
    `,
  }

  showParentPatientVisit: boolean = false;
  patientregistrationRes: any = {};
  public loginUserDetail: any = {};
  public UserName: any = {};
  showDeleteListItem : boolean = true;
  patientDiagnoseId?: string = "";
  formType: string;
  formTypeConstant: fromTypeConstant = new fromTypeConstant();
  //#endregion

  // #region Constructor
  constructor
  (
    private _patientVisitService: PatientVisitService,
    private _userService: UserService,
    public _patientsService: PatientsService,
    public _AuthService: AuthService,
    public datepipe: DatePipe,
    private eventEmitterService: EventEmitterService
  )
  {
    this.filterModel.StartDate = new Date().toJSON().slice(0,10).replace(/-/g,'-') + "T00:01:01";
    this.filterModel.EndDate = new Date().toJSON().slice(0,10).replace(/-/g,'-') + "T23:59:59";
  }

  ngOnInit(): void {
     
    this.loginUserDetail = this._AuthService.getLoginUser();
    this.UserName = this.loginUserDetail.FullName
    this.cols = [
      { field: 'FirstName', header: 'Name' },
      { field: 'Email', header: 'Email' },
      { field: 'CNIC', header: 'CNIC' },
      { field: 'IsActive', header: 'Active' }
    ];

    this.formInitialValues = this.patientVisitForm.value;

    if (this.patientCnic)
      this.filterModel.Cnic = this.patientCnic

    this.getAllPatientVisits(this.filterModel);
    this.loginUserDetail.permission = this._AuthService.getPermissionsByUrl(window.location.pathname);
    this.showDeleteListItem = this.loginUserDetail.permission.CanDelete;
    this.getAllUsers();

  }

  public urduGazette: any = {
    thankyou: `محکمہ پرائمری اینڈ سیکنڈری ہیلتھ کیر ڈیپارٹمنٹ حکومت پنجاب`,
    registrtionregard: `آپ سے درخواست ہے کہ آپ اپنی باری کا انتظار کریں `,
    registrationregaard1: `اور اپنی باری آنے کی صورت میں "وائٹل کاؤنٹر" پر تشریف لے جائیں`,
    registrtionregard02: ` معزز شہری آپ سے درخواست ہے کہ آپ اپنی باری کا انتظار کریں اور اپنی باری آنے کی صورت میں "وائٹل کاؤنٹر" پر تشریف لے جائیں`,
    TokenNum: `ٹوکن نمبر`,
    MRNum: `میڈیکل ریکارڈ نمبر`,
    PateintName: `مریض کا نام`,
    FatherName: `والد/ شوہر کا نام`,
    CnicNum: `شناختی کارڈ نمبر`,
    Agee: `عمر`,
    MobileNim: `موبائل نمبر`,
    Services:`شعبہ`,
    From: `منجانب`,
    Genders: `جنس`
  };

  public displaySlipReg: boolean = false;

  //#endregion

  // #region CUD Operations

  savePatientVisit() {


    this.submitted = true;

    if (this.patientVisitForm.valid) {

      this.patientVisit = this.patientVisitForm.value as PatientVisit;

      this._patientVisitService.create(this.patientVisit).subscribe(data => {

        if (this.patientVisitForm.controls['PatientOpenVisitId'].value) {
          // @ts-ignore
          this.patientVisits[this.findIndexById(this.patientVisitForm.controls['PatientOpenVisitId'].value)] = this.patientVisitForm.value;

        }
        else {
          this.patientVisit.PatientOpenVisitId = data.PatientOpenVisitId;
          this.patientVisits.push(this.patientVisit);
        }

        this.patientVisits = [...this.patientVisits];
        this.patientVisitDialog = false;
        this.patientVisit = {};
        this.patientVisitForm.reset(this.formInitialValues);

      });
    }
  }



  confirmDelete() {

    this.deletePatientVisitDialog = false;

    this._patientVisitService.delete(this.patientVisit.PatientOpenVisitId || '').subscribe((data: any) => {

      this.patientVisits = this.patientVisits.filter(val => val.PatientOpenVisitId !== this.patientVisit.PatientOpenVisitId);
      this.patientVisit = {};
    });

  }

  // setHealthFacilityId (event: any) {
  //    
  //   this.HealthFacilityId = event;
  // }


  //#endregion

  // #region Read Operations


  getAllPatientVisits(filterModel: PatientVisitFilter): void {

    this._patientVisitService.getPatientVisitsListWithDetail(filterModel).subscribe((data: any) => {
      debugger
      this.patientVisits = data.List;
      this.filterModel.TotalRecords = data.TotalCount;

    });
  }

  getAllUsers(): void {
    let healthFacilityId = this.filterModel.HealthFacilityId;
    let role = this.roleConstant.Registration;
    if(this.showFilters){
      this._userService.getAllByUserLevelwise(role, healthFacilityId).subscribe((data: any) => {
      this.userList = data;
      });
    }
  }

  get patientFormControl() {
    return this.patientVisitForm.controls;
  }

  //#endregion

  // #region Helper Methods

  editPatientVisit(patientVisit: PatientVisit) {

    this.patientVisit = { ...patientVisit };

    this.patientVisitDialog = true;

    Object.keys(this.patientVisitForm.value).forEach((key: any) => {

      // this.patientVisitForm.controls[key as keyof typeof this.patientVisitForm.value].setValue(patientVisit[key as keyof typeof patientVisit || '11']);

    });
  }

  deletePatientVisit(patientVisit: PatientVisit) {
    this.deletePatientVisitDialog = true;
    this.patientVisit = { ...patientVisit };
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.patientVisits.length; i++) {
      if (this.patientVisits[i].PatientOpenVisitId === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  openNew() {

    this.submitted = false;
    this.patientVisitDialog = true;
    this.patientVisitForm.reset(this.formInitialValues);
  }

  hideDialog() {
    this.patientVisitDialog = false;
    this.submitted = false;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  paginate(event: any) {
    this.filterModel.PageNumber = event.page + 1;
    this.filterModel.PageSize = event.rows;
    this.getAllPatientVisits(this.filterModel);
  }

  submitFilter() {
    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;
    this.getAllPatientVisits(this.filterModel);
  }

  clearFilter() {
    this.filterModel = new PatientVisitFilter();
    this.getAllPatientVisits(this.filterModel);
  }

  patientPreviousRecord(historyobj: any) {
     
    this.patientHistory = true;
    this.patientVisitIdGen = historyobj.PatientVisitId
    this.patientDiagnoseId = historyobj.PatientDiagnoseId;

    if(historyobj.FormType  == null)
      this.formType = this.formTypeConstant.GeneralForm;
    else
      this.formType = historyobj.FormType;

    // this._patientsService.getPatientbyVisit(historyobj.PatientVisitId).subscribe((data: any) => {
    //   if (data) {

    //     this.patientPreviousRecordData = data;
    //     this.DobAge=data.Dob;
    //     this.calculatedAgeSlip = this.calculateAge(this.DobAge);
    //      this.patientvitals=data.PatientVitals;
    //     const sortedDesc = this.patientvitals.sort(
    //         (objA, objB) =>
    //         (objA.CreatedOn > objB.CreatedOn) ? 1 :
    //         (objA.CreatedOn === objB.CreatedOn) ? (
    //         (objA.CreatedOn > objB.CreatedOn) ? 1 : -1 ): -1
    //       );
    //      this.patientvitalslastIndex=sortedDesc[sortedDesc.length-1];
    //   }
    // });
  }

  showRegistrationSlipByVisit(historyobj: any) {
     
    // this._patientsService.getPatientbyVisit(historyobj.PatientVisitId).subscribe((data: any) => {
    //   if (data) {
        this.displaySlipReg = false;

        if(historyobj){
          this.patientregistrationRes = historyobj;
          this.IsPatientFromVisitList= true;
        setTimeout(() => {
          this.displaySlipReg = true;
        }, 300);
        }
       
    //   }
    // });
  }

  hideRegistrationSlipByVisit() {

    this.displaySlipReg = false;
    this.patientregistrationRes = {};
  }

  printSlip() {
    this.printJSSlip();
  }

  PrintUrduSlip() {
    this.printJSSSlip()
  }

  printJSSlip() {

    // convert qr code canvas to png img
    var canvas = document.getElementsByClassName('qrcode')[0].getElementsByTagName('canvas')[0];
    var img = document.createElement('img');
    img.src = canvas.toDataURL("image/png");
    img.width=150;
    img.height=150
    document.getElementById('qrcode')?.appendChild(img);

    // const css = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">
    const css = `<link rel="stylesheet" href="https://phis.pshealthpunjab.gov.pk/assets/printstyles/boostrapJs.min.css">
    <link rel="stylesheet" href="assets/pdf.css"
    integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
    `;
    const printContents = document.getElementById('revisitslip');
    const pageContent = `<!DOCTYPE html><html><head>${css}</head><body onload="window.print()"><style> .tabtablele-striped thead {
      background-color: black !important;}</style>${printContents?.innerHTML}</html>`;
    let popupWindow: Window;
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      popupWindow = window.open(
        '',
        '_blank',
        'width=900,height=1200,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
      ) || window;
      popupWindow.window.focus();
      popupWindow.document.write(pageContent);
      popupWindow.document.close();
      window.onafterprint = function () { setTimeout(function () { popupWindow.close(); }, 500); };

      popupWindow.onbeforeunload = event => {
        window.onfocus = function () { setTimeout(function () { popupWindow.close(); }, 500); }
        popupWindow.close();
      };
      popupWindow.onabort = event => {
        popupWindow.document.close();
        window.onafterprint = function () { setTimeout(function () { popupWindow.close(); }, 500); };
      };
    } else {
      popupWindow = window.open('', '_blank', 'width=1200,height=1200') || window;
      popupWindow.document.open();
      popupWindow.document.write(pageContent);
      popupWindow.document.close();
    //   popupWindow.window.close();
      window.onfocus = function () { setTimeout(function () { popupWindow.close(); }, 1000); }
    }
    // setTimeout(function () { window.location.reload(); }, 2000);
  }

  printJSSSlip() {
 
    // convert qr code canvas to png img
    var canvas = document.getElementsByClassName('qrcode')[0].getElementsByTagName('canvas')[0];
    var img = document.createElement('img');
    img.width=150;
    img.height=150
    img.src = canvas.toDataURL("image/png");
    document.getElementById('urduqrcode')?.appendChild(img);

    // const css = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">
     const css = `<link rel="stylesheet" href="https://phis.pshealthpunjab.gov.pk/assets/printstyles/boostrapJs.min.css">
    <link rel="stylesheet" href="assets/pdf.css"
    integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
    `;
    const printContents = document.getElementById('Urduslip');
    const pageContent = `<!DOCTYPE html><html><head>${css}</head><body onload="window.print()"><style> .tabtablele-striped thead {
      background-color: black !important;}</style>${printContents?.innerHTML}</html>`;
    let popupWindow: Window;
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      popupWindow = window.open(
        '',
        '_blank',
        'width=900,height=1200,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
      ) || window;
      popupWindow.window.focus();
      popupWindow.document.write(pageContent);
      popupWindow.document.close();
      window.onafterprint = function () { setTimeout(function () { popupWindow.close(); }, 500); };

      popupWindow.onbeforeunload = event => {
        window.onfocus = function () { setTimeout(function () { popupWindow.close(); }, 500); }
        popupWindow.close();
      };
      popupWindow.onabort = event => {
        popupWindow.document.close();
        window.onafterprint = function () { setTimeout(function () { popupWindow.close(); }, 500); };
      };
    } else {
      popupWindow = window.open('', '_blank', 'width=1200,height=1200') || window;
      popupWindow.document.open();
      popupWindow.document.write(pageContent);
      popupWindow.document.close();
      window.onfocus = function () { setTimeout(function () { popupWindow.close(); }, 1000);
     }
    }

    // setTimeout(function () { window.location.reload(); }, 500);
  }

  calculateAge(dob: any) {

    var ctrldob = new Date(dob);

    var ctrldoa = new Date(Date.now());

    var diff = new Date(ctrldoa.getTime() - ctrldob.getTime());

    return (diff.getUTCFullYear() - 1970) + 'Y ' + diff.getUTCMonth() + 'M ' + (diff.getUTCDate() - 1) + 'D';

  }

  //   showParentPatient(patientCnic:string)
  //   {
  //     // child is set
  //     this.filterModel.Cnic = patientCnic;
  //     this.showParentPatientVisit = true;
  //     this.getAllPatientVisits(this.filterModel);
  //   }
  //#endregion


}
