import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css']
})
export class PeopleListComponent implements OnInit {

  @Input() people;
  @Output() addPerson = new EventEmitter<any>();
  @Output() editPerson = new EventEmitter<any>();

  constructor() { 

  }

  ngOnInit() {
  }

}
