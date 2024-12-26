
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-event-dialog',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './edit-event-dialog.component.html',
  styleUrl: './edit-event-dialog.component.css'
})
export class EditEventDialogComponent {
  @Input() event: any;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  editForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      capacite: [0, [Validators.required, Validators.min(1)]],
      date_evenement: ['', [Validators.required]],
      place_rest: ['', Validators.required],

    });
  }

  ngOnInit() {
    if (this.event) 
    {
      console.log("chofni :",this.event)
      this.editForm.patchValue(this.event);
    }
  }



  submitForm() {
    if (this.editForm.valid) {
      console.log(this.editForm.value)
      this.onSave.emit(this.editForm.value);
    }
  }

  closeDialog() {
    this.onClose.emit();
  }
}
