import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthheaderComponent } from './authheader.component';

describe('AuthheaderComponent', () => {
  let component: AuthheaderComponent;
  let fixture: ComponentFixture<AuthheaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthheaderComponent]
    });
    fixture = TestBed.createComponent(AuthheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
