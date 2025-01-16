import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogContent} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { StudentService } from '../app/Services/student.service';
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common"; // Upewnij się, że masz ten serwis

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  standalone: true,
  imports: [
    MatDialogContent,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatError,
    MatInputModule,
    CommonModule
  ],
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent {
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { studentId: number }
  ) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.get('newPassword')?.value;
      this.studentService.changePassword(this.data.studentId, newPassword).subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Błąd podczas zmiany hasła:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
