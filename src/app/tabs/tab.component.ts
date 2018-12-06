import { Component, Input } from "@angular/core";

@Component({
    selector : "cgsh-tab",
    templateUrl : './tab.component.html',
    styles : [
        `
            .pane{
                padding : 1em;
            }
        `
    ]
})
export class TabComponent{
    @Input() 
    tabTitle: string;
    @Input() 
    active = false;

    @Input()
    template;

    @Input()
    dataContext;

    @Input() 
    isCloseable = false;

}