import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-ticket-systems-input',
  templateUrl: './ticket-systems-input.component.html',
  styleUrls: ['./ticket-systems-input.component.scss']
})
export class TicketSystemsInputComponent implements OnInit {

  @Input() systemsControl: FormControl;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor() {}

  ngOnInit() {}

  get systems() {
    return this.systemsControl.value;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.systemsControl.setValue([...this.systemsControl.value, value.trim()]);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(system: string): void {
    const systems = this.systemsControl.value;
    const index = systems.indexOf(system);

    if (index >= 0) {
      systems.splice(index, 1);
      this.systemsControl.setValue(systems);
    }
  }

}
