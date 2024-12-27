
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les données des posts
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  

  // getMesPosts(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/poste/{id}`);
  // }
  // Méthode pour soumettre un nouveau post
  createPost(postData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-poste`, postData);
  }
  


  updatePost( postData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, postData);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-poste/{id}`);
  }

  toggleLike(postId: number, isLiked:boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/like`, { postId,  isLiked });
  }

  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/postes`);

   
  }

 



  getUserPosts(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/poste/${userId}`);
  }


  isLiked(postId: string, userId: string): Observable<boolean> {
    return this.http.post<boolean>('/api/posts/is-liked', { postId, userId });
  }
}
