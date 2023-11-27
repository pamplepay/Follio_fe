import { FormGroup } from '@angular/forms';

export class FormHandler {
  static convertObjectToFormData(value: any): FormData {
    const result = new FormData();
    Object.keys(value).forEach(key => {
      if (value[key]) {
        result.append(key, value[key]);
      }
    });
    return result;
  }
}
