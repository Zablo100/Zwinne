import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { StudentModel } from '../app/Models/Student';
import { StudentService } from '../app/Services/student.service';
import { PageableResponse } from '../app/Models/Pageable';
import {ProjektModalAdminComponent} from "../projekt-modal-admin/projekt-modal-admin.component";
import {debounceTime} from "rxjs/operators";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatTable, MatTableModule} from "@angular/material/table";
import {RouterLink} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-users-list-page',
  standalone: true,
  templateUrl: './users-list-page.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatPaginator,
    MatTable,
    RouterLink,
    MatLabel,
    MatTableModule,
    MatButton,
    MatDivider
  ],
  styleUrls: ['./users-list-page.component.css']
})
export class UsersListPageComponent implements OnInit {
  colNames = ['imie', 'nazwisko', 'nrIndeksu', 'email', 'akcja', 'admin'];
  students: StudentModel[] = [];
  totalElements: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchForm: FormGroup;

  constructor(private studentService: StudentService, private fb: FormBuilder, private dialog: MatDialog) {
    this.searchForm = this.fb.group({
      name: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.searchForm.get('name')?.valueChanges.pipe(debounceTime(300)).subscribe({
      next: response => {
        // Jeśli response zawiera dane dotyczące studentów, załaduj je
        this.students = response.content;
        this.totalElements = response.totalElements;
      },
      error: error => {
        console.error('Błąd podczas wyszukiwania projektów:', error);
      }
    });
    this.loadStudents(this.pageIndex, this.pageSize);
  }

  loadStudents(page: number, size: number): void {
    this.studentService.getStudents(page, size).subscribe({
      next: (response: PageableResponse<StudentModel[]>) => {
        this.students = response.content;
        this.totalElements = response.totalElements;
      },
      error: (error) => {
        console.error('Błąd podczas ładowania użytkowników:', error);
      }
    });
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadStudents(this.pageIndex, this.pageSize);
  }

  openAdminModal(studentId: number): void {
    const dialogRef = this.dialog.open(ProjektModalAdminComponent, {
      data: { studentId },
      disableClose: true,
      width: '1200px',
      height: '1200px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.deleted) {
        this.loadStudents(this.pageIndex, this.pageSize);  // Reload data after deleting
      }
    });
  }

  // Metoda usuwania studenta
  deleteStudent(studentId: number): void {
    if (confirm('Czy na pewno chcesz usunąć tego studenta?')) {
      this.studentService.deleteStudent(studentId).subscribe({
        next: () => {
          // Po usunięciu odświeżamy listę studentów
          this.loadStudents(this.pageIndex, this.pageSize);
        },
        error: (error) => {
          console.error('Błąd podczas usuwania studenta:', error);
        }
      });
    }
  }

}
