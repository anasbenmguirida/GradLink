// community.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  
  
  private apiUrl = 'http://localhost:8080/api/admin'; 
  private baseUrl = 'http://localhost:8080/api/communities'; 

  constructor(private http: HttpClient) {}

  getCommunities(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAllCommunities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }
  saveCommunity(data: any,adminId: number): Observable<any> {
    const params = new HttpParams().set('adminId', adminId.toString()); // Ajout du paramètre adminId

    return this.http.post(`${this.apiUrl}/caummunaute`, data, { params });
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
    return this.http.delete<void>(`${this.apiUrl}/caummunaute/${communityId}`);
  }
  updatePost(communityId: number, postId: number, updatedPost: any): Observable<any> {
    const url = `${this.apiUrl}/${communityId}/posts/${postId}`;
    return this.http.put(url, updatedPost);
  }
}
