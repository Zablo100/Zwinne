import { Component } from '@angular/core';
import { ProjektModel, ProjektWithTaskModel, ZadanieModel } from '../app/Models/Projekt';
import { ProjektService } from './projekt.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatCard} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import { KanbanBoardComponent } from '../projekt-kanban/kanban-board.component';

@Component({
  selector: 'app-prjekt-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatDivider,
    KanbanBoardComponent
  ],
  templateUrl: './prjekt-page.component.html',
  styleUrl: './prjekt-page.component.css'
})


export class PrjektPageComponent {
  Projekt: ProjektWithTaskModel;
  Zadania: ZadanieModel[];



  constructor(private service: ProjektService, private route: ActivatedRoute){}

  ngOnInit() {
    const projektId = this.route.snapshot.paramMap.get('id');
    if (projektId) {
      this.service.getProjekt(projektId).subscribe({
        next: (response) => {
          this.Projekt = response as ProjektWithTaskModel;
          this.Zadania = this.Projekt.zadania?.map((zadanie, index) => ({
            ...zadanie,
            status: index % 3 === 0 ? 'todo' : index % 3 === 1 ? 'in-progress' : 'done', // Przypisanie statusu
          })) || [];
        },
        error: (error) => {
          console.error('Błąd pobierania projektu:', error);
        },
      });
    }
  }

  hasTasks(): boolean {
    return this.Zadania && this.Zadania.length > 0;
  }
}
