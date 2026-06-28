import { Component, OnInit } from '@angular/core';
import { UmsService } from '../ums.service';
import { Table } from 'primeng/table';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ProfileType } from './profile-type';
import { ProfileTypeService } from './profile-type.service';
import { PaginatorModel } from 'src/app/core/models/PaginatorModel';
import { ProfileTypeFilter } from './profile-type-filter';
import { AuthService } from 'src/app/core/auth/auth.service';


@Component({
  selector: 'app-profile-type',
  templateUrl: './profile-type.component.html',
  styleUrls: ['./profile-type.component.scss']
})
export class ProfileTypeComponent implements OnInit {

  //#region Class Fields & Propertities

  cols: any[] = [];

  items: any[] = [];

  profileTypeDialog: boolean = false;

  deleteProfileTypeDialog: boolean = false;

  deleteProfileTypesDialog: boolean = false;

  profileTypes: ProfileType[] = [];

  profileType: ProfileType = {};

  selectedProfileTypes: ProfileType[] = [];

  submitted: boolean = false;

  // Module Creation
  profileTypeForm = new FormGroup({
      ProfileTypeId: new FormControl(),
      Name: new FormControl('',Validators.required),
      ShortName: new FormControl('',Validators.required),
      IsActive: new FormControl(true),
  });

  formInitialValues:any = {};

  filterModel : ProfileTypeFilter = new ProfileTypeFilter();

  loginUserDetail: any = {};

  showDeleteListItem : boolean = true;

  //#endregion



  // #region Constructor

    constructor
    (
      private _profileTypeService: ProfileTypeService,
      public _authService: AuthService,
    )
    {
    }

    ngOnInit(): void {

      this.cols = [
          { field: 'Name', header: 'Name' },
          { field: 'ShortName', header: 'Short Name' },
          { field: 'IsActive', header: 'Active' }
      ];

      this.getAllProfileTypes(this.filterModel);

      this.formInitialValues = this.profileTypeForm.value;

      this.loginUserDetail.permission = this._authService.getPermissionsByUrl(window.location.pathname);
      this.showDeleteListItem = this.loginUserDetail.permission.CanDelete;
    }

  // #endregion

  // #region CUD Operations

    saveProfileType() {

        this.submitted = true;

        if (this.profileTypeForm.valid)
        {
            this.profileType.ProfileTypeId = this.profileTypeForm.controls['ProfileTypeId'].value;
            this.profileType.Name = this.profileTypeForm.controls['Name'].value || '';
            this.profileType.ShortName = this.profileTypeForm.controls['ShortName'].value || '';
            this.profileType.IsActive = this.profileTypeForm.controls['IsActive'].value || false;



            this._profileTypeService.create(this.profileType).subscribe(data => {


                // if (this.profileTypeForm.controls['ProfileTypeId'].value)
                // {
                //     // @ts-ignore
                // this.profileTypes[this.findIndexById(data.ProfileTypeId)] = this.profileTypeForm.value;
                // }
                // else
                // {
                // this.profileType.ProfileTypeId = data.ProfileTypeId;
                // this.profileTypes.push(this.profileType);
                // }

                // this.profileTypes = [...this.profileTypes];
                this.profileTypeDialog = false;
                this.profileType = {};
                this.profileTypeForm.reset(this.formInitialValues);
                this.getAllProfileTypes(this.filterModel);

            });


        }
    }

    confirmDelete() {

        this._profileTypeService.delete(this.profileType.ProfileTypeId || '').subscribe((data:any) =>  {

          this.deleteProfileTypeDialog = false;
          // this.profileTypes = this.profileTypes.filter(val => val.ProfileTypeId !== this.profileType.ProfileTypeId);
          this.getAllProfileTypes(this.filterModel);
          this.profileType = {};

        });
    }

  // #endregion

  // #region Read Operations

    getAllProfileTypes(filterModel:ProfileTypeFilter): void {
      this._profileTypeService.getAllWithPagination(this.filterModel).subscribe((data:any) => {
        this.profileTypes = data.List;
        this.filterModel.TotalRecords = data.TotalCount;

      });

    }

    // #endregion

  // #region Helper Methods

    openNew() {
      this.submitted = false;
      this.profileTypeDialog = true;

      this.profileTypeForm.reset(this.formInitialValues);
    }

    hideDialog() {
      this.profileTypeDialog = false;
      this.submitted = false;
    }

    deleteSelectedProfileTypes() {
        this.deleteProfileTypesDialog = true;
    }

    editProfileType(profileType: ProfileType) {

      this.profileType = { ...profileType };
      this.profileTypeDialog = true;

      Object.keys(this.profileTypeForm.value).forEach((key:any) => {
        this.profileTypeForm.controls[key as keyof typeof this.profileTypeForm.value].setValue(profileType[key as keyof typeof profileType]) ;

      });

    }

    deleteProfileType(profileType: ProfileType) {
      this.deleteProfileTypeDialog = true;
      this.profileType = { ...profileType };
    }

    findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.profileTypes.length; i++) {
          if (this.profileTypes[i].ProfileTypeId === id) {
              index = i;
              break;
          }
      }

      return index;
    }

    get profileTypeFormControl() {
      return this.profileTypeForm.controls;
    }

    paginate(event:any)
    {
      this.filterModel.PageNumber = event.page + 1;
      this.filterModel.PageSize = event.rows;
      this.getAllProfileTypes(this.filterModel);
    }
    onSearch(){
        this.filterModel.PageNumber = 1;
        this.filterModel.PageSize = 10;
         
        if(this.filterModel.SearchString==""){
            delete this.filterModel.SearchString;
            this.getAllProfileTypes(this.filterModel);
        } else {
        this.getAllProfileTypes(this.filterModel);
        }
    }
  //#endregion

}
