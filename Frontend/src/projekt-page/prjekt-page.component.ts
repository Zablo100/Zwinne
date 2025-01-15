import { Component } from '@angular/core';
import {ProjektWithTaskModel, FileProjectModel, ZadanieModel} from '../app/Models/Projekt';
import { ProjektService } from './projekt.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCard } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import {MatButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-prjekt-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatDivider,
    MatButton,
    MatIconModule
  ],
  templateUrl: './prjekt-page.component.html',
  styleUrls: ['./prjekt-page.component.css']
})
export class PrjektPageComponent {
  Projekt: ProjektWithTaskModel;
  Zadania: ZadanieModel[];
  Pliki: FileProjectModel[] = [];

  constructor(private service: ProjektService, private route: ActivatedRoute) {}

  ngOnInit() {
    const projektId = this.route.snapshot.paramMap.get('id');
    this.service.getProjekt(projektId).subscribe(
      response => {
        this.Projekt = response as ProjektWithTaskModel;
        this.Zadania = this.Projekt.zadania;
        this.Pliki = this.Projekt.files;
        console.log('Projekt:', this.Projekt);
        console.log('Pliki:', this.Pliki);
      },
      error => {
        console.log(error);
        console.log(projektId);
      }
    );
  }

  downloadFile(fileName: string) {
    this.service.downloadFile(fileName).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      },
      (error) => {
        console.log('Błąd pobierania pliku:', error);
      }
    );
  }


}
