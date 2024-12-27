// community.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  private apiUrl = '/api'; 

  constructor(private http: HttpClient) {}

  getCommunities(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Récupérer les messages d'une catégorie
  getMessagesByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages?categoryId=${categoryId}`);
  }

  // Publier un nouveau message
  postMessage(message: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/messages`, message);
  }

  deleteCommunity(communityId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${communityId}`);
  }
}
