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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-projekt-list-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule,
    PrjektPageComponent,
    RouterLink,
    MatButton,
    MatPaginatorModule,
    MatTableModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './projekt-list-page.component.html',
  styleUrl: './projekt-list-page.component.css'
})
export class ProjektListPageComponent {
  colNames = ["nazwa", "dataczasUtworzenia", "dataOddania", "iloscStudentow", "akcja" ]
  Projekty: ProjektModel[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageIndex: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;

  searchForm: FormGroup;

  constructor(private service: ProjektService, private fb: FormBuilder){
    this.searchForm = this.fb.group({
      name: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit() {
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
        console.error('Błąd przy ładowaniu projektów:', error);
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

}
