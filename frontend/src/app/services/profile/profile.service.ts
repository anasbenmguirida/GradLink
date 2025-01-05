import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {



  private apiUrl = 'http://localhost:8080/api'; // Remplacez cette URL par celle de votre backend

  constructor(private http: HttpClient) { }

  // Méthode pour envoyer le profil et l'image au backend
  updateProfile(data: any): Observable<any> {
    const token = localStorage.getItem('authToken'); // Récupérez le token depuis le stockage local ou un autre emplacement
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Ajoutez le token au format Bearer
    });
  
  
    return this.http.put<any>(`${this.apiUrl}/profile`, data,{ headers });
  }


  getUserById(id: number): Observable<any> {
    const token = localStorage.getItem('authToken'); // Récupérez le token depuis le stockage local ou un autre emplacement
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Ajoutez le token au format Bearer
    });
  
    return this.http.get<any>(`${this.apiUrl}/profile/${id}`);
  }

  getRelation(id_emitter: any, id_receiver: any): Observable<any> {
    const body = {
      etudiantId: id_receiver,
      laureatId: id_emitter
    };
  
    console.log('Body à envoyer au backend :', body); // Affiche le contenu du body dans la console
  
    const token = localStorage.getItem('authToken'); // Récupérez le token depuis le stockage local
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Ajoutez le token au format Bearer
    });
  
    return this.http.post<any>(`${this.apiUrl}/laureat/status`, body);
  }
  
  
  
  sendInvitation(etudiantId: any, laureatId: any,reason:any) {
    const options = { responseType: 'text' as 'json' };

    return this.http.post(`${this.apiUrl}/etudiant/demander-mentorat`, { etudiantId, laureatId,reason},options);
  }







  cancelInvitation(etudiantId: any, laureatId: any) {
    const options = { responseType: 'text' as 'json' };

    return this.http.put(`${this.apiUrl}/laureat/reject`, { etudiantId, laureatId},options);
  }
  

  // cancelInvitation(id_emitter: any, id_receiver: any) {
  //   // Passer les paramètres dans le corps de la requête
  //   const body = { id_emitter, id_receiver };
  
  //   return this.http.delete(`${this.apiUrl}/cancel-invitation`, { body });
  // }
  
  acceptInvitation( etudiantId: any, laureatId: any) {
    const options = { responseType: 'text' as 'json' };

    return this.http.put(`${this.apiUrl}/laureat/accept`, { etudiantId, laureatId},options);
  }

}
