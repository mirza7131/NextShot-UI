import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from '../profile/profile.service';
import { ProfileTypeConstant } from 'src/app/core/constants/profileType.constants';
import { LocalService } from 'src/app/_services/local.service';
import { HealthFacilityConfigurationService } from './health-facility-configuration.service';
import { ProfileConstant } from 'src/app/core/constants/profile.constants';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DepartmentConstant } from 'src/app/core/constants/department.constant';
import { HealthFacilityConfigurationFilter } from './health-facility-configuration-filter';
import { TabView } from 'primeng/tabview';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-health-facility-configuration',
  templateUrl: './health-facility-configuration.component.html',
  styleUrls: ['./health-facility-configuration.component.scss']
})
export class HealthFacilityConfigurationComponent implements OnInit {

  activeIndex: number = 0;
  totalActiveIndex :number = 2;
  @ViewChild(TabView) tabView: TabView;
  testTypeList: any = [];
  labDepartmentTypes: any = [];
  allLabTestData: any = [];

  formInitialValues:any = {};

  filterModel :HealthFacilityConfigurationFilter = new HealthFacilityConfigurationFilter();

  hfConfigForm = this._fb.group ({
    HealthFacilityId: new FormControl(null, [Validators.required]),
    HealthFacilityName: new FormControl(null),
    PathologyLabTestList: this._fb.array([]),
    RadiologyLabTestList: this._fb.array([]),
    UltrasoundLabTestList: this._fb.array([]),
  });
  hfConfigList: any = [];
  hfConfigDialog: boolean;
  deleteDialog: boolean;
  dialogHeaderText: string;
  healthFacilityList: any;
  PathologyDDLabTestList: any = [];
  UltrasoundDDLabTestList: any = [];
  RadiologyDDLabTestList: any = [];

  selectedPathalogyTests: any = null;
  selectedRadiologyTests: any = null;
  selectedUltrasoundTests: any = null;
  isEdit: boolean = false;
  selectedHfId: any = null;
  ConfirmationMesage: string;
  ShowSync: boolean = false;
  loginUser: any = {};


  constructor(
    private _userService: UserService,
    private _profileService : ProfileService,
    private _confirmationService: ConfirmationService,
    private _healthFacilityConfigurationService : HealthFacilityConfigurationService,
    private _localService : LocalService,
    private _fb:FormBuilder,
    private _authService: AuthService
  ) { 
    
  }

  ngOnInit(): void {
    debugger
    this.loginUser = this._authService.user;
    // let loginUser = this._authService.getLoginUser();
    let isHfAdmin = this.loginUser.UserRoleList.find((x:any) => x.ShortName == 'HF Admin');
    if(isHfAdmin && this.loginUser.IsOffline)
      this.ShowSync = true;


    this.getTestTypes(ProfileTypeConstant.LabTestType);
    this.getLabDepartmentTypes(ProfileTypeConstant.LabDepartments);
    this.getAllLabTest();
    this.getAllConfigHealthFacilitiesByFilters(this.filterModel);
    this.getAllHealthFacilities(this.filterModel);
  }

  syncData() {
    var obj = {
      HealthFacilityId : this.loginUser.HealthFacilityId
    }
    this._userService.syncData(obj).subscribe((res: any) => {
      let response = res;
    })
  }

