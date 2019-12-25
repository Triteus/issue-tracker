import { Pipe, PipeTransform } from '@angular/core';
import { ProjectType } from 'src/app/models/project.model';

@Pipe({
  name: 'projectType'
})
export class ProjectTypePipe implements PipeTransform {

  transform(type: ProjectType): string {
    switch (type) {
      case ProjectType.ARCHITECTURE: return 'Architektur';
      case ProjectType.DESIGN: return 'Design';
      case ProjectType.DEV: return 'Development';
      case ProjectType.INFRA: return 'Infrastruktur';
      case ProjectType.OTHER: return 'Sonstiges';
      case ProjectType.PLANNING: return 'Planung';
      case ProjectType.PROD: return 'Produktion';
      case ProjectType.PROTOTYPING: return 'Prototyping';
      case ProjectType.REQUIREMENTS: return 'Anforderungserhebung';
      case ProjectType.TESTING: return 'Testen';
      default: return '';
    }
  }
}
