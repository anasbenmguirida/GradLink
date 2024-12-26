import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeMentoratComponent } from './demande-mentorat.component';

describe('DemandeMentoratComponent', () => {
  let component: DemandeMentoratComponent;
  let fixture: ComponentFixture<DemandeMentoratComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeMentoratComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeMentoratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