  AddLabTestConfigItem(labItem:any) {
    let item :any = {};
    if(labItem) {

      if(labItem.DepartmentShortName == ProfileConstant.InternalLab){
        labItem.IsInternalTest = true;
        labItem.IsExternalTest = false;
      } else {
        labItem.IsInternalTest = false;
        labItem.IsExternalTest = true;
      }

      item = this._fb.group ({
        HfLabTestConfigId: [labItem?.HfLabTestConfigId],
        LabTestId: [labItem.LabTestId, Validators.required],
        TestName: [labItem.Name, Validators.required],
        TestPrice: [labItem.TestPrice],
        TestTypeShortName: [labItem.ShortName],
        IsInternalTest: [labItem.IsInternalTest, Validators.required],
        IsExternalTest: [labItem.IsExternalTest, Validators.required],
        DepartmentShortName: [labItem.DepartmentShortName, Validators.required],
        LabDepartmentProfileId: [labItem.DepartmentProfileId, Validators.required],
        IsPerformedPrivately: [{ value: (labItem?.IsPerformedPrivately == true) ? true:false, disabled: (labItem.IsExternalTest == true) ? true:false }, Validators.required],
        IsActive: [true]
      });
    } else {
      item = this._fb.group ({
        HfLabTestConfigId: [null],
        LabTestId: [null, Validators.required],
        TestName: [null, Validators.required],
        TestPrice: [0],
        TestTypeShortName: [ProfileConstant.LabTestTypeOther],
        IsInternalTest: [true, Validators.required],
        IsExternalTest: [false, Validators.required],
        DepartmentShortName: [null, Validators.required],
        LabDepartmentProfileId: [null, Validators.required],
        IsPerformedPrivately: [false, Validators.required],
        IsActive: [true]
      });
    }
    if(item.value.TestTypeShortName == ProfileConstant.LabTestTypeOther || item.value.TestTypeShortName == ProfileConstant.LabTestTypeBlood)
      this.PathologyLabTestList.push(item);
    if(item.value.TestTypeShortName == ProfileConstant.LabTestTypeXRay)
      this.RadiologyLabTestList.push(item);
    if(item.value.TestTypeShortName == ProfileConstant.LabTestTypeUltrasound)
      this.UltrasoundLabTestList.push(item);
    
  }

  get PathologyLabTestList() {
    return this.hfConfigForm.controls["PathologyLabTestList"] as FormArray;
  }

  get RadiologyLabTestList() {
    return this.hfConfigForm.controls["RadiologyLabTestList"] as FormArray;
  }

  get UltrasoundLabTestList() {
    return this.hfConfigForm.controls["UltrasoundLabTestList"] as FormArray;
  }

  removeTests(i:number, source:any){
    // source 1=Pathalogy, 2=Radiology, 3=Ultrasound
    if(source == 1) {
      this.PathologyLabTestList.removeAt(i);
      // this.removeFromDDList(1, this.PathologyLabTestList.value);
    }
      
    if(source == 2) {
      this.RadiologyLabTestList.removeAt(i);
      // this.removeFromDDList(2, this.RadiologyLabTestList.value);
    }
      
    if(source == 3) {
      this.UltrasoundLabTestList.removeAt(i);
      // this.removeFromDDList(3, this.UltrasoundLabTestList.value);
    }
    this.refreshDDLists();
      

  }
  refreshDDLists(){
    this.segrigateTestList(this.allLabTestData);
    this.removeFromDDList(1, this.PathologyLabTestList.value);
    this.removeFromDDList(2, this.RadiologyLabTestList.value);
    this.removeFromDDList(3, this.UltrasoundLabTestList.value);
  }

