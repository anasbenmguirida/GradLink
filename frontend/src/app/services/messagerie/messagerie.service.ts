import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MessagerieService {

  private apiUrl = 'test.json';  // Remplacez par l'URL de votre backend
  private messageUrl = 'message.json'; 
    constructor(private http: HttpClient) { }


    getMessagesByUser(userId: number, authId: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}?userId=${userId}&authId=${authId}`);
    }
    
    getUsersMessages(currentUserId: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.messageUrl}?currentUserId=${currentUserId}`);
    }


    sendMessage(senderId: number, receiverId: number, content: string): Observable<any> {
      const payload = { senderId, receiverId, content };
      return this.http.post(`${this.apiUrl}/send`, payload);
    }


    getAllUsers(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/all`);
    }
  
}
