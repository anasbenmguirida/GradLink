import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {



  private apiUrl = 'test.json'; // Remplacez cette URL par celle de votre backend

  constructor(private http: HttpClient) { }

  // Méthode pour envoyer le profil et l'image au backend
  updateProfile(data: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, data);
  }


  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getRelation(id_emitter: any, id_receiver: any) {
    const params = new HttpParams()
      .set('id_emitter', id_emitter)
      .set('id_receiver', id_receiver);
  
    return this.http.get(`${this.apiUrl}`, { params });
  }
  sendInvitation(id_emitter: any, id_receiver: any) {
    return this.http.post(`${this.apiUrl}`, { id_emitter, id_receiver});
  }







  cancelInvitation(id_emitter: any, id_receiver: any) {
    // Construire l'URL avec des paramètres dans la query string
    const url = `${this.apiUrl}/cancel-invitation?id_emitter=${id_emitter}&id_receiver=${id_receiver}`;
    
    // Appeler la méthode DELETE avec l'URL construite
    return this.http.delete(url);
  }
  

  // cancelInvitation(id_emitter: any, id_receiver: any) {
  //   // Passer les paramètres dans le corps de la requête
  //   const body = { id_emitter, id_receiver };
  
  //   return this.http.delete(`${this.apiUrl}/cancel-invitation`, { body });
  // }
  
  acceptInvitation(id_emitter: any, id_receiver: any) {
    return this.http.put(`${this.apiUrl}/accept-invitation`, { id_emitter, id_receiver});
  }

}
