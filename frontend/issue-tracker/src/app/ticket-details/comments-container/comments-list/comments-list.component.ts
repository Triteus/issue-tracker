import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { UserComment } from 'src/app/models/comment.model';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss']
})
export class CommentsListComponent implements OnInit {

  @Output() commentDeleted = new EventEmitter<any>();

  @Input() comments: UserComment[];

  constructor() { }

  ngOnInit() {
  }

  update() {
    this.commentDeleted.emit();
  }

}
