import { Injectable, NgZone } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { catchError, tap  } from "rxjs/operators";


import { RegisterForm } from '../interfaces/register-form.interfaces';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interfaces';
import { map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

declare const google: any;



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario | undefined;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) { }

  logout() {

    localStorage.removeItem('token');
    
    google.accounts.id.revoke('gguerratineo@gmail.com', () => {
      this.ngZone.run( () => {
        this.router.navigateByUrl('/login')
      })      
    })

  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      map( (resp:any) => {
      
        const {email,google,nombre,role,img,uid,} = resp.usuario;
        this.usuario = new Usuario ( nombre, email, '', role, google, img, uid);
        this.usuario?.impirmirUsuario();
        localStorage.setItem('token', resp.token);
        return true;
      }),
           catchError( error => of(false) )
    );
  }



  crearUsuario(formData: RegisterForm) {
   return this.http.post(`${base_url}/usuarios`, formData)
   .pipe(
    tap( (resp: any) => {
      localStorage.setItem('token', resp.token)
    })
  ); 
  }

  login( formData: LoginForm ) {
    return this.http.post(`${base_url}/login`, formData)
    .pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token)
      })
    );
   }

   loginGoogle(token: string) {
    return this.http.post(`${ base_url }/login/google`, {token})
      .pipe(
        tap( (resp: any) => {
          /* console.log(resp);   */        
          localStorage.setItem('token', resp.token)
        }  )
      )
        
      



   }


}
