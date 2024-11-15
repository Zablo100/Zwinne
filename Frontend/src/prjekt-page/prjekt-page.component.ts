import { Component } from '@angular/core';
import { ProjektModel, ProjektWithTaskModel, ZadanieModel } from '../app/Models/Projekt';
import { ProjektService } from './projekt.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prjekt-page',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './prjekt-page.component.html',
  styleUrl: './prjekt-page.component.css'
})
export class PrjektPageComponent {
  Projekt: ProjektWithTaskModel;
  Zadania: ZadanieModel[];

  constructor(private service: ProjektService, private route: ActivatedRoute){}

  ngOnInit(){
    const projektId = this.route.snapshot.paramMap.get('id')
    this.service.getProjekt(projektId).subscribe(
      response => {
        this.Projekt = response as ProjektWithTaskModel
        this.Zadania = this.Projekt.zadania
        console.log(response)
      }, error => {
        console.log(error)
        console.log(projektId)
      }
    )
  }

}
