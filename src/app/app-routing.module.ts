import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './auth/components/signup/signup.component';
import { LoginComponent } from './auth/components/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './header/header.component';
import { AuthheaderComponent } from './auth/components/authheader/authheader.component';
import { CartComponent } from './pages/cart/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderhistoryComponent } from './pages/orderhistory/orderhistory.component';

const routes: Routes = [{ path: "signup", component: SignupComponent },
                        {path : "login",component:LoginComponent},
                        {path: "auth", component:AuthheaderComponent},
                        { path: "", redirectTo: "login", pathMatch: "full" },
                        { path: "home", component: HomeComponent },
                        { path: "header", component: HeaderComponent },
  { path: "cart", component: CartComponent },
  { path: "checkout", component: CheckoutComponent },
  {path : "orderhistory",component: OrderhistoryComponent}
                        
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
