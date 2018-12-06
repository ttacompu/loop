/*default modules */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

/* custom modules */
import { CoreModule } from './core/core.module'
import { RoutingModule } from './routing.module'
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

/* Component sections*/ 
import { AppComponent } from './app.component';
import { SecretaryHomeComponent } from './secretary-home/secretary-home.component'
import { IndexGuard } from './shared/IndexGuard';
import { PermissionGuard } from './shared/permissionGuard';

/* ngRx*/
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    AppComponent,
    SecretaryHomeComponent,
    //SearchComponent
    //ViewNotesComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    CoreModule,
    RoutingModule,
    HttpModule,
    HttpClientModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([])
  ],
  //FeedbackService,
  providers: [IndexGuard, PermissionGuard],
  bootstrap: [AppComponent]
})
export class AppModule {

}
