
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'test.json'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les données des posts
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  

  getMesPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  // Méthode pour soumettre un nouveau post
  createPost(postData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, postData);
  }


  updatePost( postData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, postData);
  }


  toggleLike(postId: number, isLiked:boolean): Observable<any> {
    return this.http.post(this.apiUrl, { postId,  isLiked });
  }

  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }



  getUserPosts(userId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?userId=${userId}`);
  }


  isLiked(postId: string, userId: string): Observable<boolean> {
    return this.http.post<boolean>('/api/posts/is-liked', { postId, userId });
  }
}
