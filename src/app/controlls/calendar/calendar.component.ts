import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }


  @Input() control: FormControl
  @Input() dateFormat: string = 'dd/mm/yy'

  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() label: string = 'Calender';
  @Input() selectionMode: string = '';

  @Input() showButtonBar: boolean = false;
  @Input() showTime: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showSeconds: boolean = false;
  @Input() view = '';
  @Input() touchUI: boolean = false;
  @Input() inline: boolean = false;
  @Input() validate: boolean = false;
  @Output() onSelect = new EventEmitter()


  public emitSelectedValue($event:any) {
    this.onSelect.emit($event)
  }

}
