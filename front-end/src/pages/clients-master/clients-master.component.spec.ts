import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsMasterComponent } from './clients-master.component';

describe('ClientsMasterComponent', () => {
  let component: ClientsMasterComponent;
  let fixture: ComponentFixture<ClientsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
