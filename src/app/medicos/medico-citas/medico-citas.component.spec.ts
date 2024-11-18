import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoCitasComponent } from './medico-citas.component';

describe('MedicoCitasComponent', () => {
  let component: MedicoCitasComponent;
  let fixture: ComponentFixture<MedicoCitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoCitasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicoCitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
