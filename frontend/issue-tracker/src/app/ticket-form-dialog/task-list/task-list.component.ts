import { Component, OnInit, Input } from '@angular/core';
import { SubTask } from 'src/app/models/subtask.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.sass']
})
export class TaskListComponent implements OnInit {

  @Input() tasks: SubTask;

  constructor() { }

  ngOnInit() {
  }

}
