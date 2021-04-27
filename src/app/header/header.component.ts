import { Component, OnInit } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import {Router} from '@angular/router'
import swal from 'sweetalert2'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',

})
export class HeaderComponent {

 title: string = 'App Administración'
  constructor( public authService:AuthService, private router:Router) {}

  logout():void
  {
    this.authService.logout();
    swal.fire('Sesion Cerrada','La sesión ha sido cerrada con exito!','success');
this.router.navigate(['/login']);
  }

}