  addLabTest(source:any){
    // source 1=Pathalogy, 2=Radiology, 3=Ultrasound
    if(source == 3)
    {
      this.selectedUltrasoundTests.forEach((x:any) => {
        this.AddLabTestConfigItem(x);  
      });
      this.removeFromDDList(3, this.selectedUltrasoundTests);
    
    } else if(source == 2) {
    
      this.selectedRadiologyTests.forEach((x:any) => {
        this.AddLabTestConfigItem(x);  
      });
      this.removeFromDDList(2, this.selectedRadiologyTests);
    } else {
      this.selectedPathalogyTests.forEach((x:any) => {
        this.AddLabTestConfigItem(x);  
      });
      this.removeFromDDList(1, this.selectedPathalogyTests);
    }
    
  }
  removeFromDDList(source:any, testListToRemove:any){
    // source 1=Pathalogy, 2=Radiology, 3=Ultrasound
    if(source == 3)
    {
      // Extract an array of ids
      let idsToRemove = testListToRemove.map((item:any) => item?.LabTestId);
      this.UltrasoundDDLabTestList = this.UltrasoundDDLabTestList.filter((item:any) => !idsToRemove.includes(item.LabTestId));
    } else if(source == 2) {
      // Extract an array of ids
      let idsToRemove = testListToRemove.map((item:any) => item?.LabTestId);
      this.RadiologyDDLabTestList = this.RadiologyDDLabTestList.filter((item:any) => !idsToRemove.includes(item.LabTestId));
    } else {
      // Extract an array of ids
      let idsToRemove = testListToRemove.map((item:any) => item?.LabTestId);
      this.PathologyDDLabTestList = this.PathologyDDLabTestList.filter((item:any) => !idsToRemove.includes(item.LabTestId));
    }
    this.selectedUltrasoundTests = null;
    this.selectedRadiologyTests = null;
    this.selectedPathalogyTests = null;

  }
  // get PathologyLabTestList() {
  //   let labTestType = this.testTypeList.find((x:any) => x.ShortName != ProfileConstant.LabTestTypeUltrasound && x.ShortName != ProfileConstant.LabTestTypeXRay);
  //   return this.hfConfigForm.get('LabTestConfigList')?.value.filter((x:any) => {
  //     return x.LabTestTypeProfileId == labTestType
  //   });
  //   // return Pathalogy
  // }

  // filterControlsByType(testType: string): FormGroup[] {
  //   return this.LabTestConfigList.controls
  //     .filter((item: FormGroup) => item.get('TestType').value === testType);
  // }

  onTabChange(event: any) {
    // const selectedTab = event.index;
  
    // switch (selectedTab) {
    //   case 0: // Pathology Tab
    //     this.filteredPathologyTests = this.filterControlsByType('Pathology');
    //     break;
    //   case 1: // Radiology Tab
    //     this.filteredRadiologyTests = this.filterControlsByType('Radiology');
    //     break;
    //   case 2: // Ultrasound Tab
    //     this.filteredUltrasoundTests = this.filterControlsByType('Ultrasound');
    //     break;
    //   // Add more cases for other tabs if needed
    // }
  }
  

  // deleteLabTestConfigItem(i:number){
  //   this.LabTestConfigList.removeAt(i);
  // }
  checkIfExternalOrInternal(index:any, listType:any, source:any){
    
    // -- listType 1=Pathology List, 2= Radiology List, 3= Ultrasound List
    // -- source 1=Internal, 2= External
    let testItem:any = {}
    if(listType == 1) //Pathology List
      testItem = this.PathologyLabTestList.controls[index];
    if(listType == 2) //Radiology List
      testItem = this.RadiologyLabTestList.controls[index];
    if(listType == 3) //Ultrasoung List
      testItem = this.UltrasoundLabTestList.controls[index];

    // Internal Test
    if(source == 1)
    {
      if(testItem.value.IsInternalTest == true)
        testItem.get('IsExternalTest')?.patchValue(false);
      else
        testItem.get('IsInternalTest')?.patchValue(true);
      
      testItem.get('IsPerformedPrivately')?.enable();
    } else { // External Test
      
      if(testItem.value.IsExternalTest == true)
      {
        testItem.get('IsInternalTest')?.patchValue(false);
        testItem.get('IsPerformedPrivately')?.patchValue(false);
        testItem.get('IsPerformedPrivately')?.disable();
      }
      else 
        testItem.get('IsExternalTest')?.patchValue(true);
        
    }
  
  }

//   handleChange(changeEvent: any) {
//     this.activeIndex = changeEvent.index;
//     this.tabName = this.tabView.tabs[this.activeIndex].header
// }

nextTab() {
    if (this.activeIndex < this.tabView.tabs.length - 1)
        this.activeIndex += 1
}

prevTab() {
    if (this.activeIndex > 0)
        this.activeIndex -= 1
}

checkIfDisabled(){
  if(this.activeIndex == 0) {
    if(this.PathologyLabTestList.value.length > 0)
      return false;
    else
      return true;
  } 
  // else if(this.activeIndex == 1) {
  //   if(this.RadiologyLabTestList.value.length > 0)
  //     return false;
  //   else
  //     return true;
  // } else if(this.activeIndex == 2) {
  //   if(this.UltrasoundLabTestList.value.length > 0)
  //     return false;
  //   else
  //     return true;
  // }
  return false;
}

