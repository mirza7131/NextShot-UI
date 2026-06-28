import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';


@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  invokeFirstComponentFunction = new EventEmitter();    
  subsVar: Subscription = new Subscription; 

  // private HfIdSource = new BehaviorSubject(0);
  
  constructor () {

    // public editDataDetails: any = [];
    // public subject = new Subject<any>();
    // private messageSource = new  BehaviorSubject("");
    
    // currentMessage = this.messageSource.asObservable();

    // changeMessage(message: string) {
    //   this.messageSource.next(message)
    // }

  }
  
  // onFirstComponentButtonClick() { 
  //       
  //   this.invokeFirstComponentFunction.emit();    
  // } 
}
