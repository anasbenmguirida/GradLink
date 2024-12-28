import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/authservice/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  http: any;
  showPassword: boolean=false;
  loginForm!: FormGroup;
  constructor(private userService: UserService, private router: Router) {}
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(false) // Case à cocher pour "Se souvenir de moi"

    });
  }
  email: string = '';
  password: string = '';
  errorMessage: string = '';
 

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;
  
      this.userService.login(email, password).subscribe(
        (response: any) => {
          console.log('Connexion réussie', response);
  
          const token = response.accessToken; // Supposons que le backend retourne un token
          const user = response.user; // Supposons que l'API renvoie aussi un objet 'user'

            localStorage.setItem('authToken', token); // Stockage persistant
            localStorage.setItem('user', JSON.stringify(user));  // Stockage de l'objet utilisateur
            this.router.navigate(['/posts']);

        },
        (error: any) => {
          console.error('Erreur de connexion', error);
        }
      );
    } else {
      console.log('Formulaire invalide');
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }



  }