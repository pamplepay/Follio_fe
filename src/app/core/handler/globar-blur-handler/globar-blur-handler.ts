import { FormGroup } from '@angular/forms';

export class GlobalBlurHandler {
  static blur(): void {
    const activeElement = document.activeElement as any;
    activeElement.blur()
  }
}
