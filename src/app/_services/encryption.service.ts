import { Injectable } from '@angular/core';
// var CryptoJS = require("crypto-js");
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EncryptionService {

    constructor() { }

    encrypt(data : string) {
         return CryptoJS.AES.encrypt(data.trim(), environment.encryptionPassword!.trim()).toString();
       // return data;
    }

    decrypt(data : string) {
        return CryptoJS.AES.decrypt(data!.trim(), environment.encryptionPassword!.trim()).toString(CryptoJS.enc.Utf8);
      //  return data;
    }
}
