import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {


  @Output() cardClick = new EventEmitter();

  @Input() project: Project;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  onClick(event: Event) {
    this.cardClick.emit();
  }

  onKeyDown(event: KeyboardEvent) {
    if(['Enter', 'Space'].includes(event.code)) {
      this.cardClick.emit();
    }
  }

}
