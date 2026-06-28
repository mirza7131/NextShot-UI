import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AssignableUserRole, UserRole } from '../user';
import { MessageService } from 'primeng/api';
import { MessageConstant } from 'src/app/core/constants/message.constants';

@Component({
  selector: 'app-assignable-user-roles',
  templateUrl: './assignable-user-roles.component.html',
  styleUrls: ['./assignable-user-roles.component.scss']
})
export class AssignableUserRolesComponent implements OnInit {

  @Input() roles: any = []
  @Input() userId: any
  @Input() assigsUserRoleDialog: boolean ;
  @Output() assignableRolesEmitter = new EventEmitter<any>();
  @Output() assigsUserRoleDialogEmitter = new EventEmitter<any>();

  constructor(
    private _messageService: MessageService,) { }

  ngOnInit(): void {
     
  }

  hideDialog() {
    this.assigsUserRoleDialog = false;
    this.assigsUserRoleDialogEmitter.emit(this.assigsUserRoleDialog)
  }



  selectRole(event: any, userRole: UserRole) {

    let value: boolean = false;
    if (event.checked) {
      value = true;
    }
    else {
      value = false;
    }

    this.roles.forEach(function (item: { RoleId: string | undefined; IsActive: boolean; }) {
      if (item.RoleId == userRole.RoleId)
        item.IsActive = value;
    });

  }

  saveUser() {
    let selectedRoles: UserRole[] | { RoleId: any; UserRoleId: any; UserId: any; IsActive: boolean; }[] = [];

    this.roles.forEach((item: any) => {

      if (item.IsActive) {
        selectedRoles.push({
          RoleId: item.RoleId,
          UserRoleId: item.UserRoleId,
          UserId: item.UserId,
          IsActive: true
        });
      }

    });



    if (selectedRoles.length == 0) {
      this._messageService.add({ severity: 'error', summary: 'Error', detail: MessageConstant.SelectAtLeastOneRole, life: 3000 });
      return;
    }

    let user: AssignableUserRole = new AssignableUserRole();

    user.UserId = this.userId;
    user.UserAssignableRoles = selectedRoles;

    this.assignableRolesEmitter.emit(user);
  }

}
