
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart,Cartproduct } from 'src/modals/cart.modals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService  {
  customer_id: string | undefined;
  cartHistory : Cart | undefined
  cart = new BehaviorSubject<Cart>({ items: [] });

  constructor(private snackBar: MatSnackBar,
    public http : HttpClient) { }

  addToCart(item: Cartproduct): void {
    const items = [...this.cart.value.items];
    console.log(this.customer_id)
    const itemInCart = items.find((_item) => _item.product_name === item.product_name);
    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item);
    }

    this.cart.next({ items });
    this.snackBar.open('1 item added to cart.', 'Ok', { duration: 3000 });
    this.cartUpdate()
  }

  removeFromCart(item: Cartproduct, updateCart = true): Cartproduct[] {
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.product_name !== item.product_name
    );

    if (updateCart) {
      this.cart.next({ items: filteredItems });
      this.snackBar.open('1 item removed from cart.', 'Ok', {
        duration: 3000,
      });
    }
    this.cartUpdate()
    return filteredItems;
    
  };


  removeQuantity(item: Cartproduct): void {
    let itemForRemoval!: Cartproduct;

    let filteredItems = this.cart.value.items.map((_item) => {
      if (_item.product_name === item.product_name) {
        _item.quantity--;
        if (_item.quantity === 0) {
          itemForRemoval = _item;
        }
      }

      return _item;
    });

    if (itemForRemoval) {
      filteredItems = this.removeFromCart(itemForRemoval, false);
    }

    this.cart.next({ items: filteredItems });
    this.snackBar.open('1 item removed from cart.', 'Ok', {
      duration: 3000,
    });

    this.cartUpdate()
  }

  clearCart(): void {
    this.cart.next({ items: [] });
    this.snackBar.open('Cart is cleared.', 'Ok', {
      duration: 3000,
    });
    this.cartUpdate()
  }

  getTotal(items: Cartproduct[]): number {
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  cartUpdate() {
    let cartProducts = { customer_id: this.customer_id, products: this.cart.value.items}
    this.http.post("http://localhost:3000/api/cartproducts",cartProducts).subscribe()
  }
getCartHistory(id?: string): void {
  if (id) {
    this.http.get(`http://localhost:3000/api/getCartProduct?customer_id=${id}`).subscribe(
      (data) => {
        if (data && Array.isArray(data)) {
          this.cart.next({ items: data as Cartproduct[] });
        }
      }
    );
  }
}





}


