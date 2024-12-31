import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root', // Accessible dans toute l'application
})
export class UserService {
//test json
private mockDataUrl = 'jsonTest/users.json'; // Chemin du fichier JSON pour simulation
private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password }; 
console.log(loginData)
    return this.http.post(`${this.apiUrl}/api/login`, loginData); 
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/register`, userData);
  }
  

  getToken() {
    return localStorage.getItem('token');
  }

  getUserProfile(token: string): Observable<any> {
    return this.http.get(this.mockDataUrl).pipe(
      delay(500),
      map((data: any) => {
        if (token === data.token) {
          return { name: 'John Doe', email: 'user@example.com', role: 'user' };
        } else {
          throw new Error('Token invalide');
        }
      })
    );
  }


  // Dans votre UserService
getUserRole(): string {
  console.log('TEEEEEEEEEST')
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('TEEEEEEEEEST2')
  console.log(user.role)


  return user.role ||  'GUEST'; 
}





//   private apiUrl = 'http://localhost:8080/api/auth';
//   constructor(private http: HttpClient) {}




//   login(email: string, password: string): Observable<any> {
//     const body = { email, password };
//     return this.http.post(${this.apiUrl}/login, body); 
//   }



//   registerUser(userData: any): Observable<any> {
//     return this.http.post(${this.apiUrl}/register, userData);  
  
//   }
//   getToken(){
//     return localStorage.getItem('token')
//   }
// getUserProfile(token: string) {
//   return this.http.get('http://localhost:8000/profile/', {
//     headers: {
//       Authorization: Bearer ${token}
//     }
//   });
// }
}