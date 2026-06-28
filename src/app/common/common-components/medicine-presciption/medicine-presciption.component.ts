import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MedicineTypeConstant } from 'src/app/core/constants/medicineType.constants';
import { MessageConstant } from 'src/app/core/constants/message.constants';
import { ProfileTypeConstant } from 'src/app/core/constants/profileType.constants';
import { PatientsService } from 'src/app/modules/patient/patients.service';
import { ProfileService } from 'src/app/modules/ums/profile/profile.service';
import { LocalService } from 'src/app/_services/local.service';
import { dose, duration, frequency, instructions, route, medicinetypes } from './medicine-presciption-data';
import { AuthService } from 'src/app/core/auth/auth.service';
import { SectionConstant } from 'src/app/core/constants/section.constants';
import { MedicineResourceConstant } from 'src/app/core/constants/medicineResource.constants';
import { fromTypeConstant } from 'src/app/core/constants/fromType.constants';


@Component({
  selector: 'app-medicine-presciption',
  templateUrl: './medicine-presciption.component.html',
  styleUrls: ['./medicine-presciption.component.scss']
})
export class MedicinePresciptionComponent implements OnInit {

  //#region Class Fields & Propertities
  @Input() medicineList: any = [];
  @Input() addedMedicineList: any
  // @Input() selectedMedicineList: any = []; // selected Medicine List for Template
  @Input() isTemplate: any = false; // check if Medicine is from Template
  @Input() allMedicineAgainstVisit: any = []
  filterAllMedicineAgainstVisit: any = []
  
  @Output() updateMedicineListEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() ViewPrescription = new EventEmitter<any>();

