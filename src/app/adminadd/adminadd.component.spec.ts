import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminaddComponent } from './adminadd.component';

describe('AdminaddComponent', () => {
  let component: AdminaddComponent;
  let fixture: ComponentFixture<AdminaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
