import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjektYourService } from './project-your.service';

import { ProjektModel } from '../app/Models/Projekt';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { StorageService } from '../app/Services/storage.service';
import {RouterLink} from "@angular/router";
import {Observable} from "rxjs";
import {HttpHeaders} from "@angular/common/http";
import {PageableResponse} from "../app/Models/Pageable";

@Component({
  selector: 'app-projekt-list-your',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './projekt-list-your.component.html',
  styleUrls: ['./projekt-list-your.component.css'],
})
export class ProjektListYourComponent {
  colNames = ['nazwa', 'dataczasUtworzenia', 'dataOddania'];
  Projekty: ProjektModel[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageIndex: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;

  constructor(private service: ProjektYourService, private storageService: StorageService) {}



  loadStudentProjects(studentId: number, pageIndex: number, pageSize: number) {
    this.service.getProjectsByStudent(studentId, pageIndex, pageSize).subscribe({
      next: (response:any) => {
        this.Projekty = response.content;
        this.totalElements = response.totalElements;
      },
      error: (error:any) => {
        console.error('Błąd podczas ładowania projektów dla studenta:', error);
      },
    });
  }


  ngOnInit() {
    const studentId = this.storageService.getStudentId();
    if (studentId) {
      this.loadStudentProjects(studentId, this.pageIndex, this.pageSize);
    } else {
      console.error('Student ID nie został znaleziony w StorageService.');
    }
  }


  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    const studentId = this.storageService.getStudentId();
    if (studentId) {
      this.loadStudentProjects(studentId, this.pageIndex, this.pageSize);
    }
  }
}
