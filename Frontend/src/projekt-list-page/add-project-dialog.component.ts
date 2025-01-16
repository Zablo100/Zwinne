import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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

registerLocaleData(localePl);

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  providers: [

    {provide: LOCALE_ID, useValue: 'pl-PL'},
    {provide: MAT_DATE_LOCALE, useValue: 'pl-PL'}
  ],
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
    MatDatepickerModule
  ]
})
export class AddProjectDialogComponent implements AfterViewInit {
  projectForm: FormGroup;
  @ViewChild('picker', { static: true }) picker!: MatDatepicker<Date>;

  tomorrow: Date | undefined;

  constructor(
    public dialogRef: MatDialogRef<AddProjectDialogComponent>,
    private fb: FormBuilder
  ) {
    this.projectForm = this.fb.group({
      nazwa: ['', Validators.required],
      opis: [''],
      dataOddania: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.tomorrow = new Date();
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.projectForm.get('dataOddania')?.setValue(this.tomorrow);
  }

  onSave(): void {
    if (this.projectForm.valid) {
      const formData = this.projectForm.value;
      const dataOddania = new Date(formData.dataOddania)
        .toISOString()
        .replace('T', ' ')
        .split('.')[0]; // Konwersja do 'yyyy-MM-dd HH:mm:ss'

      const projekt = {
        ...formData,
        dataOddania,
      };

      this.dialogRef.close(projekt);
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }
}
