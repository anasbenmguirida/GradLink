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
  saveCommunity(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
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
  updatePost(communityId: number, postId: number, updatedPost: any): Observable<any> {
    const url = `${this.apiUrl}/${communityId}/posts/${postId}`;
    return this.http.put(url, updatedPost);
  }
}
