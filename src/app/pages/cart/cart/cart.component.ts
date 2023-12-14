import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Cart, Cartproduct } from 'src/modals/cart.modals';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  cart: Cart = { items: [] };
  displayedColumns: string[] = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action',
  ];
  dataSource: Cartproduct[] = [];
  cartSubscription: Subscription | undefined;
  
  constructor(private cartService: CartService, private http: HttpClient,private router : Router) { }
  
  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart.subscribe((cart: Cart) => {
      this.cart = cart
      this.dataSource = cart.items
      })
  }

    getTotal(items: Cartproduct[]): number {
    return this.cartService.getTotal(items);
  }

  onAddQuantity(item: Cartproduct): void {
    this.cartService.addToCart(item);
  }

  onRemoveFromCart(item: Cartproduct): void {
    this.cartService.removeFromCart(item);
  }

  onRemoveQuantity(item: Cartproduct): void {
    this.cartService.removeQuantity(item);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onCheckout() {
      this.router.navigate(["/checkout"])
  }
}
