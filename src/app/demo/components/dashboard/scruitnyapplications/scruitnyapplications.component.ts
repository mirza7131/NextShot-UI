import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription, debounceTime } from 'rxjs';
import { ApiService } from 'src/Services/api.service';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-scruitnyapplications',
  standalone: false,
  providers: [MessageService],
//   imports: [],
  templateUrl: './scruitnyapplications.component.html',
  styleUrl: './scruitnyapplications.component.scss'
})
export class ScruitnyapplicationsComponent {
  @ViewChild('table', { static: true }) table: Table;

  items!: MenuItem[];
  products!: Product[];
  chartData: any;
  chartOptions: any;
  subscription!: Subscription;

  public applications: any = [];
  public dashboard: any = [];

  public selectedDrop: any;
  public AffliationType: any = [];

  public filename : string = 'Grant Applications';

  public OriginalApplications: any = [];
  public user : any = {};
  cols: any[] = [];

  constructor(private productService: ProductService, public layoutService: LayoutService,private apiService: ApiService,private router: Router) {
      this.subscription = this.layoutService.configUpdate$
      .pipe(debounceTime(25))
      .subscribe((config) => {
          this.initChart();
      });
  }

   ngOnInit()
   {
      this.user.token = localStorage.getItem('token');
      this.user.username = localStorage.getItem('username');
      this.user.roles = localStorage.getItem('roles') || '[]';
      this.user.roles = JSON.parse(this.user.roles);
      this.user.email = localStorage.getItem('email');
      this.user.userId = localStorage.getItem('userId');

      this.table.first = 0;
      this.initChart();
  

      this.items = [
          { label: 'Add New', icon: 'pi pi-fw pi-plus' },
          { label: 'Remove', icon: 'pi pi-fw pi-minus' }
      ];

      this.AffliationType =  [
        { label: 'NEB', value: { id: 1, name: 'Affliated With NEB' } },
        { label: 'University', value: { id: 2, name: 'Affliated With University' } },
        { label: 'PMF', value: { id: 3, name: 'Affliated With PMF' } },
        { label: 'Punjab Pharmacy Council', value: { id: 4, name: 'Punjab Pharmacy Council' } },
        { label: 'Others', value: { id: 5, name: 'Others' } }
     ];

     this.cols = [
      { field: 'InstituteName', header: 'Institute Name' },
      { field: 'PrincipalName', header: 'Principal Name ' },
      { field: 'Mobile', header: 'Phone Number' },
      { field: 'Email', header: 'Email' },
      { field: 'OwnerName', header: 'Owner Name' },
      { field: 'ApplicationStatus', header: 'Application Status' },
     ];


      this.GetCounts();
      this.getApplication();
  }

  // exportToExcel() {
  //     // Define the columns you want to export
  //     const columnsToExport = ['InstituteName', 'PrincipalName', 'Mobile', 'Email', 'OwnerName', 'ApplicationStatus'];
    
  //     // Set the visible columns in the table
  //     this.table.columns = this.cols.filter(col => columnsToExport.includes(col.field));
    
  //     // Transform the 'ApplicationStatus' values before exporting
  //     const transformedData = this.table.value.map(row => {
  //       return {
  //         ...row,
  //         ApplicationStatus: row.ApplicationStatus == 1 ? 'Submitted' : 'Incomplete'
  //       };
  //     });
    
  //     // Set the transformed data to the table (assuming your table has a 'value' property)
  //     this.table.value = transformedData;
    
  //     // Export the CSV with the visible columns and transformed data
    
  //     this.table.exportCSV();
    
  //     // Reset the visible columns to the original state if needed
  //     this.table.columns = this.cols;
  // }
    

  exportToExcel() {
      // Define the columns you want to export
      const columnsToExport = ['InstituteName', 'PrincipalName', 'Mobile', 'Email', 'OwnerName', 'ApplicationStatus'];
  
      // Set the visible columns in the table
      this.table.columns = this.cols.filter(col => columnsToExport.includes(col.field));
  
      // Transform the 'ApplicationStatus' values before exporting
      const transformedData = this.table.value.map(row => {
          return {
              ...row,
              ApplicationStatus: row.IsLocked ? 'Submitted' : 'Incomplete'
          };
      });
  
      // Set the transformed data to the table (assuming your table has a 'value' property)
      this.table.value = transformedData;
  
      // Export the CSV with the visible columns and transformed data
      this.table.exportCSV();
  
      // Reset the visible columns to the original state if needed
      this.table.columns = this.cols;
  }
  
  
    

 
    


