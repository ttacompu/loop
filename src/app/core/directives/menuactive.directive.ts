import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {Router, RoutesRecognized, NavigationEnd, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Directive({
  selector: '[menuactive]'
})
export class MenuactiveDirective implements OnInit  {

  constructor(private el: ElementRef, private router: Router, private route: ActivatedRoute) { 
    
  }

  ngOnInit() {
    this.router.events.filter(event => event instanceof NavigationEnd)
      .map(() => this.route)
      .map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter((route) => route.outlet === 'primary')
      .mergeMap((route) => route.data)
      .subscribe((event) => {
        const parentText = event["parent"];
        if (parentText) {
          this.removeActiveFromParentLi();
          this.setLiwithText(parentText);
        }
      });

  }

/*  @HostListener('document:click', ['$event'])
  handleClick(event : Event){
    const $target = $(event.target);
    const $parentLi=$target.closest('li');
    const classes = $parentLi.attr('class');
    if(classes && classes.indexOf('menuItemContainer') !== -1){
      this.removeActiveFromParentLi();
      $parentLi.addClass('active');
    }else{
      const parentText=$target.data("parent");
      if(parentText){
        this.removeActiveFromParentLi();
        this.setLiwithText(parentText);

      }
    }
  } */

  private removeActiveFromParentLi(){
    const $currentEle = $(this.el.nativeElement);
    const results=$currentEle.find(".menuItemContainer");
    if(results && results.length ){
     $(results).each((index, item) => {
          $(item).removeClass('active');
         
      })
    }
  }

  private setLiwithText(text){
    const $currentEle = $(this.el.nativeElement);
    const results=$currentEle.find(".menuItemContainer");
    if(results && results.length ){
     $(results).each((index, item) => {
       if ($(item).text().trim().toLowerCase() == text.toLowerCase()){
            $(item).addClass('active');
          }
      })
    }

  }

}
