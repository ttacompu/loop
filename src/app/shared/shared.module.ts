import { NgModule, ModuleWithProviders } from '@angular/core';
import { ToastrModule, ToastContainerModule  } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

/* third party kendo modules */
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DatePickerModule, TimePickerModule } from '@progress/kendo-angular-dateinputs';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogModule, WindowModule } from '@progress/kendo-angular-dialog';
import { ValidationRuleService } from './validationRuleService'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WinAuthInterceptor } from '../core/services/winAuthInterceptor';
import { DatePipe } from '@angular/common';
import { DialogWrapService } from './dialogWrapService';



@NgModule({

  imports: [ CommonModule, ToastrModule.forRoot({
    positionClass: 'inline',
    closeButton: true,
    timeOut : 7000
  }),
    ToastContainerModule,
    FormsModule, ReactiveFormsModule, ButtonsModule, GridModule, DropDownsModule, InputsModule, DialogModule, WindowModule, DatePickerModule, TimePickerModule],
  providers: [
    DatePipe,
    ValidationRuleService,
    DialogWrapService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WinAuthInterceptor,
      multi: true
    }],
  
  exports: [CommonModule, ToastrModule, ToastContainerModule, FormsModule, ReactiveFormsModule, ButtonsModule, GridModule, DropDownsModule, InputsModule, DialogModule, WindowModule, DatePickerModule, TimePickerModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
    }
  }
}
