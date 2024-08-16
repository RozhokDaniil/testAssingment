import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {
  private apiUrl = '/api/data'; 

  constructor(private http: HttpClient) {}

  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  postData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  putData(data: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, data);
  }

  deleteData(id: number): Observable<any> {
    return this.http.request('DELETE', this.apiUrl, { body: { eventId: id } });
  }
}
