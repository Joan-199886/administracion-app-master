import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Residente } from './residente';
import { ResidenteService } from './residente.service';
import { ActivatedRoute } from '@angular/router'
import { ModalService } from './detalle/modal.service';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-residentes',
  templateUrl: './residentes.component.html',
})
export class ResidentesComponent implements OnInit {

  residentes: Residente[];
  paginador: any;
  residenteSeleccionado:Residente;
  residen:Residente;
  constructor(private residenteService: ResidenteService,
    private activatedRoute: ActivatedRoute
    ,public  modalService:ModalService,public authService:AuthService  ) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params =>
      {
      let page = +params.get('page');
      let idEdificio = +this.authService.usuario.idEdificio;

      if (!page) {
        page = 0;
      }

      this.residenteService.getResidentes(page,idEdificio).subscribe(
        response => {
          this.residentes = response.content as Residente[]
          this.paginador = response;
        });
    })
  }

  delete(residente: Residente): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al Residente ${residente.nombre} ${residente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.residenteService.delete(residente.id).subscribe(
          response => {
            this.residentes = this.residentes.filter(cli => cli !== residente)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              'El residente ha sido eliminado del sistema!',
              'success'
            )
          })
        }
    })
  }
abrirModal(residente:Residente)
{
  let url;
  this.residenteService.getUrl(residente.id).subscribe(
    response =>
    {
      if(response.url!="null")
      {
       residente.urlImage = response.url;
      }else{console.log("no hay nada")}

    });
    residente.urlImage = url;
  this.residenteSeleccionado = residente;
  //console.log(this.residenteSeleccionado.urlImage);
  this.modalService.abrirModal();
}
}
