import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminbookingComponent } from './adminbooking.component';

describe('AdminbookingComponent', () => {
  let component: AdminbookingComponent;
  let fixture: ComponentFixture<AdminbookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminbookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminbookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
