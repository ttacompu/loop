import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
//import { SelectiveStrategy } from './core/services/selective-strategy.service';
//import { SearchComponent } from './search/search.component'
import { SecretaryHomeComponent } from './secretary-home/secretary-home.component'
//import { ViewNotesComponent } from './view-notes/view-notes.component'
import { PermissionGuard } from './shared/permissionGuard'
import { IndexGuard } from './shared/IndexGuard';
import { NotFoundComponent } from './notFound/notFound.component';

const routes = [
  { path: '', redirectTo: "/home/index", pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: "app/home/home.module#HomeModule",
    data: {parent: 'Home' },
    canActivate: [IndexGuard]
  },
  {
    path: 'secretaryHome',
    component: SecretaryHomeComponent,
    data: { parent: 'Home' },
    canActivate: [PermissionGuard]
  },
  //{ path: 'search/:searchText', component: SearchComponent },
  {
    path: 'search/:searchText',
    loadChildren: "app/search/search.module#SearchModule",
    //data: { preload: true},
    canActivate: [PermissionGuard]
  },
  {
    path: 'viewnotes',
    loadChildren: "app/view-notes/view-notes.module#ViewNotesModule",
    parent: 'viewnotes',
    data: { parent: 'View Notes' },
   // data: { preload: true, parent: 'View Notes' },
    canActivate: [PermissionGuard]
  },
  
  {
    path: 'system',
    loadChildren: "app/system/system.module#SystemModule",
    canActivate: [PermissionGuard]
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  { path: '**', component: NotFoundComponent }
];


 

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forRoot(routes),
    //RouterModule.forRoot(routes, { preloadingStrategy: SelectiveStrategy}),
  ],
})
export class RoutingModule {

}
