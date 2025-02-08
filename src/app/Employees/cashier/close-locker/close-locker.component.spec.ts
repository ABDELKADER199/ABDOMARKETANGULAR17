import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseLockerComponent } from './CloseLockerComponent';

describe('CloseLockerComponent', () => {
  let component: CloseLockerComponent;
  let fixture: ComponentFixture<CloseLockerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloseLockerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseLockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
