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

cerrarModal()
{
  this.modalService.cerrarModal();
  this.fotoSeleccionada = null;
}
}
