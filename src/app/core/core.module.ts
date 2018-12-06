import { NgModule } from "@angular/core";
import { MenuModule } from '@progress/kendo-angular-menu';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';

import { WinAuthInterceptor } from './services/winAuthInterceptor';
import { HttpStatusService } from './services/httpStatusService';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { FooterComponent } from "./footer/footer.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { SearchHeaderComponent } from './search-header/search-header.component'
import { ObservableBusinessService } from './services/observableBusiness.service'
import { MenuactiveDirective } from './directives/menuactive.directive';
import { NotFoundComponent } from '../notFound/notFound.component';
import { SelectiveStrategy } from './services/selective-strategy.service';
import { UserService } from './services/userService';
import { ImpersonateComponent } from './impersonate/impersonate.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ViewNotesService } from '../view-notes/services/viewNotesService'



@NgModule({
  declarations: [

    FooterComponent,
    NavMenuComponent,
    NotFoundComponent,
    MenuactiveDirective,
    SearchHeaderComponent,
    ImpersonateComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    MenuModule,
    DropDownsModule
  ],
  exports: [

    FooterComponent,
    NavMenuComponent,
    SearchHeaderComponent,
    ImpersonateComponent,
    NotFoundComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule

  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: WinAuthInterceptor,
    multi: true
  },
    HttpStatusService,
    SelectiveStrategy,
    UserService,
    ViewNotesService,
    ObservableBusinessService
  ]
})
export class CoreModule {

}
