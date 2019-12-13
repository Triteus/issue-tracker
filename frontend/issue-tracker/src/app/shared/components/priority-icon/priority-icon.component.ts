import { Component, OnInit, Input } from '@angular/core';
import { Priority } from 'src/app/models/ticket.model';

@Component({
  selector: 'app-priority-icon',
  templateUrl: './priority-icon.component.html',
  styleUrls: ['./priority-icon.component.scss']
})
export class PriorityIconComponent implements OnInit {

  @Input() priority: Priority;

  constructor() { }

  ngOnInit() {}

}
