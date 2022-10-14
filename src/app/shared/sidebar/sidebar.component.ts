import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  /* public usuario: Usuario */
  menuItems: any[];


  constructor( private sidebarservice: SidebarService,
                private usuarioService : UsuarioService) { 
    this.menuItems = sidebarservice.menu;
    /* this.usuario = usuarioService.usuario; */
  }

  ngOnInit(): void {
  }

}
