import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ResidentesComponent } from './residentes/residentes.component';
import { ResidenteService } from './residentes/residente.service';
import { FormComponent } from './residentes/form.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PaginatorComponent } from './paginator/paginator.component';
import { DetalleComponent } from './residentes/detalle/detalle.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RegistrosComponent } from './registros/registros.component';
import { LoginComponent } from './usuarios/login.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { Paginator2Component } from './paginator/paginator2.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'residentes', component: ResidentesComponent, canActivate: [AuthGuard] },
  { path: 'registros', component: RegistrosComponent, canActivate: [AuthGuard] },
  { path: 'residentes/page/:page', component: ResidentesComponent, canActivate: [AuthGuard] },
  { path: 'registros/page/:page', component: RegistrosComponent, canActivate: [AuthGuard] },
  { path: 'residentes/form', component: FormComponent, canActivate: [AuthGuard] },
  { path: 'residentes/form/:id', component: FormComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }

];

@NgModule({
  declarations: [
    AppComponent,
    ResidentesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    HeaderComponent,
    FooterComponent,
    RegistrosComponent,
    LoginComponent,
    Paginator2Component

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,

    RouterModule.forRoot(routes)
  ],
  providers: [ResidenteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
