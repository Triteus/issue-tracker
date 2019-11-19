import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

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
