import { Component, OnInit,ViewChild,AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Menu } from './menu';
import { MenuService } from './menu.service';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @ViewChild('fileUpload')
  fileUpload!: FileUpload;

  //#region Class Fields & Propertities

  submitted: boolean = false;

  fileInfo: string | undefined;

  menuDialog: boolean = false;

  menus: Menu[] = [];

  menu: Menu = {};

  selectedImage : any;

  deleteMenuDialog: boolean = false;

  // Menu Form Group
  menuForm = new FormGroup({

    MenuId: new FormControl(),
    ModuleId: new FormControl(),
    Name: new FormControl('',Validators.required),
    DisplayName: new FormControl('',Validators.required),
    Url: new FormControl(),
    Icon: new FormControl(),
    ParentId: new FormControl(),
    IsApi:new FormControl(false),
    IsLabel: new FormControl(false),
    IsModule: new FormControl(false),
    IsDisplayMenu: new FormControl(false),
    IsActive: new FormControl(true),
    ImageUrl: new FormControl(),
  });

  showTable:boolean = false;

  modules:any = [];

  formInitialValues:any = {};

  uploadedFiles: any[] = [];

  //#endregion

  // #region Constructor
  constructor
  (
    private _menuService: MenuService
  )
  {

  }

  ngOnInit(): void {

    this.getModules();

    this.formInitialValues = this.menuForm.value;
  }

  //#endregion

  // #region CUD Operations
  saveMenu() {
    this.submitted = true;

    if (this.menuForm.valid)
    {
      this.menu = this.menuForm.value as Menu;
    //   this.menu.MenuId = this.menuForm.controls['MenuId'].value ;
    //   this.menu.DisplayName = this.menuForm.controls['DisplayName'].value || '' ;
    //   this.menu.Name = this.menuForm.controls['Name'].value || '' ;
    //   this.menu.Icon = this.menuForm.controls['Icon'].value ;
    //   this.menu.Url = this.menuForm.controls['Url'].value ;
    //   this.menu.IsApi = this.menuForm.controls['IsApi'].value || false ;
    //   this.menu.IsActive = this.menuForm.controls['IsActive'].value || false ;
    //   this.menu.IsLabel = this.menuForm.controls['IsLabel'].value || false ;
    //   this.menu.IsModule = this.menuForm.controls['IsModule'].value || false ;
    //   this.menu.IsDisplayMenu = this.menuForm.controls['IsDisplayMenu'].value || false ;
    //   this.menu.ParentId = this.menuForm.controls['ParentId'].value ;
    //   this.menu.ModuleId = this.menuForm.controls['ModuleId'].value ;

      this._menuService.create(this.menu).subscribe(data => {
          this.getModules();
          this.menus = [...this.menus];
          this.menuDialog = false;
          this.menu = {};
          this.menuForm.reset(this.formInitialValues);
          this.submitted = false;
      });
    }
  }

  confirmDelete() {
    this.deleteMenuDialog = false;
    this._menuService.delete(this.menu.MenuId || '').subscribe(data => {
      this.menu = {};
      this.getModules();
    });
  }
  //#endregion

  // #region Read Operations

  getModules()
  {

    this._menuService.getAllModules().subscribe((data:any) => this.modules = data);

  }
  //#endregion

  // #region Helper Methods
  openNew(menu?:Menu,parentId:any=0) {

    this.menu = {};
    this.submitted = false;
    this.menuDialog = true;
    this.menuForm.reset(this.formInitialValues);

    if(parentId!= null && parentId!=0)
      this.menuForm.controls["ParentId"].setValue(menu?.MenuId) ;

    if(menu?.IsModule)
      this.menuForm.controls["ModuleId"].setValue(menu?.MenuId) ;
    else
      this.menuForm.controls["ModuleId"].setValue(menu?.ModuleId) ;
  }

  hideDialog() {
    this.menuDialog = false;
    this.submitted = false;
  }

  deleteMenu(menu: Menu) {
    this.deleteMenuDialog = true;
    this.menu = { ...menu };
  }

  get menuFormControl() {
    return this.menuForm.controls;
  }

  editMenu(menu: Menu) {

    this.menuForm.reset(this.formInitialValues);
    this.menu = { ...menu };
    this.menuDialog = true;

    Object.keys(this.menuForm.value).forEach((key:any) => {
      this.menuForm.controls[key as keyof typeof this.menuForm.value].setValue(menu[key as keyof typeof menu]) ;

    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.menus.length; i++) {
        if (this.menus[i].MenuId === id) {
            index = i;
            break;
        }
    }

    return index;
  }

  moduleSelection(event:any)
  {
    if(event.checked)
    {
      this.menuForm.controls["IsLabel"].setValue(false);
      this.menuForm.controls["IsApi"].setValue(false);
      return
    }


  }

  labelSelection(event:any)
  {
    if(event.checked)
    {
      this.menuForm.controls["IsModule"].setValue(false);
      this.menuForm.controls["IsApi"].setValue(false);
      this.menuForm.controls["Url"].setValue('');
      return
    }
  }

  apiSelection(event:any)
  {
    if(event.checked)
    {
      this.menuForm.controls["IsLabel"].setValue(false);
      this.menuForm.controls["IsModule"].setValue(false);
      return
    }
  }

  onUpload(event:any)
  {
      this.uploadedFiles = [];
       
      for (let file of event.files) {
          this.menuForm.patchValue({ ImageUrl: file });
          this.menuForm.get('ImageUrl')?.updateValueAndValidity();

          var reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = (_event) => {
              this.menuForm.controls['Icon'].setValue(_event.target?.result);
              this.uploadedFiles.push(_event.target?.result);
              this.menuForm.controls['ImageUrl'].setValue(this.uploadedFiles[0]);
              this.fileUpload.clear();
          }

          // this.uploadedFiles.push(this._sanitizer.bypassSecurityTrustStyle(file.objectURL.changingThisBreaksApplicationSecurity));
        }
  }

  removeimg(item:any)
  {
      const index = this.uploadedFiles.indexOf(item, 0);

      if (index > -1)
      {
          this.uploadedFiles.splice(index, 1);
          this.fileUpload.clear();
      }
  }

//   onFileSelect(input: HTMLInputElement): void {

//     /**
//      * Format the size to a human readable string
//      *
//      * @param bytes
//      * @returns the formatted string e.g. `105 kB` or 25.6 MB
//      */
//     function formatBytes(bytes: number): string {
//       const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
//       const factor = 1024;
//       let index = 0;

//       while (bytes >= factor) {
//         bytes /= factor;
//         index++;
//       }

//       return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
//     }

//     var file = input.files![0];
//     ;
//     this.fileInfo = `${file.name} (${formatBytes(file.size)})`;
//   }

  onFileSelect(event : any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        this.selectedImage = reader.result;
        this.menuForm.controls['ImageUrl'].setValue(reader.result);
        console.log(this.menuForm.value);

    };
}

removeImage(){
    this.selectedImage = '';
    this.menuForm.controls['ImageUrl'].setValue('');
}

  //#endregion






}
