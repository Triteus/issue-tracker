import { Observable } from 'rxjs';

export interface Tracker {
  selectedObjectId$: () => Observable<string | null>;
  getSelectedObjectId: () => string | null;
}