  checkIfHfConfigExist(event:any){
    let hfId = event.value;
    if(hfId != null)
      this.getHfLabTestConfigByHealthFacilityId(hfId);
  }
  openNew() {

    // this.submitted = false;
    this.hfConfigDialog = true;
    this.dialogHeaderText = "Health Facility Configuration";
    this.getAllLabTest();
    // this.hfConfigForm.reset(this.formInitialValues);
    // this.hfConfigForm.reset();
    // this.getAllConfigHealthFacilitiesByFilters(this.filterModel);
  }

  edit(item: any) {
      
      this.dialogHeaderText  = item?.HealthFacilityName + " (Configuration)"
      this.getHfLabTestConfigByHealthFacilityId(item.HealthFacilityId);
      

      // this.role = { ...role };
      // this.hfConfigDialog = true;

      // Object.keys(this.roleForm.value).forEach((key:any) => {
      //   this.roleForm.controls[key as keyof typeof this.roleForm.value].setValue(role[key as keyof typeof role]) ;

      // });

      // this.roleMenus = role.RoleMenus || [];

      // this.getRoleMenuAccess(role.RoleId || '');
  }

  delete(item:any) {
      this.deleteDialog = true;
      this.selectedHfId = item.HealthFacilityId;
  }
  confirmDelete() {

    this._healthFacilityConfigurationService.delete(this.selectedHfId).subscribe((data:any) =>  {
      this.deleteDialog = false;
      // this.roles = this.roles.filter(val => val.RoleId !== this.role.RoleId);
      this.getAllConfigHealthFacilitiesByFilters(this.filterModel);
      this.selectedHfId = null;
    });

  }

  hideDialog() {
    this.hfConfigDialog = false;
    this.deleteDialog = false;
    this.selectedHfId=null;
    // this.submitted = false;
  }

  saveFormData(data:any) {
    
    let obj:any = {}
    let formData = data.value;
    obj.HealthFacilityId = formData.HealthFacilityId;
    obj.HfLabTestConfigList = [...formData.PathologyLabTestList, ...formData.RadiologyLabTestList, ...formData.UltrasoundLabTestList];
    
    obj.HfLabTestConfigList.map((item:any) => {
      if(item.IsInternalTest)
      {
        let dep = this.labDepartmentTypes.find((x:any) => x.ShortName == ProfileConstant.InternalLab);
        if(dep){
          item.DepartmentShortName = dep?.ShortName;
          item.LabDepartmentProfileId = dep?.ProfileId;
        }
      } else {
        let dep = this.labDepartmentTypes.find((x:any) => x.ShortName == ProfileConstant.ExternalLab);
        if(dep){
          item.DepartmentShortName = dep?.ShortName;
          item.LabDepartmentProfileId = dep?.ProfileId;
        }
      }
    });
    
    this._healthFacilityConfigurationService.createOrEdit(obj).subscribe(data => {
      if(data)
      {
        this.getAllConfigHealthFacilitiesByFilters(this.filterModel);
        this.resetAfterSave();
      }
    });

  }
  resetAfterSave(){
    this.hfConfigForm.reset();
    this.PathologyLabTestList.clear();
    this.RadiologyLabTestList.clear();
    this.UltrasoundLabTestList.clear();
    this.activeIndex = 0;
    this.hfConfigDialog = false;
    this.selectedPathalogyTests = null;
    this.selectedRadiologyTests = null;
    this.selectedUltrasoundTests = null;
    this.isEdit = false;
    this.selectedHfId = null;
    
    this.segrigateTestList(this.allLabTestData);
  }

