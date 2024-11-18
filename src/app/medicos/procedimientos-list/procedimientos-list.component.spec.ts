import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedimientosListComponent } from './procedimientos-list.component';

describe('ProcedimientosListComponent', () => {
  let component: ProcedimientosListComponent;
  let fixture: ComponentFixture<ProcedimientosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcedimientosListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProcedimientosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
