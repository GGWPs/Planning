import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmbookingComponent } from './confirmbooking.component';

describe('ConfirmbookingComponent', () => {
  let component: ConfirmbookingComponent;
  let fixture: ComponentFixture<ConfirmbookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmbookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmbookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