  getTestTypes(shortName: string): void {
    this._profileService.getProfileByProfileType(shortName).subscribe((data:any) =>{
       this.testTypeList = data;
    });
  }
  getLabDepartmentTypes(shortName: string): void {
    this._profileService.getProfileByProfileType(shortName).subscribe((data:any) =>{
       this.labDepartmentTypes = data;
    });
  }
  checkForInternal(item:any){
    if(item.DepartmentShortName == ProfileConstant.InternalLab)
      return true
    else
      return false
  }
  // getTestList(testType:any) {
  //   let type = this.testTypeList.find((x:any) => x.ProfileType.ShortName == ProfileConstant.LabTestTypeUltrasound);
  //   return this.allLabTestData.filter((x:any) => x.LabTestTypeProfileId == type.ProfileTypeId);
  // }
  getAllLabTest() {
    this._healthFacilityConfigurationService.getAllLabTests()
        .subscribe((data: any) => {
            if (data) {
                this.allLabTestData = data;
                this.segrigateTestList(data);
                // this.allLabTestData.forEach((x:any) => {
                //   this.AddLabTestConfigItem(x);
                // });
            }
        });
  }

  getAllConfigHealthFacilitiesByFilters(filter:any) {
    this._healthFacilityConfigurationService.getAllConfigHealthFacilitiesByFilters(filter)
        .subscribe((data: any) => {
            if (data) {
                this.hfConfigList = data.List;
                this.filterModel.TotalRecords = data.TotalCount;
            }
        });
  }

  getHfLabTestConfigByHealthFacilityId(HealthFacilityId:any) {
    this._healthFacilityConfigurationService.GetHfLabTestConfigByHealthFacilityId(HealthFacilityId)
        .subscribe((data: any) => {
            if (data) {
                this.hfConfigDialog = true;
                if(data.HfLabTestConfigList?.length > 0){
                  this.isEdit = true;
                  this.hfConfigForm.patchValue(data);
                  this.hfConfigForm.value;
                  data.HfLabTestConfigList?.forEach((x:any) => {
                    this.AddLabTestConfigItem(x);  
                  });
                  this.removeFromDDList(1, this.PathologyLabTestList.value);
                  this.removeFromDDList(2, this.RadiologyLabTestList.value);
                  this.removeFromDDList(3, this.UltrasoundLabTestList.value);
                }
                  
                
                
            }
        });
  }

  getAllHealthFacilities(filter:any) {
    this._healthFacilityConfigurationService.getAllHealthFacilities(filter)
        .subscribe((data: any) => {
            if (data) {
                this.healthFacilityList = data;
            }
        });
  }
  segrigateTestList(testList:any) {
    this.PathologyDDLabTestList = [];
    this.RadiologyDDLabTestList = [];
    this.UltrasoundDDLabTestList = [];

    testList.forEach((item:any) => {

      if(item.ShortName == null || item.ShortName == ProfileConstant.LabTestTypeOther || item.ShortName == ProfileConstant.LabTestTypeBlood)
        this.PathologyDDLabTestList.push(item);
      if(item.ShortName == ProfileConstant.LabTestTypeXRay)
        this.RadiologyDDLabTestList.push(item);
      if(item.ShortName == ProfileConstant.LabTestTypeUltrasound)
        this.UltrasoundDDLabTestList.push(item);

    });

  }
  paginate(event:any)
  {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.filterModel.PageNumber = event.page + 1;
    this.filterModel.PageSize = event.rows;
    this.getAllConfigHealthFacilitiesByFilters(this.filterModel);
  }
  onSearch(){
    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;
     
    if(this.filterModel.SearchString==""){
        delete this.filterModel.SearchString;
        this.getAllConfigHealthFacilitiesByFilters(this.filterModel);
    } else {
      this.getAllConfigHealthFacilitiesByFilters(this.filterModel);
    }
  }

  paymentConfirmation(event:Event, index: any, source:any) {

    this.ConfirmationMesage = 'Are you sure you want to Delete?';
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.ConfirmationMesage,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        
        this.removeTests(index, source);
        
      },
      reject: () => {
        
      }
    });
  }


}
