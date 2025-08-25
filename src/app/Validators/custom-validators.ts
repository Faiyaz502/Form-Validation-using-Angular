import { AbstractControl, FormArray, ValidationErrors } from '@angular/forms';

export class CustomValidators {


  // Birthday validator: not future date, min 18 years old
  
  static birthday(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null; // required validator handles empty

    const today = new Date();
    const birthDate = new Date(control.value);

    if (birthDate > today) {
      return { futureDate: true };
    }

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    const exactAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    return exactAge < 18 ? { underage: true } : null;
  }

  
  static age(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    if(control.value){

        return control.value < 18 ? { underage: true } : null;

    }
    return null;
  }


  static minSelectedCheckboxes(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const selectedCount = formArray.controls.length;
      return selectedCount >= min ? null : { minSelected: true };
    };
  }

  
}
