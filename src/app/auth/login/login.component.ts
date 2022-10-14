import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { LoginForm } from '../../interfaces/login-form.interfaces';


declare const google: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit{

  @ViewChild('googleBtn')
  googleBtn!: ElementRef;

  public formSubmitted = false;

  public loginForm: any= this.fb.group({   
    email:     [ localStorage.getItem('email') || '' , [Validators.required, Validators.email]],
    password:  ['', Validators.required],  
    remember:  [false]
  });


  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private ngzone: NgZone) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {

    google.accounts.id.initialize({
      client_id: '12499754389-c1rfrm0cbk6ne2p633p8c0ho09f6fntf.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
     /*  document.getElementById("buttonDiv"), */
     this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );


  }

  handleCredentialResponse(response: any){
      /* console.log("Encoded JWT ID token: " + response.credential); */

      this.usuarioService.loginGoogle(response.credential)
      .subscribe(resp => {
        /* console.log({login:resp}) */
        this.router.navigateByUrl('/');
      })
  }

  

  login(){  
     
    this.usuarioService.login( this.loginForm.value )
    .subscribe( resp => {
      
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('email', this.loginForm.get('email').value);
        } else {
          localStorage.removeItem('email');
        }
        this.ngzone.run(() => {
          this.router.navigateByUrl('/');

        })

       

    },(err) => {
      Swal.fire('Error', err.error.msg, 'error')
    });
  
    
  }

}


