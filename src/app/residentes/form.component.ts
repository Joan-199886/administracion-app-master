import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Residente } from './residente';
import { ResidenteService } from './residente.service';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
import { Rol } from './rol';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {

  residente: Residente = new Residente();
  residenteTempo: Residente = new Residente();
  titulo: string = "Crear Residente";
  fotoSeleccionada: File;
  roles: Rol[];
  progreso: number = 0;
  constructor(
    private residenteService: ResidenteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService) { }


  ngOnInit() {
    this.cargarResidente();
    this.residenteService.getRoles().subscribe(roles => this.roles = roles);
  }

  cargarResidente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.residenteService.getResidente(id).subscribe((residente) => this.residente = residente)
        this.residenteTempo = this.residente;
        this.residenteService.getUrl(id).subscribe((response => this.residenteTempo.urlImage = response.url))
        //  console.error("url"+this.residente.urlImage);
      }
    })
  }
  create(): void {
    this.residente.idEdificio = +this.authService.usuario.idEdificio;
    //  console.log("el codigo de conjunto es"+this.residente.idEdificio);
    this.residenteService.create(this.residente)
      .subscribe(json => {
        this.subirFoto(json.residente.id);
        //Swal.fire('Nuevo residente', `${json.mensaje}: ${json.residente.nombre}`, 'success')
      }
      );

  }

  update(): void {
    this.residenteService.update(this.residente)
      .subscribe(json => {
        //  this.router.navigate(['/residentes']);
        if (this.fotoSeleccionada) {
          this.subirFoto(json.residente.id);
        }
        else {
          Swal.fire('Residente Actualizado', `${json.mensaje}: ${json.residente.nombre}`, 'success');
          this.router.navigate(['/residentes']);
        }
      }

      )
  }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
  //  console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire("Error seleccionar foto : ", " El archivo debe ser tipo imagen (jpg,png)", 'error');
      this.fotoSeleccionada = null;
    }
  }
  subirFoto(id: number) {
    //console.error("llegue a subir fot 1"+"el residente id es :"+ id+this.fotoSeleccionada.name);
    if (!this.fotoSeleccionada) {
      Swal.fire("Error al subir la foto : ", " Debe seleccionar una foto", 'error');
    }
    else {
      this.residenteService.subirFoto(this.fotoSeleccionada, id)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          //  console.log("progreso" + this.progreso);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.residente = response.residente as Residente;
            Swal.fire('La informacion del residente ha sido guardada', `La foto se ha subido con exito: ${this.residente.urlImage}`, 'success');
            this.router.navigate(['/residentes']);
          }
        });

    }
  }

  compareRol(o1: Rol, o2: Rol): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 == null || o2 == null ? false : o1.id == o2.id;
  }

}
