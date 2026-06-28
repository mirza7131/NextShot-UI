/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PatientsService } from '../patients.service';
import { Patient } from '../patientmodel'
import { ProfileService } from 'src/app/modules/ums/profile/profile.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { MessageService } from 'primeng/api';
import { Profile } from '../../ums/profile/profile';
import { DatePipe } from '@angular/common';
import { ReceiptTypeConstant } from 'src/app/core/constants/receipt-type.constant';
import { UserService } from '../../ums/user/user.service';
import { RoleConstant } from 'src/app/core/constants/Role.constant';
import { LocalService } from 'src/app/_services/local.service';
import { CommonService } from 'src/app/_services/common.service';
// import jsPDF from 'jspdf';
import { DepartmentConstant } from 'src/app/core/constants/department.constant';
import { FileUploadComponent } from 'src/app/controlls/file-upload/file-upload.component';
import { FormTypes } from 'src/app/core/constants/formTypes.constants';
import { PatientSource } from 'src/app/core/constants/patientSrc.constants';
import { ProfileTypeConstant } from 'src/app/core/constants/profileType.constants';
import { SectionConstant } from 'src/app/core/constants/section.constants';
import { SectionReceiptConstant } from 'src/app/core/constants/sectionReceipt.Constant';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { fromTypeConstant } from 'src/app/core/constants/fromType.constants';
import { MessageConstant } from 'src/app/core/constants/message.constants';
import { ProfileConstant } from 'src/app/core/constants/profile.constants';
import { HealthfacilityTypeConstant } from 'src/app/core/constants/HealthFacilityType.constants';
import { HealthFacilityConstant } from 'src/app/core/constants/HealthFacility.constants';
import { StringConstant } from 'src/app/core/constants/string.constants';
import { ConfirmationService } from 'primeng/api';
import { UserLevelFilterWidgetComponent } from '../../common/common-widgets/user-level-filter-widget/user-level-filter-widget.component';
import { RelationConstant } from 'src/app/core/constants/relation.constants';
import { HealthFacilityService } from '../../ums/health-facility/health-facility.service';

export function noEmptySpacesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value && control.value.trim() === '') {
        return { 'noEmptySpaces': true };
      }
      return null;
    };
  }

// import { sections } from 'src/app/core/constants/section.constants';

declare function onStart(event: any): any;
@Component({
    selector: 'app-patient-registrations',
    templateUrl: './patient-registrations.component.html',
    styleUrls: ['./patient-registrations.component.scss'],
    // directives: [FileUploadComponent]
})
export class PatientRegistrationsComponent implements OnInit {

    //#region GlobalVariable
    @Input() isFromPMIS = false;
    @Input() isPatientHistory = false;
    @Output() patientRegisterResponse = new EventEmitter<any>();
    @ViewChild('lottiePlayer') lottiePlayer: any;

    @ViewChild(FileUploadComponent) child: FileUploadComponent;

    fingerAnimation = '../.././../../assets/layout/landingPageImages/finger-print.gif';
    roleConstant: RoleConstant = new RoleConstant();
    maxDate: string = new Date().toISOString().slice(0, 10);
    minDate: string = new Date(new Date().setFullYear(new Date().getFullYear() - 110)).toISOString().slice(0, 10); //minimum 100 years
    index: number = 0;
    public displayBasic: boolean = false;
    public searchbyNo: boolean = false;
    public searchByMask: any = '99999-9999999-9';
    public searchByMaskPlaceholder: any = 'xxxxx-xxxxxxx-x';
    public searchDialog: boolean = false;
    public ShiftTab: boolean = false;
    public searching: boolean = false;
    public searchedPersons: any[] = [];
    public allLocations?: any = [];
    public division: any[] = [];
    public filteredDivision: any[] = [];
    public divisionData: any[] = [];
    public districts: any[] = [];
    public provinceData: any[] = [];
    public tehsilsData: any[] = [];
    public HealthfacilityData: any[] = [];
    public patientTehsil: any[] = [];
    public ucData: any[] = [];
    public departmentData: any[] = [];
    public sections: any[] = [];
    public doctorList: any[] = [];
    public bedList: any[] = [];
    public genderData: any[] = [];
    public relationData: any[] = [];
    public patientregistrationRes: any = {};
    public patientResponse: any = {};
    public gender: string = "GNDR";
    public relation: string = "RLTN";
    public isSelf: boolean = true;
    public section: any = null;
    public loginUserDetail: any = {};
    public tempDate: any = {};
    public age: any;
    public genderName: string = '';
    public getCurrentDateTime: Date = new Date();
    public selectedGender: any;
    public selectedGenderSlip: any;
    public selectedSection: any;
    public selectedSectionSlip: any;
    public selectedDepartment: any;
    public selectedDepartmentSlip: any;
    public provinceName: any;
    public mobilecode: any
    public firstletter: any;
    public MobilenumLetters: any;
    public keys: any;
    public ageValue: any;
    public DOBValue: any;
    public Mobilekeys: any;
    public CnicKeys: any;
    public searchval: any = 'Pak CNIC'
    public MaxDate = new Date();
    public MinDate = new Date(0 - 0 - 1900);
    public selectedtokenIndex: any = 0
    public hfId: any;
    public userDepartmentId: any;
    public userSectionId: any;
    public DobAge: any;
    public visitId: string = '';
    public profileTypeFingerPrint: string = 'FNGRPT';
    public profileTypePatientSrc: string = 'PATSRC';
    public profileTypePatientImage: string = 'PSNIMG';
    public profileTypeCaste: string = 'CSTE';
    public profileTypeOccupation: string = 'OCPTON';
    public stringQrCode: string = '';
    public relationDialog: boolean = false;
    public skipVitalsDialog: boolean = false;
    public noBedsAvailableDialog: boolean = false;
    public lottieDialog: boolean = false;
    public submittedDialog: boolean = false;
    public isReadOnlyCnic: boolean = true;
    public isReadOnlyInputField: boolean = false;
    public isShowClear: boolean = true;
    public disbaled: boolean = false;
    file: File[];
    public relationForm: any;
    profile: Patient = {};
    public tbPatContactData: any;
    formInitialValues: any = {};
    public calculatedAge: any = { years: 0, months: 0, days: 0 };
    public calculatedAgeSlip: any = { years: 0, months: 0, days: 0 };
    receiptTypeConstant: ReceiptTypeConstant = new ReceiptTypeConstant();
    fromTypeConstant: fromTypeConstant = new fromTypeConstant();
    showRegistrationPopup: boolean = false;
    restrictUserDialog: boolean = false;
    restrictUserMessage: string = '';
    showIfIPD: boolean = false;
    showIfER: boolean = false;
    IsFromCallCenter: boolean = false;
    public fingerPrints: any = []
    public tempFingerPrints: any = []
    public patientSrc: any = []
    public patientImages: any = []
    public isShowVehicle: boolean = false
    public showDesignation: any = false
    public userRole = "";
    public AlertMessage: any;
    public bedOccupiedDialog: boolean = false;
    public IsPatientFromVisitList: boolean = false;
    role: string = ''
    public casteList: any[] = [];
    public occupationList: any[] = [];
    public searchBy: string = ''
    public BlockExtraHit  :boolean = false;

    // public showAdmissionDialog: any = false

    public Province: any[] = [
        { Id: 1, Name: "KPK", HmisDbId: 7 },
        { Id: 2, Name: "FATA", HmisDbId: 8 },
        { Id: 3, Name: "Punjab", HmisDbId: 1 },
        { Id: 4, Name: "Sindh ", HmisDbId: 2 },
        { Id: 5, Name: "Balochistan", HmisDbId: 3 },
        { Id: 6, Name: "Islamabad", HmisDbId: 9 },
        { Id: 7, Name: "Gilgit Baltistan", HmisDbId: 10 },
        { Id: 8, Name: "AJK", HmisDbId: 13 },
        { Id: 9, Name: "AJK", HmisDbId: 1 },

    ]
    public SelectGender: any[] = [
        { Id: "a6bdf8cd-7129-4a96-8670-7455e5b106b6", Name: "Male" },
        { Id: "e1e777c3-042b-44fd-ba7a-a26c72fbf37d", Name: "Female" },
        { Id: "c38bfccb-33a9-48df-99d7-50cb505d9a88", Name: "TransGender" },
    ]

    public TokenList: Array<any> = [
        { TokenNo: '001' },
        { TokenNo: '002' },
        { TokenNo: '003' },
        { TokenNo: '004' },
        { TokenNo: '005' },
        { TokenNo: '006' },
        { TokenNo: '007' },
        { TokenNo: '008' },
        { TokenNo: '009' },
        { TokenNo: '010' }
    ];
    public MobileCode: Array<any> = [
        { Code: '0300' },
        { Code: '0301' },
        { Code: '0302' },
        { Code: '0303' },
        { Code: '0304' },
        { Code: '0305' },
        { Code: '0306' },
        { Code: '0307' },
        { Code: '0308' },
        { Code: '0309' },
        { Code: '0310' },
        { Code: '0311' },
        { Code: '0312' },
        { Code: '0313' },
        { Code: '0314' },
        { Code: '0315' },
        { Code: '0316' },
        { Code: '0317' },
        { Code: '0318' },
        { Code: '0319' },
        { Code: '0320' },
        { Code: '0321' },
        { Code: '0322' },
        { Code: '0323' },
        { Code: '0324' },
        { Code: '0325' },
        { Code: '0326' },
        { Code: '0327' },
        { Code: '0328' },
        { Code: '0330' },
        { Code: '0331' },
        { Code: '0332' },
        { Code: '0333' },
        { Code: '0334' },
        { Code: '0335' },
        { Code: '0336' },
        { Code: '0337' },
        { Code: '0340' },
        { Code: '0341' },
        { Code: '0342' },
        { Code: '0343' },
        { Code: '0344' },
        { Code: '0345' },
        { Code: '0346' },
        { Code: '0347' },
        { Code: '0348' },
        { Code: '0349' },
        { Code: '0355' },
    ];

    public urduGazette: any = {
        thankyou: `محکمہ پرائمری اینڈ سیکنڈری ہیلتھ کیر ڈیپارٹمنٹ حکومت پنجاب`,
        registrtionregard: ` معزز شہری آپ سے درخواست ہے کہ آپ اپنی باری کا انتظار کریں `,
        registrationregaard1: `اور اپنی باری آنے کی صورت میں "وائٹل کاؤنٹر" پر تشریف لے جائیں`,
        registrtionregard02: ` معزز شہری آپ سے درخواست ہے کہ آپ اپنی باری کا انتظار کریں `,
        registrationregard03: `کاؤنٹر پر تشریف لے جائیں `,
        registrationregardsspe: ` وائٹل کاؤنٹر`,
        registrationregards002: `اور اپنی باری آنے کی صورت میں`,
        TokenNum: `ٹوکن نمبر`,
        MRNum: `میڈیکل ریکارڈ نمبر`,
        PateintName: `مریض کا نام`,
        FatherName: `والد/ شوہر کا نام`,
        CnicNum: `شناختی کارڈ نمبر`,
        Agee: `عمر`,
        MobileNim: `موبائل نمبر`,
        Services: `شعبہ`,
        From: `منجانب`,
        Genders: `جنس`,
        vitals: `کیا آپ مریض کو وائٹلز کاؤنٹر پر بھیجنا چاہتے ہیں؟`,
        bedOccupiedAlert: `کیا آپ اس بیڈ پر مزید مریض رجسٹرکرنا چاہتے ہیں`
    };


    public patientform = new FormGroup({
        IsFromCallCenter: new FormControl(false),
        IsFromIPD: new FormControl(false),
        IsFromER: new FormControl(false),
        IPDSource: new FormControl(0),
        VisitFor: new FormControl(StringConstant.OPD), //1 = New Registration  2 = reffer case
        VisitSource: new FormControl(1),
        TokenNumberDisplay: new FormControl(),
        TokenNo: new FormControl(''),
        SlipNo: new FormControl(null),
        Cnic: new FormControl(''),
        PassportNo: new FormControl(''),
        RelationProfileId: new FormControl('', [Validators.required]),
        IsDataBankRecord: new FormControl(false),
        DataBankId: new FormControl(),
        BedNo: new FormControl(null),
        FirstName: new FormControl('', [Validators.required , noEmptySpacesValidator()]),
        LastName: new FormControl(''),
        Dob: new FormControl('', [Validators.required]),
        Age: new FormControl(0, [Validators.required]),
        GenderProfileId: new FormControl('', [Validators.required]),
        MobileNo: new FormControl('', [Validators.required]),
        ParmanentAddress: new FormControl('', [Validators.required, noEmptySpacesValidator()]),
        isQuematic: new FormControl(true),
        DepartmentLookupId: new FormControl('', [Validators.required]),
        SectionLookupId: new FormControl('', [Validators.required]),
        IsVitalSkip: new FormControl(false),
        IsDoctor: new FormControl(false),
        IsFromPMIS: new FormControl(false),
        Doctor: new FormControl(),
        searchcriteria: new FormControl(''),
        Mrno: new FormControl(''),
        personId: new FormControl(0),
        searchBy: new FormControl('Pak CNIC'),
        HealthFacilityId: new FormControl(),
        ProvinceId: new FormControl(null, [Validators.required]),
        DistrictId: new FormControl(null, [Validators.required]),
        TehsilId: new FormControl(null, [Validators.required]),
        DivisionId: new FormControl(null, [Validators.required]),
        IsSelf: new FormControl(true),
        NameOfCnicHolder: new FormControl('',[noEmptySpacesValidator()]),
        PatientId: new FormControl(null),
        IsActive: new FormControl(true),
        IsEligibleForSsc: new FormControl(false),
        ReasonIfNotEligibleForSsc: new FormControl(null),
        SscNumber: new FormControl(''),
        PatientImages: new FormControl(),
        PatientFingerprints: new FormControl(),
        PatientSource: new FormControl(),
        Category: new FormControl(''),
        PatientRole: new FormControl(''),
        isAlive: new FormControl(true),
        PatientAdmissionDetails: this.fb.array([]),
        TbPatientTypeId: new FormControl(null),
        TbPatientTreatmentLengthId: new FormControl(null),
        TbPatientLengthOfInterruptionId: new FormControl(null),
        TbPatientNoOfMedicineTaken: new FormControl(0),
        NoOfMonthsMedicineIssued: new FormControl(0),
        DRTBPatientStatus: new FormControl(''),
        VisitDate: new FormControl(null, [Validators.nullValidator]),
        PatinetPrivateHeathFacilityId: new FormControl(),
        CreateOrEditAdditionalPatient: new FormControl(),
        //#region Eye blindness

        isEyeBlindness: new FormControl(false),
        ComorbidityBy: new FormControl(''),
        DateOfInocvlation: new FormControl(null, [Validators.nullValidator]),
        ConsultantName: new FormControl(''),
        OtherHealthFacility: new FormControl(''),
        StatusOfVision: new FormControl(''),
        Recovery: new FormControl(''),
        HospitalInjectedId: new FormControl(0),
        EyeInvolved: new FormControl(''),

        //#endregion Eye blindness


        //#region Afghan Cnic
        IsAfghanCnic: new FormControl(false),
        //#endregion

    });




