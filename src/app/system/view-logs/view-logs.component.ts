import { Component, OnInit } from '@angular/core';
import { logService } from '../services/logService';
import { Log } from '../../models/Log';
import { process, State } from '@progress/kendo-data-query';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor } from '@progress/kendo-data-query/dist/npm/grouping/group-descriptor.interface';
import * as R from 'ramda';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-view-logs',
  templateUrl: './view-logs.component.html',
  styleUrls: ['./view-logs.component.css']
})
export class ViewLogsComponent implements OnInit {
  logGridData: GridDataResult;
  logData: Log[];

  public state: State = {
    skip: 0,
    take: 10,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    },
    group: []
  };

  constructor(private route: ActivatedRoute, private router: Router, private logService_: logService) {

  }

  ngOnInit() {
    this.logData = this.route.snapshot.data["logList"];
    this.logGridData = process(this.logData, this.state);

    if (!R.isEmpty(this.logService_.fileter)) {
      this.state.filter = this.logService_.fileter;
      this.logGridData = process(this.logData, this.state);
    }
    
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.logGridData = process(this.logData, this.state);
  }

  clearLogs() {
    if (confirm("Are you sure want to delete logs?")) {
      //alert("Clear Logs");
      this.logService_.clearLog();
      this.logData = [];
      this.logGridData = process(this.logData, this.state);
      //this.router.navigate(['/system/viewLogs']);
    }
  }
}
