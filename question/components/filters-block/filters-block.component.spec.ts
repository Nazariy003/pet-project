import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FiltersBlockComponent} from './filters-block.component';

describe('FiltersBlockComponent', () => {
  let component: FiltersBlockComponent;
  let fixture: ComponentFixture<FiltersBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersBlockComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
