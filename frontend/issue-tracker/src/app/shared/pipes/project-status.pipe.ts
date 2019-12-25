import { Pipe, PipeTransform } from '@angular/core';
import { ProjectStatus } from 'src/app/models/project.model';

@Pipe({
  name: 'projectStatus'
})
export class ProjectStatusPipe implements PipeTransform {

  transform(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.ABORTED: return 'Abgebrochen';
      case ProjectStatus.ACTIVE: return 'Aktiv';
      case ProjectStatus.DEFERRED: return 'Pausiert';
      case ProjectStatus.FINISHED: return 'Abgeschlossen';
      case ProjectStatus.OPEN: return 'Offen';
      default: return '';
    }
  }
}
