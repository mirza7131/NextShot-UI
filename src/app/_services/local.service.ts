import { Injectable } from '@angular/core';
import { EncryptionService } from './encryption.service';


@Injectable({
providedIn: 'root'
})

export class LocalService 
{
    
    constructor(private encryptionService: EncryptionService) 
    {  
    }

    // Set the data to local storage
    setValue(key: string, value: any) {

        // this is to remove null parameters from HFDepartmentSectionDropdown to reduce localstorage space
        if(key == 'alllocations') {
            if(value.HfDepartmentSectionDropdown?.length > 0) {
                value.HfDepartmentSectionDropdown = this.removeNullValues(value.HfDepartmentSectionDropdown)
            }
        }
        localStorage.setItem(key, JSON.stringify(value));
    }

    // Get the value from local storage
    getValue(key: string) {
        
        if(localStorage.getItem(key) === null)
        {
            return null;
        }
        else
            return JSON.parse(localStorage.getItem(key) || '{}');
    }


    // Set the data to local storage
    setEncryptedValue(key: string, value: any) {
        localStorage.setItem(key, this.encryptionService.encrypt(JSON.stringify(value)));
    }

    // Get the value from local storage
    // getEncryptedValue(key: string) {
        
    //     if(localStorage.getItem(key) === null)
    //     {
    //         return null;
    //     }
    //     else
    //         return JSON.parse(this.encryptionService.decrypt(localStorage.getItem(key) || '{}'));
    // }


    getEncryptedValue(key: string) {
        debugger
        const storedValue = localStorage.getItem(key);
        if(storedValue === null) {
            return null;
        }
        return JSON.parse(storedValue);
    }

    // Clear the local storage
    clearToken() 
    {
        localStorage.clear();
    }

    removeNullValues(obj: any): any {
        if (typeof obj !== 'object' || obj === null) {
          return obj;
        }
      
        if (Array.isArray(obj)) {
          // If it's an array, remove null values from each element in the array.
          return obj.map((item) => this.removeNullValues(item));
        }
      
        // If it's an object, remove null values from its properties.
        return Object.keys(obj).reduce((acc:any, key) => {
          const cleanedValue = this.removeNullValues(obj[key]);
          if (cleanedValue !== null) {
            acc[key] = cleanedValue;
          }
          return acc;
        }, {});
    }
}