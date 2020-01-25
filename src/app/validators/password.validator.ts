import {AbstractControl, FormControl} from '@angular/forms';


export class PasswordValidator {

  static MatchPassword(AC: AbstractControl): { [key: string]: boolean } | null {
    const password = AC && AC.parent && AC.parent.controls['password'].value;
    const confirmPassword = AC && AC.value;
    if (password === confirmPassword) {
      return null;
    } else {
      return ({'notMatch': true});
    }
  }
}