import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionerComponent } from './questioner.component';

describe('QuestionerComponent', () => {
  let component: QuestionerComponent;
  let fixture: ComponentFixture<QuestionerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
