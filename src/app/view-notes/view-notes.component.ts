import { Component, OnInit, Input } from '@angular/core';
import { ViewNotesService } from './services/viewNotesService'
import { NoteView } from '../models/NoteView'
import { Person } from '../models/Person'
import { process, State } from '@progress/kendo-data-query';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor } from '@progress/kendo-data-query/dist/npm/grouping/group-descriptor.interface';
import { sharedStylesheetJitUrl } from '@angular/compiler';
import { UserService } from '../core/services/userService';
import { Router, ActivatedRoute } from '@angular/router';
import { ObservableBusinessService } from '../core/services/observableBusiness.service';
import { ValidationRuleService } from '../shared/validationRuleService';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: './view-notes.component.html',
  styleUrls: ['./view-notes.component.css']

})
export class ViewNotesComponent implements OnInit {  
  notesView: NoteView[];
  requestorList: Person[];
  userClearyKey: string = "";
  userRoleName: string = "";
  notesResultCount: number = 0;
  selectedRequestor: string = "";

  constructor(private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private observableBusinessService: ObservableBusinessService,
    private validationRuleService: ValidationRuleService,
    private userService: UserService,
    private noteService_: ViewNotesService
  ){}


  ngOnInit() {
    //Get logon user cleary key
    this.userService.getClearyKey().then(key => {
      this.userClearyKey = key;
    })

    //Get logon user Role
    this.userService.getUserRoles().then(roles => {
      roles.forEach(role => {
        this.userRoleName = role.name;
      });
    })

    this.userService.getClearyKey().then(key => {
      this.noteService_.getRequestorList(this.userClearyKey, this.userRoleName).subscribe((results) => {
        this.requestorList = results;
        if (results.length > 0) {
          this.notesResultCount = results.length;
          this.selectedRequestor = results[0].clearyKey;
          this.noteService_.getRequestorNotes(this.userClearyKey, this.userRoleName, this.selectedRequestor).subscribe((noteData) => {
            //this.notesView = noteData;
            this.notesView = noteData.filter(note => note.requesterClearyKey === this.selectedRequestor);
          });
        }
      })
    })

  }

  public SafeHtmlContent(content: string) {
    let hcontent: string = content;
    if (this.IsEmptyOrNull(content) == false) {
      hcontent = content.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
    return this.sanitizer.bypassSecurityTrustHtml(hcontent);
  }

  public IsEmptyOrNull(value: string): Boolean {
    if (typeof value != 'undefined' && value) {
      return false;
    }
    return true;
  }

  public valueChange(value: any): void {
      if (value.toLowerCase() === 'select item...')
      {
          //No Item Selected
      }
      else {           
        this.noteService_.getRequestorNotes(this.userClearyKey, this.userRoleName, value).subscribe((noteData) => {
          //this.notesView = noteData;
          this.notesView = noteData.filter(note => note.requesterClearyKey === value);
        });
      }
  }

}






