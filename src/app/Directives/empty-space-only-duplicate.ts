import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Directive({
  selector: '[SpaceOnlyPreventDuplicate]'
})

export class EmptySpaceOnlyDuplicate 
{
  constructor(private el: ElementRef, private control: NgControl, private messageService: MessageService) {}
  
  @HostListener('input', ['$event']) onInput(event: Event): void 
  {
    debugger
    let inputValue = this.el.nativeElement.value;
   
    const isValid = !/^\s+$/.test(inputValue);
    if (!isValid) {
      this.control.control?.setValue(this.control.control?.value.trim() === '' ? '' : this.control.control?.value);
      this.showErrorViaToast("Error","Only Blank Spaces are not allowed");
    }
  }

  showErrorViaToast(summary: string, detail: string) {
    this.messageService.add({ key: 'tst', severity: 'error', summary, detail });
  }
}
