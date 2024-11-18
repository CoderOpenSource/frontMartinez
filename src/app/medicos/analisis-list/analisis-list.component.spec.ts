import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisListComponent } from './analisis-list.component';

describe('AnalisisListComponent', () => {
  let component: AnalisisListComponent;
  let fixture: ComponentFixture<AnalisisListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalisisListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnalisisListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
