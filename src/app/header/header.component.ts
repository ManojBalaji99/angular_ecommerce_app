import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; 

import { Router } from '@angular/router';
import { Cart, Cartproduct } from 'src/modals/cart.modals';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  {
  private _cart: Cart = { items: [] };
  itemsQuantity = 0;

    constructor(public authService: AuthService,
    public cartService : CartService,
  public router : Router) { }

  @Input() 
  get cart() {
    return this._cart
  }
  
    set cart(cart: Cart) {
    this._cart = cart;

    this.itemsQuantity = cart.items
      .map((item) => item.quantity)
      .reduce((prev, curent) => prev + curent, 0);
  }

  
  logout() {
    this.authService.logout()
    this.router.navigate(["/login"])
  }
    getTotal(items: Cartproduct[]): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

}
