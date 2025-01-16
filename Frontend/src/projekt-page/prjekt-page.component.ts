import { Component } from '@angular/core';
import {ProjektWithTaskModel, FileProjectModel, ZadanieModel} from '../app/Models/Projekt';
import { ProjektService } from './projekt.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCard } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import {MatButton} from "@angular/material/button";
import {MatIconModule, MatIconRegistry} from "@angular/material/icon";
import {MatCell, MatCellDef} from "@angular/material/table";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-prjekt-page',
  standalone: true,
    imports: [
        CommonModule,
        MatCard,
        MatDivider,
        MatButton,
        MatIconModule,
        MatCell,
        MatCellDef
    ],
  templateUrl: './prjekt-page.component.html',
  styleUrls: ['./prjekt-page.component.css']
})
export class PrjektPageComponent {
  Projekt: ProjektWithTaskModel;
  Zadania: ZadanieModel[];
  Pliki: FileProjectModel[] = [];
  iloscDni: number;

  constructor(private matIconRegistry: MatIconRegistry, private sanitizer: DomSanitizer, private service: ProjektService, private route: ActivatedRoute) {
    console.log('Rejestruję ikonę');
    this.matIconRegistry.addSvgIcon(
      'pdf_icon',
      '/pdf_icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('/pdf_icon.svg')
    );
  }

  ngOnInit() {
    const projektId = this.route.snapshot.paramMap.get('id');
    this.service.getProjekt(projektId).subscribe(
      response => {
        this.Projekt = response as ProjektWithTaskModel;
        this.Zadania = this.Projekt.zadania;
        this.Pliki = this.Projekt.files;
        this.iloscDni = this.dniDoOddania(this.Projekt.dataOddania);
        console.log('Projekt:', this.Projekt);
        console.log('Pliki:', this.Pliki);
      },
      error => {
        console.log(error);
        console.log(projektId);
      }
    );
  }
  isPdfFile(filePath: string): boolean {
    return filePath.toLowerCase().endsWith('.pdf');
  }

  // Sprawdza, czy plik ma rozszerzenie obrazu (np. .jpg, .png)
  isImageFile(filePath: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    return imageExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
  }
  dniDoOddania(deadline: string | Date): number {
    const today = new Date();
    const dueDate = new Date(deadline);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    const timeDifference = dueDate.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
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
