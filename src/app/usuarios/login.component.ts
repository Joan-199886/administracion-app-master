import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import swal from "sweetalert2" ;
import{AuthService} from './auth.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario:Usuario;
  constructor(private authService:AuthService,private router:Router)
  {
  this.usuario=new Usuario();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated())
    {
      swal.fire('Login','Hola '+this.authService.usuario.username+', ya estas autenticado!','info');

      this.router.navigate(['/residentes']);
    }
  }

  login()
  {
  //  console.log(this.usuario);
    if(this.usuario.username==null || this.usuario.password==null)
    {
      swal.fire('Error al ingresar','Usuario o Contraseña vacios','error');
      return;
    }
    this.authService.login(this.usuario).subscribe(response =>{
      console.log(response);

    //  console.log(usuario);
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      let usuario = this.authService.usuario;
      this.router.navigate(['/residentes']);
      swal.fire('Login','Hola '+usuario.username+', has iniciado sesión con éxito!','success');
    },error =>{
        if(error.status == 400)
        {
          swal.fire('Error al ingresar','Usuario o Contraseña incorrectas!','error');

        }
    });
  }
}
