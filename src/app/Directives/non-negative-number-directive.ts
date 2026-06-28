import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Directive({
  selector: '[appNonNegativeNumber]'
})

export class NonNegativeNumberDirective 
{
  constructor(private el: ElementRef, private control: NgControl, private messageService: MessageService) {}

  @HostListener('input', ['$event']) onInput(event: Event): void 
  {
    const inputValue = this.el.nativeElement.value;
    const isValid = /^\d+(\.\d{1,2})?$/.test(inputValue) && inputValue >= 0;
    if (!isValid) {
      this.control.control?.setValue(this.control.control?.value == undefined);
      this.showErrorViaToast("Error","-ve value is not allowed");
    }
  }

  @HostListener('keydown', ['$event']) onImport(event: Event): void 
  {
    const inputValue = this.el.nativeElement.value;
    const isValid = /^\d+(\.\d{1,2})?$/.test(inputValue) && inputValue >= 0;
    if (!isValid) {
      this.control.control?.setValue(this.control.control?.value == undefined);
      this.showErrorViaToast("Error","-ve value is not allowed");
    }
  }

  showErrorViaToast(summary: string, detail: string) {
    this.messageService.add({ key: 'tst', severity: 'error', summary, detail });
  }
}
