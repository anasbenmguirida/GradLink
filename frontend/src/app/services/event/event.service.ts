import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, delay, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  // getReservationStatus(eventId: number): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/reservation.json`);
  // }
  // // Méthode pour réserver une place (simulée)
  // reserverEvent(eventId: number): Observable<any> {
  //   return new Observable((observer) => {
  //     setTimeout(() => {
  //       observer.next({ status: 'Réservé' });
  //       observer.complete();
  //     }, 1000); // Simuler un délai pour la réservation
  //   });
  // }
  // // Méthode pour annuler une réservation (simulée)
  // cancelReservation(eventId: number): Observable<any> {
  //   return new Observable((observer) => {
  //     setTimeout(() => {
  //       observer.next({ status: 'Annulé' });
  //       observer.complete();
  //     }, 1000); // Simuler un délai pour l'annulation
  //   });
  // }
  //  // Méthode pour obtenir l'état de la réservation d'un événement

  addEvent(eventData: any, adminId: number): Observable<any> {
    const params = new HttpParams().set('adminId', adminId.toString()); // Ajout du paramètre adminId
  
    const url = `${this.apiUrl}/admin/evenement`; // URL sans adminId
  
    return this.http.post(url, eventData, { params });
  }
  
  
  private baseUrl = 'http://localhost:8080/api/events';

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Fonction pour récupérer les événements
  getEvents(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }


          //testing
                // reserver(eventId: string) {
                
                // }
                // // Méthode pour récupérer les détails de l'événement
                // getEventDetails(eventId: number){
                //   return this.http.get(`${this.apiUrl}/events.json`);
                // }

                // // Méthode pour vérifier le statut de la réservation
                // getReservationStatus(eventId: number): Observable<any> {
                //   return this.http.get(`${this.apiUrl}/reservation.json`);
                // }

                // // Méthode pour réserver une place (simulée)
                // reserverEvent(eventId: number): Observable<any> {
                //   return new Observable((observer) => {
                //     setTimeout(() => {
                //       observer.next({ status: 'Réservé' });
                //       observer.complete();
                //     }, 1000); // Simuler un délai pour la réservation
                //   });
                // }

                // // Méthode pour annuler une réservation (simulée)
                // cancelReservation(eventId: number): Observable<any> {
                //   return new Observable((observer) => {
                //     setTimeout(() => {
                //       observer.next({ status: 'Annulé' });
                //       observer.complete();
                //     }, 1000); // Simuler un délai pour l'annulation
                //   });
                // }


//  // Méthode pour obtenir l'état de la réservation d'un événement
 getReservationStatus(eventId: number): Observable<any> {
  const token = localStorage.getItem('authToken'); // Récupérer le token JWT
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 

  return this.http.get(`${this.apiUrl}/${eventId}/reservation-status`, { headers });
}
// Récupérer les détails d'un événement par son ID
getEventDetails(eventId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/${eventId}`);
}
//Méthode pour réserver un événement
reserverEvent(eventId: number): Observable<any> {
  const token = localStorage.getItem('authToken'); 
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 
  return this.http.post(`${this.apiUrl}/${eventId}/reserve`, {}, { headers });
}

// Méthode pour annuler une réservation
cancelReservation(eventId: number): Observable<any> {
  const token = localStorage.getItem('authToken'); 
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 

  return this.http.delete(`${this.apiUrl}/${eventId}/cancel`, { headers });
}

deleteEvent(eventId: number): Observable<any> {
  const token = localStorage.getItem('authToken'); 
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete(`${this.apiUrl}/${eventId}`, { headers });
}


updateEvent(eventId: number, updatedEvent: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${eventId}`, updatedEvent);
}
}
