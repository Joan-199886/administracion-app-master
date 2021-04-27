import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Residente } from '../residente';
import { ResidenteService } from '../residente.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-residente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() residente:Residente;
  titulo:string = "Detalle del residente";
  fotoSeleccionada: File;
  constructor(private residenteService: ResidenteService,
  public modalService:ModalService){ }

  ngOnInit(): void {
  
  }
/*  seleccionarFoto(event)
  {
    this.fotoSeleccionada = event.target.files[0];
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image')<0)
    {
      Swal.fire("Error seleccionar imagen : "," El archivo debe ser tipo imagen",'error');
      this.fotoSeleccionada=null;
    }
  }
  subirFoto()
  {
    if(!this.fotoSeleccionada)
    {
      Swal.fire("Error Upload: "," Debe seleccionar una foto",'error');
    }
else {
    this.residenteService.subirFoto(this.fotoSeleccionada,this.residente.id)
    .subscribe(residente =>{
      //  this.residente = residente;
      Swal.fire('La foto se ha subido completamente',`La foto se ha subido con exito: ${this.residente.urlImage}`,'success');
    });
  }
}
*/
cerrarModal()
{
  this.modalService.cerrarModal();
  this.fotoSeleccionada = null;
}
}
