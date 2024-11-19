import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementsFormComponent } from './requirements-form.component';

describe('RequirementsFormComponent', () => {
  let component: RequirementsFormComponent;
  let fixture: ComponentFixture<RequirementsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequirementsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
