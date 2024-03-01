import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LogInData } from 'src/app/_models/auth.model';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup | undefined;
  public userIsAuthenticated = false;
  private authListener: Subscription | undefined;
  public userIsAdmin = false;
  private roleListener: Subscription | undefined;
  hide = true;

  constructor(
    private builder: FormBuilder, 
    private authService: AuthService, 
    private router: Router, 
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loginForm = this.builder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    })
    this.userIsAdmin = this.authService.getRole();
    this.userIsAuthenticated = this.authService.getAuthStatus();
    this.authListener = this.authService.getAuthStatusListener()
      .subscribe((isAuthenticated: boolean) => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.roleListener = this.authService.getRoleListener()
      .subscribe((isAdmin: boolean) => {
        this.userIsAdmin = isAdmin;
      });

    if (this.userIsAuthenticated) {
      this.router.navigate(['/main']);
      this._snackBar.open("Welcome back", "Okay");
    }
  }

  get formControls() {
    return this.loginForm!.controls;
  }

  ngOnDestroy() {
    this.authListener?.unsubscribe();
    this.roleListener?.unsubscribe();
  }

  onSubmit(formData: LogInData) {
    this.authService.logInUser(formData.username, formData.password)
      .subscribe(authenticated => {
        console.log("authenticated: " + authenticated);
        if (authenticated) {
          this._snackBar.open("Welcome back", "Okay");
          this.router.navigate(['/home']);
        } else {
          this._snackBar.open("Failed to login, please try again!", "Okay");
        }
      });
  }
}
