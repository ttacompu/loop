import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GridModule } from '@progress/kendo-angular-grid';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module'
import { UserService } from '../core/services/userService';

import { ViewLogsComponent } from './view-logs/view-logs.component';
import { logService } from './services/logService';
import { logListResolver } from './services/logListResolver';

const routes = [
  { path: '', component: ViewLogsComponent },
  { path: 'viewLogs', component: ViewLogsComponent, data: { parent: "System" }, resolve: { logList: logListResolver } },
  ];
@NgModule({
  imports: [FormsModule, SharedModule.forRoot(), CommonModule, GridModule, RouterModule.forChild(routes)],
  declarations: [ViewLogsComponent],
  exports: [ViewLogsComponent],
  providers: [UserService, logService, logListResolver]
})
export class SystemModule { }
