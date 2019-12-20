import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchKindergartensComponent } from './search-kindergartens.component';

describe('SearchKindergartensComponent', () => {
  let component: SearchKindergartensComponent;
  let fixture: ComponentFixture<SearchKindergartensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchKindergartensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchKindergartensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
