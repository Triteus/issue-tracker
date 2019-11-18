import { Component, OnInit, Input } from '@angular/core';
import { SubTask } from 'src/app/models/subtask.model';

@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.sass']
})
export class TaskListItemComponent implements OnInit {

  @Input() task: SubTask;

  constructor() { }

  ngOnInit() {
  }

}
