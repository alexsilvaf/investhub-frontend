import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestHubLayoutComponent } from './investhub-layout.component';

describe('InvestHubLayoutComponent', () => {
  let component: InvestHubLayoutComponent;
  let fixture: ComponentFixture<InvestHubLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestHubLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestHubLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