  initChart() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.chartData = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
              {
                  label: 'First Dataset',
                  data: [65, 59, 80, 81, 56, 55, 40],
                  fill: false,
                  backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                  borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                  tension: .4
              },
              {
                  label: 'Second Dataset',
                  data: [28, 48, 40, 19, 86, 27, 90],
                  fill: false,
                  backgroundColor: documentStyle.getPropertyValue('--green-600'),
                  borderColor: documentStyle.getPropertyValue('--green-600'),
                  tension: .4
              }
          ]
      };

      this.chartOptions = {
          plugins: {
              legend: {
                  labels: {
                      color: textColor
                  }
              }
          },
          scales: {
              x: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              },
              y: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              }
          }
      };
  }

  ngOnDestroy() {
      if (this.subscription) {
          this.subscription.unsubscribe();
      }
  }

   GetCounts()
   {
        let TypeId = null;
        if(this.user.username == "1111111111111")
        {
            TypeId = 4;
        }
        if(this.user.username == "2222222222222")
        {
            TypeId = 2;
        }
        if(this.user.username == "3333333333333")
        {
            TypeId = 1;
        }
        if(this.user.username == "4444444444444")
        {
            TypeId = 3;
        }

        this.apiService.get('Application', 'ScrutinyDashboard', {TypeId: TypeId}).subscribe(response => {
          if(response)
          {
            this.dashboard = response;
          }
      });
   }


    getApplication()
   {
        let TypeId = null;

        if(this.user.username == "1111111111111")
        {
            TypeId = 4;
        }
        if(this.user.username == "2222222222222")
        {
            TypeId = 2;
        }
        if(this.user.username == "3333333333333")
        {
            TypeId = 1;
        }
        if(this.user.username == "4444444444444")
        {
            TypeId = 3;
        }

        this.apiService.get('Application', 'GetScrutinyApplications', {TypeId: TypeId}).subscribe(response => {
            if(response)
            {
              debugger
              this.applications = response;
              this.OriginalApplications = response;
            }
        });
    }
  

    FilterStatus(statusId: number)
   {
      this.table.first = 0;

      if(statusId == 1)
      {
        this.applications = this.OriginalApplications.filter(x=> x.StatusId == 1);
      }

      if(statusId == 2)
      {
        this.applications = this.OriginalApplications.filter(x=> x.StatusId == 2);
      }
     
      if(statusId == 3)
      {
        this.applications = this.OriginalApplications.filter(x=> x.StatusId == 3);
      }

      if(statusId == 4)
      {
        this.applications = this.OriginalApplications.filter(x=> x.StatusId == 4);
      }
   }

    navigateToDetails(grantApplicationId: string, userId: string): void {
      debugger
      // Use the Router to navigate to the DetailsComponent with parameters
      // this.router.navigate(['dashboard/details', grantApplicationId]);

      const url = this.router.serializeUrl(this.router.createUrlTree(['dashboard/details', grantApplicationId], { queryParams: { userId } }));

      // Open the URL in a new tab
      window.open(url, '_blank');
   }

  onDropdownChange(event: any): void {
      let TypeId = null;
      this.table.first = 0;
      if(this.selectedDrop)
      {
          TypeId = this.selectedDrop.id ;
          this.apiService.get('Application', 'GetApplications', {TypeId: TypeId}).subscribe(response => {
              if(response)
              {
                debugger
                this.applications = response;
                this.OriginalApplications = response;
              }
           });
      }
      else
      {
          this.GetCounts();
          this.apiService.get('Application', 'GetApplications', null).subscribe(response => {
              if(response)
              {
                debugger
                this.applications = response;
                this.OriginalApplications = response;
              }
           });
      }
  }

}
