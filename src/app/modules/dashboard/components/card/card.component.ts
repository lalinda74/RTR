import { Component, Input, OnInit } from '@angular/core';
import { CardModel } from 'src/app/core/models/UI/card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() data!: CardModel;

  constructor() { }

  ngOnInit(): void {
  }

}
