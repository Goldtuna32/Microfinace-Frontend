import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service'; // Import AuthService
import { Router, RouterLink } from '@angular/router'; // Import Router
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  signIn(): void {
    this.errorMessage = null;
    this.loading = true;

    const credentials = { email: this.email, password: this.password };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.router.navigate(['/analytics']); // Redirect on success
      },
      error: (err) => {  
        console.error('Login Error:', err);
        this.loading = false;
        this.errorMessage = 'Login failed. Please check your credentials or try again later.';
      }
    });
  }
}
