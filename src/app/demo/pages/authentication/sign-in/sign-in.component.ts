import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

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
    
    this.authService.login(credentials.email, credentials.password)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
        
          this.router.navigate(['/analytics']);

     
        },
        error: (err) => {  
          console.error('Login Error:', err);
          this.errorMessage = this.getErrorMessage(err);
        }
      });
  }

  private getErrorMessage(error: any): string {
   
    if (error.status === 401) {
      return 'Invalid email or password!';
    }
    return 'An unexpected error occurred. Please try again later.';
  }
}