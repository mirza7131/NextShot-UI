import { ChangeDetectorRef, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { ApiService } from 'src/Services/api.service';
//import { Building, BuildingDimension, FeeStructure, Finance, InstituteIncome, PrincipalQualification } from 'src/app/modules/application/application.component';

@Component({
  selector: 'app-details',
  standalone: false,
  // imports: [],
  providers: [MessageService, ConfirmationService],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})


export class DetailsComponent {
  isDropdownDisabled: boolean = true; 
  application: any = {};
  public user : any = {};
  PrincipalQualifications!: any[];
  PrincipalExperiences !: any[];
  public Institute: any = {};





  @ViewChild('ownershipProof') ownershipProof: FileUpload;
  @ViewChild('principalqualificationFile') principalqualificationFile: FileUpload;
  @ViewChild('experiencefile') experiencefile: FileUpload;

  // 2nd Tab Files
  @ViewChild('uniaffiliationCertificate') uniaffiliationCertificate: FileUpload;
  @ViewChild('legalRegistration') legalRegistration: FileUpload;
  @ViewChild('moucertificate') moucertificate: FileUpload;
  @ViewChild('pastaffliation') pastaffliation: FileUpload;

  // 3rd Tab Files
  @ViewChild('auditreport') auditreport: FileUpload;
  @ViewChild('bankstatement') bankstatement: FileUpload;
  @ViewChild('incomeStatement') incomeStatement: FileUpload;

  // 4th Tab Files
  @ViewChild('fileUpload') fileUpload: FileUpload;
  @ViewChild('map') map: FileUpload;

  // 5th Tab Files
  @ViewChild('ibccAffliation') ibccAffliation: FileUpload;
  @ViewChild('hecrecgonization') hecrecgonization: FileUpload;


  // 7th Tab Files
  @ViewChild('evaluationReport') evaluationReport: FileUpload;

  // 9th Tab Files
  @ViewChildren('propsal') propsal: QueryList<FileUpload>;
  @ViewChildren('risk') risk: QueryList<FileUpload>;

  
  routeItems: MenuItem[] = [];
  currentStep: number = 0;
  MobileNumber: string = '';

  qualifications: SelectItem[] = [];
  PrincipalRequiredqualifications : SelectItem[] = [];
  PrincipalRequiredqualificationsOriginal : SelectItem[] = [];

  BuildingStatus: SelectItem[] = [];
  Categories: SelectItem[] = [];
  Designations: SelectItem[] = [];
  ScholarshipTypes: SelectItem[] = [];

  selectedPrincipalQualification: any;
  selectedBuildingStatus: any;
  selectedCategory: any;
  selectedDesignation : any;
  selectedInstituteType: any;
  selectedAffliationType: any;
  selectedLegalStatus: any;
  selectedEmployeeQualification : any;
  selectedCourseRequiredQualification: any;
  selectedSchloarshipType: any;

  classrooms!: any[];
  labotries!: any[];
  demonstration!: any[];
  libraries!:any[];
  hostels!:any[];
  emlpoyees!: any[];
  PastAffliations!: any[];
  Incomes!: any[];
  Fees!: any[];
  CoursesCurrentYear!: any[];
  CoursesOldYear!: any[];

  domeshow: boolean = true;
  display: boolean =  false;

  uploadedFiles: any[] = [];
  OwnerShipProofFiles: any[] = [];
  PrincipalQualificationFile: any[] = [];
  ExperienceFiles: any[] = [];
  UniAffliationCertificateFiles:any[]=[];
  LegalRegistrationFiles:any[]=[];
  MOUFiles:any[]=[];
  PastAffliationFiles:any[]=[];
  InstituteCollectiveFiles:any[]=[];
  AuditReportFiles:any[] = [];
  BankStatementFiles:any[]=[];
  FinanceCollectiveFiles:any[]=[];
  IncomeStatementFiles:any[]=[];
  MapFiles:any[]=[];
  IBCCFiles:any[]=[];
  HECFiles:any[]=[];
  CourseCollectiveFiles:any[]=[];
  EvaluationReportFiles:any[]=[];
  PropsolsCollectiveFiles:any[]=[];



  BuildingTypeId: number = 0;
  propertyName: string = '';
  propertyHeading: string = '';
 
  ApplicationSubmitted: Boolean = false;
  
  Course: any = {};
  
  loading = false;

  displayQualification: boolean = false;
  displayExperience : boolean = false;
  displayPastAffliation : boolean = false;
  displayTotalIncome : boolean = false;
  displayFeeStructure: boolean = false;
  displayHostels: boolean = false;
  displayOfferedCourses: boolean = false;
  displayOfferedCoursesOld: boolean = false;
  displayEmployees:boolean = false;

  public InstituteTypes: any = [];
  public AffliationType: any = [];
  public LegalStatuses: any = [];


 
 
  PastAffliation: any = {}
  public shcolarship: any = {};
  public Governance: any = {};
  public PropsalAreas: any = [] = [];
  public Propsal: any = {};
  public ProposalResponse:any={};
  valCheck:any;
  Additionalinfo: any = {};

  
  public grantapp: any = {};


  public grantApplicationId: number = 0;
  public userId: string = '';

  constructor(private messageService: MessageService,private apiService: ApiService,private router: Router,private cdr: ChangeDetectorRef, private route: ActivatedRoute,private confirmationService: ConfirmationService) {}

  ngOnInit(): void
  {

    this.user.token = localStorage.getItem('token');
    this.user.username = localStorage.getItem('username');
    this.user.roles = localStorage.getItem('roles') || '[]';
    this.user.roles = JSON.parse(this.user.roles);
    this.user.email = localStorage.getItem('email');
    this.user.userId = localStorage.getItem('userId');

    this.qualifications = 
    [
      { label: 'Matric', value: { id: 1, name: 'Matric' } },
      { label: 'Intermediate', value: { id: 2, name: 'Intermediate' } },
      { label: 'Graduation', value: { id: 3, name: 'Graduation' } },
      { label: 'Masters', value: { id: 4, name: 'Masters' } },
      { label: 'MBBS', value: { id: 5, name: 'MBBS' } }
    ];

    this.PrincipalRequiredqualifications = 
    [
      { label: 'Matric', value: { id: 1, name: 'Matric' } },
      { label: 'Intermediate', value: { id: 2, name: 'Intermediate' } },
      { label: 'Graduation', value: { id: 3, name: 'Graduation' } },
      { label: 'Masters', value: { id: 4, name: 'Masters' } },
      { label: 'MBBS', value: { id: 5, name: 'MBBS' } }
    ];

    this.PrincipalRequiredqualificationsOriginal = 
    [
      { label: 'Matric', value: { id: 1, name: 'Matric' } },
      { label: 'Intermediate', value: { id: 2, name: 'Intermediate' } },
      { label: 'Graduation', value: { id: 3, name: 'Graduation' } },
      { label: 'Masters', value: { id: 4, name: 'Masters' } },
      { label: 'MBBS', value: { id: 5, name: 'MBBS' } }
    ];

    this.InstituteTypes = 
    [
      { label: 'Nursing', value: { id: 1, name: 'Nursing' } },
      { label: 'Allied Health Professional Institue', value: { id: 2, name: 'Allied Health Professional Institue' } },
      { label: 'Pharmacy Technician Schools', value: { id: 3, name: 'Pharmacy Technician Schools' } },
      { label: 'Any Other', value: { id: 4, name: 'Any Other' } },
    ];

    this.LegalStatuses = 
    [
      { label: 'Sole Proprietor', value: { id: 1, name: 'Sole Proprietor' } },
      { label: 'Company', value: { id: 2, name: 'Company' } },
      { label: 'Not-for-profit', value: { id: 3, name: 'Not-for-profit' } },
      { label: 'Any Other', value: { id: 4, name: 'Any Other' } },
    ];

    this.AffliationType = 
    [
      { label: 'NEB', value: { id: 1, name: 'Affliated With NEB' } },
      { label: 'University', value: { id: 2, name: 'Affliated With University' } },
      { label: 'PMF', value: { id: 3, name: 'Affliated With PMF' } },
      { label: 'Punjab Pharmacy Council', value: { id: 4, name: 'Punjab Pharmacy Council' } }
      
    ];


    this.BuildingStatus = 
    [
      { label: 'Owned', value: { id: 1, name: 'Owned' } },
      { label: 'Rented', value: { id: 2, name: 'Rented' } },
      { label: 'Leased', value: { id: 3, name: 'Leased' } }
    ];

    this.ScholarshipTypes = 
    [
      { label: 'Scholarship', value: { id: 1, name: 'Scholarship' } },
      { label: 'Loan', value: { id: 2, name: 'Loan' } },
      { label: 'Grant', value: { id: 3, name: 'Grant' } },
      { label: 'Other', value: { id: 4, name: 'Other' } }
    ];

    this.ScholarshipTypes = 
    [
      { label: 'Scholarship', value: { id: 1, name: 'Scholarship' } },
      { label: 'Loan', value: { id: 2, name: 'Loan' } },
      { label: 'Grant', value: { id: 3, name: 'Grant' } },
      { label: 'Other', value: { id: 4, name: 'Other' } }
    ];

    this.Categories = [
      { label: 'Dispenser', value: { id: 1, name: 'Dispenser' } },
      { label: 'Medical Lab Technician', value: { id: 2, name: 'Medical Lab Technician' } },
      { label: 'Operation Theater', value: { id: 3, name: 'Operation Theater' } },
      { label: 'Pharmacy Technician', value: { id: 4, name: 'Pharmacy Technician' } }
    ];

    this.Designations = [
      { label: 'Doctor', value: { id: 1, name: 'Doctor' } },
      { label: 'Pharmacist', value: { id: 2, name: 'Pharmacist' } },
      { label: 'Specialist Doctor', value: { id: 3, name: 'Specialist Doctor' } }
    ];



    // Retrieve the route parameters 'grantApplicationId' and 'username'
    this.grantApplicationId = +this.route.snapshot.paramMap.get('appId');
    // this.userId = this.route.snapshot.paramMap.get('userId');

    this.getApplication();
    this.getInstituteDetail();
    this.GetPastAffliation();
    this.getFinance();
    this.GetIncome();
    this.GetFeeStructure();

    this.getBuildingDimension();
    this.getClassrooms();
    this.getLabotries();
    this.getLibraryRooms();
    this.getHostels();
    this.getCourses();
    this.getEmployees();
    this.getScholarship();
    this.getGovernance();
    this.getProposal();
    this.getAdditionalInfo();
  }

  openPDFInNewTab(url: string): void 
  {
    window.open(url, '_blank');
  }



  getApplication()
  {
    debugger
    this.apiService.get('Application', 'GetApplicationDetails', {Id: this.grantApplicationId}).subscribe(response => {
      debugger
      if(response)
      {
        debugger
        this.application = response;
        this.application.Dob = new Date(this.application.Dob);
        this.application.PrincipalAppointmentDate = new Date(this.application.PrincipalAppointmentDate);
        this.grantapp.Remarks = this.application.Remarks;
        this.GetQualifications();
        this.GetExperiences();
      }
    });
  }

  GetQualifications()
  {
    this.apiService.get('Application', 'GetPrincipalQualifications', {AppId: this.grantApplicationId}).subscribe(response => {
      if(response)
      {
        this.PrincipalQualifications = response;
      }
    });
  }

  GetExperiences()
  {
    this.apiService.get('Application', 'GetPrincipalExperiences', {AppId: this.grantApplicationId}).subscribe(response => {
      debugger
      if(response)
      {
        this.PrincipalExperiences = response;
      }
    });
  }


  getInstituteDetail()
  {
    this.apiService.get('Application', 'GetInstituteDetail', {AppId: this.grantApplicationId}).subscribe(response => {
      
      if(response)
      {
        this.Institute = response;

        this.Institute.HospitalAffliationDate   = new Date(this.Institute.HospitalAffliationDate );
        this.Institute.HospitalAffliationExpiry = new Date(this.Institute.HospitalAffliationExpiry);

        this.Institute.EstablishmentYear = new Date(this.Institute.EstablishmentYear);
        this.Institute.AffliationDate = new Date(this.Institute.AffliationDate);
        this.Institute.AffliationExpiry = new Date(this.Institute.AffliationExpiry);
    
        // let qualification = this.qualifications.filter(x=> x.value.name == response.Qualification);
        // this.selectedQualification = qualification[0].value; 

        if(response.InstituteTypeId != null)
        {
          let InstitueType = this.InstituteTypes.filter(x=> x.value.id == response.InstituteTypeId);
          this.selectedInstituteType = InstitueType[0].value; 
        }

        if(response.AffliationTypeId != null)
        {
          let AffliationType = this.AffliationType.filter(x=> x.value.id == response.AffliationTypeId);
          this.selectedAffliationType = AffliationType[0].value; 
        }

        if(response.LegalStatusId != null)
        {
          let LegalStatus = this.LegalStatuses.filter(x=> x.value.id == response.LegalStatusId);
          this.selectedLegalStatus = LegalStatus[0].value; 
        }

        

      }
    });
  }

  GetPastAffliation()
  {
    
    this.apiService.get('Application', 'GetPastAffliation', {AppId: this.grantApplicationId}).subscribe(response => {
      if(response)
      {
        this.PastAffliations = response;
      }
    });
  }

  getFinance()
  {
    this.apiService.get('Application', 'GetFinance', {AppId: this.grantApplicationId}).subscribe(response => {
      
      if(response)
      {
        
      //  this.Finance = response;
      }
    });
  }

  GetIncome()
  {
    this.apiService.get('Application', 'GetIncome', {AppId: this.grantApplicationId}).subscribe(response => {
      if(response)
      {
        this.Incomes = response;
      }
    });
  }

  GetFeeStructure()
  {
    this.apiService.get('Application', 'GetFeeStructure', {AppId: this.grantApplicationId}).subscribe(response => {
      if(response)
      {
        this.Fees = response;
      }
    });
  }

  getBuildingDimension()
  {
    this.apiService.get('Application', 'GetBuildingDimension', {AppId: this.grantApplicationId}).subscribe(response => {
      if(response)
      {
       // this.BuildingDimension = response;
        
        if(response.BuildingStatusId != null)
        {
          let buildingStatus = this.BuildingStatus.filter(x=> x.value.id == response.BuildingStatusId);
          this.selectedBuildingStatus = buildingStatus[0].value; 
        }
      }
    });
  }

  getClassrooms()
  { 
      this.apiService.get('Application', 'GetBuildings', {AppId: this.grantApplicationId, TypeId: 1}).subscribe(response => {
        if(response)
        {
          this.classrooms = response;
        }
      });
  }

  getLabotries()
  {
    this.apiService.get('Application', 'GetBuildings', {AppId: this.grantApplicationId, TypeId: 2}).subscribe(response => {
      if(response)
      {
        this.labotries = response;
      }
    });
  }

  getLibraryRooms()
  {
    this.apiService.get('Application', 'GetBuildings', {AppId: this.grantApplicationId, TypeId: 4}).subscribe(response => {
      if(response)
      {
        this.libraries = response;
      }
    });
  }

  getHostels()
  { 
    this.apiService.get('Application', 'GetBuildings', {AppId: this.grantApplicationId, TypeId: 5}).subscribe(response => {
      if(response)
      {
        this.hostels = response;
      }
    });
  }

  getCourses()
  {
    this.apiService.get('Application', 'GetCourse', {AppId: this.grantApplicationId}).subscribe(response => {
      if(response)
      {
        this.CoursesOldYear = response.filter(x=> x.IsOld == true);
        this.CoursesCurrentYear = response.filter(x=> x.IsOld == false);
      }
    });
  }

  getEmployees()
  {
    this.apiService.get('Application', 'GetEmployees', {AppId: this.grantApplicationId}).subscribe(response => {
      if(response)
      {
        this.emlpoyees = response;
      }
    });
  }

  getScholarship()
  {
    this.apiService.get('Application', 'GetScholarship', {AppId: this.grantApplicationId}).subscribe(response => {
      if(response)
      {
        this.shcolarship = response;
        
        if(response.ScholarshipType != null || response.ScholarshipType != "")
        {
          let scholarshiptype = this.ScholarshipTypes.filter(x=> x.value.name == response.ScholarshipType);
          this.selectedSchloarshipType = scholarshiptype[0].value; 
        }
      }
    });
  }

  getProposal()
  {
    this.apiService.get('Application', 'GetProposal', {AppId: this.grantApplicationId}).subscribe(response => {
      if(response)
      {
        this.loading = false;
        this.ProposalResponse = response;
        this.PropsalAreas = [];
        this.Propsal = response.Proposal;
        
        if(this.Propsal != undefined && this.Propsal != null)
        {
          if(this.ProposalResponse.ProposalProbe.length)
          {
            this.SetFormDataToProposal();
          }
        }
        if(this.Propsal == null)
        {
          this.Propsal = {};
        }
        
      }
    });
  }
  
  SetFormDataToProposal()
  {
    
    const probeIdsArray = this.ProposalResponse.ProposalProbe.map(probe => String(probe.ProbeId));
    this.valCheck = probeIdsArray
    for (var i = 0; i < this.valCheck.length; i++)
    { 
      for (const x of this.ProposalResponse.ProposalProbe)
      {
        if(x.ProbeId == this.valCheck[i])
        {
          let obj: any = {};
          obj.CheckedValue = parseInt(this.valCheck[i], 10);
          obj.Data = {Intervention: x.Intervention, Cost: x.Cost, Time: x.Time, OutCome: x.OutCome}
          obj.ProposalFiles = [];
          obj.RiskFiles=[]
          obj.ProposalReport = x.ProposalReport;
          obj.RiskStatement = x.RiskStatement;
          if(obj.CheckedValue == 1)
          {
            obj.label = "Faculty Development";
          }
          if(obj.CheckedValue == 2)
          {
            obj.label = "Examination Development";
          }
          if(obj.CheckedValue == 3)
          {
            obj.label = "Curriculum Development";
          }
          if(obj.CheckedValue == 4)
          {
            obj.label = "Campus Shifting";
          }
          if(obj.CheckedValue == 5)
          {
            obj.label = "Provision of Study Materials";
          }
          if(obj.CheckedValue == 6)
          {
            obj.label = "Provision of IT Equipment";
          }
          if(obj.CheckedValue == 7)
          {
            obj.label = "Improving college Environment";
          }
          if(obj.CheckedValue == 8)
          {
            obj.label = "Stakeholder Engagement";
          }
          if(obj.CheckedValue == 9)
          {
            obj.label = "Any other area";
          }
          let arr = this.PropsalAreas.filter(x=>x.CheckedValue == obj.CheckedValue);
          if(!arr.length)
          {
            this.PropsalAreas.push(obj);
          }
        }
      }
    }
  }

  getAdditionalInfo()
  {
    this.apiService.get('Application', 'GetAdditionalInfo', {AppId: this.grantApplicationId}).subscribe(response => {
      if(response)
      {
        this.Additionalinfo = response;
        this.Additionalinfo.hear = response.Hear;
        
      }
    });
  }

  getGovernance()
  {
    this.apiService.get('Application', 'GetGovernance', {AppId: this.grantApplicationId}).subscribe(response => {
      if(response)
      {
        this.Governance = response;
      }
    });
  }

  confirm1(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure that you want to Accept the application?',
        header: 'Acceptance Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        rejectButtonStyleClass:"p-button-text",
        accept: () => 
        {
          this.grantapp.StatusId = 3;
          this.ScrutinyApplication();
          // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        },
        reject: () => 
        {
          // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
  }
  
  confirm2(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure that you want to Reject the application?',
        header: 'Rejection Confirmation',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        acceptIcon:"none",
        rejectIcon:"none",

        accept: () => {
          this.grantapp.StatusId = 4;
          this.ScrutinyApplication();
        },
        reject: () => {
          // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        }
    });
  }


  ScrutinyApplication()
  {
    this.grantapp.Id = this.grantApplicationId;
    this.grantapp.ScrutinyByUserId = this.user.userId;
    
    this.apiService.post('Application', 'ScrutinyApplication', this.grantapp).subscribe(response => {
      debugger
      if(response)
      { 
        this.application = response.Data;
        this.getApplication();
      }
    },
    (error: any) => 
    {
      this.loading = false;
    });
  }






}

