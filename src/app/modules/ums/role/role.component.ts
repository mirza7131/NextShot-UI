import { Component, OnInit } from '@angular/core';
import { UmsService } from '../ums.service';
import { Table } from 'primeng/table';
import { FormGroup, FormControl,FormArray,AbstractControl  } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Role,RoleMenu } from './role';
import { RoleService } from './role.service';
import { MenuService } from '../menu/menu.service';
import { RoleMenuService } from './role-menu.service';
import { RoleFilter } from './role-filter';
import { AuthService } from 'src/app/core/auth/auth.service';


@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  //#region Class Fields & Propertities

  listModules:any = [];

  formData: Role = {};

  roles: Role[] = [];

  role: Role = {};

  roleMenus: RoleMenu[] = [];

  roleMenu: RoleMenu = {};

  submitted: boolean = false;

  roleDialog: boolean = false;

  deleteRoleDialog: boolean = false;

  deleteRolesDialog: boolean = false;

  selectedRoles: Role[] = [];

  dialogHeaderText:string = "Role";

  menus:any = [];

  formInitialValues:any = {};

  filterModel : RoleFilter = new RoleFilter();

  loginUserDetail: any = {};

  showDeleteListItem : boolean = true;

  // Role Form Group
  roleForm = new FormGroup({
    RoleId: new FormControl(),
    Name: new FormControl('',Validators.required),
    ShortName: new FormControl('',Validators.required),
    routingUrl: new FormControl('',Validators.required),
    IsActive: new FormControl(true),
  });

  //#endregion

  // #region Constructor

  constructor
  (
    private _roleService: RoleService,
    private _roleMenuService: RoleMenuService,
    private _menuService: MenuService,
    public _authService: AuthService

  )
  {

  }

  ngOnInit(): void {

    this.getAllRoles(this.filterModel);
    this.formInitialValues = this.roleForm.value;
    this.loginUserDetail.permission = this._authService.getPermissionsByUrl(window.location.pathname);
    this.showDeleteListItem = this.loginUserDetail.permission.CanDelete;

  }

  //#endregion

  // #region CUD Operations

  submitForm()
  {
    this.submitted = true;

    if (this.roleForm.valid)
    {

      let tempRoleMenu:any = [];

      this.roleMenus.forEach(function(item){

        var tempObj = {
          RoleMenuId:item.RoleMenuId,
          MenuId:item.MenuId,
          HasAccess:item.HasAccess,
          RoleId:item.RoleId,
        };

        if(item.HasAccess)
        {
          tempRoleMenu.push(tempObj);

          item.ChildMenu?.forEach(function(childItem){

            if(childItem.HasAccess)
            {

              var tempObj2 = {
                RoleMenuId:childItem.RoleMenuId,
                MenuId:childItem.MenuId,
                CanRead:childItem.CanRead,
                CanWrite:childItem.CanWrite,
                CanEdit:childItem.CanEdit,
                CanDelete:childItem.CanDelete,
                RoleId:childItem.RoleId,
                HasAccess:childItem.HasAccess,
              };

              tempRoleMenu.push(tempObj2);
            }
          })
        }

      });

      var roleItem = {
        RoleId:this.roleForm.controls['RoleId'].value,
        RoleMenus: tempRoleMenu,
        Name : this.roleForm.controls['Name'].value  || '',
        IsActive : this.roleForm.controls['IsActive'].value || false,
        ShortName : this.roleForm.controls['ShortName'].value || '',
        RoutingUrl : this.roleForm.controls['routingUrl'].value || '',

      }

      this.formData = roleItem;

      this._roleService.create(this.formData).subscribe((res:any) => {
        this.roleDialog = false;
        this.getAllRoles(this.filterModel);
      });
    }

  }

  confirmDelete() {

    this._roleService.delete(this.role.RoleId || '').subscribe((data:any) =>  {
      this.deleteRoleDialog = false;
      // this.roles = this.roles.filter(val => val.RoleId !== this.role.RoleId);
      this.getAllRoles(this.filterModel);
      this.role = {};
    });

  }

  //#endregion

  // #region Read Operations

  get roleFormControl() {
    return this.roleForm.controls;
  }

  getAllModules(): void {

    this._menuService.getAllModules().subscribe((data:any) => this.listModules = data);

  }

  getAllRoles(filterModel:RoleFilter): void {

    this._roleService.getAllWithPagination(this.filterModel).subscribe((data:any) => {

      this.roles = data.List;
      this.filterModel.TotalRecords = data.TotalCount;

    });

  }

  getRoleMenuAccess(roleId?:string): void {

    this._roleMenuService.getRoleMenuAccess(roleId).subscribe((response:any) =>  {
      this.roleMenus = response;
    });

  }

  getRoleById(id:string):void{

    this._roleService.getById(id).subscribe((data:any) => this.roleMenus = data.RoleMenus);
  }



  //#endregion


  // #region Helper Methods


  openNew() {

    this.submitted = false;
    this.roleDialog = true;
    this.dialogHeaderText = "Role";
    this.roleForm.reset(this.formInitialValues);
    this.getRoleMenuAccess();
  }

  editRole(role: Role) {

      this.dialogHeaderText  = "Role (" + role.Name + ")"

      this.role = { ...role };
      this.roleDialog = true;

      Object.keys(this.roleForm.value).forEach((key:any) => {
        this.roleForm.controls[key as keyof typeof this.roleForm.value].setValue(role[key as keyof typeof role]) ;

      });

      this.roleMenus = role.RoleMenus || [];

      this.getRoleMenuAccess(role.RoleId || '');
  }

  deleteRole(role: Role) {
      this.deleteRoleDialog = true;
      this.role = { ...role };
  }

  hideDialog() {
    this.roleDialog = false;
    this.submitted = false;
  }


  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.roles.length; i++) {
        if (this.roles[i].RoleId === id) {
            index = i;
            break;
        }
    }

    return index;
  }

  toggle(event:any,index: number) {
    this.closeAllDivs();
    if(event.checked)
    {
      this.roleMenus[index].IsOpened = true;
    }
    else
      this.roleMenus[index].IsOpened = false;


  }

  closeAllDivs()
  {
    this.roleMenus.forEach(function(item){
      item.IsOpened = false;
    });
  }

  menuHasAccessSelection(event:any,menu:any,index: number)
  {
    let value:boolean = false;

    if(event.checked)
      value = true;
    else
      value = false;

    this.roleMenus[index].ChildMenu?.forEach(function(item){

      if(item.MenuId == menu.MenuId)
      {
        item.CanRead = value;
        item.CanEdit = value;
        item.CanWrite = value;
        item.CanDelete = value;
      }
    });
  }

  selectAll(event:any) {

    let value:boolean = false;

    if(event.checked)
      value = true;
    else
      value = false;

    this.roleMenus.forEach(function(module){

      module.HasAccess = value;

      module.ChildMenu?.forEach(menu => {
        menu.HasAccess = value;
        menu.CanRead = value;
        menu.CanEdit = value;
        menu.CanWrite = value;
        menu.CanDelete = value;

      });

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
    this.getAllRoles(this.filterModel);
  }
  onSearch(){
    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;
     
    if(this.filterModel.SearchString==""){
        delete this.filterModel.SearchString;
        this.getAllRoles(this.filterModel);
    } else {
    this.getAllRoles(this.filterModel);
    }
}
  //#endregion













}
