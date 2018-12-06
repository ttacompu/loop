import { Component, AfterViewInit, AfterContentInit, ContentChildren, QueryList, ViewChild, ComponentFactoryResolver } from "@angular/core";
import { TabComponent } from "./tab.component";
import { DynamicTabAnchorDirective } from "./dynamic-tab-anchor.directive";

@Component({
    selector : "cgsh-tabs",
    templateUrl : './tabs.component.html'
})
export class TabsComponent implements AfterContentInit{

    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
    @ViewChild(DynamicTabAnchorDirective) dynamicTabPlaceHolder : DynamicTabAnchorDirective;

    dynamicTabs: TabComponent[] = [];

    constructor(private componentFactoryResolver : ComponentFactoryResolver ){

    }

    ngAfterContentInit(){
        const activeTabs = this.tabs.filter(tab => tab.active);
        if(activeTabs.length === 0){
            this.selectTab(this.tabs.first);
        }
    }

    openTab(title:string, template, data, isClosable = false){
       const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TabComponent);
       const viewContainerRef = this.dynamicTabPlaceHolder.viewContainer;

       const componentRef = viewContainerRef.createComponent(componentFactory);

       const instance:TabComponent = componentRef.instance as TabComponent;

       instance.tabTitle = title;
       instance.template = template;
       instance.dataContext = data;
       instance.isCloseable = isClosable;

       this.dynamicTabs.push(instance);
       this.selectTab(this.dynamicTabs[this.dynamicTabs.length -1]);
       
    }

    selectTab(tab : TabComponent){
        
        this.tabs.toArray().forEach(tab => (tab.active = false));
        this.dynamicTabs.forEach( tabs => (tab.active = false))
        tab.active = true;
    }
}