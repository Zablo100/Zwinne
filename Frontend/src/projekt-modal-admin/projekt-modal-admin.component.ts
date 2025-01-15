import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { ProjektModalAdminService } from './projekt-modal-admin.service';
import {CommonModule} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {FormsModule} from "@angular/forms";
import { MatTabsModule } from '@angular/material/tabs';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import { MatTableModule } from '@angular/material/table';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import { AssignUserModalComponent } from './app-assign-user-modal';
import { MatDialog } from '@angular/material/dialog';
import {AuthService} from "../app/Services/auth.service";

@Component({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatTab,
    MatTabGroup,
    FormsModule,
    MatTabsModule,
    MatProgressSpinner,
    MatTableModule,
    MatSnackBarModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    AssignUserModalComponent,
  ],
  selector: 'app-projekt-modal-admin',
  standalone: true,
  templateUrl: './projekt-modal-admin.component.html',
})
export class ProjektModalAdminComponent implements OnInit {
  students: any[] = [];
  projectName: string = '';
  projectDetails: any = {};
  assignedStudents: any[] = [];
  selectedStudentId: number | null = null;
  selectedFile!: File;



  constructor(
    public dialogRef: MatDialogRef<ProjektModalAdminComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: {
      projektId: number;
    },
    private projektModalAdminService: ProjektModalAdminService,
    private snackBar: MatSnackBar,private dialog: MatDialog,) {}
  onFileChanged(event:any) {
    this.selectedFile = event.target.files[0];
  }
  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.snackBar.open(message, 'Zamknij', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: [`snackbar-${type}`],
    });
  }
  onUpload() {
    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('projektId', this.data.projektId.toString());

    this.authService.addFileToProject(formData).subscribe(
      (response) => {
        console.log('Plik dodany:', response);
        this.showNotification('Plik został pomyślnie dodany!', 'success');
      },
      (error) => {
        console.error('Błąd podczas dodawania pliku:', error);
        this.showNotification('Wystąpił błąd podczas dodawania pliku.', 'error');
      }
    );
  }


  ngOnInit(): void {
    this.loadProjectDetails();
    this.loadStudents();
  }

  loadProjectDetails(): void {
    this.projektModalAdminService.getProjektById(this.data.projektId).subscribe({
      next: (projekt) => {
        this.projectName = projekt.nazwa;
        this.projectDetails = projekt;
        this.assignedStudents = projekt.studenci || [];
      },
      error: (err) => {
        console.error('Błąd podczas pobierania szczegółów projektu:', err);
        this.projectDetails = {};
      },
    });
  }

  loadStudents(): void {
    this.projektModalAdminService.getStudents().subscribe({
      next: (response) => {
        this.students = response.content.map((student: any) => ({
          id: student.studentId,
          displayName: `${student.nrIndeksu} - ${student.imie} ${student.nazwisko}`,
        }));
      },
      error: (err) => {
        console.error('Błąd podczas pobierania listy studentów:', err);
      },
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  removeStudentFromProject(studentId: number): void {
    if (confirm('Czy na pewno chcesz usunąć tego studenta z projektu?')) {
      this.projektModalAdminService
        .removeStudentFromProject(this.projectDetails.projektId, studentId)
        .subscribe({
          next: () => {
            this.showNotification('Student został usunięty z projektu.');
            this.assignedStudents = this.assignedStudents.filter(
              (student) => student.studentId !== studentId
            );
          },
          error: (err) => {
            console.error('Błąd podczas usuwania studenta z projektu:', err);
            this.showNotification('Wystąpił błąd podczas usuwania studenta.');
          },
        });
    }
  }

  openAssignUserModal(): void {
    const availableStudents = this.students.filter(
      (student) => !this.assignedStudents.some(
        (assigned) => assigned.studentId === student.id
      )
    );

    const dialogRef = this.dialog.open(AssignUserModalComponent, {
      data: { projektId: this.projectDetails.projektId, availableStudents },
      disableClose: true,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const studentAlreadyAssigned = this.assignedStudents.some(
          (student) => student.studentId === result.studentId
        );

        if (studentAlreadyAssigned) {
          this.showNotification('Ten student jest już przypisany do projektu!', 'error');
          return;
        }

        this.projektModalAdminService
          .assignStudentToProjekt(result.projektId, result.studentId)
          .subscribe({
            next: () => {
              const student = this.students.find((s) => s.id === result.studentId);
              if (student) {
                this.assignedStudents.push({
                  studentId: student.id,
                  imie: student.imie,
                  nazwisko: student.nazwisko,
                  nrIndeksu: student.nrIndeksu,
                });
                this.showNotification('Student został przypisany do projektu!', 'success');
              }
            },
            error: (err) => {
              console.error('Błąd podczas przypisywania użytkownika:', err);
              this.showNotification('Wystąpił błąd przy przypisywaniu użytkownika.', 'error');
            },
          });
      }
    });
  }

  deleteProject(projektId: number): void {
    const confirmDelete = confirm('Czy na pewno chcesz usunąć ten projekt?');
    if (confirmDelete) {
      this.projektModalAdminService.deleteProject(projektId).subscribe({
        next: () => {
          this.showNotification('Projekt został usunięty.', 'success');
          this.dialogRef.close({ deleted: true });
        },
        error: (err) => {
          if (err.status === 401) {
            this.showNotification('Błąd: Brak autoryzacji. Sprawdź dane logowania.', 'error');
          } else {
            this.showNotification('Wystąpił błąd podczas usuwania projektu.', 'error');
          }
          console.error('Błąd podczas usuwania projektu:', err);
        },
      });
    }
  }




  onSave(): void {

    console.log('Zapisano dane projektu:', this.projectDetails);
    this.dialogRef.close(this.projectDetails);
  }

  onAssign(): void {
    if (this.selectedStudentId) {
      this.projektModalAdminService
        .assignStudentToProjekt(this.data.projektId, this.selectedStudentId)
        .subscribe({
          next: () => {
            alert('Student został przypisany do projektu!');
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.error('Błąd podczas przypisywania studenta:', err);
          },
        });
    } else {
      alert('Proszę wybrać studenta.');
    }
  }
}
