import { Component } from '@angular/core';
import { ApplicationService } from '../application.service';
import { RegisterSPDTO, SpServiceDto } from './register-sp.model';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-register-company',
  standalone: false,
 
  templateUrl: './register-company.component.html',
  styleUrl: './register-company.component.scss'
})
export class RegisterCompanyComponent {
  services:[];
  divisions = [];
  allDistricts =[];
  districts=[];
  selectedDivision:string;
  registerData = new RegisterSPDTO({ spServices: [ new SpServiceDto(), ] });
  selectedServices: string[] = [];
  imageUrl: string;
  imagePreviewUrl: string;
  fieldErrors:any;
  constructor(
    private messageService: MessageService,
    private appService:ApplicationService,
    ) {}
    ngOnInit() {
      this.getAllDivisions();
      this.GetServiceTypes();
      this.fieldErrors = {
        name: '',
        services: '',
        division: '',
        district: '',
        address: '',
        ownerName: '',
        ownerCnic: '',
        ownerMob: '',
        logo: '',
        banner: '',
    };
    }

    getAllDivisions() {
      this.appService.GetAllDivisions().subscribe(res => {
        console.log('API Response:', res);  // Log the raw response data to see the structure
    
        // Check if the response is an array
        if (res.data && Array.isArray(res.data)) {
          this.divisions = res.data;
        } else {
          console.error('Error: data is not an array or is empty');
        }
      }, error => {
        console.error('Error fetching data:', error);
      });
    }
    getAllDistricts(selectedValue: any) {
      debugger
        console.log("this.selectedDivision",this.selectedDivision)
         this.appService.GetAllDistricts(selectedValue).subscribe(res => {
          console.log('API Response:', res);  // Log the raw response data to see the structure
    
         // Check if the response is an array
          if (res.data && Array.isArray(res.data)) {
          this.districts= res.data;
          } else {
          console.error('Error: data is not an array or is empty');
          }
        }, error => {
         console.error('Error fetching data:', error);
       });
      } 
      GetServiceTypes() {
        this.appService.GetServiceTypes().subscribe(res => {
          console.log('API Response:', res);  // Log the raw response data to see the structure
      
          // Check if the response is an array
          if (res.data && Array.isArray(res.data)) {
            this.services = res.data;
          } else {
            console.error('Error: data is not an array or is empty');
          }
        }, error => {
          console.error('Error fetching data:', error);
        });
      }
 
 

  // Function to handle banner upload event
  onLogoUpload(event) {
    
    const uploadedFile = event.files[0]; 
    this.registerData.logo = uploadedFile.objectURL.changingThisBreaksApplicationSecurity
    ; 
    console.log('this.registerData.logo', this.registerData.logo);
  }
  onBannerUpload(event) {
    
    const uploadedFile = event.files[0]; 
    this.registerData.banner = uploadedFile.objectURL.changingThisBreaksApplicationSecurity
    ; 
    console.log('this.registerData.banner', this.registerData.banner);
  }
  onFileSelect(event) {
    const file = event.files[0];  // Get the first file selected

    // Ensure the file is an image
    if (file && file.type.startsWith('image')) {
      const reader = new FileReader();

      // Convert the image to a base64 string
      reader.onload = (e: any) => {
        // The result is a base64-encoded string
        this.registerData.banner = e.target.result;
      };

      // Read the file as a data URL (base64)
      reader.readAsDataURL(file);
    } else {
      console.error('Please select a valid image file.');
    }
  }
  validate():boolean {
    debugger
    this.fieldErrors = {};
    if (!this.registerData.name) {
      this.fieldErrors.name = 'Company Name is required.';
    }
    if (!this.selectedServices) {
      this.fieldErrors.services = 'Please select at least one Service.';
    }
    if (!this.selectedDivision) {
      this.fieldErrors.division = 'Please select a Division.';
    }
    if (!this.registerData.districtCode) {
      this.fieldErrors.district = 'Please select a District.';
    }
    if (!this.registerData.address) {
      this.fieldErrors.address = 'Address is required.';
    }
    if (!this.registerData.ownerName) {
      this.fieldErrors.ownerName = 'Owner Name is required.';
    } 
    if (!this.registerData.owneCnic) {
      this.fieldErrors.owneCnic = 'Owner CNIC is required.';
    } 
    if (!this.registerData.ownerMob) {
      this.fieldErrors.ownerMob = 'Owner Mobile is required.';
    } 
    if (!this.registerData.banner) {
      this.fieldErrors.banner = 'Upload a Banner.';
    } 
    if (!this.registerData.logo) {
      this.fieldErrors.logo = 'Upload a Logo.';
    } 

  
    const hasErrors = Object.values(this.fieldErrors).some(msg => msg);
    if (hasErrors) {
      console.error('Please correct the errors before proceeding:', this.fieldErrors);
      Object.entries(this.fieldErrors).forEach(([field, message]) => {
        console.log('Field:', field, 'Message:', message);
        if (message) {
          try {
            this.showErrorViaToast('Validation Error', message as string);
          } catch (error) {
            console.error('Toaster error:', error);
          }
        }
      });
      return false
    }
    else{return true}
  
  }
  isFormValid(): boolean {
    debugger
    return this.validate();
  }
  cleanOwnerMobile() {
    // Removing non-numeric characters from the mobile number
    if (this.registerData.ownerMob) {
      this.registerData.ownerMob = this.registerData.ownerMob.replace(/\D/g, ''); // Removes non-digits
    }
  }
  Mapping(){
  
    this.registerData.spServices = this.selectedServices.map(serviceId => new SpServiceDto(({ serviceTypeId: serviceId })));
    this.registerData.divisionCde = this.selectedDivision;
    //this.cleanOwnerMobile();
    console.log('this.registerData',this.registerData)
  }

  OnRegister(){
    if(this.isFormValid()){
      this.Mapping()
      this.appService.RegisterCompany(this.registerData).subscribe({
        next: (response) => {
          console.log('Company Registered successfully', response);
          this.showSuccessViaToast("Success", response.Message);
          
        },
        error: (error) => {
          console.error('Error Registering Company', error);
          this.showErrorViaToast("Error", "Something Went Wrong !") 
        }
      });
    
    }
  }
  showInfoViaToast(summary: string, detail: string) {
    this.messageService.add({ key: 'tst', severity: 'info', summary, detail });
 }

  showWarnViaToast(summary: string, detail: string) {
    this.messageService.add({ key: 'tst', severity: 'warn', summary, detail });
  }

  showErrorViaToast(summary: string, detail: string) {
    debugger
    this.messageService.add({ key: 'tst', severity: 'error', summary, detail });
  }

  showSuccessViaToast(summary: string, detail: string) {
    this.messageService.add({ key: 'tst', severity: 'success', summary, detail });
  }

}
