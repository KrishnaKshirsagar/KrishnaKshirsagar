import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService as AuthApiService } from 'src/app/modules/auth/services/api/api.service';
import { UserResFull } from 'src/app/shared/interfaces/results/user.interface';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() user!: UserResFull | null;

  @Input() authenticated!: boolean;

  @Input() authorized!: boolean;

  @Input() sidenav!: MatSidenav;

  isLogin!: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: AuthApiService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const routePath = this.router.url.split('?')[0];
        this.isLogin = routePath === '/auth/login';
      }
    });
  }

  toggleMenu() {
    this.sidenav.toggle();
  }

  logout() {
    // this.apiService.logout().subscribe(() => {
    //   this.authService.setAuthStatus(null);
    //   this.router.navigate(['/auth/login']);
    // });
  }
}
