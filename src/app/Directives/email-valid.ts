import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Directive({
  selector: '[onlyalphabets]'
})

export class EmailValid 
{
  constructor(private el: ElementRef, private control: NgControl, private messageService: MessageService) {}
  
  @HostListener('input', ['$event']) onInput(event: Event): void 
  {
    let inputValue = this.el.nativeElement.value;
    if(inputValue != "")
    {
        const alphabetAndSpacePattern = /^[a-zA-Z\s]+$/;
        const cleanedString = this.removeNumbersAndSpecialCharacters(inputValue);
        const isValid = alphabetAndSpacePattern.test(inputValue);
        if (!isValid)
        {
          this.control.control?.setValue(cleanedString);
          this.showErrorViaToast("Error","Only Aplhabets are Allowed");
        }
    }
  }

  showErrorViaToast(summary: string, detail: string) {
    this.messageService.add({ key: 'tst', severity: 'error', summary, detail });
  }

  removeNumbersAndSpecialCharacters(inputString) {
    // Use a regular expression to replace numbers and special characters with an empty string
    return inputString.replace(/[^a-zA-Z\s]/g, '');
  }
}
