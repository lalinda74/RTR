import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let iconDe: any;
  let iconEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    iconDe = fixture.debugElement.query(By.css('.material-icons'));
    iconEl = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render card icon', () => {
    component.data = { icon: 'add', key: 'key', value: 'value' };

    component.ngOnInit();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('span').innerText).toContain('add');
  });

  it('should render card title', () => {
    component.data = { icon: 'add', key: 'key', value: 'value' };

    component.ngOnInit();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h3').innerText).toContain('key');
  });

  it('should render card desc', () => {
    component.data = { icon: 'add', key: 'key', value: 'value' };

    component.ngOnInit();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h5').innerText).toContain('value');
  });
});
