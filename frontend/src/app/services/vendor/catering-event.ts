import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CateringEvent {
  eventId: number;
  eventType: string;
  eventDate: string;
  numberOfGuests: number;
  eventStartTime: string;
  eventEndTime: string;
  eventLocation: string;
  budgetRange: string;
  additionalNote: string;
  cateringDetailFile: string;
  createdAt: string;
  updatedAt: string;
  vendorId: number;
  userId: number;
  eventStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class VendorMealCateringService {

  private api = 'https://a711-192-197-60-11.ngrok-free.app/api/events';

  constructor(private http: HttpClient) {}

  // ✅ Get events by vendor
  getEvents(vendorId: number): Observable<CateringEvent[]> {
    return this.http.get<CateringEvent[]>(`${this.api}/vendor/${vendorId}`);
  }

  // ✅ Update status
  updateStatus(eventId: number, status: string) {
    return this.http.put(`${this.api}/${eventId}/status`, `"${status}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // ✅ Send details + file
  sendDetails(eventId: number, formData: FormData) {
    return this.http.post(`${this.api}/${eventId}/send-details`, formData);
  }
}