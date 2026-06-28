import { Component, Input, OnInit, Output,EventEmitter, OnChanges } from '@angular/core';
import { id } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-patient-fingerprint',
  templateUrl: './patient-fingerprint.component.html',
  styleUrls: ['./patient-fingerprint.component.scss']
})
export class PatientFingerprintComponent implements OnInit,OnChanges {
    patientFingerPrint:any="assets/layout/images/fingerprint_placeholder.png";
  constructor() { }

  ngOnInit(): void {
     ;
    if(this.ptFngPrt){
        this.patientFingerPrint=this.ptFngPrt;
    }
  }

  ngOnChanges(): void {
    // console.log(this.patientFingerPrint);
    // console.log(this.ptFngPrt);
    if(this.ptFngPrt){
        this.patientFingerPrint=this.ptFngPrt;
    }
  }


  @Input() fingerPrints: any = []
  @Input() isPatientBioMatric:boolean=false;
  @Input() ptFngPrt:string;

  @Output() eventEmitter = new EventEmitter<any>();


  onFingerPrint($event:any,Id:any) {
    this.eventEmitter.emit({$event:$event,id:`ThumbFinger${Id}Hidden`});
  }
}
