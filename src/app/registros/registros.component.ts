import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResidenteService } from '../residentes/residente.service';
import { AuthService } from '../usuarios/auth.service';
import { Registro } from './registro';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.css']
})
export class RegistrosComponent implements OnInit {

  registros: Registro[];
  paginador: any;

  constructor(public authService:AuthService,
    private residenteService: ResidenteService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit()
   {
     this.activatedRoute.paramMap.subscribe(params =>
       {
       let page = +params.get('page');
       let idEdificio = +this.authService.usuario.idEdificio;
     //  console.error("el id del edificio es "+idEdificio);

       if (!page) {
         page = 0;
       }
   //    let idConjunto = sessionStorag
     //  console.error("entre");
       this.residenteService.getRegistros(page,idEdificio).subscribe(
         response => {
           this.registros = response.content as Registro[]
           this.paginador = response;
          // console.log(response);
         });
     })

   }

}
