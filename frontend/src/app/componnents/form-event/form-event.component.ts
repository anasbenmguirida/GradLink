import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-event',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './form-event.component.html',
  styleUrl: './form-event.component.css'
})
export class FormEventComponent {
  eventForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      type: ['', Validators.required]

    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const eventData = this.eventForm.value;
      console.log('Données de l’événement:', eventData);
      alert('Événement créé avec succès !');
      this.eventForm.reset();
    } else {
      console.error('Formulaire invalide');
    }
  }
}
