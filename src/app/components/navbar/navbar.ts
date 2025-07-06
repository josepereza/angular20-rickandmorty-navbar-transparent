import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  
  private scrollThreshold = 50; // Píxeles de scroll para activar el cambio
  private isScrolled = false;
  private isMobileMenuOpen = false;

  constructor() { }

  ngOnInit(): void {
    // Verificar posición inicial del scroll
    this.checkScrollPosition();
  }

  // Escuchar el evento de scroll del document
  @HostListener('document:scroll', ['$event'])
  onDocumentScroll(event: any): void {
    this.checkScrollPosition();
  }

  // Método para verificar la posición del scroll
  private checkScrollPosition(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > this.scrollThreshold;
  }

  // Método público para el trigger del template
  isNavbarScrolled(): boolean {
    return this.isScrolled;
  }

  // Método público para el trigger del menú móvil
  isMobileMenuActive(): boolean {
    return this.isMobileMenuOpen;
  }

  // Métodos adicionales para funcionalidad de la navbar
  onMenuClick(): void {
    // Toggle del menú hamburguesa en mobile
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onMenuLinkClick(): void {
    // Cerrar el menú móvil cuando se hace clic en un enlace
    this.isMobileMenuOpen = false;
  }

  onLogoClick(): void {
    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}