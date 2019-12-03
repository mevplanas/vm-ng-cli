import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractContainerComponent } from './extract-container.component';

describe('ExtractContainerComponent', () => {
  let component: ExtractContainerComponent;
  let fixture: ComponentFixture<ExtractContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtractContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
