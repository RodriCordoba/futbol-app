import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = signal<string>('');
  loading = signal<boolean>(false);

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit() {
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      await this.auth.signIn(this.email, this.password);
      this.router.navigate(['/admin']);
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Credenciales inválidas');
    } finally {
      this.loading.set(false);
    }
  }
}