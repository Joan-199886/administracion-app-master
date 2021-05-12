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

  public residente: Residente = new Residente();
  public residenteTempo: Residente = new Residente();
  titulo: string = "Crear Residente";
  fotoSeleccionada: File;
  roles: Rol[];
  progreso: number = 0;
  constructor(
    private residenteService: ResidenteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService) { }

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
      }
    })
  }
  create(): void {
    this.residente.idEdificio = +this.authService.usuario.idEdificio;
    this.residenteService.create(this.residente)
      .subscribe(json => {
        this.subirFoto(json.residente.id, "create");
      });
  }
  update(): void {
    this.residenteService.update(this.residente)
      .subscribe(json => {
        if (this.fotoSeleccionada) {
          this.subirFoto(json.residente.id, "update");
        }
        else {
          Swal.fire('Residente Actualizado', `${json.mensaje}: ${json.residente.nombre}`, 'success');
          this.router.navigate(['/residentes']);
        }
      });
  }
  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire("Error seleccionar foto : ", " El archivo debe ser tipo imagen (jpg,png)", 'error');
      this.fotoSeleccionada = null;
    }
  }
  subirFoto(id: number, proceso) {
    if (!this.fotoSeleccionada) {
      Swal.fire("Error al subir la foto : ", " Debe seleccionar una foto", 'error');
    }
    else {
      this.residenteService.subirFoto(this.fotoSeleccionada, id, proceso)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            if (response.status == 500) {
              Swal.fire('Error al registrar el residente', response.error, 'error');
              this.fotoSeleccionada = null;
              this.router.navigate(['/residentes']);
            }
            if (response.status == 400) {
              let response: any = event.body;
              Swal.fire('Error al registrar el residente', response.mensaje, 'error');
              this.fotoSeleccionada = null;
              this.router.navigate(['/residentes']);
            }
            if (response.status == 200) {
              this.residente = response.residente as Residente;
              Swal.fire('La informacion del residente ha sido guardada', `La foto se ha subido con exito: ${this.residente.urlImage}`, 'success');
              this.router.navigate(['/residentes']);
            }
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
