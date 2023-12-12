
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{

  errorMessage!: string;
  
  user = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address:"",
    password: "",
    conFirmPassword:""
  }
  constructor(public http: HttpClient,
              public router: Router) { }

ngOnInit(): void {}

  onSubmit() {

    if (this.user.first_name && this.user.last_name && this.user.email && this.user.phone_number && this.user.address && this.user.password && this.user.conFirmPassword) {
     
      if (this.user.password != this.user.conFirmPassword) {
        this.errorMessage="Password does not match"
      }

      else {
        this.errorMessage=""
        console.log(this.user)
        this.http.post("http://localhost:3000/api/addCustomer", this.user).subscribe((res: any) => {
          window.alert(res.message)
          this.router.navigate(["/login"])
        })
        

      }
    }
    
    else {
      this.errorMessage = "Fill out all"
    }
   
  }
}
