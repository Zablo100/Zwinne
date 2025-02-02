import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZadanieModel } from '../app/Models/Projekt';
import {CdkDragDrop, DragDropModule} from '@angular/cdk/drag-drop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css'],
  standalone: true,
  imports: [CommonModule,DragDropModule, MatSnackBarModule],
})
export class KanbanBoardComponent {
  @Input() tasks: ZadanieModel[] = [];

  ngOnInit(): void {

    this.fetchTasksFromBackend();
  }

  private fetchTasksFromBackend(): void {
    this.http.get<ZadanieModel[]>(`${this.BASE_URL}/zadania`, { headers: this.getAuthHeaders() })
      .subscribe(
        (response) => {

          this.tasks = response.map(task => ({
            ...task,
            status: task.status || 'backlog'
          }));
        },
        (error) => {
          console.error('Błąd podczas pobierania zadań:', error);
          this.showNotification('Nie udało się załadować zadań', 'error');
        }
      );
  }


  columns = [
    { name: 'Backlog', key: 'backlog', limit: Infinity, color: '#FF5722' },
    { name: 'Do zrobienia', key: 'todo', limit: 10, color: '#2196F3' },
    { name: 'W toku', key: 'in-progress', limit: 5, color: '#4CAF50' },
    { name: 'Zrobione', key: 'done', limit: 10, color: '#9C27B0' }
  ];

  private readonly BASE_URL = 'http://localhost:8080/api';
  connectedLists: string[];

  constructor(private cdr: ChangeDetectorRef, private snackBar: MatSnackBar,  private http: HttpClient) {
    this.connectedLists = this.columns.map(column => column.key);
  }

  getTasksForColumn(columnKey: string): ZadanieModel[] {
    if (!this.tasks) {
      return [];
    }
    return this.tasks.filter(task => task.status === columnKey);
  }


  onDrop(event: CdkDragDrop<ZadanieModel[]>, columnKey: string): void {
    const task = event.item.data;
    const targetColumn = this.columns.find((col) => col.key === columnKey);


    if (targetColumn && targetColumn.limit !== Infinity) {
      const tasksInTargetColumn = this.getTasksForColumn(columnKey);
      if (tasksInTargetColumn.length >= targetColumn.limit) {
        this.showNotification(
          `Nie można przenieść zadania: osiągnięto limit w kolumnie "${targetColumn.name}".`,
          'error'
        );
        return;
      }
    }


    const previousStatus = task.status;
    task.status = columnKey;


    this.updateTaskStatus(task.zadanieId, columnKey).subscribe(
      () => {
        this.showNotification(`Zadanie przeniesione do "${targetColumn?.name}".`, 'success');
      },
      (error) => {

        task.status = previousStatus;
        this.showNotification(`Błąd podczas aktualizacji zadania: ${error.message}`, 'error');
        console.error('API Error:', error);
      }
    );
  }


  private updateTaskStatus(taskId: number, newStatus: string): Observable<void> {
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    const body = { status: newStatus };
    console.log("Wysyłam updateTaskStatus, body:", body);
    return this.http
      .patch<void>(`${this.BASE_URL}/zadania/${taskId}/status`, body, { headers })
      .pipe(
        catchError((error) => {
          console.error('Błąd podczas aktualizacji statusu zadania:', error);
          return throwError(error);
        })
      );
  }



  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Basic ' + btoa('admin:admin'),
    });
  }

  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.snackBar.open(message, 'Zamknij', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: [`snackbar-${type}`],
    });
  }

  protected readonly Infinity = Infinity;
}
