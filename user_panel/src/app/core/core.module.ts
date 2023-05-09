import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { IndexComponent } from "./pages/index/index.component";
import { HomeComponent } from "./pages/home/home.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { ForbiddenComponent } from "./pages/forbidden/forbidden.component";
import { ErrorComponent as ErrorPageComponent } from "./pages/error/error.component";
import { HeaderComponent } from "./components/header/header.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { SharedModule } from "../shared/shared.module";
import { LayoutComponent } from "./components/layout/layout.component";
import { ErrorComponent } from "./components/error/error.component";
import { ErrorDialogComponent } from "./components/error-dialog/error-dialog.component";
import { InfoDialogComponent } from "./components/info-dialog/info-dialog.component";
import { DialogService } from "./services/dialog/dialog.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpConfigInterceptor } from "./interceptors/http-config/http-config.interceptor";
import { LoaderInterceptor } from "./interceptors/loader/loader.interceptor";
import { ErrorInterceptor } from "./interceptors/error/error.interceptor";
// import { NotificationInterceptor } from './interceptors/notification/notification.interceptor';
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { PrivacypolicyComponent } from "./pages/privacypolicy/privacypolicy.component";
import { TermsandconditionsComponent } from "./pages/termsandconditions/termsandconditions.component";
import { NotificationInterceptor } from "./interceptors/notification/notification.interceptor";
import { MatSnackBarModule } from "@angular/material/snack-bar";

@NgModule({
  declarations: [
    IndexComponent,
    HomeComponent,
    NotFoundComponent,
    HeaderComponent,
    PrivacypolicyComponent,
    TermsandconditionsComponent,
    SidebarComponent,
    LayoutComponent,
    ErrorComponent,
    ForbiddenComponent,
    ErrorPageComponent,
    ErrorDialogComponent,
    InfoDialogComponent,
    SpinnerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    HttpClientModule,
    MatSnackBarModule,
  ],
  exports: [HeaderComponent, LayoutComponent, ErrorComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotificationInterceptor,
      multi: true,
    },
    DialogService,
  ],
})
export class CoreModule {}
