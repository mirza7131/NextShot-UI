import { Component, OnInit } from '@angular/core';
import { Profile } from './profile';
import { Table } from 'primeng/table';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ProfileService} from './profile.service';
import { ProfileTypeService } from '../profile-type/profile-type.service';
import { PaginatorModel } from 'src/app/core/models/PaginatorModel';
import { ProfileFilter } from './profile-filter';
import { AuthService } from 'src/app/core/auth/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  //#region Class Fields & Propertities

  cols: any[] = [];

  profileTypes: any[] = [];

  profileDialog: boolean = false;

  deleteProfileDialog: boolean = false;

  deleteProfilesDialog: boolean = false;

  profiles: Profile[] = [];

  profile: Profile = {};

  selectedProfiles: Profile[] = [];

  submitted: boolean = false;


  // Profile Form Groupn
  profileForm = new FormGroup({
    ProfileId: new FormControl(),
    Name: new FormControl('',Validators.required),
    ShortName: new FormControl('',Validators.required),
    ProfileTypeId: new FormControl('',Validators.required),
    IsActive: new FormControl(true),
  });

  formInitialValues:any = {};

  filterModel :ProfileFilter = new ProfileFilter();

  loginUserDetail: any = {};

  showDeleteListItem : boolean = true;

  //#endregion

  // #region Constructor

  constructor
  (
    private _profileService: ProfileService,
    private _profileTypeService: ProfileTypeService,
    public _authService: AuthService,
  )
  {
  }

  ngOnInit(): void {

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'shortName', header: 'Short Name' },
      { field: 'profileType', header: 'Profile Type' },
      { field: 'isActive', header: 'Active' }
    ];

    this.getAllWithProfileType(this.filterModel);

    this.formInitialValues = this.profileForm.value;

    this.loginUserDetail.permission = this._authService.getPermissionsByUrl(window.location.pathname);
    this.showDeleteListItem = this.loginUserDetail.permission.CanDelete;

  }

  //#endregion

  // #region CUD Operations

  saveProfile() {
    this.submitted = true;

    if (this.profileForm.valid)
    {
        this.profile.ProfileId = this.profileForm.controls['ProfileId'].value;
        this.profile.ProfileTypeId = this.profileForm.controls['ProfileTypeId'].value || '';
        this.profile.Name = this.profileForm.controls['Name'].value || '';
        this.profile.ShortName = this.profileForm.controls['ShortName'].value || '';
        this.profile.IsActive = this.profileForm.controls['IsActive'].value || false;

        this._profileService.create(this.profile).subscribe(data => {
            // if (this.profileForm.controls['ProfileId'].value)
            // {
            //   this.profile.ProfileId = this.profileForm.controls['ProfileId'].value;
            //   // @ts-ignore
            //   this.profiles[this.findIndexById(this.profileForm.controls['ProfileId'].value)] = this.profileForm.value;
            // }
            // else
            // {
            //   this.profile.ProfileId = data.ProfileId;
            //   this.profiles.push(this.profile);
            // }

            // this.profileTypes.forEach(element => {

            //   if(element.ProfileTypeId == this.profile.ProfileTypeId)
            //     this.profiles[this.findIndexById(this.profile.ProfileId || '')].ProfileTypeName = element.Name;

            // });

            // this.getAllWithProfileType();
            this.profiles = [];
            this.profileDialog = false;
            this.profile = {};
            this.profileForm.reset(this.formInitialValues);
            this.getAllWithProfileType(this.filterModel);

        });
    }
  }

  //#endregion

  // #region Read Operations

  get profileFormControl() {

    return this.profileForm.controls;

  }

  getAllProfileTypes(): void {

    this._profileTypeService.get().subscribe((data:any) => this.profileTypes = data);
  }

  getAllProfiles(): void {

    this._profileService.get().subscribe((data:any) => this.profiles = data);
  }

  getAllWithProfileType(profileFilter:ProfileFilter): void {
    this._profileService.getAllWithProfileType(profileFilter).subscribe((data:any) =>{
      this.profiles = data.List;
      this.filterModel.TotalRecords = data.TotalCount;
    });
  }

  //#endregion

  // #region Helper Methods

  openNew() {
    this.profile = {};
    this.submitted = false;
    this.profileDialog = true;
    this.profileForm.reset(this.formInitialValues);
    this.getAllProfileTypes();
  }

  deleteSelectedProfiles() {
      this.deleteProfilesDialog = true;
  }

  editProfile(profile: Profile) {

    this.profile = { ...profile };
    this.profileDialog = true;

    Object.keys(this.profileForm.value).forEach((key:any) => {

      this.profileForm.controls[key as keyof typeof this.profileForm.value].setValue(profile[key as keyof typeof profile] || '11') ;

    });

    this.getAllProfileTypes();
  }

  deleteProfile(profile: Profile) {
      this.deleteProfileDialog = true;
      this.profile = { ...profile };
  }

  confirmDelete() {

    this._profileService.delete(this.profile.ProfileId || '').subscribe((data:any) =>  {

      this.deleteProfileDialog = false;
      // this.profiles = this.profiles.filter(val => val.ProfileId !== this.profile.ProfileId);
      this.getAllWithProfileType(this.filterModel);
      this.profile = {};

    });

  }

  hideDialog() {
      this.profileDialog = false;
      this.submitted = false;
  }

  onGlobalFilter(table: Table, event: Event) 
  {
    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;
    if((event.target as HTMLInputElement).value)
      this.filterModel.SearchString = (event.target as HTMLInputElement).value;
    else
      this.filterModel.SearchString = undefined;

    this.getAllWithProfileType(this.filterModel);
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.profiles.length; i++) {
        if (this.profiles[i].ProfileId === id) {
            index = i;
            break;
        }
    }

    return index;
  }


  paginate(event:any)
  {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.filterModel.PageNumber = event.page + 1;
    this.filterModel.PageSize = event.rows;
    this.getAllWithProfileType(this.filterModel);
  }

  onSearch()
  {
    
    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;

    if(this.filterModel.SearchString=="")
    {
      delete this.filterModel.SearchString;
      this.getAllWithProfileType(this.filterModel);
    } 
    else 
    {
      this.getAllWithProfileType(this.filterModel);
    }
  }
  //#endregion

}
