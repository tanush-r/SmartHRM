import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  show: boolean = false; // For password visibility toggle
  private auth = getAuth(initializeApp(environment.firebase));
  userEmail: string = ''; // Variable to store the user's email

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      setPersistence(this.auth, browserLocalPersistence)
        .then(() => signInWithEmailAndPassword(this.auth, username, password))
        .then((userCredential) => {
          console.log('User logged in:', userCredential.user);
          this.userEmail = userCredential.user.email || ''; // Default to empty string if email is null
          this.router.navigate(['/home'], { replaceUrl: true }); // Navigate to home on successful login
        })
        .catch((error) => {
          console.error('Login failed:', error.code, error.message);
          alert('Login failed: ' + error.message); // Display error message
        });
    } else {
      alert('Please fill in all fields correctly.'); // Alert for invalid form
    }
  }

  togglePasswordVisibility() {
    this.show = !this.show; // Toggle password visibility
  }
}
