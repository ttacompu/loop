import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { SearchService } from './services/searchService';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module'



const routes = [
  { path: '', component: SearchComponent },
];
@NgModule({
  imports: [SharedModule.forRoot(), RouterModule.forChild(routes) ],
  declarations: [SearchComponent],
  exports: [SearchComponent],
  providers: [SearchService]
})
export class SearchModule { }
