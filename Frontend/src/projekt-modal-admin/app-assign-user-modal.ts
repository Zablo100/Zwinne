import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjektModalAdminService } from '../projekt-modal-admin/projekt-modal-admin.service';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-assign-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './app-assign-user-modal.component.html',
})


export class AssignUserModalComponent implements OnInit {
  students: any[] = [];
  projectName: string = '';
  selectedStudentId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<AssignUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projektId: number;availableStudents: any[] },
    private projektServiceAdmin: ProjektModalAdminService
  ) {}

  ngOnInit(): void {
    this.students = this.data.availableStudents;
    this.projektServiceAdmin.getProjektById(this.data.projektId).subscribe({
      next: (projekt) => {
        console.log('Szczegóły projektu:', projekt);
        this.projectName = projekt.nazwa || 'Brak nazwy projektu';
      },
      error: (err: any) => {
        console.error('Błąd podczas pobierania szczegółów projektu:', err);
      },
    });

    this.projektServiceAdmin.getStudents().subscribe({
      next: (response) => {
        if (response && response.content) {
          this.students = response.content.map((student: any) => ({
            id: student.studentId,
            displayName: `${student.nrIndeksu} - ${student.imie} ${student.nazwisko}`,
          }));
        } else {
          console.warn('Brak studentów w odpowiedzi.');
          this.students = [];
        }
      },
      error: (err) => {
        console.error('Błąd podczas pobierania listy studentóww:', err);
      },
    });
  }
  onClose(): void {
    this.dialogRef.close();
  }

  onAssign(): void {
    if (this.selectedStudentId) {
      this.dialogRef.close({ projektId: this.data.projektId, studentId: this.selectedStudentId });
    } else {
      alert('Proszę wybrać studenta.');
    }
  }
}
