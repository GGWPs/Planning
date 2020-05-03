import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminemailComponent } from './adminemail.component';

describe('AdminemailComponent', () => {
  let component: AdminemailComponent;
  let fixture: ComponentFixture<AdminemailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminemailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
