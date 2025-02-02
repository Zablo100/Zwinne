import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle,
  MatDateRangePicker
} from '@angular/material/datepicker';


import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { StorageService } from '../../app/Services/storage.service';
import { ProjektService } from '../projekt.service';

registerLocaleData(localePl);

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
      CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatDatepicker,
        MatNativeDateModule,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatDateRangePicker,
        MatDatepickerModule,
  ],
  templateUrl: './addTask.component.html',
  styleUrl: './addTask.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTaskComponent implements AfterViewInit{
  taskFrom: FormGroup;
  @ViewChild('picker', { static: true }) picker!: MatDatepicker<Date>;

  constructor(
    public dialogRef: MatDialogRef<AddTaskComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storageService: StorageService,
    private projektService: ProjektService
  ) {
    this.taskFrom = this.fb.group({
      nazwa: ['', Validators.required],
      opis: [''],
      dataOddania: ['', Validators.required],
      czas: ['', [Validators.required, this.hourValidator]]
    });
  }

  ngAfterViewInit(): void {

  }

  hourValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value;

    if (value !== null && (isNaN(value) || value < 0 || value > 23)) {
        return { 'invalidHour': true };
    }

    return null;
}

  validateHour(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let value = parseInt(inputElement.value, 10);

    if (isNaN(value) || value < 0) {
        value = 0;
    } else if (value > 23) {
        value = 23;
    }

    inputElement.value = value.toString();
  }

  onSave(): void{
    const request = {
      zadanie: {
      nazwa: this.taskFrom.value.nazwa,
      opis: this.taskFrom.value.opis,
      dataCzasOddania: this.createDateTime()
      },
      studentId: this.storageService.getStudentId(),
      projektId: this.data.projektId
    }
    this.createDateTime()

    console.log(request)
    this.projektService.addTaskToProjekt(request).subscribe()
  }

  createDateTime(){
    const dataOddania = new Date(this.taskFrom.value.dataOddania);
    const poprawionyCzas = this.taskFrom.value.czas + 1 // Cofa o godzinke tak o wrrrr
    dataOddania.setHours(poprawionyCzas, 0, 0, 0);
    const dataString = dataOddania.toISOString().replace('T', ' ').split('.')[0];

    return dataString
  }

}