    // IpdRegistrationform = new FormGroup ({
    //     PatientAdmissionDetailId: new FormControl(null),
    //     PatientStatusProfileId: new FormControl('',Validators.required),
    //     ReasonOfShifting: new FormControl('',Validators.required),
    //     IsVantilated: new FormControl(true,Validators.required),
    //     PatientAdmittedOn: new FormControl('',Validators.required),
    //     AdmittedInSpeciality: new FormControl('',Validators.required),
    // });


    sscNotEligibleReasons: any[] = [];
    optionsEligibleForSsc: any = [{ "Id": true, "Value": "Yes" }, { "Id": false, "Value": "No" }];
    //#endregion




    //#region Tb



    public tbPatientDetails = new FormGroup({
        PatientTypes: new FormControl(''),
        TreatmentLength: new FormControl(''),
        InterruptionLength: new FormControl(''),
        noOfMedicineTaken: new FormControl(0),
        NoOfMonthsMedicineIssued: new FormControl(0),
        DRTBPatientStatus: new FormControl('')
    });


    shortNamePatientTypes = 'TPT'
    shortNameTreatmentLengths = 'TTL'
    shortNameInterruptionLengths = 'TTLI'
    tbPatientTypes: any = []
    treatmentLengths: any = []
    interruptionLengths: any = []
    isShowtbPatientDetails: boolean = false
    deptID = DepartmentConstant.OpdId
    sectionID = SectionConstant.oneWindowTbClinic
    isShowTBDropdowns: boolean = false
    //#endregion

    //#region Emc Additional Information

