import { Injectable } from "@angular/core";
import { DialogService, DialogRef, DialogCloseResult } from "@progress/kendo-angular-dialog";


@Injectable()
export class DialogWrapService {

  constructor(private dialogService: DialogService) {

  }

  createDialog(option) {
    const resultOption =
    {
      title: 'Please confirm',
      actions: [
        { text: 'Yes', primary: true },
        { text: 'No' }
      ],
      width: 450,
      height: 200,
      minWidth: 250,
      ...option
    }
    return this.dialogService.open(resultOption);
  }

  // Accept three callback functions; first one is when primary Button click, second is when dialog close and third is when other button click
  dialogResponse(dialog: DialogRef, primaryButtonFn=null, DialogCloseFn=null, OtherButtonFn=null) {
    return dialog.result.subscribe((result: any) => {
      if (result instanceof DialogCloseResult) {
        if (DialogCloseFn) {
          DialogCloseFn();
        }
      } else {
        if (result.primary == true) {
          if (primaryButtonFn) {
            primaryButtonFn();
          }
        } else {
          if (OtherButtonFn) {
            OtherButtonFn();
          }
        }
      }
    });
  }

}
