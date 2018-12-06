import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PeopleListComponent} from './people-list.component';
import {PeopleService} from './people.service';
import { PersonEditComponent } from './person-edit.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [CommonModule, ReactiveFormsModule ],
  declarations: [PeopleListComponent, PersonEditComponent],
  exports: [PeopleListComponent,PersonEditComponent ],
  providers: [PeopleService, PersonEditComponent]
})
export class PeopleModule {}