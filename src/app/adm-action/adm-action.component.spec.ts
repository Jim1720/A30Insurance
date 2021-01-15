import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmActionComponent } from './adm-action.component';

describe('AdmActionComponent', () => {
  let component: AdmActionComponent;
  let fixture: ComponentFixture<AdmActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
