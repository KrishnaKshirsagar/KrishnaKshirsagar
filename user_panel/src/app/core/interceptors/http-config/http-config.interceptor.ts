import { HostListener, Injectable, Injector } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../../services/auth/auth.service";
import { NavigationEnd, Router } from "@angular/router";
import packageJson from 'package.json';

import { ApiService as AuthApiService } from "src/app/modules/auth/services/api/api.service";
import { LOCAL_STORAGE_AUTH_DETAILS_KEY } from "src/app/shared/constants/constants";
import { MatDialog } from "@angular/material/dialog";


const MINUTES_UNITL_AUTO_LOGOUT = 15 // in mins
const CHECK_INTERVAL = 1000 // in ms
const LAST_ACTION =  'lastAction';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  userid!:string;

  isLogin!: boolean;

  isLogout!: boolean;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private apiService: AuthApiService,
    private authService: AuthService // private injector: Injector
  ) {
    if(!this.isLogout){
      this.check();
      this.initListener();
      this.initInterval();
      sessionStorage.setItem(LAST_ACTION,Date.now().toString());
    }
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let _token = this.authService.getToken();    
    let  version = packageJson.version;

    let token = request.clone({
      setHeaders: {
        authorization: `Bearer ${_token}`,
        platform:`Web_user_panel`,
        version:version
      },
    });
    return next.handle(token);
  }
  
  //============= To logout after specific time ==============
  public setLastAction(lastAction: number) {
    sessionStorage.setItem(LAST_ACTION, lastAction.toString());
  }

  public getLoginTime() {
    const getkey = sessionStorage.getItem(LAST_ACTION);
    if(getkey)
    return parseInt(getkey);
    else
    return 0
  }

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover',()=> this.reset());
    document.body.addEventListener('mouseout',() => this.reset());
    document.body.addEventListener('keydown',() => this.reset());
    document.body.addEventListener('keyup',() => this.reset());
    document.body.addEventListener('keypress',() => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  check() {
    const now = Date.now();
    const timeleft = this.getLoginTime() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = (timeleft - now) > 0 ? (timeleft - now) : 0;
    this.isLogout  = diff == 0;
    if (this.isLogout){
      this.logout();
    }
  }

  logout() {
    this.dialog.closeAll();
    //checking session storage for user data
    const detailsStr = sessionStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      this.userid = userDetails._id;
      //logout from current session
      this.apiService.logout(this.userid).subscribe(() => {
        sessionStorage.removeItem('companyid');
        this.authService.setAuthStatus(null);
        sessionStorage.clear();
        this.router.navigate(["/auth/login"]);
      });
    }
  }
}
