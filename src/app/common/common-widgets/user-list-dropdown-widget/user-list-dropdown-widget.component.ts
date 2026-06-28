import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { RoleConstant } from 'src/app/core/constants/Role.constant';
// import { RoleConstant } from 'src/app/core/constants/role.constant';

import { PatientVisitFilter } from 'src/app/patient/patient-visit/patient-visit-filter';
import { UserService } from 'src/app/modules/ums/user/user.service';

@Component({
  selector: 'app-user-list-dropdown-widget',
  templateUrl: './user-list-dropdown-widget.component.html',
  styleUrls: ['./user-list-dropdown-widget.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class UserListDropdownWidgetComponent implements OnInit {

  // This property is bound using its original name.
  @Input() userFilterModel : any = new PatientVisitFilter(); // if Model
  @Input() userFilterFormGroup : any;  // if Formgroup
  @Input() RoleConst : any = '';  // if Formgroup
  @Input() HealthFacilityId : any = 0;  // if Formgroup

  
  //#region Class Fields & Propertities

  userList: any[] = [];
  roleConstant: RoleConstant = new RoleConstant();

  //#endregion

  // #region Constructor

  constructor (
    private _userService: UserService,
  ) {}

  ngOnInit(): void {
    this.getAllUsers(this.HealthFacilityId);
  }

  //#endregion

  // #region CUD Operations


  //#endregion

  // #region Read Operations

  getAllUsers(HfId?:any): void {
    let healthFacilityId = 0;

    if(HfId)
      healthFacilityId = HfId;
    else
      if(this.userFilterModel.HealthFacilityId)
        healthFacilityId = this.userFilterModel.HealthFacilityId;
    else
      healthFacilityId = 0;
    
    // let role = this.roleConstant.Registration;
    let role = this.RoleConst;
    
    this._userService.getAllByUserLevelwise(role, healthFacilityId).subscribe((data: any) => {
      this.userList = data;
    });

  }

  ngOnChanges(changes: SimpleChanges) {

    if(!this.checkForNullandUndefined(changes["HealthFacilityId"].currentValue) && changes["HealthFacilityId"].currentValue != changes["HealthFacilityId"].previousValue)
    {
      let HfId = changes["HealthFacilityId"].currentValue;
      this.getAllUsers(HfId);
    }
    else{
      this.getAllUsers(this.HealthFacilityId);
    }
    this.userFilterModel.User = [];
      
    // changes.prop contains the old and the new value...
  }


  //#endregion

  // #region Helper Methods
  
    checkForNullandUndefined(val:any){
      if(val == null || val == 'undefined')
        return true;
      else
        return false;
    }
    //#endregion
  

}