    addtionalInformation: FormGroup = new FormGroup({
        PatientAdditionalInfoId: new FormControl(null),
        PatientId: new FormControl(null),
        PatientVisitId: new FormControl(null),
        PatientDiagnoseId: new FormControl(null),
        PatientStatusProfileId: new FormControl(null),
        HealthFacilityId: new FormControl(null),
        DepartmentLookupId: new FormControl(null),
        SectionLookupId: new FormControl(null),
        CasteTypeProfileId: new FormControl('', [Validators.required]),
        AccupationTypeProfileId: new FormControl(null, [Validators.required]),
        GuardianName: new FormControl(null, [Validators.required]),
        GuardianCNIC: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9][0-9]{4}-[0-9]{7}-[0-9]$/)]),
        GuardianAddress: new FormControl(null, [Validators.required]),
        GuardianMobileNo: new FormControl(null, [Validators.required]),
        FormType: new FormControl(null),
        // Dob: new FormControl(null),
    })

    //#endregion




    //#region Eye Blindness

    isShowEyeBlindnessFields: boolean = false;
    isOtherHealthFacility: boolean = false;
    EyeInvolved: any = [
        { Id: 1, Name: 'Right' },
        { Id: 2, Name: 'Left' },
        { Id: 3, Name: 'Bi-Lateral' },
    ]


    //#endregion
    onCloseModal() {

        setTimeout(() => {
            // Reinitialize the Lottie player when the modal is closed
            // const lottiePlayer: any = document.querySelector('.LogInimg');
            // if (lottiePlayer) {
            //     lottiePlayer.stop();
            //     lottiePlayer.play();
            // }
        }, 500);
    }

    onFingerPrint(value: any): void {


        onStart(value.$event)
        this.lottieDialog = true

        setInterval(() => {
            //
            var _value = (<HTMLInputElement>document.getElementById(value?.id))?.value;
            if (_value != '' && !this.checkForNullandUndefined(_value)) {
                this.lottieDialog = false
                value = null
            }
        }, 500);
    }


    public formTypes = new FormGroup({
        generalForm: new FormControl('generalForm'),
    })
    public unknownStats = new FormGroup({
        status: new FormControl('', [Validators.required])
    })
    public patientCategory = new FormGroup({
        category: new FormControl('', [Validators.required])
    })

    public patientFingerPrints = new FormGroup({
        fingerPrints: this.fb.array([])
    })

    public patientSourceInfo = new FormGroup({
        source: new FormControl('', [Validators.required]),
        designation: new FormControl('', [Validators.pattern('^[a-zA-Z \-\']+')]),
        vehicleNo: new FormControl('', [Validators.maxLength(10)]),
        Name: new FormControl('', [Validators.minLength(3), Validators.maxLength(20)]),
        ContactNo: new FormControl(''),
    })

    public _file = new FormControl('');



    fingerPrint(): FormArray {
        return this.patientFingerPrints.get('fingerPrints') as FormArray;
    }


    newFingerPrint(fingerPrintObj: any): FormGroup {
        return this.fb.group({
            fingerPrintId: new FormControl(fingerPrintObj.ProfileId),
            fingerPrintProfileTypeId: new FormControl(fingerPrintObj.ProfileTypeId),
            base64: new FormControl(fingerPrintObj.base64)
        });
    }


    addFingerPrint(fingerPrintObj: any) {

        this.fingerPrint().push(this.newFingerPrint(fingerPrintObj))
    }

    clearFormArray = () => {
        while (this.fingerPrint().length !== 0) {
            this.fingerPrint().removeAt(0);
        }
    }
    //#region Constructor
    constructor(
        public fb: FormBuilder,
        public _PatientsService: PatientsService,
        public _ProfileService: ProfileService,
        public _AuthService: AuthService,
        private _messageService: MessageService,
        public _UserService: UserService,
        public _localService: LocalService,
        public _commonService: CommonService,
        public layoutService: LayoutService,
        private confirmationService: ConfirmationService,
        private UserLevelFilterWidgetComponent: UserLevelFilterWidgetComponent,
        public _healthFacilityService: HealthFacilityService
    ) {
        this.stringQrCode = 'eduforbetterment.com'
    }
    ngOnInit() {
        this.hideSideMenu();
        this.loginUserDetail = this._AuthService.getLoginUser();
        this.checkRoomNoForSpeciality();
        this.getLoginUserRoleForTb();
        // console.log(this.loginUserDetail);
        this.hfId = this.loginUserDetail.HealthFacilityId;

        if (this.loginUserDetail.DepartmentId) {
            this.userDepartmentId = this.loginUserDetail.DepartmentId;
        }

        if (this.loginUserDetail.SectionId)
            this.userSectionId = this.loginUserDetail.SectionId;

        if (this.isPatientHistory) {
            this.userDepartmentId = this.deptID
            this.userSectionId = this.sectionID
            this.isPatientAdviseMedicineInLastVisit();
        }

        if (this.isFromPMIS) {
            this.userDepartmentId = this.loginUserDetail.DepartmentId
        }

        if (this.loginUserDetail.IsDoctor) {
            this.userDepartmentId = this.loginUserDetail.DepartmentId;
            this.userSectionId = this.loginUserDetail.SectionId;
            this.patientform.controls["IsVitalSkip"].patchValue(true);
            this.patientform.controls["IsDoctor"].patchValue(true);
        }

        // Call Center Registration Working
        let isCallCenter = this.loginUserDetail.UserRoleList.find((x: any) => x.ShortName == this.roleConstant.CallCenterUser)
        if (isCallCenter) {
            this.patientform.controls["IsFromCallCenter"].patchValue(true);
        }



        this.getAllLocations();

        if (this.isPatientHistory) {
            this.getAllHealthFacilities();
        }
        this.getGender();
        this.getRelationShip();
        this.getSscNotEligibleReasons();
        // this.getdepartments();
        // this.getTehsil

        this.formInitialValues = this.patientform.value;

        if (this.isFromPMIS) {
            this.getAllDoctorList();
            this.patientform.controls['Doctor'].setValidators(Validators.required);
            this.patientform.controls['Doctor'].updateValueAndValidity();
        }

        if (this.isPatientHistory) {
            this.getAllHealthFacilities();
        }

        this.getProfileByProfileTypeForCaste(this.profileTypeCaste);
        this.getProfileByProfileTypeForOccupation(this.profileTypeOccupation);
        // if (!this.checkForNullandUndefined(this.loginUserDetail?.TehsilId)) {
        //     this.patientform.controls.TehsilId.patchValue(this.loginUserDetail.TehsilId);
        //     this.setLocations();
        // }
        // console.log('---------------------------------', this.loginUserDetail)
        this.loginUserDetail.UserRoleList.forEach((ele: any) => {
            if (ele.Name == FormTypes.drugAddict) {
                this.userRole = FormTypes.drugAddict
            } else if (ele.Name == FormTypes.mortaury) {
                this.userRole = FormTypes.mortaury
            }
        })


        if (this.userRole == FormTypes.drugAddict || this.userRole == FormTypes.mortaury) {
            this.getProfileByProfileTypeForFingerPrint(this.profileTypeFingerPrint);
            this.getProfileByProfileTypeForPatientSrc(this.profileTypePatientSrc);
            this.getProfileByProfileTypeForPatientImage(this.profileTypePatientImage);
        }
        this.patientform.controls.LastName.patchValue(' ')
        if (this.userRole == FormTypes.drugAddict) {
            this.formTypes.controls.generalForm.patchValue(FormTypes.drugAddict);
        }

        else if (this.userRole == FormTypes.mortaury) {
            this.formTypes.controls.generalForm.patchValue(FormTypes.mortaury);
        }




        // else if (this.loginUserDetail.UserRoleList[0].Name == FormTypes.patientRegistration) {
        //     this.formTypes.controls.generalForm.patchValue(FormTypes.patientRegistration);
        // }
    }
    //#endregion

    ngAfterContentInit() {
        //
        // this.getPatientData();
    }

    addPatientAdmissionDetails() {

        const Item = this.fb.group({
            PatientAdmissionDetailId: new FormControl(null),
            // PatientStatusProfileId: new FormControl(null,Validators.required),
            // ReferTo: new FormControl(null,Validators.required),
            // ReasonOfShifting: new FormControl(null,Validators.required),
            // ShiftedBy: new FormControl(null,Validators.required),
            // ShiftedOn: new FormControl(new Date(),Validators.required),
        });
        this.PatientAdmissionDetails.push(Item);
    }

    get PatientAdmissionDetails() {
        return this.patientform.controls["PatientAdmissionDetails"] as FormArray;
    }

    removePatientAdmissionDetails() {
        this.patientform.controls["PatientAdmissionDetails"].clear();
        this.PatientAdmissionDetails.clear();
    }

    // get PatientAdmissionDetails() {
    //     return this.patientform.controls["PatientAdmissionDetails"] as FormArray;
    // }


    setUpMortuaryForm() {
        if (this.loginUserDetail.UserRoleList[0].Name == "Mortaury") {

            this.index = 1
            this.patientform.get('SectionLookupId')?.clearValidators();
            this.patientform.get('DepartmentLookupId')?.clearValidators();

            this.patientform.controls.SectionLookupId.patchValue('0');
            this.patientform.controls.DepartmentLookupId.patchValue('0');
            this.patientform.controls.Cnic.patchValue('35201-9876543-2')
            this.patientform.controls.MobileNo.patchValue('0300-1234567')
            let val: any = this.relationData.filter(x => x.Name === 'Self')[0];
            this.patientform.controls.RelationProfileId.patchValue(val.ProfileId);
            this.isReadOnlyInputField = true;
            this.isShowClear = false
            this.formTypes.controls.generalForm.patchValue('Mortaury');
            this.unknownStats.controls.status.patchValue('Dead')
        }
    }

    dropdownValueChanged($event: any) {


        //#region Tb
        if ($event?.ShortName == ProfileConstant.lostToFollowUp) {
            this.isShowTBDropdowns = true;
        } else {
            this.isShowTBDropdowns = false;
            this.tbPatientDetails.controls.TreatmentLength.reset()
            this.tbPatientDetails.controls.InterruptionLength.reset()
            this.tbPatientDetails.controls.noOfMedicineTaken.reset()
        }
        //#endregion


        this.patientSourceInfo.controls.designation.patchValue('')
        this.patientSourceInfo.controls.vehicleNo.patchValue('')
        if ($event.Name == PatientSource.Edhi || $event.Name == PatientSource.Chippa) {
            this.isShowVehicle = true;
            this.showDesignation = false;
        } else if ($event.Name == PatientSource.Rescue1122) {
            this.isShowVehicle = true
            this.showDesignation = true;
        } else if ($event.Name == PatientSource.GeneralPublic) {
            this.isShowVehicle = false
            this.showDesignation = false;
        }
    }
    checkBoxValue() {

        // if (this.formTypes.controls.generalForm.value == FormTypes.generalForm) {
        //     this.unknownStats.reset()
        //     this.patientSourceInfo.reset()
        //     this.patientSourceInfo.reset();
        // } else if (this.formTypes.controls.generalForm.value == FormTypes.drugAddictForm) {
        this.unknownStats.reset()
        this.patientSourceInfo.reset()
        this.patientSourceInfo.reset();
        this.isShowVehicle = false;
        this.showDesignation = false;
        // }

        // if (this.formTypes.controls.generalForm.value == FormTypes.drugAddictForm) {

        //     if (this.patientSrc.length == 0) {
        //         this.getProfileByProfileTypeForPatientSrc(this.profileTypePatientSrc);
        //     }
        //     if (this.fingerPrints.length == 0) {
        //         this.getProfileByProfileTypeForFingerPrint(this.profileTypeFingerPrint);
        //     }
        // }

    }

    checkForNullandUndefined(val: any) {
        if (val == null || val == 'undefined' || val == '') return true;
        else return false;
    }

    IsNullorUndefined(val?: any) {
        return (val === undefined || val == null || val.length <= 0 || val == '' || val == 0) ? true : false;
    }

    public getProfileByProfileTypeForFingerPrint(profileType: string) {


        this._ProfileService.getProfileByProfileType(profileType).subscribe((res) => {


            // this.tempFingerPrints = res.sort(function (a: any, b: any) {
            //     var textA = a?.Name.toUpperCase();
            //     var textB = b?.Name.toUpperCase();
            //     return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            // })

            // console.log(this.fingerPrints)
            this.fingerPrints = res;
            // console.log('==================================', this.fingerPrints)


        })

    }


    public getProfileByProfileTypeForPatientSrc(profileType: string) {


        this._ProfileService.getProfileByProfileType(profileType).subscribe((res) => {
            this.patientSrc = res;
            // console.log('==================================', this.patientSrc)
        })


    }
    public getProfileByProfileTypeForPatientImage(profileType: string) {


        this._ProfileService.getProfileByProfileType(profileType).subscribe((res) => {
            this.patientImages = res;
            // console.log('==================================', this.patientImages)
        })


    }

    // Caste

    public getProfileByProfileTypeForCaste(profileType: string) {
        this._ProfileService.getProfileByProfileType(profileType).subscribe((res) => {
            this.casteList = res;
        })
    }

    // Occupation
    public getProfileByProfileTypeForOccupation(profileType: string) {
        this._ProfileService.getProfileByProfileType(profileType).subscribe((res) => {
            this.occupationList = res;
        })
    }

    getPatientData() {
        this.tbPatContactData = this._PatientsService.getTbPatientContactData();
        if (!this.checkForNullandUndefined(this.tbPatContactData)) {
            this.index = 1
            this.setUpPatientForm(this.tbPatContactData);
            this.isReadOnlyCnic = false;
        }
        // else {
        //     return this._messageService.add({ severity: 'error', summary: 'Error', detail: MessageConstant.FailedToReteriveDataPatientData, life: 3000 });
        // }
    }


    uploadFile(file: File[]) {

        this.file = file;
    }

    readFileAsBase64(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                const base64String = reader.result as string;
                resolve(base64String);
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsDataURL(file);
        });
    }



    filesToBase64(files: File[]) {
        if (!this.checkForNullandUndefined(this.file)) {
            const promises: Promise<string>[] = files.map((file) => this.readFileAsBase64(file));
            return Promise.all(promises);
        }
        return null
    }
    //#region CUD


    getValue(event: any) {

        if (!this.disbaled) {
            if (event == 'Unknown') {
                this.patientform.controls.Cnic.patchValue('35201-9876543-2')
                this.patientform.controls.MobileNo.patchValue('0300-1234567')
                let val: any = this.relationData.filter(x => x.Name === 'Self')[0];
                this.patientform.controls.RelationProfileId.patchValue(val.ProfileId);
                this.isReadOnlyInputField = true;
                this.isShowClear = false
                this.unknownStats.controls.status.patchValue('Alive')
                // this.formTypes.controls.generalForm.patchValue('unknownForm');
                // this.index = 1
            } else {
                this.isReadOnlyInputField = false;
                this.patientform.controls.Cnic.patchValue('')
                this.patientform.controls.RelationProfileId.patchValue('');
                this.isShowClear = true
                this.unknownStats.controls.status.patchValue('Dead')
                // this.formTypes.controls.generalForm.patchValue('drugAddictForm');
                // this.index = 0
            }
        }
    }


    async validateUser() {
        // console.log("Patient Form Value = > ",this.patientform.value);
        // console.log("Additional Info Value = > ",this.addtionalInformation.value);
        //#region EMC Additional Info



        // console.log(this.searchBy)
        if (this.searchval == 'Pak CNIC' || this.searchval == 'Afghan CNIC') {
            if (this.IsNullorUndefined(this.patientform.controls.Cnic.value)) {
                return this._messageService.add({ severity: 'info', summary: 'info', detail: 'Please search by cnic', life: 3000 });
            }
        } else if (this.searchval == 'Passport No') {
            if (this.IsNullorUndefined(this.patientform.controls.PassportNo.value)) {
                return this._messageService.add({ severity: 'info', summary: 'info', detail: 'Please search by passport no.', life: 3000 });
            }
        }


        if (this.loginUserDetail.FormType === this.fromTypeConstant.EMCMLEFORM || this.loginUserDetail.FormType === this.fromTypeConstant.PoliceKhidmatForm) {
            this.addtionalInformation.controls['FormType'].setValue(this.loginUserDetail.FormType);
            this.addtionalInformation.controls['HealthFacilityId'].setValue(this.loginUserDetail.HealthFacilityId);
            this.addtionalInformation.controls['DepartmentLookupId'].setValue(this.userDepartmentId);
            this.addtionalInformation.controls['SectionLookupId'].setValue(this.userSectionId);
            // this.addtionalInformation.controls['PatientId'].setValue(this.);

            // this.addtionalInformation.controls['FormType'].setValue(this.loginUserDetail.FormType);


            this.patientform.controls['CreateOrEditAdditionalPatient'].patchValue(this.addtionalInformation.value);
        }
        // console.log(this.patientform.value);
        // console.log(this.addtionalInformation.value)


        //#endregion

        //#region Drug Addict
        // console.log(this.formTypes.controls.generalForm.value)
        if (this.formTypes.controls.generalForm.value == FormTypes.drugAddict) {
            // if (this.patientCategory.invalid) {
            //     return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please Select Patient Category Known/ Unknown", life: 3000 });
            // }

            if (this.checkForNullandUndefined(this.patientSourceInfo.controls.source.value) || this.patientSourceInfo.controls.source.value == '') {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please select source", life: 3000 });
            }


            if (this.checkForNullandUndefined(this.patientSourceInfo.controls.Name.value) || this.patientSourceInfo.controls.Name.value == '') {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please Enter Name", life: 3000 });
            }

            if (this.patientSourceInfo.controls.Name.dirty) {
                if (this.patientSourceInfo.controls.Name.invalid) {
                    return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Enter Valid Name", life: 3000 });

                }
            }


            if (this.checkForNullandUndefined(this.patientSourceInfo.controls.ContactNo.value) || this.patientSourceInfo.controls.ContactNo.value == '') {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please Enter Contact", life: 3000 });

            }

            if (this.isShowVehicle && (this.checkForNullandUndefined(this.patientSourceInfo.controls.vehicleNo.value) || this.patientSourceInfo.controls.vehicleNo.value == '')) {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please enter vehicle number", life: 3000 });
            }


            if (this.patientSourceInfo.controls.vehicleNo.dirty) {
                if (this.patientSourceInfo.controls.vehicleNo.invalid) {
                    return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Enter Valid Vehicle No.", life: 3000 });

                }
            }

            if (this.showDesignation && (this.checkForNullandUndefined(this.patientSourceInfo.controls.designation.value) || this.patientSourceInfo.controls.designation.value == '')) {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please enter designation", life: 3000 });
            }

            if (this.unknownStats.controls.status.value == 'Alive') {
                let index = 0;
                this.clearFormArray();
                this.fingerPrints.forEach((ele: any, i: number) => {
                    let _ele = <HTMLElement>document.getElementById(`ThumbFinger${i}Hidden`) as any;
                    ele.base64 = _ele?.value
                    if (ele.base64 != '' && !this.checkForNullandUndefined(ele.base64)) {
                        let obj = {
                            ProfileId: ele.ProfileId,
                            ProfileTypeId: ele.ProfileTypeId,
                            base64: 'data:image/jpg;base64,' + _ele.value
                        }
                        this.addFingerPrint(obj)
                        ++index;
                    }
                });



                let patImageObj: { Name: any; ShortName: any; ProfileTypeId: any; ProfileId: any; base64: string; }[] = []


                let res = await this.filesToBase64(this.file)
                if (!this.checkForNullandUndefined(res)) {
                    res?.forEach((ele, i) => {
                        let patImage = this.patientImages[i]
                        if (!this.checkForNullandUndefined(patImage)) {
                            let _obj = { Name: patImage.Name, ShortName: patImage.ShortName, ProfileTypeId: patImage.ProfileTypeId, ProfileId: patImage.ProfileId, base64: ele.split('base64,')[1] }

                            patImageObj.push(_obj);
                        }


                    })




                    this.patientform.controls.PatientImages.patchValue(patImageObj);
                }

                if ((this.checkForNullandUndefined(this.file) || this.file.length == 0) && index == 0) {
                    return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Upload images and Fingerprints", life: 3000 });
                }


                if (res == null) {
                    return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Upload atleast 1 images", life: 3000 });
                }
                if (res) {
                    if (res.length == 0) {
                        return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Upload atleast 1 images", life: 3000 });
                    }
                }

                if (index < 10) {
                    return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Biomatric All Fingerprints", life: 3000 });
                }
                // console.log(patImageObj)

                // console.log(this.patientFingerPrints.value)
            }

            this.openVitalsDialouge()

        }


        if (this.formTypes.controls.generalForm.value == FormTypes.unknownForm) {
            if (this.unknownStats.invalid) {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please select patient Status Alive/Dead", life: 3000 });
            }

            // if (this.unknownStats.controls.status.value == 'Alive' && this.checkForNullandUndefined(this.file)) {
            //     return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please select file", life: 3000 });
            // }
            // if (this.unknownStats.controls.status.value == 'Dead' && this.checkForNullandUndefined(this.file)) {
            //     return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please select file", life: 3000 });
            // }

            if (this.checkForNullandUndefined(this.patientSourceInfo.controls.source.value) || this.patientSourceInfo.controls.source.value == '') {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please select source", life: 3000 });
            }


            if (this.checkForNullandUndefined(this.patientSourceInfo.controls.Name.value) || this.patientSourceInfo.controls.Name.value == '') {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please Enter Name", life: 3000 });
            }

            if (this.patientSourceInfo.controls.Name.dirty) {
                if (this.patientSourceInfo.controls.Name.invalid) {
                    return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Enter Valid Name", life: 3000 });

                }
            }


            if (this.checkForNullandUndefined(this.patientSourceInfo.controls.ContactNo.value) || this.patientSourceInfo.controls.ContactNo.value == '') {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please Enter Contact", life: 3000 });

            }

            // console.log(this.isShowVehicle)
            if (this.isShowVehicle && (this.checkForNullandUndefined(this.patientSourceInfo.controls.vehicleNo.value) || this.patientSourceInfo.controls.vehicleNo.value == '')) {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please enter vehicle number", life: 3000 });
            }

            if (this.patientSourceInfo.controls.vehicleNo.dirty) {
                if (this.patientSourceInfo.controls.vehicleNo.invalid) {
                    return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Enter Valid Vehicle No.", life: 3000 });

                }
            }

            if (this.showDesignation && (this.checkForNullandUndefined(this.patientSourceInfo.controls.designation.value) || this.patientSourceInfo.controls.designation.value == '')) {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please enter designation", life: 3000 });
            }




            let patImageObj: { Name: any; ShortName: any; ProfileTypeId: any; ProfileId: any; base64: string; }[] = []
            // if (this.checkForNullandUndefined(this.file)) {
            //     return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Upload Images", life: 3000 });
            // }
            let res = await this.filesToBase64(this.file)
            if (!this.checkForNullandUndefined(res)) {
                res?.forEach((ele, i) => {
                    let patImage = this.patientImages[i]
                    if (!this.checkForNullandUndefined(patImage)) {
                        let _obj = { Name: patImage.Name, ShortName: patImage.ShortName, ProfileTypeId: patImage.ProfileTypeId, ProfileId: patImage.ProfileId, base64: ele.split('base64,')[1] }

                        patImageObj.push(_obj);
                    }


                })

                this.patientform.controls.PatientImages.patchValue(patImageObj);
            }


            if ((this.checkForNullandUndefined(this.file) || this.file.length == 0)) {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Upload images", life: 3000 });
            }

            if (res == null) {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Upload atleast 1 images", life: 3000 });
            }

            if (res) {
                if (res.length == 0) {
                    return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Upload atleast 1 images", life: 3000 });
                }
            }


            let index = 0;
            this.clearFormArray();
            this.fingerPrints.forEach((ele: any, i: number) => {
                let _ele = <HTMLElement>document.getElementById(`ThumbFinger${i}Hidden`) as any;
                ele.base64 = _ele?.value
                if (ele.base64 != '' && !this.checkForNullandUndefined(ele.base64)) {
                    let obj = {
                        ProfileId: ele.ProfileId,
                        ProfileTypeId: ele.ProfileTypeId,
                        base64: 'data:image/jpg;base64,' + _ele.value
                    }
                    this.addFingerPrint(obj)
                    ++index;
                }
            });
            if (index < 10) {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Biomatric All Fingerprints", life: 3000 });
            }

            this.patientform.controls.PatientFingerprints.patchValue(this.patientFingerPrints.controls.fingerPrints.value);
            this.patientform.controls.PatientRole.patchValue(this.userRole);


            this.vitalStatus(true)

        }



        if (this.formTypes.controls.generalForm.value == FormTypes.drugAddict) {

            let source: any = this.patientSourceInfo.controls.source.value
            if (!this.checkForNullandUndefined(source)) {
                if (source.Name == PatientSource.Rescue1122) {
                    if (this.patientSourceInfo.controls.designation.invalid) {
                        return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Validation Error", life: 3000 });
                    }
                }
                // if(source.Name == PatientSource.Chippa || source.Name == PatientSource.Edhi){
                //     if(this.patientSourceInfo.controls.vehicleNo.invalid){
                //         return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Validation Error", life: 3000 });
                //     }
                // }

            }

            // console.log(this.patientSourceInfo.value)

            let val: any = this.patientSourceInfo.value.source;

            let obj = {
                ContactNo: this.patientSourceInfo.controls.ContactNo.value,
                Name: this.patientSourceInfo.controls.Name.value,
                designation: this.patientSourceInfo.controls.designation.value,
                vehicleNo: this.patientSourceInfo.controls.vehicleNo.value,
                source: val.ProfileId,
            }

            this.patientform.controls.PatientFingerprints.patchValue(this.patientFingerPrints.controls.fingerPrints.value);
            this.patientform.controls.Category.patchValue(this.patientCategory.controls.category.value);
            this.patientform.controls.PatientSource.patchValue(obj)


            this.patientform.controls.PatientRole.patchValue(this.loginUserDetail.UserRoleList[0].Name);
        }



        if (this.formTypes.controls.generalForm.value == FormTypes.mortaury) {

            let index = 0;
            this.clearFormArray();
            this.fingerPrints.forEach((ele: any, i: number) => {
                let _ele = <HTMLElement>document.getElementById(`ThumbFinger${i}Hidden`) as any;
                ele.base64 = _ele?.value
                if (ele.base64 != '' && !this.checkForNullandUndefined(ele.base64)) {
                    let obj = {
                        ProfileId: ele.ProfileId,
                        ProfileTypeId: ele.ProfileTypeId,
                        base64: 'data:image/jpg;base64,' + _ele.value
                    }
                    this.addFingerPrint(obj)
                    ++index;
                }
            });


            let patImageObj: { Name: any; ShortName: any; ProfileTypeId: any; ProfileId: any; base64: string; }[] = []

            let res = await this.filesToBase64(this.file)
            if (!this.checkForNullandUndefined(res)) {
                res?.forEach((ele, i) => {
                    let patImage = this.patientImages[i]
                    if (!this.checkForNullandUndefined(patImage)) {
                        let _obj = { Name: patImage.Name, ShortName: patImage.ShortName, ProfileTypeId: patImage.ProfileTypeId, ProfileId: patImage.ProfileId, base64: ele.split('base64,')[1] }

                        patImageObj.push(_obj);
                    }
                })

                this.patientform.controls.PatientImages.patchValue(patImageObj);
            }


            if ((this.checkForNullandUndefined(this.file) || this.file.length == 0) && this.fingerPrint().length == 0) {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Upload images/ fingerprint", life: 3000 });
            }

            if (this.checkForNullandUndefined(this.patientSourceInfo.controls.source.value) || this.patientSourceInfo.controls.source.value == '') {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please select source", life: 3000 });
            }


            if (this.checkForNullandUndefined(this.patientSourceInfo.controls.Name.value) || this.patientSourceInfo.controls.Name.value == '') {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please Enter Name", life: 3000 });
            }

            if (this.patientSourceInfo.controls.Name.dirty) {
                if (this.patientSourceInfo.controls.Name.invalid) {
                    return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Enter Valid Name", life: 3000 });

                }
            }


            if (this.checkForNullandUndefined(this.patientSourceInfo.controls.ContactNo.value) || this.patientSourceInfo.controls.ContactNo.value == '') {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please Enter Contact", life: 3000 });

            }

            // console.log(this.isShowVehicle)
            if (this.isShowVehicle && (this.checkForNullandUndefined(this.patientSourceInfo.controls.vehicleNo.value) || this.patientSourceInfo.controls.vehicleNo.value == '')) {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please enter vehicle number", life: 3000 });
            }

            if (this.patientSourceInfo.controls.vehicleNo.dirty) {
                if (this.patientSourceInfo.controls.vehicleNo.invalid) {
                    return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Enter Valid Vehicle No.", life: 3000 });

                }
            }

            if (this.showDesignation && (this.checkForNullandUndefined(this.patientSourceInfo.controls.designation.value) || this.patientSourceInfo.controls.designation.value == '')) {
                return this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Please enter designation", life: 3000 });
            }
        }

        //#endregion


        //#region Tb

        if (this.isPatientHistory) {
            if (this.patientform.controls.VisitDate.value == null || this.patientform.controls.VisitDate.value == '') {
                return this._messageService.add({ severity: 'info', summary: 'Info', detail: MessageConstant.SelectVisitDate, life: 3000 })
            }

            if (this.patientform.controls.PatinetPrivateHeathFacilityId.value == null || this.patientform.controls.PatinetPrivateHeathFacilityId.value == '') {
                return this._messageService.add({ severity: 'info', summary: 'Info', detail: MessageConstant.SelectHealthFacility, life: 3000 })
            }
        }

        if (!this.isPatientHistory) {
            if (this.selectedSection?.LookupId == SectionReceiptConstant.TbOpd) {

                if (this.checkForNullandUndefined(this.tbPatientDetails.controls.PatientTypes.value) || this.tbPatientDetails.controls.PatientTypes.value == '') {
                    return this._messageService.add({ severity: 'info', summary: 'Info', detail: "Select tb patient type", life: 3000 });
                }
            }

            if (this.role == this.roleConstant.DRTBDoctor) {
                if (this.tbPatientDetails.controls.DRTBPatientStatus.value == '' || this.tbPatientDetails.controls.DRTBPatientStatus.value == null) {
                    return this._messageService.add({ severity: 'info', summary: 'Info', detail: MessageConstant.selectDRTBPatientStatus, life: 3000 });
                }
            }
        }

        //#endregion



        //#region Victim Of Avastiam Details

        if (this.selectedSection?.Name == SectionConstant.EyeBlindnessOPD) {
            var patientForm = this.patientform.controls;
            if (
                this.IsNullorUndefined(patientForm.ComorbidityBy.value) ||
                this.IsNullorUndefined(patientForm.DateOfInocvlation.value) ||
                this.IsNullorUndefined(patientForm.ConsultantName.value) ||
                this.IsNullorUndefined(patientForm.StatusOfVision.value) ||
                // this.IsNullorUndefined(patientForm.Recovery.value) ||
                this.IsNullorUndefined(patientForm.HospitalInjectedId.value) ||
                this.IsNullorUndefined(patientForm.EyeInvolved.value)
            ) {
                return this._messageService.add({ severity: 'info', summary: 'Info', detail: MessageConstant.FillAllDetailsForVictimOfAvastin, life: 3000 });
            }


            if (this.isOtherHealthFacility) {
                if (this.IsNullorUndefined(patientForm.OtherHealthFacility.value)) {
                    return this._messageService.add({ severity: 'info', summary: 'Info', detail: MessageConstant.FillAllDetailsForVictimOfAvastin, life: 3000 });
                }

            }
        }

        //#endregion

        //#region General Form

        // console.log(this.formTypes.controls.generalForm.value)
        if (this.formTypes.controls.generalForm.value == FormTypes.generalForm) {
            if (!this.isFromPMIS && !this.isPatientHistory && !this.loginUserDetail?.IsDoctor && !this.showIfIPD && !this.showIfER && !this.patientform.controls["IsFromCallCenter"].value && this.selectedSection?.Name != SectionConstant.EyeBlindnessOPD) {
                this.openVitalsDialouge();
            } else {
                this.vitalStatus(false)
            }
        }
        //#endregion


        if (this.formTypes.controls.generalForm.value == FormTypes.mortaury) {
            this.vitalStatus(false)
        }
    }


    public openVitalsDialouge() {
        debugger
        var list = this.filterIPDSections(this.allLocations?.HfDepartmentSectionDropdown);
        this.patientform.controls.SectionLookupId.value
        var fiteredList = list.filter((x:any)=>x.LookupId === this.patientform.controls.SectionLookupId.value)
        if (!this.isFromPMIS && !this.isPatientHistory && !this.loginUserDetail?.IsDoctor)
            this.skipVitalsDialog = true;
        if(fiteredList[0]?.Name === 'EMCOther' || fiteredList[0]?.Name === 'Police Khidmat'){
            this.skipVitalsDialog = false;
            this.vitalStatus(true);
        }

            return
    }

    checkIfBedOccupied(event: any) {

        let id = event.value;
        let bed = this.bedList.find(x => x.Id == id)
        if (bed.Occupied > 0) {
            this.bedOccupiedDialog = true;
            this.AlertMessage = "Do You want to Register Another Patient on This Bed";
        }
    }
    ConfirmBedNo(val: any) {
        if (!val)
            this.patientform.controls['BedNo'].patchValue(null);

        this.bedOccupiedDialog = false;
    }

    vitalStatus(value: boolean) {


        if (value) {
            this.patientform.controls.IsVitalSkip.patchValue(value);


            this.section = this.sections.filter(x => x.LookupId == this.patientform.controls.SectionLookupId.value)[0]
            if (this.section) {

                this.urduGazette.registrationregardsspe = this.section.Name

            }
        }
        else {
            this.urduGazette.registrationregardsspe = ' وائٹل کاؤنٹر'
        }

        if (this.patientCategory.controls.category.value == 'Known') {
            this.SavePatient();
        } else if (this.formTypes.controls.generalForm.value == FormTypes.drugAddict && this.patientCategory.controls.category.value == FormTypes.unknown) {
            this.SavePatient();
        }
        else {
            // if (this.formTypes.controls.generalForm.value == FormTypes.drugAddictForm) {
            //     this.patientform.controls.isAlive.patchValue(true);
            // } else
            if (this.formTypes.controls.generalForm.value == FormTypes.unknownForm) {
                this.patientform.controls.isAlive.patchValue(false);
            }
            this.patientform.controls.PatientRole.patchValue(FormTypes.mortaury);
            this.saveUnknownPatient();
        }
        this.skipVitalsDialog = false
        this.displayBasic = true;
    }



    public async SavePatient() {
        debugger

        if(this.BlockExtraHit == true)
        {
            return;
        }

        // return this._messageService.add({ severity: 'success', summary: 'Empty', detail: "Good TO Go", life: 3000 });

        // let cnic = this.patientform.controls['Cnic'].value;

        // if(cnic != null && !cnic.includes("-")) {
        //     cnic = cnic.replace(/(\d{5})(\d{7})/, "$1-$2-");
        //     this.patientform.controls['Cnic'].setValue(cnic);
        // }
        this.IsPatientFromVisitList = false;
        if (this.patientform.valid) {
            // new
            if (this.isFromPMIS) {

                this.patientform.controls['IsFromPMIS'].setValue(true);
                if (this.patientform.controls['Doctor'].value == null) {
                    this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Must Select Doctor!", life: 3000 });
                    return;
                }

                // localStorage.setItem('PatientRegisterTest' , JSON.stringify(this.patientform.value));

                let PatientRegisterObj: any = this.patientform.value;
                // localStorage.setItem('PatientRegisterTest' , JSON.stringify(this.patientform.value));

                this.resetFormAfterSave();
                PatientRegisterObj.success = true;
                this.patientRegisterResponse.emit(PatientRegisterObj);

                // this._PatientsService.savePatientRegistration(this.patientform.value).subscribe(data => {

                //     if (data) {
                //         this.patientregistrationRes = data
                //         this.patientResponse = data;
                //         this.DobAge=data.Dob;

                //         this.visitId = this.patientregistrationRes.PatientOpenVisits[0].PatientOpenVisitId;
                //         this.calculatedAgeSlip = this.calculateAge(this.DobAge);
                //     }

                //     this.resetFormAfterSave();
                //     data.success = true;
                //     this.patientRegisterResponse.emit(data);
                // });

            } else if (this.isPatientHistory) {
                let PatientRegisterObj: any = this.patientform.value;
                this.resetFormAfterSave();
                PatientRegisterObj.success = true;
                this.patientRegisterResponse.emit(PatientRegisterObj);

            }
            else {

                this.showRegistrationPopup = false; // hide Registration Successfull
                // let inputModel = this.patientform.value;
                // let patientAdditionalInfoModel = "abc";
                // inputModel.patientAdmissionDetail = [];



                if (this.selectedSection.LookupId == SectionReceiptConstant.TbOpd) {

                    let value: any = this.tbPatientDetails.controls.PatientTypes.value
                    if (value)
                        this.patientform.controls.TbPatientTypeId.patchValue(value.ProfileId)
                    else
                        this.patientform.controls.TbPatientTypeId.patchValue(null)

                    value = this.tbPatientDetails.controls.TreatmentLength.value
                    if (value)
                        this.patientform.controls.TbPatientTreatmentLengthId.patchValue(value.ProfileId)
                    else
                        this.patientform.controls.TbPatientTreatmentLengthId.patchValue(null)

                    value = this.tbPatientDetails.controls.InterruptionLength.value
                    if (value)
                        this.patientform.controls.TbPatientLengthOfInterruptionId.patchValue(value.ProfileId)
                    else
                        this.patientform.controls.TbPatientLengthOfInterruptionId.patchValue(null)

                    let val = this.tbPatientDetails.controls.NoOfMonthsMedicineIssued.value as any;

                    if (this.tbPatientDetails.controls.noOfMedicineTaken.value == null || val == '') {
                        this.tbPatientDetails.controls.noOfMedicineTaken.patchValue(0)
                    }

                    val = this.tbPatientDetails.controls.NoOfMonthsMedicineIssued.value

                    if (this.tbPatientDetails.controls.NoOfMonthsMedicineIssued.value == null || val == '') {
                        this.tbPatientDetails.controls.NoOfMonthsMedicineIssued.patchValue(0)
                    }

                    this.patientform.controls.TbPatientNoOfMedicineTaken.patchValue(this.tbPatientDetails.controls.noOfMedicineTaken.value)



                    this.patientform.controls.NoOfMonthsMedicineIssued.patchValue(this.tbPatientDetails.controls.NoOfMonthsMedicineIssued.value)



                    this.patientform.controls.DRTBPatientStatus.patchValue(this.tbPatientDetails.controls.DRTBPatientStatus.value)
                }

                if (this.showIfIPD) {

                    this.patientform.controls['VisitFor'].patchValue(StringConstant.IPD);
                    this.patientform.controls['VisitSource'].patchValue(1); // 1 for registration, 2 for Refer
                    this.patientform.controls['IsFromIPD'].patchValue(true);
                    this.patientform.controls['IPDSource'].setValue(1); // 1 for registration, 2 for Refer
                    this.addPatientAdmissionDetails();
                } else if (this.showIfER) {
                    this.patientform.controls['VisitFor'].patchValue(StringConstant.ER);
                    this.patientform.controls['VisitSource'].patchValue(1); // 1 for registration, 2 for Refer
                    this.patientform.controls['IsFromER'].patchValue(true);
                    this.patientform.controls['IPDSource'].setValue(0); // 1 for registration, 2 for Refer
                    this.removePatientAdmissionDetails();
                } else {
                    this.patientform.controls['VisitFor'].patchValue(StringConstant.OPD);
                    this.patientform.controls['VisitSource'].patchValue(1); // 1 for registration, 2 for Refer
                    this.patientform.controls['IsFromIPD'].patchValue(false);
                    this.patientform.controls['IPDSource'].setValue(0); // 1 for registration, 2 for Refer
                    this.removePatientAdmissionDetails();
                }

                if (this.patientform.controls.searchBy.value == 'Afghan CNIC') {
                    this.patientform.controls.IsAfghanCnic.patchValue(true);
                }

                this.patientform.value
                this.BlockExtraHit = true;

                this._PatientsService.savePatientRegistration(this.patientform.value).subscribe(data => {
                    if (data) {

                        debugger
                        this.searchBy = this.patientform.controls.searchBy.value as string;
                        this.patientregistrationRes = data
                        this.patientResponse = data;
                        this.DobAge = data.Dob;
                        this.BlockExtraHit = false;

                        this.visitId = this.patientregistrationRes.PatientOpenVisits[0].PatientOpenVisitId;
                        this.calculatedAgeSlip = this.calculateAge(this.DobAge);
                        this.tempDate = {}

                        // registration popup data

                        this.patientregistrationRes.IsVitalSkip = this.patientform.controls['IsVitalSkip'].value;
                        if (!this.patientregistrationRes.CreatedOn)
                            this.patientregistrationRes.CreatedOn = new Date();

                        this.patientregistrationRes.TokenNo = this.patientregistrationRes.PatientOpenVisits[0].TokenNo;
                        this.patientregistrationRes.PatientName = this.patientregistrationRes.FirstName;
                        this.patientregistrationRes.GurdianName = this.patientregistrationRes.GuardianName;
                        this.patientregistrationRes.CNIC = this.patientregistrationRes.Cnic;
                        this.patientregistrationRes.ContactNo = this.patientregistrationRes.MobileNo;
                        this.patientregistrationRes.Department = this.selectedDepartment?.Name;
                        this.patientregistrationRes.HealthFacilityName = this.loginUserDetail.HealthFacilityName;
                        this.patientregistrationRes.Section = this.selectedSection?.Name;
                        this.patientregistrationRes.Gender = this.selectedGender?.Name;
                        this.patientregistrationRes.PatientOpenVisitId = this.patientregistrationRes.PatientOpenVisits[0].PatientOpenVisitId;
                        // this.patientregistrationRes.IsEligibleForSsc = this.patientform.controls['IsEligibleForSsc'].value;
                        // this.patientregistrationRes.SscNumber = this.patientform.controls['SscNumber'].value;
                        // if (this.patientregistrationRes.IsEligibleForSsc == false && this.showIfIPD)
                        //     this.patientregistrationRes.ReasonIfNotEligibleForSsc = this.sscNotEligibleReasons.find(x => x.ProfileId == this.patientform.controls['ReasonIfNotEligibleForSsc'].value).Name;

                    }

                    this.resetFormAfterSave();
                    this.displayBasic = true;
                    this.showRegistrationPopup = true;
                });
            }


            // old

            // if(this.isFromPMIS) {
            //     this.patientform.controls['IsFromPMIS'].setValue(true);
            //     if(this.patientform.controls['Doctor'].value == null)
            //     {
            //         this._messageService.add({ severity: 'error', summary: 'Empty', detail: "Must Select Doctor!", life: 3000 });
            //         return;
            //     }
            // }
            // this._PatientsService.savePatientRegistration(this.patientform.value).subscribe(data => {

            //     if (data) {
            //         this.patientregistrationRes = data
            //         this.patientResponse = data;
            //         this.DobAge=data.Dob;

            //         this.visitId = this.patientregistrationRes.PatientOpenVisits[0].PatientOpenVisitId;
            //         this.calculatedAgeSlip = this.calculateAge(this.DobAge);
            //     }

            //     this.resetFormAfterSave;

            //     if (!this.isFromPMIS) {
            //         this.displayBasic = true;
            //     }else{
            //         data.success = true;
            //         this.patientRegisterResponse.emit(data);
            //     }
            // });
        }
    }



    public async saveUnknownPatient() {



        if (this.patientform.valid) {
            this.showRegistrationPopup = false;

            this._PatientsService.saveUnknownPatientRegistration(this.patientform.value).subscribe(data => {
                if (data) {

                    // this.patientregistrationRes = data
                    // this.patientResponse = data;
                    // this.DobAge = data.Dob;

                    // // this.visitId = this.patientregistrationRes.PatientOpenVisits[0].PatientOpenVisitId;
                    // this.calculatedAgeSlip = this.calculateAge(this.DobAge);

                    /////////////////////////////////////////////////////////////////////////////



                    this.patientregistrationRes = data
                    this.patientResponse = data;
                    this.DobAge = data.Dob;

                    // this.visitId = this.patientregistrationRes.PatientOpenVisits[0].PatientOpenVisitId;
                    this.calculatedAgeSlip = this.calculateAge(this.DobAge);

                    // registration popup data
                    // this.patientregistrationRes.TokenNo = this.patientregistrationRes.PatientOpenVisits[0].TokenNo;
                    this.patientregistrationRes.PatientName = data.FullName;
                    // this.patientregistrationRes.GurdianName = this.patientregistrationRes.GuardianName;
                    this.patientregistrationRes.CNIC = data.Cnic;
                    this.patientregistrationRes.ContactNo = data.MobileNo
                    this.patientregistrationRes.Department = this.selectedDepartment?.Name;
                    this.patientregistrationRes.HealthFacilityName = this.loginUserDetail.HealthFacilityName;
                    this.patientregistrationRes.Section = this.selectedSection?.Name;
                    this.patientregistrationRes.Gender = this.selectedGender?.Name;
                    // this.patientregistrationRes.PatientOpenVisitId = this.patientregistrationRes.PatientOpenVisits[0].PatientOpenVisitId;
                }

                let PatientRegisterObj: any = this.patientform.value;
                PatientRegisterObj.success = true;
                this.patientRegisterResponse.emit(PatientRegisterObj);
                this.resetFormAfterSave();
                this.displayBasic = true;

                this.showRegistrationPopup = true;
            });
        }
    }


    resetDrugAddictForm() {
        if (this.loginUserDetail.UserRoleList[0].Name == "Mortaury") {
            this.patientform.reset(this.formInitialValues);
            this.setUpMortuaryForm();
        } else {
            this.formInitialValues.TehsilId = this.loginUserDetail?.TehsilId
            this.patientform.reset(this.formInitialValues);
            // this.setLocations();
            this.getDivisions(this.loginUserDetail.ProvinceId);
            this.getDistricts(this.loginUserDetail.DivisionId);
            this.getTehsil(this.loginUserDetail.DistrictId)
            this.getUnionCouncil(this.loginUserDetail.TehsilId)
        }
        this.patientSourceInfo.reset();
        this.child?.reset();
        this.clearFormArray();
        this.file = []
        this._file?.reset()
        // this.unknownStats.reset()
        this.patientCategory.reset();
        this.isShowVehicle = false
        this.showDesignation = false
        this.fingerPrints = []
        this.disbaled = false
        // this.getProfileByProfileTypeForFingerPrint(this.profileTypeFingerPrint);
        this.fingerPrints = []
        this.fingerPrints = JSON.parse(JSON.stringify(this.tempFingerPrints));
    }


    resetFormAfterSave() {

        if (this.formTypes.controls.generalForm.value == FormTypes.drugAddict || this.formTypes.controls.generalForm.value == FormTypes.mortaury) {
            this.resetDrugAddictForm();
            this.patientSourceInfo.reset()
        }
        // else if (this.loginUserDetail.UserRoleList[0].Name == "Mortaury") {
        //     this.setUpMortuaryForm();
        // }

        this.patientform.reset(this.formInitialValues);
        this.selectedGenderSlip = {};

        if (this.loginUserDetail?.IsDoctor) {
            this.selectedSectionSlip = {};
            this.userDepartmentId = this.loginUserDetail.DepartmentId;
            this.userSectionId = this.loginUserDetail.SectionId;
            this.patientform.controls["IsVitalSkip"].patchValue(true);
            this.patientform.controls["IsDoctor"].patchValue(true);
        }

        this.patientResponse = {};
        this.calculatedAge = {};
        this.index = this.index === 1 ? 0 : this.index + 1;
        this.patientform.controls['searchBy'].setValue('Pak CNIC')
        this.searchByMask = '99999-9999999-9'
        this.searchByMaskPlaceholder = 'xxxxx-xxxxxxxx-x'
        this.patientform.controls['searchcriteria'].setValue('')
        this.serarchByEvent();
        this.showRegistrationPopup = false;
        this.showIfIPD = false;
        this.showIfER = false;
        this.removePatientAdmissionDetails();
        // this.showAdmissionDialog();
        this.isShowtbPatientDetails = false
        this.tbPatientDetails.reset();
        this.getAllLocations();

        if (this.isPatientHistory) {
            this.getAllHealthFacilities();
        }
        this.isShowEyeBlindnessFields = false
    }

    saveRelation() {
        this.submittedDialog = true;
        this.relationForm.controls['ProfileTypeId'].setValue(this.relationData[0].ProfileTypeId);
        if (this.relationForm.valid) {
            this._ProfileService.create(this.relationForm.value as Profile).subscribe(data => {
                this.relationData.push(
                    {
                        "ProfileId": data.ProfileId,
                        "Name": data.Name,
                        "ShortName": data.ShortName,
                        "ProfileTypeId": data.ProfileTypeId,
                    }
                );
                this.patientform.controls['RelationProfileId'].setValue(data.ProfileId!);
                this.relationData = [...this.relationData];
                this.relationDialog = false;
            });
        }
    }
    setUpPatientForm(tbPatContactData: any) {


        let relationData = this.relationData.filter(x => x.Name == tbPatContactData.Relation)[0];
        this.patientform.patchValue({ NameOfCnicHolder: tbPatContactData.ContactName });
        this.patientform.patchValue({ FirstName: tbPatContactData.ContactName });
        if (!this.checkForNullandUndefined(relationData)) {

            this.patientform.patchValue({ RelationProfileId: relationData.ProfileId });
        }
        this.patientform.patchValue({ Age: tbPatContactData.Age });
        this.patientform.patchValue({ MobileNo: tbPatContactData.ContactNo });
        this.patientform.patchValue({ TehsilId: this.tbPatContactData.TehsilId });
        this.AgeToDOB();
        this.setLocations();
    }

    // openAdmissionDialog() {
    //     if(this.patientform.valid)
    //     {
    //         // this.showAdmissionDialog = true;
    //         // this.addPatientAdmissionDetails();
    //     }
    // }

    // closeAdmissionDialog() {
    //     this.showAdmissionDialog = false;
    //     this.removePatientAdmissionDetails();
    // }

    //#endregion

    //#region Helper Methods

    // guardianNameAdditionalInfoValueChange(event: any){
    //     console.log(event)
    // }

    public fillCNICData(data: any) {

        // this.showIfIPD = false;
        // this.showIfER = false;
        this.patientform.patchValue(data);


        // this.addtionalInformation.patchValue(data);
        // this.addtionalInformation.controls['Dob'].patchValue(data.Dob.substring(0,10));
        // this.addtionalInformation.controls['GuardianCNIC'].patchValue(data.GuardianCnic
        //     );
        //     this.addtionalInformation.controls['GuardianName'].patchValue(data.GuardianNameInEnglisOrUrdu
        //         );


        var datePipe = new DatePipe("en-US");
        this.patientform.patchValue({
            Dob: datePipe.transform(data.Dob, 'yyyy-MM-dd')
        });

        if (this.loginUserDetail.FormType === this.fromTypeConstant.EMCMLEFORM || this.loginUserDetail.FormType === this.fromTypeConstant.PoliceKhidmatForm) {

            this.addtionalInformation.patchValue(data);
            // this.addtionalInformation.controls['Dob'].patchValue(data.Dob.substring(0,10));
            this.addtionalInformation.controls['GuardianCNIC'].patchValue(data.GuardianCnic
            );
            this.addtionalInformation.controls['GuardianName'].patchValue(data.GuardianNameInEnglisOrUrdu
            );
            // this.addtionalInformation.patchValue(res);
            // console.log("We are here",this.addtionalInformation.value)
        }

        let convertAge = this.patientform.controls['Dob'].value || new Date();
        this.calculatedAge = this.calculateAge(convertAge);
        var year = this.calculatedAge.split(" ", 1);
        year = Number(year)
        if (year >= 0 && year <= 110) {
            if (this.tempDate['year'] > 0) {
                this.patientform.controls['Age'].setValue(year);
            } else if (this.tempDate['month'] > 0 && this.tempDate['year'] == 0) {
                this.patientform.controls['Age'].setValue(this.tempDate['month']);
            } else if (this.tempDate['day'] >= 0 && this.tempDate['month'] == 0 && this.tempDate['year'] == 0) {
                this.patientform.controls['Age'].setValue(this.tempDate['day'] == 0 ? 1 : this.tempDate['day']);
            }
        }

        if (this.loginUserDetail.DepartmentId) {
            this.userDepartmentId = this.loginUserDetail.DepartmentId;
        }

        if (this.loginUserDetail.SectionId)
            this.userSectionId = this.loginUserDetail.SectionId;

        this.getAllLocations();

        if (this.isPatientHistory) {
            this.getAllHealthFacilities();
        }
        this.getGenderNames(data.GenderProfileId);
        this.getDivisions(data.ProvinceId);
        this.getDistricts(data.DivisionId);
        this.getTehsil(data.DistrictId)
        this.getUnionCouncil(data.TehsilId);
        this.closeSearchDialog();
        this.calculatedAge = this.calculateAge(data.Dob);
    }

    closedailog() {
        this.displayBasic = false;
        this.patientregistrationRes = {};
    }

    closeSearchDialog() {
        this.searchbyNo = false;
    }

    ResetPage(event: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure, you want to reset this record?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.searchByMask = "99999-9999999-9"
                this.searchByMaskPlaceholder = "xxxxx-xxxxxxx-x"
                this.tempDate = {};
                this.formInitialValues.TehsilId = this.loginUserDetail?.TehsilId
                this.patientform.reset(this.formInitialValues);
                // this.setLocations();
                this.getDivisions(this.loginUserDetail.ProvinceId);
                this.getDistricts(this.loginUserDetail.DivisionId);
                this.getTehsil(this.loginUserDetail.DistrictId)
                this.getUnionCouncil(this.loginUserDetail.TehsilId)
                this.selectedGenderSlip = {};
                if (!this.loginUserDetail?.IsDoctor)
                    this.selectedSectionSlip = {};
                this.patientResponse = {};
                this.index = this.index === 1 ? 0 : this.index + 1;
                this.getdepartments(this.loginUserDetail.HealthFacilityId);
                this.resetDrugAddictForm();
                this.isShowtbPatientDetails = false
                this.isShowEyeBlindnessFields = false
                this.tbPatientDetails.reset()
                this.addtionalInformation.reset();

            },
            reject: () => {
                // this._messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });

    }
    openRegistrationTab() {

        let cnic = this.patientform.controls['searchcriteria'].value;
        this.searchval = this.patientform.controls['searchBy'].value;
        this.patientform.reset(this.formInitialValues);
        this.patientform.controls['searchBy'].setValue(this.searchval);
        if (this.searchval == "Pak CNIC" || this.searchval == "Afghan CNIC") {
            this.patientform.controls['Cnic'].setValue(cnic);
            this.index = this.index === 2 ? 0 : this.index + 1;
        }
        if (this.searchval == "Passport No") {
            this.patientform.controls['PassportNo'].setValue(cnic);
            this.index = this.index === 2 ? 0 : this.index + 1;
        }
        if (this.searchval == "Mobile No") {
            this._messageService.add({ severity: 'info', summary: 'آپ کے درج کئے گئے موبائل نمبر پر مریض کا ریکارڈ موجود نہیں ہے، برائے مہربانی مریض  کا شناختی کارڈ نمبر کے ذریعے اندراج کریں یا سرچ کی دوسری اپشن  کا استعمال کریں۔', life: 3000 });
            // this.patientform.controls['MobileNo'].setValue(this.patientform.controls['searchcriteria'].value);
            this.index = this.index === 2 ? 0 : this.index + 1;
        }
        if (this.searchval == "MR No") {
            this._messageService.add({ severity: 'info', summary: 'آپ کے درج کئے گئے میڈیکل ریکارڈ نمبر پر مریض کا ریکارڈ موجود نہیں ہے، برائے مہربانی مریض  کا شناختی کارڈ نمبر کے ذریعے اندراج کریں یا سرچ کی دوسری اپشن  کا استعمال کریں۔', life: 3000 });
        }


        if (this.loginUserDetail.DepartmentId == DepartmentConstant.OpdId && this.loginUserDetail.SectionId == SectionConstant.oneWindowTbClinic) {
            this.isPatientAdviseMedicineInLastVisit();
        }
        this.closeSearchDialog();
    }
    openSelectedRegistrationTab() {

        // this.patientform.controls['Cnic'].setValue('');
        this.formTypes.controls.generalForm.patchValue('generalForm')
        if (!this.checkForNullandUndefined(this.patientform.controls.PassportNo.value)) {
            this.patientform.controls['searchBy'].patchValue("Passport No")
            this.searchval = "Passport No"
            this.searchByMask = "aa9999999"
            this.searchByMaskPlaceholder = "aa*******"
        } else {

            this.searchval = this.patientform.controls['searchBy'].value;
        }
        this.patientform.controls['searchcriteria'].setValue(null);
        // this.patientform.controls['DepartmentLookupId'].setValue('');
        // this.patientform.controls['SectionLookupId'].setValue([]);

        this.showRegistrationPopup = false;
        this.patientregistrationRes = {}
        this._PatientsService.CheckIfPatientVisitExist(this.patientform.controls.PatientId.value, this.loginUserDetail.HealthFacilityId).subscribe((res) => {


            if (res) {
                this.showRegistrationPopup = true;
                this.IsPatientFromVisitList = true;
                this.patientregistrationRes = res;
                this.patientform.patchValue(this.formInitialValues);
                this.tempDate = {}
                this.selectedGenderSlip = {}
                this.selectedSectionSlip = {}
                this.closeSearchDialog();
                this.searchByMask = '99999-9999999-9';
                this.searchByMaskPlaceholder = 'xxxxx-xxxxxxxx-x';
            } else {
                this.closeSearchDialog();
                this.index = this.index === 2 ? 0 : this.index + 1;
                this.patientform.controls.HealthFacilityId.patchValue(this.loginUserDetail.HealthFacilityId)
                if (this.loginUserDetail.DepartmentId == DepartmentConstant.OpdId && this.loginUserDetail.SectionId == SectionConstant.oneWindowTbClinic) {
                    this.isPatientAdviseMedicineInLastVisit();
                }
                if (this.loginUserDetail.UserRoleList[0].Name == "Drug Addict") {
                    this.formTypes.controls.generalForm.patchValue(FormTypes.drugAddict);
                    this.unknownStats.controls.status.patchValue('Dead')
                }
                if (this.loginUserDetail.UserRoleList[0].Name == "Mortaury") {
                    this.formTypes.controls.generalForm.patchValue(FormTypes.mortaury);
                    this.unknownStats.controls.status.patchValue('Dead')
                }

                if (this.loginUserDetail.FormType === 'EMCMLEFORM') {
                    debugger;
                    this.addtionalInformation.controls['PatientId'].setValue(this.patientform.controls['PatientId'].value)
                    // console.log(this.patientform.value);
                    // console.log()
                }
            }
        })



        // if (this.isPatientHistory) {
        //     this.patientform.controls.HealthFacilityId.patchValue(null);
        // } else {

        // }
    }
    searchRecord() {



        this.disbaled = true
        this.isShowTBDropdowns = false;
        this.searchval = this.patientform.controls['searchBy'].value;
        let genders: any;
        this.keys = this.patientform.controls['searchcriteria'].value;

        if (this.searchval == "Mobile No") {
            this.MobilenumLetters = this.keys.substring(0, 4);
            this.mobilecode = this.MobileCode.find(x => x.Code == this.MobilenumLetters);
            if (!this.mobilecode) {
                this.patientform.controls['searchcriteria'].setValue(null)
                return this._messageService.add({ severity: 'error', summary: 'Invalid User', detail: "Mobile Number Invalid", life: 3000 });
            }
        }

        if (this.searchval == 'Passport No') {
            var provinceId = this.Province.find(x => x.Id == this.firstletter)?.HmisDbId;
            if (!provinceId) {
                provinceId = 1;
            }
        }
        if (this.searchval == "Pak CNIC" || this.searchval == "Afghan CNIC") {
            this.firstletter = this.keys.substring(0, 1);
            var provinceId: any = 1
            // var provinceId = this.Province.find(x => x.Id == this.firstletter)?.HmisDbId;
            // if (!provinceId) {
            // provinceId = 1;
            // }
            if (this.firstletter == 0) {
                this.patientform.controls['searchcriteria'].setValue(null);
                return this._messageService.add({ severity: 'error', summary: 'Invalid User', detail: "Cnic Number Invalid", life: 3000 });
            }

            let lastLetter = this.keys.substring(14);

            if (lastLetter == 1 || lastLetter == 3 || lastLetter == 5 || lastLetter == 7 || lastLetter == 9) {
                genders = this.SelectGender.find(x => x.Id == "a6bdf8cd-7129-4a96-8670-7455e5b106b6");
            }
            else if (lastLetter == 2 || lastLetter == 4 || lastLetter == 6 || lastLetter == 8) {
                genders = this.SelectGender.find(x => x.Id == "e1e777c3-042b-44fd-ba7a-a26c72fbf37d");
            }
            else if (lastLetter == 0) {
                genders = this.SelectGender.find(x => x.Id == "c38bfccb-33a9-48df-99d7-50cb505d9a88");
            }
        }

        this._PatientsService.getPatientbyCNIC(this.searchval, this.keys).subscribe((res: any) => {
            this.addtionalInformation.reset();
            // console.log("So here we go",res);
            if (res) {
                debugger
                this.searchedPersons = res;
                if (this.searchedPersons.length > 0) {
                    this.searchbyNo = true;
                    this.patientCategory.controls.category.patchValue('Known')
                }
                else {

                    if (this.loginUserDetail.FormType == this.fromTypeConstant.TbForm) {
                        this.isPatientAdviseMedicineInLastVisit();
                    }

                    let cnic = this.patientform.controls['searchcriteria'].value;
                    this.searchval = this.patientform.controls['searchBy'].value;
                    debugger
                    this.formInitialValues.TehsilId = this.loginUserDetail?.TehsilId
                    this.patientform.reset(this.formInitialValues);
                    let data = this.relationData.filter(x => x.Name == RelationConstant.Self);
                    if (data?.length > 0) {
                        this.patientform.controls.RelationProfileId.patchValue(data[0].ProfileId);
                    }
                    // this.setLocations();
                    this.getDivisions(this.loginUserDetail.ProvinceId == null ? 1 : this.loginUserDetail.ProvinceId);
                    this.getDistricts(this.loginUserDetail.DivisionId);
                    this.getTehsil(this.loginUserDetail.DistrictId)
                    this.getUnionCouncil(this.loginUserDetail.TehsilId)

                    this.getAllLocations();

                    if (this.isPatientHistory) {
                        this.getAllHealthFacilities();
                    }
                    this.patientform.controls['searchBy'].setValue(this.searchval);

                    if (this.searchval == "Pak CNIC" || this.searchval == "Afghan CNIC") {

                        // شناختی کارڈ
                        this._messageService.add({ severity: 'info', summary: 'آپ کے درج کئے گئے شناختی کارڈ پر مریض کا ریکارڈ موجود نہیں ہے، برائے مہربانی مریض کے ریکارڈ کا اندراج کریں یا سرچ کی دوسری اپشن  کا استعمال کریں۔', life: 3000 });
                        // this._messageService.add({ severity: 'info', summary: 'No Record Found', detail: "Register New Patient", life: 3000 });
                        this.patientCategory.controls.category.patchValue('Known')

                        this.patientform.controls['Cnic'].setValue(cnic);
                        this.patientform.patchValue({
                            ProvinceId: provinceId
                        });
                        if (this.checkForNullandUndefined(this.loginUserDetail?.TehsilId)) {
                            this.getDivisions(provinceId);
                        }
                        this.patientform.patchValue({
                            GenderProfileId: genders.Id
                        });
                        this.getGenderNames(genders.Id);
                        this.patientform.controls['searchcriteria'].setValue(null);
                        this.index = this.index === 2 ? 0 : this.index + 1;
                    }
                    if (this.searchval == "Passport No") {

                        this._messageService.add({ severity: 'info', summary: 'آپ کے درج کئے گئے پاسپورٹ نمبر پر مریض کا ریکارڈ موجود نہیں ہے، برائے مہربانی مریض  کا شناختی کارڈ نمبر کے ذریعے اندراج کریں یا سرچ کی دوسری اپشن  کا استعمال کریں۔', life: 3000 });
                        // this._messageService.add({ severity: 'info', summary: 'No Record Found', detail: "Register New Patient", life: 3000 });
                        this.patientCategory.controls.category.patchValue('Known')

                        this.patientform.controls['PassportNo'].setValue(cnic);
                        this.patientform.patchValue({
                            ProvinceId: provinceId
                        });
                        if (this.checkForNullandUndefined(this.loginUserDetail?.TehsilId)) {
                            this.getDivisions(provinceId);
                        }
                        this.patientform.controls['searchcriteria'].setValue(null);
                        this.index = this.index === 2 ? 0 : this.index + 1;
                    }
                    if (this.searchval == "Mobile No") {
                        this._messageService.add({ severity: 'info', summary: 'آپ کے درج کئے گئے موبائل نمبر پر مریض کا ریکارڈ موجود نہیں ہے، برائے مہربانی مریض  کا شناختی کارڈ نمبر کے ذریعے اندراج کریں یا سرچ کی دوسری اپشن  کا استعمال کریں۔', life: 3000 });
                        // this.patientform.controls['MobileNo'].setValue(this.patientform.controls['searchcriteria'].value);
                        // this.index = this.index === 2 ? 0 : this.index + 1;
                    }

                    if (this.searchval == "MR No") {
                        this._messageService.add({ severity: 'info', summary: 'آپ کے درج کئے گئے میڈیکل ریکارڈ نمبر پر مریض کا ریکارڈ موجود نہیں ہے، برائے مہربانی مریض  کا شناختی کارڈ نمبر کے ذریعے اندراج کریں یا سرچ کی دوسری اپشن  کا استعمال کریں۔', life: 3000 });
                    }


                    this.closeSearchDialog();
                }

            }
        });
    }

    getHealthFacility($event: any) {
        var name = this.HealthfacilityData.filter(x => x.Id == $event.value)[0]?.Name
        if (name == HealthFacilityConstant.OtherHealthFacility) {
            this.isOtherHealthFacility = true;
        } else {
            this.patientform.controls.OtherHealthFacility.reset();
            this.isOtherHealthFacility = false;
        }

    }
    getAllLocations() {

        if (!this._localService.getValue('alllocations')) {
            this._commonService.getAllLocations().subscribe((data: any) => {

                this._localService.setValue('alllocations', data);

                this.allLocations = data;

                // remove ICU/CCU/HDU from IPD Department
                this.allLocations.HfDepartmentSectionDropdown = this.filterIPDSections(this.allLocations?.HfDepartmentSectionDropdown);

                this.provinceData = data.ProvinceDropdown;
                this.tehsilsData = data.TehsilDropdown;
                this.HealthfacilityData = data.HealthFacilityDropdown

                if (this.selectedSection?.Name == SectionConstant.EyeBlindnessOPD) {

                    this.HealthfacilityData = this.HealthfacilityData.filter(x => x.HfTypeCode == '011' || x.HfTypeCode == '012' || x.HfTypeCode == '016' || x.HfTypeCode == '061' || x.HfTypeCode == '043' || x.Name == HealthFacilityConstant.OtherHealthFacility)
                }


                if (this.loginUserDetail.HealthFacilityId)
                    this.getdepartments(this.loginUserDetail.HealthFacilityId);
                // this.departmentData = data.HfDepartmentDropdown;
                else
                    this.getdepartments();


                // if (!this.checkForNullandUndefined(this.loginUserDetail?.TehsilId)) {
                //     this.patientform.controls.TehsilId.patchValue(this.loginUserDetail.TehsilId);
                //     this.setLocations();
                // }

                this.getDivisions(this.loginUserDetail.ProvinceId);
                this.getDistricts(this.loginUserDetail.DivisionId);
                this.getTehsil(this.loginUserDetail.DistrictId)
                this.getUnionCouncil(this.loginUserDetail.TehsilId)
            });
        }
        else {
            this.allLocations = this._localService.getValue('alllocations');
            // remove ICU/CCU/HDU from IPD Department
            this.allLocations.HfDepartmentSectionDropdown = this.filterIPDSections(this.allLocations?.HfDepartmentSectionDropdown);

            this.provinceData = this.allLocations.ProvinceDropdown;
            this.getDivisions(this.loginUserDetail.ProvinceId);
            this.getDistricts(this.loginUserDetail.DivisionId);
            this.getTehsil(this.loginUserDetail.DistrictId)
            this.getUnionCouncil(this.loginUserDetail.TehsilId)
            // this.tehsilsData = this.allLocations.TehsilDropdown;
            this.HealthfacilityData = this.allLocations.HealthFacilityDropdown

            if (this.isPatientHistory) {
                this.HealthfacilityData = this.HealthfacilityData.filter(x => x.HfTypeCode == HealthfacilityTypeConstant.Private && x.Id != this.loginUserDetail.HealthFacilityId)
            }


            if (this.loginUserDetail.HealthFacilityId)
                this.getdepartments(this.loginUserDetail.HealthFacilityId);
            else
                this.getdepartments();
        }
    }

    getDivisions(provinceId?: number) {

        if (!provinceId)
            provinceId = this.patientform.controls['ProvinceId'].value || 0;
        else
            this.patientform.controls['ProvinceId'].setValue(provinceId as any)
        this.divisionData = [];
        this.districts = [];
        this.tehsilsData = []

        if (provinceId) {
            this.divisionData = this.allLocations?.DivisionDropdown.filter((item: any) => item.ParentId === provinceId);
            // this.tehsilsData = [];
        }
    }
    getDistricts(divisionId?: number) {
        if (!divisionId)
            divisionId = this.patientform.controls['DivisionId'].value || 0;
        else
            this.patientform.controls['DivisionId'].setValue(divisionId as any)
        this.districts = [];
        this.tehsilsData = []

        if (divisionId)
            this.districts = this.allLocations?.DistrictDropdown.filter((item: any) => item.ParentId === divisionId);
        //
        this.ucData = [];
    }
    getTehsil(districtId?: number) {


        if (!districtId)
            districtId = this.patientform.controls['DistrictId'].value || 0;
        else
            this.patientform.controls['DistrictId'].setValue(districtId as any)
        this.tehsilsData = [];

        if (districtId)
            this.tehsilsData = this.allLocations?.TehsilDropdown?.filter((item: any) => item.ParentId === districtId);
        // else
        //     this.tehsilsData = this.allLocations?.TehsilDropdown;
        this.ucData = [];

    }
    getUnionCouncil(tehsilId?: any) {

        if (!tehsilId)
            tehsilId = this.patientform.controls['TehsilId'].value || 0;
        else
            this.patientform.controls['TehsilId'].setValue(tehsilId as any)

        this.ucData = this.allLocations?.UCDropdown.filter((item: any) => item.ParentId === tehsilId);
    }
    filterIPDSections(sections: any) {
        let filterdSections = sections.filter((item: any) =>
            item.Name !== SectionConstant.CCU
            && item.Name !== SectionConstant.HDU
            && item.Name !== SectionConstant.ICU
        );
        return filterdSections;
    }

    getHealthFacilities() {
        this.HealthfacilityData = this.allLocations?.HealthFacilityDropdown;
    }

    getAllHealthFacilities(): void {
        if (!this._localService.getValue('dropdownAllHealthFacilities')) {
            this._healthFacilityService.getAllForConsignment().subscribe((data: any) => {
                if (data) {
                    this._localService.setValue('dropdownAllHealthFacilities', data);
                    this.HealthfacilityData = data

                    if (this.isPatientHistory) {
                        this.HealthfacilityData = this.HealthfacilityData.filter(x => x.HfTypeCode == HealthfacilityTypeConstant.Private && x.Id != this.loginUserDetail.HealthFacilityId)
                    }
                }
            })
        }
        else {
            this.HealthfacilityData = this._localService.getValue('dropdownAllHealthFacilities');
            if (this.isPatientHistory) {
                this.HealthfacilityData = this.HealthfacilityData.filter(x => x.HfTypeCode == HealthfacilityTypeConstant.Private && x.Id != this.loginUserDetail.HealthFacilityId)
            }
        }
    }


    setLocations() {

        let tehsilId = this.patientform.controls['TehsilId'].value || 0;
        let tehsil = this.allLocations?.TehsilDropdown?.filter((item: any) => item.Id === tehsilId);
        this.districts = this.allLocations?.DistrictDropdown?.filter((item: any) => item.Id === tehsil[0].ParentId);
        let districtId = this.districts?.map((obj: any) => obj.Id);
        if (districtId) {
            this.patientform.controls['DistrictId'].setValue(districtId[0]);
        }
        // get division
        let districtsId = this.patientform.controls['DistrictId'].value || 0;
        let districts = this.allLocations?.DistrictDropdown?.filter((item: any) => item.Id === districtsId);
        this.divisionData = this.allLocations?.DivisionDropdown?.filter((item: any) => item.Id === districts[0].ParentId);
        let divisonId = this.divisionData?.map((obj: any) => obj.Id);
        if (divisonId) {
            this.patientform.controls['DivisionId'].setValue(divisonId[0]);
        }
        // get province
        let divisonsId = this.patientform.controls['DivisionId'].value || 0;
        let divisions = this.allLocations?.DivisionDropdown?.filter((item: any) => item.Id == divisonsId);
        let provinceData = this.allLocations?.ProvinceDropdown?.filter((item: any) => item.Id === divisions[0].ParentId);
        let provinceId = provinceData?.map((obj: any) => obj.Id);
        if (provinceId) {
            this.patientform.controls['ProvinceId'].setValue(provinceId[0]);
        }
    }
    getGender(): void {
        if (!this._localService.getValue('dropdownGender')) {
            this._ProfileService.getProfileByProfileType(this.gender).subscribe((data: any) => {

                if (data) {
                    this._localService.setValue('dropdownGender', data);
                    this.genderData = data
                }
            })
        }
        else {
            this.genderData = this._localService.getValue('dropdownGender');
        }
    }
    getRelationShip(): void {


        if (!this._localService.getValue('dropdownRelationShip')) {
            this._ProfileService.getProfileByProfileType(this.relation).subscribe((data: any) => {
                if (data) {

                    this._localService.setValue('dropdownRelationShip', data);
                    this.relationData = data
                    this.getPatientData();
                    this.setUpMortuaryForm();
                    // console.log(data);
                }
            })
        }
        else {
            this.relationData = this._localService.getValue('dropdownRelationShip');
            this.getPatientData();
            this.setUpMortuaryForm();
        }
    }
    getdepartments(healthFacilityId?: any) {
        if (healthFacilityId)
            this.departmentData = this.allLocations?.HfDepartmentDropdown.filter((item: any) => item.ParentId === healthFacilityId);
        else
            this.departmentData = this.allLocations?.HfDepartmentDropdown;

        this.sections = [];

        if (this.userDepartmentId) {
            this.departmentData.filter((item: any) => item.Id === this.userDepartmentId);
            this.patientform.controls["DepartmentLookupId"].patchValue(this.userDepartmentId);
            this.getSectionsServices(this.userDepartmentId);
        }
    }

    getSectionsServices(Id: any) {

        // if (dd != null && dd.selectedOption.Name == DepartmentConstant.IPD && !this.isFromPMIS && !this.isPatientHistory) {
        //     this.showIfIPD = true;
        //     this.showIfER = false;
        //     // this.checkSscValidation();
        // } else if(dd != null && dd.selectedOption.Name == DepartmentConstant.ERD && !this.isFromPMIS && !this.isPatientHistory) {
        //     this.showIfIPD = false;
        //     this.showIfER = true;
        // }
        // else {
        //     this.showIfIPD = false;
        //     this.showIfER = false;
        //     // this.checkSscValidation();
        // }

        let depId = Id.value
        if (this.userDepartmentId)
            depId = this.userDepartmentId;
        let department: any

        department = this.departmentData.find(x => x.LookupId == depId);

        this.showIfER = false;
        this.showIfIPD = false;

        if (!this.isFromPMIS && !this.isPatientHistory) {
            if (department.Name == DepartmentConstant.IPD)
                this.showIfIPD = true;

            if (department.Name == DepartmentConstant.ERD)
                this.showIfER = true;
        }

        this.getDepartmentName(department.LookupId);

        this.sections = [];

        if (this.userDepartmentId && this.userSectionId) {

            this.sections = this.allLocations?.HfDepartmentSectionDropdown.filter((item: any) => item.LookupId === this.userSectionId && item.ParentId === department.Id);
            this.patientform.controls["SectionLookupId"].patchValue(this.userSectionId);
            this.getServiceName(this.userSectionId);


        }
        else {
            //update work for Localstorage
            // this.sections = this.allLocations?.HfDepartmentSectionDropdown.filter((item: any) => item.ParentId === department.Id && item.ParentLookupId === null);
            this.sections = this.allLocations?.HfDepartmentSectionDropdown.filter((item: any) => item.ParentId === department.Id);
        }




        // console.log(this.userSectionId);
    }

    getAllDoctorList() {
        if (this.isFromPMIS) {
            let role = this.roleConstant.Doctor;
            let healthFacilityId = this.hfId;
            let departmentId = this.patientform.controls['DepartmentLookupId'].value || 0;
            let sectionId = this.patientform.controls['SectionLookupId'].value || 0;

            if (!this._localService.getValue('allPmisDoctors')) {
                this._UserService.getAllDoctorList(role, healthFacilityId, departmentId, sectionId).subscribe((data: any) => {
                    if (data) {
                        this._localService.setValue('allPmisDoctors', data);
                        this.doctorList = data;
                        // if(this.doctorList.length>0)
                        //     this.patientform.get('Doctor')?.addValidators(Validators.required);
                    }
                })
            }
            else {
                this.doctorList = this._localService.getValue('allPmisDoctors');
            }
        }
    }

    getAllBedList() {
        // In this metod we are checking which Speciality has been selected

        // These are all the parameters that we have to pass to the getAllBeds service
        let HealthFacilityId = this.hfId
        let DepartmentLookupId = this.patientform.controls['DepartmentLookupId'].value
        let SectionLookupId = this.patientform.controls['SectionLookupId'].value

        let department = this.allLocations.HfDepartmentDropdown.find((x: any) => x.LookupId == DepartmentLookupId);
        if (department?.Name == DepartmentConstant.IPD) {
            this._PatientsService.getAllBeds(HealthFacilityId, DepartmentLookupId, SectionLookupId).subscribe((data: any) => {
                if (data.length != 0) {
                    this.bedList = data
                } else {
                    this.noBedsAvailableDialog = true
                    this.AlertMessage = "No Beds Available In This Speciality"
                }
            })
        }
    }

    ageCalculator() {
        debugger
        if (this.UserLevelFilterWidgetComponent.isValidDate(this.patientform.controls['Dob'].value)) {
            let convertAge = this.patientform.controls['Dob'].value || new Date();
            if (convertAge == '') {
                this.patientform.controls['Age'].setValue(0);
            }
            this.calculatedAge = this.calculateAge(convertAge);
            var year = this.calculatedAge.split(" ", 1);
            year = Number(year)
            if (year >= 0 && year <= 110) {
                if (this.tempDate['year'] > 0) {
                    this.patientform.controls['Age'].setValue(year);
                } else if (this.tempDate['month'] > 0 && this.tempDate['year'] == 0) {
                    this.patientform.controls['Age'].setValue(this.tempDate['month']);
                } else if (this.tempDate['day'] >= 0 && this.tempDate['month'] == 0 && this.tempDate['year'] == 0) {
                    this.patientform.controls['Age'].setValue(this.tempDate['day'] == 0 ? 1 : this.tempDate['day']);
                }
            }
        } else if (this.patientform.controls['Dob'].value?.toString()[0] != '0') {
            this.patientform.controls['Dob'].patchValue('')
            this.patientform.controls['Age'].patchValue(0)
            this.tempDate = {}
            return this._messageService.add({ severity: 'info', summary: 'Invalid DOB', detail: "Enter valid date of birth", life: 3000 });
        } else {
            let age = this.calculateAge(this.patientform.controls['Dob'].value)
            let year: any = age.split(" ", 1);
            year = Number(year)
            if (year < 0 || year > 110) {
                this.patientform.controls['Dob'].patchValue('')
                this.patientform.controls['Age'].patchValue(0)
                this.tempDate = {}
                return this._messageService.add({ severity: 'info', summary: 'Invalid DOB', detail: "Enter valid date of birth", life: 3000 });
            }
        }
    }
    calculateAge(dob: any) {

        var ctrldob = dob == '' ? new Date() : new Date(dob);

        var ctrldoa = new Date(Date.now());

        var diff = new Date(ctrldoa.getTime() - ctrldob.getTime());

        this.tempDate = {}
        this.tempDate['year'] = (diff.getUTCFullYear() - 1970);
        this.tempDate['month'] = diff.getUTCMonth();
        this.tempDate['day'] = (diff.getUTCDate() - 1);

        if (this.tempDate['day'] >= 0 && this.tempDate['month'] == 0 && this.tempDate['year'] == 0) {
            this.patientform.controls['Age'].setValue(this.tempDate['day'] == 0 ? 1 : this.tempDate['day']);
        }
        return (diff.getUTCFullYear() - 1970) + ' Y ' + diff.getUTCMonth() + ' M ' + (diff.getUTCDate() - 1) + ' D ';


    }
  
    public rjxscharacter(e: any) {
        debugger
        try {
            
            let k
            if (/^[a-zA-Z ]*$/.test(e.key)) {
                // return true;
            }
            // else if (/^[.]*$/.test(e.key)) {
            //     // return true;
            // }
            else {
                e.preventDefault();
                // return false;
            }
        } catch (e) {
        }
    }


    getLoginUserRoleForTb() {
        this.loginUserDetail.UserRoleList.forEach((element: any) => {
            if (element.Name == this.roleConstant.DRTBDoctor)
                this.role = this.roleConstant.DRTBDoctor
        });
    }

    public isPatientAdviseMedicineInLastVisit() {


        // if (!this.isPatientHistory) {

        this.getTbPatientTypes();
        this.getTreatmentLengths();
        this.getLengthOfInterruption();
        this.isShowtbPatientDetails = true;
        // }

        // this._PatientsService.isPatientAdviseMedicineInLastVisit(this.patientform.controls.Cnic.value, DepartmentConstant.OpdId, SectionReceiptConstant.TbOpd).subscribe((res) => {
        //     if (res) {
        //         this.getTbPatientTypes();
        //         this.getTreatmentLengths();
        //         this.getLengthOfInterruption();
        //         this.isShowtbPatientDetails = true;
        //     } else {
        //         this.isShowtbPatientDetails = false;
        //         this.tbPatientDetails.reset();
        //     }
        // })
    }

    getTbPatientTypes() {
        if (!this._localService.getValue('tbPatientTypes')) {
            this._ProfileService.getProfileByProfileType(this.shortNamePatientTypes).subscribe((res) => {

                if (res) {

                    this._localService.setValue('tbPatientTypes', res);

                    this.tbPatientTypes = res

                }

                // console.log('11111111111111111', this.tbPatientTypes);

            })
        } else {
            this.tbPatientTypes = this._localService.getValue('tbPatientTypes')
        }
    }

    getTreatmentLengths() {
        if (!this._localService.getValue('treatmentLengths')) {
            this._ProfileService.getProfileByProfileType(this.shortNameTreatmentLengths).subscribe((res) => {
                if (res) {
                    this._localService.setValue('treatmentLengths', res);
                    this.treatmentLengths = res
                }
                // console.log('11111111111111111', this.tbPatientTypes);
            })
        } else {
            this.treatmentLengths = this._localService.getValue('treatmentLengths')
        }

        // this._ProfileService.getProfileByProfileType(this.shortNameTreatmentLengths).subscribe((res) => {
        //     this.treatmentLengths = res;
        //     // console.log('2222222222222222222', this.treatmentLengths);
        // })
    }

    getLengthOfInterruption() {
        if (!this._localService.getValue('interruptionLengths')) {
            this._ProfileService.getProfileByProfileType(this.shortNameInterruptionLengths).subscribe((res) => {
                if (res) {
                    this._localService.setValue('interruptionLengths', res);
                    this.interruptionLengths = res
                }
                // console.log('11111111111111111', this.tbPatientTypes);
            })
        } else {
            this.interruptionLengths = this._localService.getValue('interruptionLengths')
        }

        // this._ProfileService.getProfileByProfileType(this.shortNameInterruptionLengths).subscribe((res) => {
        //     this.interruptionLengths = res;
        //     // console.log('3333333333333', this.interruptionLengths);
        // })
    }


    getServiceName(data: any) {


        // show if IPD
        if (this.showIfIPD)
            this.getAllBedList();

        // show if PMIS
        if (this.isFromPMIS)
            this.getAllDoctorList();

        if (this.userSectionId) {
            this.selectedSection = this.sections.find(x => x.LookupId == this.userSectionId)
            this.selectedSectionSlip = this.sections.find(x => x.LookupId == this.userSectionId)
        } else {
            this.selectedSection = this.sections.find(x => x.LookupId == data.value)
            this.selectedSectionSlip = this.sections.find(x => x.LookupId == data.value)
        }



        if (this.selectedSection?.LookupId == SectionReceiptConstant.TbOpd) {
            if (!this.patientform.controls.IsFromCallCenter.value) {
                if (!this.checkForNullandUndefined(this.patientform.controls.Cnic.value) && this.patientform.controls.Cnic.value != '') {
                    this.isPatientAdviseMedicineInLastVisit();
                }
            }
        } else {
            this.isShowtbPatientDetails = false;
            this.tbPatientDetails.reset();
        }



        if (this.selectedSection != null) {
            if (this.selectedSection?.Name == SectionConstant.EyeBlindnessOPD) {
                this.isShowEyeBlindnessFields = true
                this.patientform.controls.isEyeBlindness.patchValue(true);

                if (this.selectedSection?.Name == SectionConstant.EyeBlindnessOPD) {

                    this.HealthfacilityData = this.HealthfacilityData.filter(x => x.HfTypeCode == '011' || x.HfTypeCode == '012' || x.HfTypeCode == '016' || x.HfTypeCode == '061' || x.HfTypeCode == '043' || x.Name == HealthFacilityConstant.OtherHealthFacility)
                }

            } else {
                this.isShowEyeBlindnessFields = false
                this.patientform.controls.isEyeBlindness.patchValue(false);
            }
        } else {
            this.isShowEyeBlindnessFields = false
            this.patientform.controls.isEyeBlindness.patchValue(false);
        }


    }
    getDepartmentName(depId: any) {

        if (depId == DepartmentConstant.IPDId && !this.isFromPMIS) {
            this.patientform.controls['BedNo'].setValidators(Validators.required);
            this.patientform.controls['BedNo'].updateValueAndValidity();
        } else {
            this.patientform.controls['BedNo'].patchValue(null);
            this.patientform.controls['BedNo'].removeValidators(Validators.required);
            this.patientform.controls['BedNo'].updateValueAndValidity();
        }
        this.selectedDepartment = this.departmentData.find(x => x.LookupId == depId)
        this.selectedDepartmentSlip = this.departmentData.find(x => x.LookupId == depId)
    }
    getGenderNames(data: any) {
        this.selectedGender = this.genderData.find(x => x.ProfileId == data)
        this.selectedGenderSlip = this.genderData.find(x => x.ProfileId == data)
    }
    printSlip() {
        this.printJSSlip();
        // this.openPDF();
    }
    printJSSlip() {
        // convert qr code canvas to png img
        var canvas = document.getElementsByClassName('qrbox')[0].getElementsByTagName('canvas')[0];
        var img = document.createElement('img');
        img.src = canvas.toDataURL("image/png");
        img.width = 150;
        img.height = 150;
        const el = document.getElementById("qrcode");
        while (el?.firstChild) {
            el.removeChild(el.firstChild);
        }
        document.getElementById('qrcode')?.appendChild(img);

        // const css = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">
        const css = `<link rel="stylesheet" href="https://phis.pshealthpunjab.gov.pk/assets/printstyles/boostrapJs.min.css">
        <link rel="stylesheet" href="assets/pdf.css"
        integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
        `;
        const printContents = document.getElementById('slip');
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
            window.onfocus = function () { setTimeout(function () { popupWindow.close(); }, 1000); }
        }
        setTimeout(function () { window.location.reload(); }, 2000);
    }

    PrintUrduSlip() {
        this.printJSSSlip()
    }
    printJSSSlip() {
        // convert qr code canvas to png img
        var canvas = document.getElementsByClassName('qrcode')[0].getElementsByTagName('canvas')[0];
        var img = document.createElement('img');
        img.src = canvas.toDataURL("image/png");
        img.width = 150;
        img.height = 150;
        document.getElementById('urduqrcode')?.appendChild(img);
        document.getElementsByClassName('urduqrbox')[0].remove();

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
            window.onfocus = function () { setTimeout(function () { popupWindow.close(); }, 1000); }
        }
        setTimeout(function () { window.location.reload(); }, 2000);
    }

    callNext() {
        if (this.TokenList.length > 0 && this.TokenList[this.selectedtokenIndex]) {
            var abc = this.TokenList[this.selectedtokenIndex];
            this.selectedtokenIndex += 1;
            this.patientform.controls['TokenNumberDisplay'].setValue(abc.TokenNo)
        }
    }
    EnterMobileNum(flag: boolean = false) {

        if (flag) {
            this.Mobilekeys = this.patientSourceInfo.controls['ContactNo'].value;
            this.MobilenumLetters = this.Mobilekeys.substring(0, 4);
            this.mobilecode = this.MobileCode.find(x => x.Code == this.MobilenumLetters);
            if (!this.mobilecode) {
                this._messageService.add({ severity: 'error', summary: 'Invalid Number', detail: "Mobile Number Invalid", life: 3000 });
                this.patientSourceInfo.controls['ContactNo'].setValue(null)
            }
        } else {
            this.Mobilekeys = this.patientform.controls['MobileNo'].value;
            this.MobilenumLetters = this.Mobilekeys.substring(0, 4);
            this.mobilecode = this.MobileCode.find(x => x.Code == this.MobilenumLetters);
            if (!this.mobilecode) {
                this._messageService.add({ severity: 'error', summary: 'Invalid Number', detail: "Mobile Number Invalid", life: 3000 });
                this.patientform.controls['MobileNo'].setValue(null)
            }
        }
    }
    EnterCnicNum() {

        // console.log('--------------------------------------------------------')
        let genders: any;
        this.CnicKeys = this.patientform.controls['Cnic'].value;
        this.firstletter = this.CnicKeys.substring(0, 1);
        let pro = this.Province.find(x => x.Id == this.firstletter);
        if (this.firstletter == 0 || this.firstletter == 9) {
            this.patientform.controls['Cnic'].setValue(null);
            return this._messageService.add({ severity: 'error', summary: 'Invalid User', detail: "Cnic Number Invalid", life: 3000 });
        }
        this.provinceName = pro.HmisDbId;

        let lastLetter = this.CnicKeys.substring(14);
        if (lastLetter == 1 || lastLetter == 3 || lastLetter == 5 || lastLetter == 7 || lastLetter == 9) {
            genders = this.SelectGender.find(x => x.Id == "a6bdf8cd-7129-4a96-8670-7455e5b106b6");
        }
        else if (lastLetter == 2 || lastLetter == 4 || lastLetter == 6 || lastLetter == 8) {
            genders = this.SelectGender.find(x => x.Id == "e1e777c3-042b-44fd-ba7a-a26c72fbf37d");
        }
        else if (lastLetter == 0) {
            genders = this.SelectGender.find(x => x.Id == "c38bfccb-33a9-48df-99d7-50cb505d9a88");
        }


        // this.patientCategory.controls.category.patchValue('Known')
        this._messageService.add({ severity: 'info', summary: 'No Record Found', detail: "Register New Patient", life: 3000 });
        this.patientform.patchValue({
            ProvinceId: this.provinceName
        });
        this.getDivisions(this.provinceName);
        this.patientform.patchValue({
            GenderProfileId: genders.Id
        });
        this.getGenderNames(genders.Id);
    }
    FindRelation(relationobj: any) {

        if (relationobj.value == 'a28c4864-723e-4cd2-a880-f086eab1da93') {
            this.patientform.controls['IsSelf'].setValue(true)
        }
        else {
            this.patientform.controls['IsSelf'].setValue(false)
        }


        let val: any = this.relationData.filter(x => x.ProfileId === relationobj.value)[0];
        let genders: any = null;
        if (val.Name === 'Mother' || val.Name === 'Sister' || val.Name === 'Wife' || val.Name === 'Daughter') {
            genders = this.SelectGender.find(x => x.Name == 'Female');
            this.patientform.patchValue({
                GenderProfileId: genders.Id
            });
            this.getGenderNames(genders.Id);

        } else if (val.Name === 'Father' || val.Name === 'Brother' || val.Name === 'Husband' || val.Name === 'Son') {
            genders = this.SelectGender.find(x => x.Name == 'Male');
            this.patientform.patchValue({
                GenderProfileId: genders.Id
            });
            this.getGenderNames(genders.Id);

        } else {
            genders = this.SelectGender.find(x => x.Name == 'Male');
            this.patientform.patchValue({
                GenderProfileId: genders.Id
            });
            this.getGenderNames(genders.Id);
        }
    }
    public serarchByEvent() {
        this.searchval = this.patientform.controls['searchBy'].value;
        if (this.searchval == 'Mobile No') {
            this.searchByMask = '9999-9999999';
            this.searchByMaskPlaceholder = '03xx-xxxxxxx';
        } else if (this.searchval == 'MR No') {
            this.searchByMask = 'MRN-99999-999-999999999';
            this.searchByMaskPlaceholder = 'MRN-xxxxx-xxx-xxxxxxxxx';
        }
        else if (this.searchval == 'Afghan CNIC') {
            this.searchByMask = 'aa-99999999999';
            this.searchByMaskPlaceholder = 'aa-xxxxxxxxxxx';
        } else if (this.searchval == 'Passport No') {
            this.searchByMask = 'aa9999999'
            this.searchByMaskPlaceholder = 'aaxxxxxxx'
        }
        else if (this.searchval == 'Pak CNIC') {
            this.searchByMask = '99999-9999999-9';
            this.searchByMaskPlaceholder = 'xxxxx-xxxxxxxx-x';
        }
    }

    // dobValidator(control: FormControl): ValidationErrors | null {

    //     if (control.value) {
    //         const date = new Date(control.value);
    //         const today = new Date();
    //         const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 110));
    //         if (today < date || date < minDate) {
    //             return { 'invalidDate': true }
    //         }
    //     }
    //     return null;
    // }
    get relationFormControl() {
        return this.relationForm.controls;
    }

    openRelationDialog() {
        this.submittedDialog = false;
        this.relationDialog = true;
        this.relationForm = new FormGroup({
            Name: new FormControl('', [Validators.required]),
            ShortName: new FormControl('', [Validators.required]),
            ProfileTypeId: new FormControl(''),
            IsActive: new FormControl(true),
        });
    }

    hideRelationDialog() {
        this.relationDialog = false;
        this.submittedDialog = false;
    }
    rjxsnumber(e: any) {
        try {

            let k;
            if (/^[0-9]*$/.test(e.key)) {
                // return true;
            } else {
                e.preventDefault();
                // return false;
            }
        } catch (e) {
        }
    }

    AgeToDOB() {

        this.ageValue = this.patientform.controls['Age'].value
        if (this.ageValue == '') {
            this.patientform.controls['Dob'].setValue('');
        } // example age
        this.DOBValue = this.calculateDOBFromAge(this.ageValue);
        this.calculateAge(this.DOBValue);
        if (this.UserLevelFilterWidgetComponent.isValidDate(this.DOBValue)) {
            this.patientform.controls['Dob'].setValue(this.DOBValue);

        } else {
            this.patientform.controls['Dob'].patchValue('');
            this.patientform.controls['Age'].patchValue(0);
            return this._messageService.add({ severity: 'info', summary: 'Invalid Age', detail: "Enter valid age", life: 3000 });
        }

        // console.log(this.DOBValue.toDateString());
        // this.patientform.patchValue({
        //     Dob:this.DOBValue
        // });
        //
    }

    calculateDOBFromAge(age: number): Date {
        debugger

        const currentDate = new Date();
        const currentYear = new Date().getFullYear();
        const birthYear = currentYear - age;
        this.DOBValue = new Date(birthYear, currentDate.getMonth(), currentDate.getDate());
        const formattedDOB = this.DOBValue.toISOString().split('T')[0];
        return formattedDOB;
        // Assuming January 1st as birthdate
    }

    getSscNotEligibleReasons(): void {

        // this._ProfileService.getProfileByProfileType(ProfileTypeConstant.SSCNotEligibleReasons).subscribe((res) => {
        //     this.sscNotEligibleReasons = res;
        // });
        // this.sscNotEligibleReasons = [{"Name":"reason1","ProfileId":"69ab64a2-a6d1-4b05-99f5-e525880588fd"},
        // {"Name":"reason2","ProfileId":"69ab64a2-a6d1-4b05-99f5-e525880588fd"}];


        if (!this._localService.getValue('dropdownSsc')) {
            this._ProfileService.getProfileByProfileType(ProfileTypeConstant.SSCNotEligibleReasons).subscribe((data: any) => {

                if (data) {
                    this._localService.setValue('dropdownSsc', data);
                    this.sscNotEligibleReasons = data
                }
            })
        }
        else {
            this.sscNotEligibleReasons = this._localService.getValue('dropdownSsc');

        }



    }

    checkIfDepartmentDisable() {
        if (this.userDepartmentId) {
            return true;
        } else {
            return false;
        }
    }


    checkRoomNoForSpeciality() {
        this._PatientsService.checkRoomNoForSpeciality(this.loginUserDetail.HealthFacilityId).subscribe((res: any) => {
            if (res != '') {
                this.restrictUserDialog = true;
                this.restrictUserMessage = res;
            } else {
                this.restrictUserDialog = false;
                this.restrictUserMessage = ''
            }
        })
    }

    // Validation function when we select if patient is of IPD or NOT
    // checkSscValidation() {

    //     if (!this.isFromPMIS) {
    //         if (this.showIfIPD) {

    //             this.patientform.controls['ReasonIfNotEligibleForSsc'].setValue(null);

    //             this.patientform.controls["IsEligibleForSsc"].setValidators(Validators.required);
    //             this.patientform.controls["IsEligibleForSsc"].updateValueAndValidity();

    //             if (!this.patientform.controls['IsEligibleForSsc'].value) {
    //                 this.patientform.controls["ReasonIfNotEligibleForSsc"].setValidators(Validators.required);
    //                 this.patientform.controls["ReasonIfNotEligibleForSsc"].updateValueAndValidity();

    //                 this.patientform.controls["SscNumber"].setValidators(null);
    //                 this.patientform.controls["SscNumber"].updateValueAndValidity();
    //             }
    //             else {
    //                 this.patientform.controls["ReasonIfNotEligibleForSsc"].setValidators(null);
    //                 this.patientform.controls["ReasonIfNotEligibleForSsc"].updateValueAndValidity();

    //                 this.patientform.controls["SscNumber"].setValidators(Validators.required);
    //                 this.patientform.controls["SscNumber"].updateValueAndValidity();
    //             }

    //         }
    //         else {
    //             this.patientform.controls["IsEligibleForSsc"].setValidators(null);
    //             this.patientform.controls["IsEligibleForSsc"].updateValueAndValidity();

    //             this.patientform.controls["ReasonIfNotEligibleForSsc"].setValidators(null);
    //             this.patientform.controls["ReasonIfNotEligibleForSsc"].updateValueAndValidity();

    //             this.patientform.controls["SscNumber"].setValidators(null);
    //             this.patientform.controls["SscNumber"].updateValueAndValidity();

    //         }
    //     }
    // }
    hideSideMenu() {
        this.layoutService.hideSideMenuDesktop();
    }

    //#endregion


    ngOnDestroy() {
        this._PatientsService.setTbPatientContactData(null);
    }
}

