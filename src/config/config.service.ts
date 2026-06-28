import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public apiUrl: string;
  constructor() {
    this.apiUrl = environment.apiUrl;
  }
}
