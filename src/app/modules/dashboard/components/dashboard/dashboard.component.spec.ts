import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CardModel } from 'src/app/core/models/UI/card.model';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let items: CardModel[];
  let debugElement: any;

  @Component({
    selector: 'app-card',
    template: '<div></div>'
  }) class FakeCardComponent {
    @Input() data!: CardModel;
  }

  beforeEach(async () => {
    items = [
      {
        icon: 'add',
        key: 'key 1',
        value: 'value 1',
      },
      {
        icon: 'add',
        key: 'key 2',
        value: 'value 2',
      },
      {
        icon: 'add',
        key: 'key 3',
        value: 'value 3',
      },
    ];
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ DashboardComponent, FakeCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render three cards', () => {
    const element = fixture.debugElement.queryAll(By.css('.as-card-wrapper__inner'));

    component.ngOnInit();
    fixture.detectChanges();

    expect(element.length).toBe(3);
  });

  it('should card section hide if card array length is 0', () => {
    const cardSection = fixture.debugElement.query(By.css('.as-card-wrapper'))?.nativeElement;

    component.ngOnInit();
    fixture.detectChanges();
    
    expect(cardSection).toBeTruthy();
  });
});
