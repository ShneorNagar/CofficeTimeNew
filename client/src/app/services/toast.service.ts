import { Injectable } from '@angular/core';
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) {}

  displaySuccessToast(message: string, detail?: string){
    this.displayToast('success', message, detail);
  }

  displayInfoToast(message: string, detail?: string){
    this.displayToast('info', message, detail);
  }

  displayWarningToast(message: string, detail?: string){
    this.displayToast('warning', message, detail);
  }

  displayErrorToast(message: string, detail?: string){
    this.displayToast('error', message, detail);
  }

  private displayToast(severity: string, summary: string, detail?: string){
    this.messageService.add({
      severity,
      summary,
      detail,
      key: 'tl'
    })
  }
}
