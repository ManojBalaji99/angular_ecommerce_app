import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';


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
    public authService: AuthService,
    public cartService : CartService,
    public router: Router) { }
    
  
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
          this.authService.customer_id = res.user_id
          this.cartService.customer_id = res.user_id
          if (res.token_id) {
            this.authService.setToken(res.token_id)
            this.router.navigate(["/home"])

            
          }
        }
      })
    }
    else {
      this.errorMessage=""
      this.errorMessage="Please enter a email and password to login "
    }
  }

 
}
