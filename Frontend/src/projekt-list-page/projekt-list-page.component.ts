import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjektService } from './projekt.service';
import { ProjektModel } from '../app/Models/Projekt';
import { StudentModel } from '../app/Models/Student';
import { RouterLink, RouterModule, Routes } from '@angular/router';
import { PrjektPageComponent } from '../projekt-page/prjekt-page.component';
import {MatButton} from "@angular/material/button";
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';


import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';


import { StorageService } from "../app/Services/storage.service";

import { ProjektModalAdminComponent } from '../projekt-modal-admin/projekt-modal-admin.component';
import { AssignUserModalComponent } from '../projekt-modal-admin/app-assign-user-modal';
import {AddProjectDialogComponent} from "./add-project-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";



@Component({
  selector: 'app-projekt-list-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule,
    RouterLink,
    MatButton,
    MatPaginatorModule,
    MatTableModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,

  ],
  templateUrl: './projekt-list-page.component.html',
  styleUrl: './projekt-list-page.component.css'
})
export class ProjektListPageComponent {
  colNames = ["nazwa", "dataczasUtworzenia", "dataOddania", "iloscStudentow", "akcja" ]
  Projekty: ProjektModel[] = []
  role: string;
  isLoggedIn = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageIndex: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;

  searchForm: FormGroup;

  constructor(private snackBar: MatSnackBar,private service: ProjektService, private fb: FormBuilder, private storageService: StorageService,private dialog: MatDialog ){
    this.searchForm = this.fb.group({
      name: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      if (user) {
        this.role = user.role;
        console.log(`Zalogowano jako: ${this.role}`);
      } else {
        console.error('Nie udało się pobrać danych użytkownika.');
      }
    }

    if (this.role === 'admin') {
      this.colNames = [...this.colNames, 'admin'];
    }

    this.searchForm.get('name')?.valueChanges.pipe(
      debounceTime(300),
      switchMap(name => this.service.getFilteredProjects(name, this.pageIndex, this.pageSize))
    ).subscribe({
      next: response => {
        this.Projekty = response.content;
        this.totalElements = response.totalElements;
      },
      error: error => {
        console.error('Błąd podczas wyszukiwania projektów:', error);
      }
    });

    // Załaduj początkowe dane
    this.loadProjects(this.pageIndex, this.pageSize);
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  loadFilteredProjects(values: any) {
    const { name, startDate, endDate } = values;
    return this.service.getFilteredProjects(name, this.pageIndex, this.pageSize);
  }

  loadProjects(page: number, size: number) {
    this.service.getFilteredProjects('', page, size).subscribe({
      next: response => {
        this.Projekty = response.content;
        this.totalElements = response.totalElements;
      },
      error: error => {
        console.error('Błąd przy ładowaniu projektówww:', error);
      }
    });
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    const name = this.searchForm.get('name')?.value || '';
    this.service.getFilteredProjects(name, this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.updateProjects(response);
      },
      error: (error) => console.error('Błąd podczas zmiany strony:', error),
    });
  }

  updateProjects(response: any) {
    this.Projekty = response.content as ProjektModel[];
    this.totalElements = response.totalElements;
    this.pageIndex = response.pageable.pageNumber;
  }
  getNumberOfStudents(studenci: StudentModel[]){
    return studenci.length
  }

  showId(id: any){
    console.log(id)
  }

/*
  openAssignUserModal(projektId: number): void {
    const dialogRef = this.dialog.open(AssignUserModalComponent, {
      data: { projektId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.assignStudentToProjekt(result.projektId, result.studentId).subscribe({
          next: () => {
            alert('Student został przypisany do projektu!');
          },
          error: (err: any) => {
            console.error('Błąd podczas przypisywania studenta:', err);
            alert('Wystąpił błąd przy przypisywaniu studenta.');
          }
        });
      }
    });
  }
*/

  openAdminModal(projektId: number): void {
    const dialogRef = this.dialog.open(ProjektModalAdminComponent, {
      data: { projektId },
      disableClose: true,
      width: '1200px',
      height: '1200px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.deleted) {

        this.loadProjects(this.pageIndex, this.pageSize);
      }
    });


  }

  // Funkcja powiadomień SnackBar
  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.snackBar.open(message, 'Zamknij', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: [`snackbar-${type}`],
    });
  }

  openAddProjectDialog(): void {
    const dialogRef = this.dialog.open(AddProjectDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.addProjekt(result).subscribe({
          next: () => {
            this.showNotification('Projekt został pomyślnie dodany!', 'success');
            this.loadProjects(this.pageIndex, this.pageSize);
          },
          error: (err: any) => {
            console.error('Błąd podczas dodawania projektu:', err);
            this.showNotification('Nie udało się dodać projektu. Spróbuj ponownie.', 'error');
          },
        });
      }
    });
  }



}


