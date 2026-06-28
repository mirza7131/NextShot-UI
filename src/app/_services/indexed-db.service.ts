import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';


@Injectable({
providedIn: 'root'
})

export class IndexedDbService 
{
    
    constructor(private dbService: NgxIndexedDBService) 
    {  
    }

    // Set the data to indexed db


    setValue(): Observable<any> {
       return  this.dbService.add('people', {
            name: `Bruce Wayne`,
            email: `bruce@wayne.com`,
        });
       
    }

  

}