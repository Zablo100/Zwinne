import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjektService } from './projekt.service';
import { ProjektModel } from '../app/Models/Projekt';
import {MatTableModule} from '@angular/material/table';
import { StudentModel } from '../app/Models/Student';
import { RouterLink, RouterModule, Routes } from '@angular/router';
import { PrjektPageComponent } from '../prjekt-page/prjekt-page.component';
import {MatButton} from "@angular/material/button";


@Component({
  selector: 'app-projekt-list-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule,
    PrjektPageComponent,
    RouterLink,
    MatButton
  ],
  templateUrl: './projekt-list-page.component.html',
  styleUrl: './projekt-list-page.component.css'
})
export class ProjektListPageComponent {
  colNames = ["nazwa", "dataczasUtworzenia", "dataOddania", "iloscStudentow", "akcja" ]
  Projekty: ProjektModel[] = []

  constructor(private service: ProjektService){}

  ngOnInit(){
    this.service.getProjekt().subscribe(
      response => {
        this.Projekty = response.content as ProjektModel[]
        console.log("Sukces")
      }, error => {
        console.log(error)
      }
    )
  }

  getNumberOfStudents(studenci: StudentModel[]){
    return studenci.length
  }

  showId(id: any){
    console.log(id)
  }

}
