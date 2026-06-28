import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user/user.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { MessageService } from 'primeng/api';
import { MessageConstant } from 'src/app/core/constants/message.constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  authViaHR: boolean = false;
  isShow: boolean = false;
  StrongPasswordRegx: RegExp = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  public loginUserDetail: any = {};
  @Output() isSaved = new EventEmitter<boolean>();
  @Output() isNotMatch = new EventEmitter<boolean>();

  passwordForm = new FormGroup({
    UserId: new FormControl(''),
    OldPassword: new FormControl('', this.authViaHR ? [] : Validators.required),
    NewPassword: new FormControl('', this.authViaHR ? [] : [Validators.required, Validators.pattern(this.StrongPasswordRegx)]),
    ConfirmNewPassword: new FormControl('', this.authViaHR ? [] : [Validators.required, Validators.pattern(this.StrongPasswordRegx)]),
  });
  constructor(
    private _userService: UserService,
    public _AuthService: AuthService,
    public _MessageService: MessageService

  ) { }

  ngOnInit(): void {

    this.loginUserDetail = this._AuthService.getLoginUser();
    this.passwordForm.controls['UserId'].setValue(this.loginUserDetail.UserId)

  }

  get passwordFormControl() {
    return this.passwordForm.controls;
  }
  ChangePassword() {

    if (this.passwordForm.controls['NewPassword'].value == this.passwordForm.controls['ConfirmNewPassword'].value) {
      this._userService.UpdatePassword(this.passwordForm.value).subscribe((data: any) => {
        if (data) {
          this.isShow = false;
          this.isSaved.emit(true);
        }
      }, err => {
        this.isShow = true;
      });
    }
    else {
      this.isNotMatch.emit(true)

    }

  }
}
