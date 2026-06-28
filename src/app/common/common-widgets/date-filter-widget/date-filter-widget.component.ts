// import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-filter-widget',
  templateUrl: './date-filter-widget.component.html',
  styleUrls: ['./date-filter-widget.component.scss']
})
export class DateFilterWidgetComponent implements OnInit {

  @Input() dateFiltersModel? : any;

  public Datefrom = new Date();
  public Dateto = new Date();
  minDate: string;
  maxDate: string;

  // constructor(private datePipe: DatePipe) {}
  constructor() {}
  ngOnInit(): void {

    // console.log('USerFilterDateFilter',this.dateFiltersModel);

    //currentDate.setHours(5, 0, 0, 0);

    // let DatefromHour = this.Datefrom.setHours(5, 0, 0, 0);
    // let DatetoHour = this.Dateto.setHours(28, 59, 59, 0);

    // const minDateValue = new Date(this.Datefrom);
    // minDateValue.setDate(this.Datefrom.getDate() - 30);

    // this.minDate = minDateValue.toISOString().slice(0, 16);
    // this.maxDate = this.Datefrom.toISOString().slice(0, 16);



    // this.dateFiltersModel.StartDate = this.Datefrom.toISOString().slice(0, 16);
    // this.dateFiltersModel.EndDate = this.Dateto.toISOString().slice(0, 16);
  }



  updateEndDateMax() {
    //if (this.dateFiltersModel.StartDate) {
      const startDate = new Date(this.dateFiltersModel.StartDate);
      const endDate = new Date(startDate);
      const endDatereflection = new Date(startDate).setHours(28, 59, 59, 0);
      endDate.setDate(startDate.getDate() + 31); // Set End Date 30 days after Start Date
      this.maxDate = endDate.toISOString().split('.')[0]; // Format as datetime-local input
    // } else {
    //   this.maxDate = null; // If Start Date is not selected, clear the maxDate
    // }
      this.dateFiltersModel.EndDate = new Date(endDatereflection).toISOString().split('.')[0];

  }
}
