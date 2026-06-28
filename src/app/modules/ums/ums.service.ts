import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
// import { Config } from 'src/app/_helpers/config.class'; 
import { Observable } from 'rxjs';  
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UmsService  {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json, application/x-www-form-urlencoded',
      'Authorization':"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IntcIlVzZXJJZFwiOlwiMzllNjBkOWItNDhhMy00NWMzLThjZTgtMDFhNmJhNjczYjA3XCIsXCJGaXJzdE5hbWVcIjpcInVzbWFuXCIsXCJMYXN0TmFtZVwiOm51bGwsXCJFbWFpbFwiOlwibWFhbmhhaWRlcjAxQGdtYWlsLmNvbVwiLFwiVXNlcm5hbWVcIjpudWxsLFwiQ25pY1wiOm51bGwsXCJNb2JpbGVOb1wiOm51bGwsXCJIZklkXCI6bnVsbCxcIklzU3VwZXJBZG1pblwiOmZhbHNlLFwiVXNlclJvbGVzXCI6bnVsbCxcIlRva2VuXCI6bnVsbH0iLCJuYmYiOjE2NjkzNTIzMDksImV4cCI6MTY2OTQzODcwOSwiaWF0IjoxNjY5MzUyMzA5LCJpc3MiOiJITUlTIiwiYXVkIjoiSE1JUyJ9.WC5TbYyZpGriArWWUfPoE_0D2PtnaIevBt6ytU9zukM"
    })
  }

  constructor(private http: HttpClient) {
  }

  
}
