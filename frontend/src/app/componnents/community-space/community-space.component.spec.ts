import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitySpaceComponent } from './community-space.component';

describe('CommunitySpaceComponent', () => {
  let component: CommunitySpaceComponent;
  let fixture: ComponentFixture<CommunitySpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunitySpaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunitySpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
