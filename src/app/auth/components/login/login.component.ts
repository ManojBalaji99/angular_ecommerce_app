import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage = '';
  successMessage = '';
  userLogin = { email: "", password: "" };
  customer_id!: string;


  constructor(public http: HttpClient,
              public authService : AuthService) { }
  
  onSubmit() {
    if (this.userLogin.email && this.userLogin.password) {
      this.http.put("http://localhost:3000/api/login", this.userLogin).subscribe((res:any) => {
        if (!res.success) {
          this.successMessage=""
          this.errorMessage = res.message;
          this.authService.logout()
        }
        else {
          this.errorMessage=""
          this.successMessage = res.message
          this.customer_id = res.user_id
          if (res.token_id) {
            this.authService.setToken(res.token_id)
          }
          console.log(this.customer_id)
           console.log(res.token_id)
        }
      })
    }
    else {
      this.errorMessage=""
      this.errorMessage="Please enter a email and password to login "
    }
  }
}
