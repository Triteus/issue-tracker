import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent implements OnInit {

  @Input() description: string;
  @Input() amount: number;

  constructor() { }

  ngOnInit() {
  }

}
