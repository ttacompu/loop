import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core/services/userService';
import { SearchService } from './services/searchService';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  subscriptions: Subscription = new Subscription();
  userClearyKey: string = "";
  userRoleName: string = "";
  searchResults: any[];
  searchResultCount: number = 0;  
  searchText = "";
  count = 0;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private location: Location,
    private searchService_: SearchService,
    private userService: UserService) { }

  ngOnInit() {
    
    this.subscriptions.add(this.route.params.subscribe(
      params => {
        if (params.searchText) {
          this.searchText = params.searchText;
          this.GetSearchResults(this.searchText);
        }
      }
    ));

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

    //Getting search results
    this.GetSearchResults(this.searchText);

  }

  GetSearchResults(searchTerm: string) {
    this.userService.getClearyKey().then(key => {
      if (this.IsEmptyOrNull(this.userClearyKey) == false && this.IsEmptyOrNull(this.userRoleName) == false) {
        this.searchService_.getSearchResults(this.userClearyKey, this.userRoleName, searchTerm).subscribe((results) => {
          if (results.length > 0) {
            this.searchResults = results;
            this.searchResultCount = results.length;
          }
          else {
            this.searchResults = [];
            this.searchResultCount = 0;
          }
        })
      }
    })
  }

  GotoFeedbackRequest(e, id) {
    e.preventDefault();
    this.router.navigate(['/home', 'editRequest', id]);
  }

  public highlight(content: string) {
    let hcontent: string = content;
    if (this.IsEmptyOrNull(content) == false) {
      content = content.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }    

    if (!this.searchText) {
      return content;
    }
    //const hcontent: string = content.replace(new RegExp(this.searchText, "gi"), match => {
    //  return '<span class="highlightText">' + match + '</span>';
    //});
    if (this.IsEmptyOrNull(content) == false) {
      hcontent = content.replace(new RegExp(this.searchText, "gi"), match => {
        return '<span style="background: yellow">' + match + '</span>';
      });
    }

    return this.sanitizer.bypassSecurityTrustHtml(hcontent);
  }

  GoBack(event) {
    //this.router.navigate(['/home', 'index']);
    this.location.back();
  }

  IsEmptyOrNull(value: string): Boolean{
    if (typeof value != 'undefined' && value) {
      return false;
    }
    return true;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
