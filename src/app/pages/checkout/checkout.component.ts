import { Component, OnInit } from '@angular/core';
import { Cart, Cartproduct } from 'src/modals/cart.modals';
import { CartService } from 'src/app/services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{

  cart: Cart = { items: [] }

  cartSubscription: Subscription | undefined;
  
  constructor(public cartService:CartService){}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart.subscribe((cart: Cart) => {
      this.cart = cart
      console.log(this.cart)
      })
  }


  submitOrder() {
    
  }
}
