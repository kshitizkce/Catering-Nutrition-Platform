import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WeeklyPreferenceDto {
  vendorId: number;
  vendorName: string;
  items: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  private apiUrl = 'http://localhost:5197/api/preference';

  constructor(private http: HttpClient) {}

  // ✅ Get weekly preference by userId
  getWeeklyPreference(userId: number): Observable<WeeklyPreferenceDto[]> {
    return this.http.get<WeeklyPreferenceDto[]>(
      `${this.apiUrl}/user/${userId}/weekly-preference`
    );
  }
}