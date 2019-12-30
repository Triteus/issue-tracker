import { Component, OnInit, Input } from '@angular/core';
import { History } from 'src/app/models/history.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  @Input() histories: History[] = [];
  displayedColumns = ['path', 'oldValue', 'pointingRight', 'newValue'];

  constructor() { }

  ngOnInit() {
  }

  pathNames(paths) {
    return paths.map(obj => obj.path);
  }

}