  medicineform: FormGroup = new FormGroup({
    PatientPrescriptionId: new FormControl(),
    PatientId: new FormControl(null),
    PatientVisitId: new FormControl(),
    MedicineTypeId: new FormControl(),
    MedicineId: new FormControl('', Validators.required),
    IsMedicineIsNotAvailable: new FormControl(false),
    MedicineType: new FormControl(''),
    MedicineIsNotAvailName: new FormControl(''),
    DoseProfileId: new FormControl('', Validators.required),
    RouteProfileId: new FormControl('', Validators.required),
    FrequencyProfileId: new FormControl('', Validators.required),
    DurationProfileId: new FormControl('', Validators.required),
    DoseTimeProfileId: new FormControl('', Validators.required),
    MedicineTypeProfileId: new FormControl('', Validators.required),
    MedicineResourceProfileId: new FormControl(''),
    UnitPrice: new FormControl(0),
    Days: new FormControl(0, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    PrescribedBy: new FormControl(),
    Quantity: new FormControl(0),
    IsActive: new FormControl(true),
    DoesTimeUrdu: new FormControl(''),
  });

  //   addedMedicineList: any = [];
  tempMedicineList: any = [];
  filterTempMedicineList: any = [];
  addmedicineobj: any = {};
  selectedPatient: any = {};
  showReferPharmacyBtn: boolean = false;
  selectedRowIndex = -1;
  doseList: any = []
  dose: any = dose;
  route: any = route;
  frequency: any = frequency;
  instructions: any = instructions;
  duration: any = duration;
  medicinetypes: any = medicinetypes;
  medicineFormInitialValues: any = {};
  deleteMedicinetPrescriptionDialog: boolean = false;
  medicinetPrescription: any = {};
  loginUserDetail: any = {};
  dentalSurgeonOPDStringConstant = SectionConstant.DentalSurgeonOPD;
  dentalOPDStringConstant = SectionConstant.DentalOPD;
  medicineTypeList: any;
  medicineResourceList: any;  // Internal or External

  alreadyPrescribedMedicineDialog:boolean = false;

  public fromTypeConstant: fromTypeConstant = new fromTypeConstant();

  public urduGazette: any = {
    alreadyPrescribedAlertHeader: `اس مریض کو یہ دوائی اِن ڈاکٹرز نے پہلے ہی تجویز کی ہے`,
    alreadyPrescribedAlertFooter: `کیا آپ بھی اس مریض کو یہ دوائی تجویز کرنا چاہتے ہیں`,
  }
  public message: any = {
    alreadyPrescribedAlertHeader: `This Medicine has already been prescribed to this patient`,
    alreadyPrescribedAlertFooter: `Do you want to prescribe again ?`,
  }
  

  //#endregion

  // #region Constructor
  constructor(
    public _messageService: MessageService,
    public _patientService: PatientsService,
    public _profileService: ProfileService,
    public _localService: LocalService,
    public _AuthService: AuthService,
  ) {
    this.getMedicine();

    // this.getDoseList();
  }
  ngOnInit(): void {

    this.medicineFormInitialValues = this.medicineform.value;
    this.loginUserDetail = this._AuthService.getLoginUser();
    this.getMedicineTypeList();
    this.getMedicineResourceList();

  }
  ngOnChanges(changes: SimpleChanges){
    if (changes['addedMedicineList'].firstChange)
      this.addedMedicineList = this.SortMedicineList(this.addedMedicineList);

    let isTemplate = changes['isTemplate']?.currentValue

    if(isTemplate) {
      // this.isTemplate = false;
      this.tempMedicineList = this.addedMedicineList;

      this.addedMedicineList = [];
      this.populateTemplateMedicine(this.tempMedicineList)
      // tempMedicineList.forEach((x:any) => {
      //   this.addmedicineForTemplate(x)
      // });
      // this.isTemplate = false;
    } 
    // else {
    //   // if(this.medicineList.lenght > 0)
    //     // this.setAvailableQuantityForEdit();
    // }
  }
  //#endregion

  // #region CUD Operation
  //#endregion

  // #region Read Operations

  getMedicine() {

    // if(!this._localService.getValue('dropdownMeidicines'))
    // {
    this._patientService.getAllMedicine().subscribe((data: any) => {
      if (data) {
        // this._localService.setValue('dropdownMeidicines',data.Data);
        if (data["Data"] !== undefined) {
          this.medicineList = data.Data;
          // this.medicineList = this.medicineList.filter((x: any) => x.AvailableQuantity > 0 );
          this.medicineList.forEach(function(item:any){
              if(item.AvailableQuantity == null)
                item.AvailableQuantity = 0;
          });
          if (this.loginUserDetail.FormType == this.fromTypeConstant.HCPForm) {
            this.medicineList = this.medicineList.filter((x: any) => x.MedicineId != 1681 && x.MedicineId != 1682 && x.MedicineId != 12221 && x.MedicineId != 12255 && x.MedicineId != 1528 && x.MedicineId != 1378)
          }
        }
        else {
          this.medicineList = data;
          if (this.loginUserDetail.FormType == this.fromTypeConstant.HCPForm) {
            this.medicineList = this.medicineList.filter((x: any) => x.MedicineId != 1681 && x.MedicineId != 1682 && x.MedicineId != 12221 && x.MedicineId != 12255 && x.MedicineId != 1528 && x.MedicineId != 1378)
          }
        }
        this.medicineList = this.SortMedicineList(this.medicineList);
        this.setAvailableQuantityForEdit();
      }
    });

    // }
    // else
    // {
    //   this.medicineList = this._localService.getValue('dropdownMeidicines');
    // }
  }

  getDoseList() {

    this.doseList = [];
    this._profileService.getProfileByProfileType(ProfileTypeConstant.NEWDOSE).subscribe((data: any) => {
      if (data) {
        this.doseList = data;
      }
    });
  }

  getMedicineTypeList() {

    if (!this._localService.getValue('medicineTypeList')) {
      this._profileService.getProfileByProfileType(ProfileTypeConstant.MedicineTypes).subscribe((data: any) => {
        if (data) {
          data.forEach((item: any) => {
            item.MedicineTypeName = item.Name;
          });
          this._localService.setValue('medicineTypeList', data);
          this.medicineTypeList = data;
        }
      });
    }
    else {
      this.medicineTypeList = this._localService.getValue('medicineTypeList');
    }
  }

  getMedicineResourceList() {

    if (!this._localService.getValue('medicineResourceList')) {
      this._profileService.getProfileByProfileType(ProfileTypeConstant.MedicineResource).subscribe((data: any) => {
        if (data) {
          this._localService.setValue('medicineResourceList', data);
          this.medicineResourceList = data;
        }
      });
    }
    else {
      this.medicineResourceList = this._localService.getValue('medicineResourceList');
    }
  }

  //#endregion

  // #region Helper Methods
  addmedicine() {

    let medicine = this.medicineform.value.MedicineId as any;
    let dose = this.medicineform.value.DoseProfileId as any; // instructions
    let doseTime = this.medicineform.value.DoseTimeProfileId as any;
    let route = this.medicineform.value.RouteProfileId as any;
    let frequency = this.medicineform.value.FrequencyProfileId as any;
    let duration = this.medicineform.value.DurationProfileId as any;
    let medicineTypeProfileId = this.medicineform.value.MedicineTypeProfileId as any;

    this.filterAllMedicineAgainstVisit = [];
    let checkIfMedicineExistInList = null; //this.addedMedicineList.filter((t: any) => t.MedicineId != '' && medicine && t.MedicineId == medicine.Id)[0];
    if(!this.alreadyPrescribedMedicineDialog)
      this.filterAllMedicineAgainstVisit = this.allMedicineAgainstVisit.filter((x: any) => x.MedicineId == medicine.MedicineId);
    else
      this.alreadyPrescribedMedicineDialog = false;

    this.addedMedicineList.every(function (item: any) {
      if (
        item.MedicineId != '' &&
        medicine &&
        medicine != '' &&
        item.MedicineId == medicine.MedicineId && item.IsDispensed
      ) {
        checkIfMedicineExistInList = item;
        return false;
      }
      return true;
    });

    if (checkIfMedicineExistInList == null && this.filterAllMedicineAgainstVisit.length == 0) {

      

      this.addmedicineobj.PatientId = this.selectedPatient.PatientId;
      this.addmedicineobj.PatientVisitId = this.selectedPatient.PatientVisitId;
      this.addmedicineobj.MedicineId = medicine != null && medicine != '' ? medicine.MedicineId : 0;
      this.addmedicineobj.MedicineName = medicine != null && medicine != '' ? medicine.MedicineName : this.medicineform.value.MedicineIsNotAvailName;
      this.addmedicineobj.MedicineType = this.addmedicineobj.MedicineId == 0 ? this.medicineform.value.MedicineType.MedicineTypeName : medicine.MedicineTypeName;
      this.addmedicineobj.IsSMLMedicine = medicine?.IsSMLMedicine;
      this.addmedicineobj.BatchNo = medicine.BatchNo;
      this.addmedicineobj.UnitPrice = medicine.PricePerItem; //medicine.UnitPrice;
      this.addmedicineobj.MedicineTypeProfileId = medicineTypeProfileId; // e.g. tablet,syrupe etc...
      this.addmedicineobj.AvailableQuantity = Number(medicine != null && medicine != '' && medicine.AvailableQuantity != null ? medicine.AvailableQuantity : 0);
      this.addmedicineobj.Days = duration.value;
      this.addmedicineobj.DoseValue = dose.value;
      this.addmedicineobj.MedicineDose = dose.name;
      this.addmedicineobj.InstructionValue = doseTime.value;
      this.addmedicineobj.MedicineInstruction = doseTime.name;
      this.addmedicineobj.RouteValue = route.value;
      this.addmedicineobj.MedicineRoute = route.name;
      this.addmedicineobj.FrequencyValue = frequency.value;
      this.addmedicineobj.MedicineFrequency = frequency.name;
      this.addmedicineobj.DurationValue = duration.value;
      this.addmedicineobj.MedicineDuration = duration.name;
      this.addmedicineobj.Quantity = Number(this.calculateMedicineQuantity(this.addmedicineobj));
      this.addmedicineobj.MedicineResourceProfileId = this.getMedicineResourceProfileIdFromMedicineObject(this.addmedicineobj);
      this.addmedicineobj.IsDispensed = true;
      
      // Math.ceil(
      //     this.addmedicineobj.Days * this.addmedicineobj.FrequencyProfileId * this.addmedicineobj.DoseProfileId
      // );
      this.addedMedicineList.push(this.addmedicineobj);
      // this.addedMedicineList = this.SortMedicineList(this.addedMedicineList);
      this.showButtonPharmacyRefer();

    } else if(checkIfMedicineExistInList) {
      this.highlightAlreadySelectedRow(checkIfMedicineExistInList);
      this._messageService.add({
        severity: 'info',
        summary: 'Medicine',
        detail: MessageConstant.MedicineAlreadySelected,
        life: 3000,
      });
    } else if(this.filterAllMedicineAgainstVisit.length > 0) {
      this.alreadyPrescribedMedicineDialog = true;
    }
    if(!this.alreadyPrescribedMedicineDialog){
      this.addmedicineobj = {};
      this.medicineform.reset(this.medicineFormInitialValues);
      this.checkValidation();
      this.updateMedicineListEvent.emit(this.addedMedicineList);
    }
    
  }

  populateTemplateMedicine(medicineList:any){

    this.filterAllMedicineAgainstVisit = [];

    medicineList.forEach((x:any) => {
      this.addmedicineForTemplate(x)  
    });
    
    if(this.filterAllMedicineAgainstVisit.length > 0)
      this.alreadyPrescribedMedicineDialog = true;
    else
      this.alreadyPrescribedMedicineDialog = false;

    if(!this.alreadyPrescribedMedicineDialog){
      this.tempMedicineList = [];
      this.filterTempMedicineList = [];
      this.updateMedicineListEvent.emit(this.addedMedicineList);
    }

  }

  addAlreadyPrescribedMedicine(){
    if(!this.isTemplate)
      this.addmedicine();  
    else
      this.populateTemplateMedicine(this.filterTempMedicineList)  
  }

  // #region Helper Methods
  addmedicineForTemplate(medicine:any) {

    // let medicine = this.medicineform.value.MedicineId as any;
    // let dose = this.medicineform.value.DoseProfileId as any; // instructions
    // let doseTime = this.medicineform.value.DoseTimeProfileId as any;
    // let route = this.medicineform.value.RouteProfileId as any;
    // let frequency = this.medicineform.value.FrequencyProfileId as any;
    // let duration = this.medicineform.value.DurationProfileId as any;
    // let medicineTypeProfileId = this.medicineform.value.MedicineTypeProfileId as any;

    let filterMedicineAgainstVisit = [];
    let checkIfMedicineExistInList = null; //this.addedMedicineList.filter((t: any) => t.MedicineId != '' && medicine && t.MedicineId == medicine.Id)[0];
    if(!this.alreadyPrescribedMedicineDialog)
      filterMedicineAgainstVisit = this.allMedicineAgainstVisit.filter((x: any) => x.MedicineId == medicine.MedicineId);
      
      
    // else
    //   this.alreadyPrescribedMedicineDialog = false;

    this.addedMedicineList.every(function (item: any) {
      if (
        item.MedicineId != '' &&
        medicine &&
        medicine != '' &&
        item.MedicineId == medicine.MedicineId && item.IsDispensed
      ) {
        checkIfMedicineExistInList = item;
        return false;
      }
      return true;
    });

    if (checkIfMedicineExistInList == null && filterMedicineAgainstVisit.length == 0) {

      let selectedMedicine = this.medicineList.find((x:any) => x.MedicineId == medicine.MedicineId);

      this.addmedicineobj.PatientId = this.selectedPatient.PatientId;
      this.addmedicineobj.PatientVisitId = this.selectedPatient.PatientVisitId;
      this.addmedicineobj.MedicineId = medicine != null && medicine != '' ? medicine.MedicineId : 0;
      this.addmedicineobj.MedicineName = medicine != null && medicine != '' ? medicine.MedicineName : this.medicineform.value.MedicineIsNotAvailName;
      this.addmedicineobj.MedicineType = this.addmedicineobj.MedicineId == 0 ? this.medicineform.value.MedicineType.MedicineTypeName : medicine.MedicineTypeName;
      this.addmedicineobj.IsSMLMedicine = selectedMedicine?.IsSMLMedicine;
      this.addmedicineobj.BatchNo = selectedMedicine.BatchNo;
      this.addmedicineobj.UnitPrice = selectedMedicine.UnitPrice; //medicine.UnitPrice;
      this.addmedicineobj.MedicineTypeProfileId = selectedMedicine.MedicineTypeProfileId; // e.g. tablet,syrupe etc...
      this.addmedicineobj.AvailableQuantity = Number(selectedMedicine != null && selectedMedicine != '' && selectedMedicine.AvailableQuantity != null ? selectedMedicine.AvailableQuantity : 0);
      this.addmedicineobj.Days = medicine?.Days;
      this.addmedicineobj.DoseValue = medicine?.DoseValue;
      this.addmedicineobj.MedicineDose = medicine?.MedicineDose;
      this.addmedicineobj.InstructionValue = medicine?.InstructionValue;
      this.addmedicineobj.MedicineInstruction = medicine?.MedicineInstruction;
      this.addmedicineobj.RouteValue = medicine?.RouteValue;
      this.addmedicineobj.MedicineRoute = medicine?.MedicineRoute;
      this.addmedicineobj.FrequencyValue = medicine?.FrequencyValue;
      this.addmedicineobj.MedicineFrequency = medicine?.MedicineFrequency;
      this.addmedicineobj.DurationValue = medicine?.DurationValue;
      this.addmedicineobj.MedicineDuration = medicine?.MedicineDuration;
      this.addmedicineobj.Quantity = Number(medicine.Quantity);
      this.addmedicineobj.MedicineResourceProfileId = this.getMedicineResourceProfileIdFromMedicineObject(this.addmedicineobj);
      this.addmedicineobj.IsDispensed = true;
      
      // Math.ceil(
      //     this.addmedicineobj.Days * this.addmedicineobj.FrequencyProfileId * this.addmedicineobj.DoseProfileId
      // );
      this.addedMedicineList.push(this.addmedicineobj);
      this.addedMedicineList = this.SortMedicineList(this.addedMedicineList);
      this.showButtonPharmacyRefer();

    } else if(filterMedicineAgainstVisit.length > 0) {
      this.filterTempMedicineList.push(medicine);
    }
    // else if(checkIfMedicineExistInList) {
    //   this.highlightAlreadySelectedRow(checkIfMedicineExistInList);
    //   this._messageService.add({
    //     severity: 'info',
    //     summary: 'Medicine',
    //     detail: MessageConstant.MedicineAlreadySelected,
    //     life: 3000,
    //   });
    // } else if(this.filterAllMedicineAgainstVisit.length > 0) {
    //   // this.alreadyPrescribedMedicineDialog = true;
    // }
    if (filterMedicineAgainstVisit.length > 0) {
      filterMedicineAgainstVisit.forEach((x:any) => {
        this.filterAllMedicineAgainstVisit.push(x);  
      });
    }

    this.addmedicineobj = {};
    this.medicineform.reset(this.medicineFormInitialValues);
    this.checkValidation();
    // if(!this.alreadyPrescribedMedicineDialog){
      // this.updateMedicineListEvent.emit(this.addedMedicineList);
    // }

    // this.addmedicineobj = {};
    // this.medicineform.reset(this.medicineFormInitialValues);
    // this.checkValidation();
    
    
  }

  // Hide or Show Buttons (Save & Close visit) and (Save & Refer to Pharmacy)
  showButtonPharmacyRefer() {
    this.showReferPharmacyBtn = false;
    this.addedMedicineList.every((item: any) => {
      this.showReferPharmacyBtn = item.AvailableQuantity > 0;
      if (this.showReferPharmacyBtn) return false;
      return true;
    });
  }

  highlightAlreadySelectedRow(row: any) {
    this.selectedRowIndex = row.MedicineId;
    let self = this;
    setTimeout(function () {
      self.selectedRowIndex = -1;
    }, 3000);
  }

  checkValidation() {
    let check = this.medicineform.controls['IsMedicineIsNotAvailable'].value;
    if (check) {
      this.medicineform.controls["MedicineId"].setValue('');
      this.medicineform.controls["MedicineId"].clearValidators();
      this.medicineform.controls["MedicineIsNotAvailName"].setValidators(Validators.required);
      this.medicineform.controls['MedicineType'].setValidators([Validators.required]);
    }
    else {
      this.medicineform.controls["MedicineIsNotAvailName"].setValue('');
      this.medicineform.controls["MedicineIsNotAvailName"].clearValidators();
      this.medicineform.controls["MedicineId"].setValidators(Validators.required);
      this.medicineform.controls['MedicineType'].clearValidators();

    }
    this.medicineform.controls["MedicineType"].updateValueAndValidity();
    this.medicineform.controls["MedicineId"].updateValueAndValidity();
    this.medicineform.controls["MedicineIsNotAvailName"].updateValueAndValidity();
  }

  ReomoveMedicine(i: any) {
    var medicineObj = this.addedMedicineList[i];
    if (medicineObj.hasOwnProperty('PatientPrescriptionId')) {
      this.deleteMedicinetPrescription(medicineObj);
    }
    else
      this.addedMedicineList.splice(i, 1);

    this.updateMedicineListEvent.emit(this.addedMedicineList);
  }

  medicineDropdownChange(event: any) {
    let medicineTypeProfileId = this.getMedicineTypeIdByMedicineTypeName(event.value.MedicineTypeName.toLowerCase());

    this.medicineform.controls['MedicineTypeProfileId'].setValue(medicineTypeProfileId);

    switch (event.value.MedicineTypeName.toLowerCase()) {
      case MedicineTypeConstant.Tablet:

        this.doseList = dose.tablet;
        this.medicineform.controls['DoseProfileId'].setValue(dose.tablet[2]);
        this.medicineform.controls['RouteProfileId'].setValue(this.route[0]);
        this.medicineform.controls['FrequencyProfileId'].setValue(this.frequency[0]);
        this.medicineform.controls['DurationProfileId'].setValue(this.duration[3]); // by default 5 days
        this.medicineform.controls['DoseTimeProfileId'].setValue(this.instructions[2]); // by default کھانے کے بعد"

      break;

      case MedicineTypeConstant.Capsule:

        this.doseList = dose.capsule;
        this.medicineform.controls['DoseProfileId'].setValue(dose.capsule[1]);
        this.medicineform.controls['RouteProfileId'].setValue(this.route[0]);
        this.medicineform.controls['FrequencyProfileId'].setValue(this.frequency[0]);
        this.medicineform.controls['DurationProfileId'].setValue(this.duration[3]); // by default 5 days
        this.medicineform.controls['DoseTimeProfileId'].setValue(this.instructions[2]); // by default کھانے کے بعد"

        break;

      case MedicineTypeConstant.Syrup:
      case MedicineTypeConstant.Suspension:
      case MedicineTypeConstant.Solution:

        this.doseList = structuredClone(dose.syrup);
        this.medicineform.controls['DoseProfileId'].setValue(dose.syrup[1]);
        this.medicineform.controls['RouteProfileId'].setValue(this.route[0]);
        this.medicineform.controls['FrequencyProfileId'].setValue(this.frequency[0]);
        this.medicineform.controls['DurationProfileId'].setValue(this.duration[3]); // by default 5 days
        this.medicineform.controls['DoseTimeProfileId'].setValue(this.instructions[2]); // by default کھانے کے بعد"
      break;

      case MedicineTypeConstant.Pack:

        this.doseList = structuredClone(dose.syrup);
        this.doseList.push(...dose.pack);
        // this.doseList = dose.pack;
        this.medicineform.controls['DoseProfileId'].setValue(dose.pack[0]);
        this.medicineform.controls['RouteProfileId'].setValue(this.route[10]);
        this.medicineform.controls['FrequencyProfileId'].setValue(this.frequency[4]);
        this.medicineform.controls['DurationProfileId'].setValue(this.duration[10]); // by default 5 days
        this.medicineform.controls['DoseTimeProfileId'].setValue(this.instructions[10]); // by default کھانے کے بعد"
      break;

      case MedicineTypeConstant.Disposable:

        this.doseList = dose.pack;
        this.medicineform.controls['DoseProfileId'].setValue(dose.pack[0]);
        this.medicineform.controls['RouteProfileId'].setValue(this.route[10]);
        this.medicineform.controls['FrequencyProfileId'].setValue(this.frequency[4]);
        this.medicineform.controls['DurationProfileId'].setValue(this.duration[10]); // by default 5 days
        this.medicineform.controls['DoseTimeProfileId'].setValue(this.instructions[10]); // by default کھانے کے بعد"
      break;

      case MedicineTypeConstant.Injection:

        this.doseList = dose.injection;
        this.medicineform.controls['DoseProfileId'].setValue(dose.tablet[0]);

        break;
      case MedicineTypeConstant.Drip:
        this.doseList = dose.drip;
        break;
      case MedicineTypeConstant.Infusion:
        this.doseList = dose.infusion;
        break;

      case MedicineTypeConstant.Drop:

        this.doseList = dose.drop;

        break;
      case MedicineTypeConstant.Cream:

        this.doseList = dose.cream;

        break;
      case MedicineTypeConstant.Spray:

        this.doseList = dose.spray;
        break;
      case MedicineTypeConstant.Powder:

        this.doseList = dose.powder;

        break;
      case MedicineTypeConstant.Granules:

        this.doseList = dose.sachet;
        break;
      case MedicineTypeConstant.Sachet:

        this.doseList = dose.sachet;

        break;
      case MedicineTypeConstant.Lotion:

        this.doseList = dose.lotion;

        break;
      case MedicineTypeConstant.Ointment:

        this.doseList = dose.ointment;

        break;
      case MedicineTypeConstant.Gel:

        this.doseList = dose.ointment;

        break;
      case MedicineTypeConstant.Roll:

        this.doseList = dose.roll;

        break;
      case MedicineTypeConstant.Inhaler:

        this.doseList = dose.inhaler;

        break;
      default:

        this.doseList = dose.tablet;
    }
  }

  calculateMedicineQuantity(medicineObj: any) {
    let quantity = 0;

    switch (medicineObj.MedicineType.toLowerCase()) {
      case MedicineTypeConstant.Tablet:
      case MedicineTypeConstant.Capsule:
      case MedicineTypeConstant.Sachet:
      case MedicineTypeConstant.Granules:
        

      quantity = this.addmedicineobj.DurationValue * this.addmedicineobj.FrequencyValue * this.addmedicineobj.DoseValue;

      break;

      case MedicineTypeConstant.Pack:
      case MedicineTypeConstant.Disposable:

      quantity = this.addmedicineobj.DoseValue;

      break;

      case MedicineTypeConstant.Syrup:
      case MedicineTypeConstant.Injection:
      case MedicineTypeConstant.Drop:
      case MedicineTypeConstant.Solution:
      case MedicineTypeConstant.Suspension:
      case MedicineTypeConstant.Infusion:

      quantity = 1;

      break;

      default:

        quantity = 1;

    }

    return Math.ceil(
      quantity
    );
  }

  deleteMedicinetPrescription(medicinetPrescription: any) {
    this.deleteMedicinetPrescriptionDialog = true;
    this.medicinetPrescription = { ...medicinetPrescription };
  }

  confirmMedicinetPrescriptionDelete() {

    this._patientService.CheckIfMedicineDispensed(this.medicinetPrescription.PatientPrescriptionId || '').subscribe((data: any) => {
      if(data == true){
        this._messageService.add({
          severity: 'info',
          summary: 'Medicine',
          detail: MessageConstant.MedicineAlert,
          life: 3000,
        });
        this.deleteMedicinetPrescriptionDialog = false;
        this.medicinetPrescription = {};
      } else{
        this.addedMedicineList = this.addedMedicineList.filter((val: any) => val.PatientPrescriptionId !== this.medicinetPrescription.PatientPrescriptionId);
        this.updateMedicineListEvent.emit(this.addedMedicineList);
        this.deleteMedicinetPrescriptionDialog = false;
        this.medicinetPrescription = {};
      }

    });

    // this._patientService.deletePatientPrescription(this.medicinetPrescription.PatientPrescriptionId || '').subscribe((data: any) => {
    //   this.addedMedicineList = this.addedMedicineList.filter((val: any) => val.PatientPrescriptionId !== this.medicinetPrescription.PatientPrescriptionId);
    //   this.updateMedicineListEvent.emit(this.addedMedicineList);
    //   this.deleteMedicinetPrescriptionDialog = false;
    //   this.medicinetPrescription = {};

    // });
    
  }

  SortMedicineList(list:any) {
    return list.slice().sort((a: any, b: any) => {
      // Compare IsDispensed wise desc
      if (b?.IsDispensed !== a?.IsDispensed) {
        return b?.IsDispensed ? -1 : 1; // Flip the order for descending
      }

      // Compare IsSMLMedicine wise desc
      if (a.IsSMLMedicine !== b.IsSMLMedicine) {
      // if (a.IsSMLMedicine == true) {
        return a.IsSMLMedicine ? -1 : 1; // Flip the order for descending
        // return a.IsSMLMedicine - b.IsSMLMedicine
      }

      // Compare Available Quantity wise desc
      if (a.AvailableQuantity == 0) {
        // return (a.AvailableQuantity == 0) ? 1 :-1; // Flip the order for descending
        return b.AvailableQuantity - a.AvailableQuantity
      }

      // Then Medicine Name
      if (a.MedicineName !== b.MedicineName) {
        return a.MedicineName.localeCompare(b.MedicineName);
      }
  
      // Then Medicine Id
      // return a.MedicineId - b.MedicineId;
    });
  }

  setAvailableQuantityForEdit() {

    this.addedMedicineList.forEach((item1: any,index:number) => {

      if (item1.MedicineId > 0 && item1?.IsDispensed) 
      {
        let tempMedicine = this.medicineList.find((item2: any) => item2.MedicineId == item1.MedicineId);

        if (tempMedicine) {
          item1.AvailableQuantity = Number(tempMedicine.AvailableQuantity);
          item1.IsSMLMedicine = (tempMedicine?.IsSMLMedicine) ? tempMedicine?.IsSMLMedicine : false;
        }
        else
          this.addedMedicineList.splice(index, 1)
      }

    });
    this.updateMedicineListEvent.emit(this.addedMedicineList);
  }

  getMedicineTypeIdByMedicineTypeName(medicineTypeName: any) {

    let medicineType = this.medicineTypeList.filter((x: any) => x.Name === medicineTypeName);

    if (medicineType && medicineType.length > 0)
      return medicineType[0].ProfileId;

  }

  getMedicineResourceIdByMedicineResourceName(medicineResourceName: any) {

    let medicineResource = this.medicineResourceList.filter((x: any) => x.Name === medicineResourceName);

    if (medicineResource && medicineResource.length > 0)
      return medicineResource[0].ProfileId;

  }

  getMedicineResourceProfileIdFromMedicineObject(medicineObj: any) {
    let medicineResourceProfileId;

    if (medicineObj.MedicineId > 0 && medicineObj.AvailableQuantity >= medicineObj.Quantity)
      medicineResourceProfileId = this.getMedicineResourceIdByMedicineResourceName(MedicineResourceConstant.InternalMedicine);
    if (medicineObj.MedicineId > 0 && medicineObj.AvailableQuantity < medicineObj.Quantity)
      medicineResourceProfileId = this.getMedicineResourceIdByMedicineResourceName(MedicineResourceConstant.InternalAndExternalMedicine);
    else if (medicineObj.MedicineId == 0)
      medicineResourceProfileId = this.getMedicineResourceIdByMedicineResourceName(MedicineResourceConstant.ExternalMedicine);

    return medicineResourceProfileId;
  }
  closeAlreadyPrescribedMedicineDialog(){
    this.alreadyPrescribedMedicineDialog = false;
    this.addmedicineobj = {};
    this.medicineform.reset(this.medicineFormInitialValues);
    this.checkValidation();
    this.updateMedicineListEvent.emit(this.addedMedicineList);
  }

  // Lab Test Dropdown Working
  applyBgColorOnMedicineListDD(item:any):any{
    if(item.IsSMLMedicine == true){
      if(item.AvailableQuantity > 0)
        return {'background-color': '#d1ffbd', 'color':'black', 'border-radius':'5px', 'padding':'3px' };
      else
        return {'background-color': '#ff474c', 'color':'black', 'border-radius':'5px', 'padding':'3px' };
    } else {
      if(item.AvailableQuantity > 0)
        return {'background-color': '#adcae6', 'color':'black', 'border-radius':'5px', 'padding':'3px' };
      else
        return {'background-color': '#ffb347', 'color':'black', 'border-radius':'5px', 'padding':'3px' };
    }
    
  }

  getBadgeClass(item:any):any{
    if(item.IsSMLMedicine == true){
      if(item.AvailableQuantity > 0)
        return "medTypeBadge SMLAvailable";
      else
        return "medTypeBadge SMLNotAvailable";
    } else {
      if(item.AvailableQuantity > 0)
        return "medTypeBadge NotSMLAvailable";
      else
        return "medTypeBadge NotSMLNotAvailable";
    }
    
  }
  viewPrescription(item:any){
    this.ViewPrescription.emit(item);
  }
  //#endregion
}
