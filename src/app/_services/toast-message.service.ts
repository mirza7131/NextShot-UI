import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastMessageService {

  constructor(private _messageService : MessageService) { }

    showInfoMessage(message:string) {
        this._messageService.add({ key: 'info', severity: 'info', summary: 'Info Message', detail: message ,life: 3000 });
    }

    showWarnMessage(message:string) {
        this._messageService.add({ key: 'warn', severity: 'warn', summary: 'Warn Message', detail: message });
    }

    showSuccessMessage(message:string) {
        this._messageService.add({ key: 'success', severity: 'success', summary: 'Success Message', detail: message });
    }

    showErrorMessage(message:string) {
        this._messageService.add({ key: 'error', severity: 'error', summary: 'Error Message', detail: message , life: 3000 });
    }

}
