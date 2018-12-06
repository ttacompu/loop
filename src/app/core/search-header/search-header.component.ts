import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'cgsh-search-header',
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.css']
})
export class SearchHeaderComponent implements OnInit {
  searchText = "";
  alias = environment.alias;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  search(event) {
    event.preventDefault();
    const searchText = this.searchText;
    this.searchText = "";
    if (searchText) {
      this.router.navigate(['/search', searchText]);
    }
  }

}
