import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonEvent } from '../modules/table.modules';

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {
  private apiUrl = '/api/data'; 

  constructor(private http: HttpClient) {}

  getData(): Observable<CommonEvent[]> {
    return this.http.get<CommonEvent[]>(this.apiUrl);
  }

  postData(data: CommonEvent): Observable<CommonEvent> {
    return this.http.post<CommonEvent>(this.apiUrl, data);
  }

  putData(data: CommonEvent): Observable<CommonEvent> {
    return this.http.put<CommonEvent>(this.apiUrl, data);
  }

  deleteData(id: number): Observable<Partial<CommonEvent>> {
    return this.http.request('DELETE', this.apiUrl, { body: { eventId: id } });
  }
}
