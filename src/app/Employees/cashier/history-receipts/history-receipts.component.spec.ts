import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryReceiptsComponent } from './history-receipts.component';

describe('HistoryReceiptsComponent', () => {
  let component: HistoryReceiptsComponent;
  let fixture: ComponentFixture<HistoryReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoryReceiptsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
