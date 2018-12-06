import { NgModule } from '@angular/core';
import { ViewNotesComponent } from './view-notes.component';
import { ViewNotesService } from './services/viewNotesService';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module'



const routes = [
  { path: '', component: ViewNotesComponent },
];
@NgModule({
  imports: [SharedModule.forRoot(), RouterModule.forChild(routes) ],
  declarations: [ViewNotesComponent],
  exports: [ViewNotesComponent],
  providers: [ViewNotesService]
})
export class ViewNotesModule { }
