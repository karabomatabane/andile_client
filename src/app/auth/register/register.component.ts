import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { SpinnerService } from 'src/app/_services/spinner.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide = true;
  hide2 = true;
  registerForm: FormGroup | undefined;

  constructor(
    private builder: FormBuilder,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.builder.group({
      username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, emailValidator]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      confirmPassword: ['', Validators.required],
    }, {
      validator: this.passwordMatchValidator
    });
  }

    get formControls() {
      return this.registerForm?.controls;
    }
  
    //custom validator for password match
    passwordMatchValidator(formGroup: FormGroup): void {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
  
      if (password !== confirmPassword) {
        formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
      } else {
        formGroup.get('confirmPassword')?.setErrors(null);
      }
    }
  
    onSubmit(FormData: any) {
      if (this.registerForm?.invalid) {
        console.log('Invalid form');
        return;
      }
      this.spinnerService.showSpinnerOverlay();
      this.authService.createUser(
        FormData.username,
        FormData.name,
        FormData.email,
        FormData.password
        ).subscribe(
          (res: any) => {
            console.log(res);
            this.spinnerService.hideSpinnerOverlay();
            this.router.navigate(['/']);
          },
          (err: any) => {
            console.log(err);
            this.spinnerService.hideSpinnerOverlay();
          }
        );
    }

}

export function emailValidator(control: FormControl): { [key: string]: any } | null {
  const emailRegex = new RegExp(
    '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
  );
  const valid = emailRegex.test(control.value);
  return valid
    ? null
    : {
      invalidEmail: true,
    };
}
