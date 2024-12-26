import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheProfileComponent } from './recherche-profile.component';

describe('RechercheProfileComponent', () => {
  let component: RechercheProfileComponent;
  let fixture: ComponentFixture<RechercheProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechercheProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechercheProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
