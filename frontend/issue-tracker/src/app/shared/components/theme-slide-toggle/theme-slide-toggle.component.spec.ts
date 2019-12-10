import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeSlideToggleComponent } from './theme-slide-toggle.component';

describe('ThemeSlideToggleComponent', () => {
  let component: ThemeSlideToggleComponent;
  let fixture: ComponentFixture<ThemeSlideToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeSlideToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeSlideToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
