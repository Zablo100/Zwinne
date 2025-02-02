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
import {KanbanBoardComponent} from "../projekt-kanban/kanban-board.component";
import {StorageService} from "../app/Services/storage.service";
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, map } from 'rxjs';
import { AddTaskComponent } from './addTask/addTask.component';
import {ProjektChatComponent} from "../projekt-chat/projekt-chat.component";
@Component({
  selector: 'app-prjekt-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatDivider,
    MatButton,
    MatIconModule,

    KanbanBoardComponent,
    ProjektChatComponent
  ],
  templateUrl: './prjekt-page.component.html',
  styleUrls: ['./prjekt-page.component.css']
})
export class PrjektPageComponent {
  Projekt: ProjektWithTaskModel;
  Zadania: ZadanieModel[];
  Pliki: FileProjectModel[] = [];
  iloscDni: number;

  isAssigned: boolean = false;

  constructor( private storageService: StorageService,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private service: ProjektService,
    private route: ActivatedRoute,
    private dialog: MatDialog)
    {
    console.log('Rejestruję ikonę');
    this.matIconRegistry.addSvgIcon(
      'pdf_icon',
      '/pdf_icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('/pdf_icon.svg')
    );
  }

  ngOnInit() {
    const projektId = this.route.snapshot.paramMap.get('id');
    const studentId = this.storageService.getStudentId();

    if (studentId === null) {
      console.error('Student ID nie został znaleziony w StorageService.');
      // Opcjonalnie: Przekierowanie na stronę logowania

      return; // Przerwij dalsze wykonywanie
    }

    console.log('Zalogowany studentId:', studentId);

    // Pobierz dane projektu
    this.service.getProjekt(projektId).subscribe(
      (response) => {
        this.Projekt = response as ProjektWithTaskModel;
        this.Zadania = this.Projekt.zadania;
        this.Pliki = this.Projekt.files;
        this.iloscDni = this.dniDoOddania(this.Projekt.dataOddania);

        console.log('Projekt:', this.Projekt);
        console.log('Pliki:', this.Pliki);
      },
      (error) => {
        console.error('Błąd podczas pobierania projektu:', error);
      }
    );

    this.service.isStudentAssignedToProject(Number(projektId), studentId).subscribe(
      (response: boolean) => {
        this.isAssigned = response;
        console.log('Czy użytkownik przypisany do projektu:', this.isAssigned);

        if (!this.isAssigned) {
          console.warn('Użytkownik nie ma dostępu do tego projektu.');
        }
      },
      (error) => {
        console.error('Błąd podczas sprawdzania przypisania:', error);
      }
    );
  }


  getStudentId(): number {
    const studentId = localStorage.getItem('studentId'); // Pobierz studentId z localStorage
    return studentId ? Number(studentId) : 0; // Zwróć wartość jako liczba lub 0, jeśli brak danych
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

  openAddTaskDialog(){
    const projektId = Number(this.route.snapshot.paramMap.get('id'));
    const dialogRef = this.dialog.open(AddTaskComponent, {
      data: {projektId: projektId }
    });

    }

}
