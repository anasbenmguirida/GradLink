import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostePageComponent } from './postepage.component';

describe('PostepageComponent', () => {
  let component: PostePageComponent;
  let fixture: ComponentFixture<PostePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
