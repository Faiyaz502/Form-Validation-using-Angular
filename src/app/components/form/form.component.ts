import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/Validators/custom-validators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {



  

  submitted = false ;

  userForm = this.fb.group({

   firstName : ['',[Validators.required,Validators.minLength(3)]],
   lastName : ['',[Validators.required,Validators.minLength(3)]],
   email : ['',[Validators.required,Validators.email]],
   phone : ['',[Validators.required,Validators.pattern("^[0-9]{11}$")]],
   birthDate : ['',[Validators.required,CustomValidators.birthday]],
   birthTime : [''],
   age : ['',[Validators.required,Validators.min(18),Validators.max(120)]],
   password : ['',[Validators.required,Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)]],
   link : ['',[Validators.pattern(/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,6}(:\d+)?(\/[\w-]*)*(\?[\w=&-]*)?(#[\w-]*)?$/)]],
   address : ['',Validators.required],
   city : ['',Validators.required],
   state : ['',Validators.required],
   zip : ['',[Validators.required , Validators.pattern("^[0-9]{1,6}$")]],
   country : ['',Validators.required],
   gender : ['',Validators.required],
   color : ['',Validators.required],
   salary : ['',[Validators.required,Validators.min(20000)]],
   exp : ['',[Validators.required,Validators.max(50)]],
  skills: this.fb.array([], [CustomValidators.minSelectedCheckboxes(3)]),
   cv : ['',Validators.required],
   portfolio : ['',Validators.required],
   picture : ['',Validators.required],
   bio : ['',[Validators.required,Validators.minLength(10)]],
   motivate:['',[Validators.required,Validators.minLength(10)]],
   priority: ['',Validators.required],
   aboutUs:['',Validators.required],
   subscribe : [false,Validators.requiredTrue],
   agree : [false,Validators.requiredTrue],
   consent : [false,Validators.requiredTrue]



  })



  salaryValue = 75000; // default value

ngOnInit(): void {
  const salaryControl = this.userForm.get('salary');

  if (salaryControl) {
    salaryControl.valueChanges.subscribe((value: string | number | null) => {
      // Convert string to number, fallback to 0 if null
      this.salaryValue = value !== null ? +value : 0;
    });
  }
}





  constructor(private fb : FormBuilder){

  }


    skills = [
    'JavaScript', 'Python', 'Java',
    'React', 'Angular', 'Vue.js',
    'UI/UX Design', 'Photography', 'Content Writing',
    'Digital Marketing', 'Data Analytics', 'Project Management'
  ];

  
  get expFormArray(): FormArray {
    return this.userForm.get('skills') as FormArray;
  }

onCheckboxChange(event: any) {
  const expArray = this.expFormArray;
  if (event.target.checked) {
    expArray.push(this.fb.control(event.target.value));
  } else {
    const index = expArray.controls.findIndex(x => x.value === event.target.value);
    expArray.removeAt(index);
  }
  expArray.markAsTouched(); // Add this to trigger validation messages
}

  onFileChange(event: any, controlName: string) {
  const control = this.userForm.get(controlName);
  const files: FileList = event.target.files;
  const maxSize = 2 * 1024 * 1024; // 2 MB

  if (!files || files.length === 0) {
    control?.setErrors({ required: true });
    return;
  }

  let invalidType = false;
  let oversize = false;

  // Cast each item to File
  Array.from(files).forEach((file: File) => {
    if (controlName === 'picture' && !file.type.startsWith('image/')) invalidType = true;

    if (controlName === 'cv' && ![
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ].includes(file.type)) invalidType = true;

    if (file.size > maxSize) oversize = true;
  });

  if (invalidType) {
    control?.setErrors({ fileType: true });
  } else if (oversize) {
    control?.setErrors({ maxSize: true });
  } else {
    // For multiple files, store the FileList; for single file, store File
    control?.setValue(controlName === 'portfolio' ? Array.from(files) : files[0]);
    control?.updateValueAndValidity();
  }
}



  saveAsDraft() {
    // Get raw form value ignoring validation state
    const draftData = this.userForm.getRawValue(); 
    console.log("Draft saved:", draftData);

    // TODO: send draftData to backend or localStorage
    Example: localStorage.setItem('draftForm', JSON.stringify(draftData));
  }






  onSubmit() {
    this.submitted=true;
    if (this.userForm.valid) {
      console.log("Form submitted:", this.userForm.value);
    } else {
      console.log("Form invalid");
      this.userForm.markAllAsTouched();
    }
  }



}
