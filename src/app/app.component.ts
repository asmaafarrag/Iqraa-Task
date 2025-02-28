import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators,FormBuilder ,FormArray} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  contactForm: FormGroup;

  constructor(private fb: FormBuilder,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstname: new FormControl('', [Validators.required,Validators.minLength(3)]),
      lastname: new FormControl('', [Validators.required,Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required, Validators.minLength(6)]),
      age:new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      isMarried: new FormControl('', [Validators.required]),
      address:new FormGroup({
        city: new FormControl('', [Validators.required]),
        street:new FormControl('', [Validators.required]),
        pincode:new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
      }),
      // phoneNumbers: this.fb.array([]),
    
      phoneNumbers: this.fb.array([this.fb.control('', [Validators.required, Validators.maxLength(11)])]),



    })

    this.loadFormData();

  }


  loadFormData() {
    const savedData = localStorage.getItem('FormData') || '{}';;
    const parsedData = JSON.parse(savedData);
      this.contactForm.patchValue({
        firstname: parsedData.firstname || '',
        lastname: parsedData.lastname || '',
        email: parsedData.email || '',
        password: parsedData.password || '',
        age: parsedData.age || '',
        gender: parsedData.gender || '',
        isMarried: parsedData.isMarried || '',
        address: parsedData.address || { city: '', street: '', pincode: '', country: '' }
      });

      // تحديث phoneNumbers
      this.phoneNumbers.clear();
      parsedData.phoneNumbers.forEach((num: string) => {
        this.phoneNumbers.push(this.fb.control(num, [Validators.required, Validators.maxLength(11)]));
      });



    console.log(savedData)
    // if (savedData) {
    //   const parsedData = JSON.parse(savedData);
    //   this.contactForm.patchValue(JSON.parse(savedData));

    //   if (parsedData.phoneNumbers && Array.isArray(parsedData.phoneNumbers)) {
    //     const phoneNumbersArray = this.contactForm.get('phoneNumbers') as FormArray;
    //     phoneNumbersArray.clear(); // 🛑 إزالة أي بيانات سابقة لتجنب التكرار

    //     parsedData.phoneNumbers.forEach((value: string) => {
    //       this.phoneNumbers.push(this.fb.control(value)); // ✅ إضافة القيم المحفوظة
    //     });
    //   }
    // }
  }

  get phoneNumbers() {
    return this.contactForm?.get('phoneNumbers') as FormArray || this.fb.array([]);
  }

  addPhoneNumbers() {
    this.phoneNumbers.push(this.fb.control(''));
  }



removePhoneNumber(index: number) {
  this.phoneNumbers.removeAt(index);
}

onSubmit() {

  if (this.contactForm.valid) {
    localStorage.setItem("FormData", JSON.stringify(this.contactForm.value));
    this.showSuccess()
  } else {
    this.showError()
  }
}

showSuccess() {
  this.toastr.success('Form Submitted!');
}


showError(){
  this.toastr.error('Please fill in all required fields.');
}

resetForm() {
  this.contactForm.reset();
  localStorage.removeItem("FormData");
  this.toastr.info('Form reset and data cleared.');
}

}
