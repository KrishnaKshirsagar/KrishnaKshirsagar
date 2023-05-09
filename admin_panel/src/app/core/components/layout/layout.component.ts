import {
  AfterViewInit,
  Input,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { UserResFull } from 'src/app/shared/interfaces/results/user.interface';
import { onMainContentChange } from '../../animations/animations';
import { AuthService } from '../../services/auth/auth.service';
import { SidenavService } from '../../services/sidenav/sidenav.service';
import { ApiService as AuthApiService } from 'src/app/modules/auth/services/api/api.service';
import { NavigationEnd, Router } from '@angular/router';
import { LOCAL_STORAGE_AUTH_DETAILS_KEY } from 'src/app/shared/constants/constants';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [onMainContentChange],
})
export class LayoutComponent implements OnInit, AfterViewInit {
  logochange: boolean | undefined;
  sidenavWidth = 5;
  ngStyle: string | undefined;
  @ViewChild('leftSidenav') leftSidenav!: MatSidenav;
  userid: any;
  toggleMenu() {
    this.sidenav.toggle();
  }

  authenticated = false;
  @Input() sidenav!: MatSidenav;

  authorized = false;

  isLogin!: boolean;

  companyName: string = '';

  token!: string;

  auth!: UserResFull | null;

  routes: {
    title: string;
    path: string;
    icon: string;
  }[] = [];

  public onSideNavChange!: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private _sidenavService: SidenavService,
    private apiService: AuthApiService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.authService.getAuthStatusObservable().subscribe((details) => {
        this.authenticated = !!details;
        this.authorized = this.authenticated;
        this.auth = details;
      });
    }, 3000);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const routePath = this.router.url.split("?")[0];
        this.isLogin = routePath === "/auth/login";
      }
    });
    this._sidenavService.sideNavState$.subscribe((res) => {
      this.onSideNavChange = res;
    });
    this.getLoggedInUser();
  }

  getLoggedInUser() {
    const detailsStr = sessionStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      this.userid = userDetails._id;
    }
  }

  logout() {
    this.getLoggedInUser();
    this.apiService.logout(this.userid).subscribe((resp: any) => {
      if (resp.status == true) {
         this.authService.setAuthStatus(null);
         sessionStorage.clear();
         this.router.navigate(["/admin/auth/login"]);
      }
    });
  }

  increase() {
    this.sidenavWidth = 17;
    this.logochange = true;
  }
  decrease() {
    this.sidenavWidth = 5;
    this.logochange = false;
  }

  ngAfterViewInit() {}
}
