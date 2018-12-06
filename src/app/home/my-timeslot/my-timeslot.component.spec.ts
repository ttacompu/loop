import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTimeslotComponent } from './my-timeslot.component';

describe('MyTimeslotComponent', () => {
  let component: MyTimeslotComponent;
  let fixture: ComponentFixture<MyTimeslotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTimeslotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTimeslotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
