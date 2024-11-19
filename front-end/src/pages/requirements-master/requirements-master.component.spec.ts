import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementsMasterComponent } from './requirements-master.component';

describe('RequirementsMasterComponent', () => {
  let component: RequirementsMasterComponent;
  let fixture: ComponentFixture<RequirementsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequirementsMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
