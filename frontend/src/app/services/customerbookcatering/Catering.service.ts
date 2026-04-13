import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CateringService {

  private baseUrl = ' https://biconical-sara-counteractive.ngrok-free.dev/api/CateringEvent';

  constructor(private http: HttpClient) {}

  createEvent(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formData);
  }

  updateEvent(eventId: number, formData: FormData): Observable<any> {
  return this.http.put(`${this.baseUrl}/${eventId}`, formData);
}

  getUserEvents(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }
}