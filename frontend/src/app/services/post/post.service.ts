
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api'; // Remplacez par l'URL de votre backend
  //private apiUrl = 'test.json';
  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les données des posts
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/postes`);
  }
  

  // getMesPosts(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/poste/{id}`);
  // }
  // Méthode pour soumettre un nouveau post
  createPost(postData: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    console.log("Token récupéré depuis localStorage :", token);

    // Si le token est null, vérifiez s'il est bien stocké
    if (!token) {
        console.error('Token manquant !');
    }

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    console.log("Fichiers dans servuce'files[]' :");
    const files = postData.getAll('files[]');
    files.forEach((file: any, index: number) => {
      console.log(`File ${index + 1}:`, file);
    });

  
     
    return this.http.post<any>(`${this.apiUrl}/create-poste`, postData);
  }
  


  updatePost( postData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, postData);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-poste/{id}`);
  }


  likePost(postId: number, userId: number): Observable<any> {
    const payload = { posteId: postId, userId: userId };
console.log(payload)
const options = { responseType: 'text' as 'json' };

// Retourne une requête POST
return this.http.post(`${this.apiUrl}/like`, payload, options);
}
  
  
  
  unlikePost(postId: number, userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/unlike/${postId}`, userId);
  }
  
  // toggleLike(postId: number, isLiked:boolean): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/like`, { postId,  isLiked });
  // }

  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/postes`);

   
  }

 



  getUserPosts(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/poste/${userId}`);
  }


  isLiked(postId: any, userId: any): Observable<boolean> {
    return this.http.post<boolean>(`{${this.apiUrl}/posts/isLiked}`, { postId, userId });
  }
}
