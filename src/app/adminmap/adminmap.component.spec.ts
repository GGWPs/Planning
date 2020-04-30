import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminmapComponent } from './adminmap.component';

describe('AdminmapComponent', () => {
  let component: AdminmapComponent;
  let fixture: ComponentFixture<AdminmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
