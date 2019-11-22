import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { SubTask } from 'src/app/models/subtask.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.sass']
})
export class TaskListComponent implements OnInit {

  @Input() ticketForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }

  get subTasks() {
    return this.ticketForm.get('subTasks') as FormArray;
  }

  get numSubTasks() {
    return this.subTasks.value.length;
  }

  get numDoneSubTasks() {
    return this.subTasks.value.reduce((prev: number, task: SubTask) => {
      return task.isDone ? prev + 1 : prev;
    }, 0);
  }

  addSubTask() {
    this.subTasks.push(new FormGroup({
      description: new FormControl('', Validators.required),
      isDone: new FormControl(false, Validators.required)
    }));
  }

  deleteSubTask(index: number) {
    this.subTasks.removeAt(index);
  }


}
