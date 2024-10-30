import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JDUploadComponent } from './jd-upload.component';

describe('JDUploadComponent', () => {
  let component: JDUploadComponent;
  let fixture: ComponentFixture<JDUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JDUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JDUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
