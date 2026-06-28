import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorLog } from './error-log';
import { ErrorLogFilter } from './error-log-filter';
import { ErrorLogService } from './error-log.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-error-log',
  templateUrl: './error-log.component.html',
  styleUrls: ['./error-log.component.scss']
})
export class ErrorLogComponent implements OnInit {

  //#region Class Fields & Propertities

  errorLogs: ErrorLog[] = [];

  errorLog: ErrorLog = {};

  selectedProfiles: ErrorLog[] = [];

  submitted: boolean = false;


  // Form Group
  errorLogForm = new FormGroup({
    ProfileId: new FormControl(),
    Name: new FormControl('',Validators.required),
    ShortName: new FormControl('',Validators.required),
    ProfileTypeId: new FormControl('',Validators.required),
    IsActive: new FormControl(true),
  });

  formInitialValues:any = {};

  filterModel:ErrorLogFilter = new ErrorLogFilter();

  loginUserDetail: any = {};
  viewDialog:boolean = false;

  //#endregion

  // #region Constructor

  constructor
  (
    private _errorLogService: ErrorLogService,
    public _authService: AuthService,
  )
  {
  }

  ngOnInit(): void {

    this.getAllWithPagination(this.filterModel);

    this.formInitialValues = this.errorLogForm.value;

    this.loginUserDetail.permission = this._authService.getPermissionsByUrl(window.location.pathname);

  }

  //#endregion

  // #region CUD Operations

  
  //#endregion

  // #region Read Operations
  
  getAll(): void {

    this._errorLogService.get().subscribe((data:any) => this.errorLogs = data);
  }

  getAllWithPagination(profileFilter:ErrorLogFilter): void {

    this._errorLogService.getAllWithPagination(profileFilter).subscribe((data:any) =>{
      
      this.errorLogs = data.List;
      this.filterModel.TotalRecords = data.TotalCount;
    
    });

  }

  get profileFormControl() {

    return this.errorLogForm.controls;

  }

 
  //#endregion

  // #region Helper Methods


  onGlobalFilter(table: Table, event: Event) 
  {
    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;
    if((event.target as HTMLInputElement).value)
      this.filterModel.SearchString = (event.target as HTMLInputElement).value;
    else
      this.filterModel.SearchString = undefined;

    // this.getAllWithProfileType(this.filterModel);
  }


  paginate(event:any)
  {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.filterModel.PageNumber = event.page + 1;
    this.filterModel.PageSize = event.rows;
    this.getAllWithPagination(this.filterModel);
  }

  onSearch()
  {
    
    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;

    if(this.filterModel.SearchString=="")
    {
      delete this.filterModel.SearchString;
      this.getAllWithPagination(this.filterModel);
    } 
    else 
    {
      this.getAllWithPagination(this.filterModel);
    }    
  }

  hideDialog()
  {
    this.viewDialog = false;
    this.errorLog = {};
  }

  showDetail(itemDetail:any)
  {
    this.errorLog = itemDetail;
    this.viewDialog = true;
  }

  //#endregion

}
