import { UserService } from './../../services/authservice/user.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-registre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],



  templateUrl: './registre.component.html',
  styleUrls: ['./registre.component.css']
})
export class RegistreComponent implements OnInit {
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  currentStep = 1; // Initialiser à l'étape 1

  formGroup!: FormGroup;
  router: any;
  
  constructor(private userService: UserService) {} 

  ngOnInit() {
    this.formGroup = new FormGroup(
      {
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
  
       // cin: new FormControl('', Validators.required),
        role: new FormControl('', Validators.required),
       filiere: new FormControl(''), 
        specialite: new FormControl(''),
        promotion: new FormControl(''),
  
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required),
      },
      { validators: RegistreComponent.passwordMatchValidator } 
    );
  
    this.formGroup.get('role')?.valueChanges.subscribe(value => {
      if (value === 'etudiant') {

        this.formGroup.get('filiere')?.setValidators(Validators.required);
      } else {
        this.formGroup.get('promotion')?.setValidators(Validators.required);

        this.formGroup.get('filiere')?.clearValidators();
      }
      this.formGroup.get('filiere')?.updateValueAndValidity();
    });
  
    if (this.formGroup.get('role')?.value === 'etudiant') {
      this.formGroup.get('filiere')?.setValidators(Validators.required);
    }
  }
  
  onSubmit(): void {
    if (this.formGroup.valid) {
      const userData = {
        ...this.formGroup.value,
        photoProfile: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png' 
      };
  console.log(userData)
      this.userService.registerUser(userData).subscribe(
        (response:any) => {
          console.log('Signup successful:', response);

          alert('Inscription réussie !');
          this.router.navigate(['/login']); 
        },
        (error) => {
          alert('Une erreur s\'est produite lors de l\'inscription.');
          console.error(error);
        }
      );
    }
  }
  


  // Basculer la visibilité du mot de passe
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Validateur statique
  static passwordMatchValidator: ValidatorFn = (group: AbstractControl) => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  };

   // Méthodes pour naviguer entre les étapes
   nextStep() {
    this.currentStep++;
  }

  prevStep() {
    this.currentStep--;
  }
}
