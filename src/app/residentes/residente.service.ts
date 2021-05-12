import { Injectable } from '@angular/core';
import { of, Observable, throwError, observable } from "rxjs";
import { Residente } from './residente';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from "sweetalert2"
import { Router } from '@angular/router'
import { AuthService } from '../usuarios/auth.service';
import { Rol } from './rol';
import { Registro } from '../registros/registro';
import { URL_BACKEND } from '../config/config';



@Injectable()
export class ResidenteService {
  private urlEndPoint: string = URL_BACKEND+'/api/residentes';
  private urlEndPoint2: string = URL_BACKEND+'/api';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private authService:AuthService,private http: HttpClient, private router: Router) { }

getRoles(): Observable<Rol[]>
{
  return this.http.get<Rol[]>(this.urlEndPoint+'/roles',{headers:this.agregarAuthorizationHeader()});
}
private agregarAuthorizationHeader()
{
  let token = this.authService.token;
  if(token != null)
  {
    return this.httpHeaders.append('Authorization','Bearer '+token);
  }
  return this.httpHeaders;
}
  private isNoAutorizado(e): boolean{
    if(e.status==401)
    {
    //SVGPathSegLinetoVerticalAbs
      swal.fire("Acceso denegado","Debe auntenticarse para acceder a este recurso","warning");

      this.router.navigate(['/login']);
      return true;
    }
    if(e.status==403)
    {
      swal.fire("Acceso denegado","No posee permisos para acceder al recurso","warning");
      this.router.navigate(['/login']);
      return true;
    }
    return false;
  }

  getResidentes(page: number,idEdificio:number): Observable<any>
  {
    return this.http.post<any>(this.urlEndPoint+'/page/' + page,idEdificio,{headers:this.agregarAuthorizationHeader()}).pipe(
      tap((response: any) => response.content as Residente[])
    )
  }

  getRegistros(page: number,idEdificio:number): Observable<any>
  {
    return this.http.post<any>(this.urlEndPoint2+'/registros/page/' + page,idEdificio,{headers:this.agregarAuthorizationHeader()}).pipe(
      tap((response: any) => response.content as Registro[])
    )
  }
  //CREAR
  create(residente: Residente): Observable<any> {
    return this.http.post<any>(this.urlEndPoint, residente, { headers: this.agregarAuthorizationHeader() }).pipe(

      catchError(e => {
        if(this.isNoAutorizado(e))
        {
          this.router.navigate(['/login'])

          return throwError(e);
        }
        swal.fire('Error al crear un nuevo residente', e.error.mensaje, 'error');
        return throwError(e);


      })
    );
  }

  getResidente(id: number): Observable<Residente> {
    return this.http.get<Residente>(`${this.urlEndPoint}/${id}`,{headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
        if(this.isNoAutorizado(e))
        {
          return throwError(e);
        }
        this.router.navigate(['/residentes']);
        swal.fire('Error al editar el residente', e.error.mensaje, 'error');

        return throwError(e);
      })
    );
  }
  update(residente: Residente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${residente.id}`, residente, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {
        if(this.isNoAutorizado(e))
        {
          return throwError(e);
        }
        //console.error(e.error.mensaje);
        swal.fire('Error al editar el residente', e.error.mensaje, 'error');
        return throwError(e);

      })
    )
  }

  delete(id: number): Observable<Residente> {
    return this.http.delete<Residente>(`${this.urlEndPoint}/${id}`, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {
        if(this.isNoAutorizado(e))
        {
          return throwError(e);
        }
        swal.fire('Error al eliminar el residente', e.error.mensaje, 'error');
        return throwError(e);

      })
    )
  }


subirFoto(archivo:File,id,proceso):Observable<HttpEvent<{}>>
{
  let formData = new FormData();
  let idEdificio = +this.authService.usuario.idEdificio;
  formData.append("archivo",archivo);
  formData.append("id",id);
  formData.append("idConjunto",""+idEdificio);
  formData.append("proceso",proceso);

  let httpHeaders = new HttpHeaders();
  let token = this.authService.token;
  if(token != null)
  {httpHeaders =  httpHeaders.append('Authorization','Bearer ' + token);
  }
  const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true,
      headers: httpHeaders
    });

  return this.http.request(req);

}
getUrl(id:number): Observable<any>
{

  return this.http.post(`${this.urlEndPoint}/generate`,id,{headers:this.agregarAuthorizationHeader()}).pipe(
    catchError(e =>
      {
      return throwError(e.error.mensaje);
    })
  );
}

}
