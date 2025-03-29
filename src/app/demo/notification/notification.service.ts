// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from './Notification.model';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8080/api/notifications'; // Adjust to your backend URL

  constructor(private http: HttpClient) {}

  getAllUnreadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/unread`);
  }

  markAsRead(notificationId: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/mark-as-read/${notificationId}`, {});
  }

  sendNotification(accountId: number, type: string, message: string, smeLoanId?: number): Observable<Notification> {
    const params: any = { accountId, type, message };
    if (smeLoanId) {
      params.smeLoanId = smeLoanId;
    }
    return this.http.post<Notification>(`${this.apiUrl}/send`, null, { params });
  }
}