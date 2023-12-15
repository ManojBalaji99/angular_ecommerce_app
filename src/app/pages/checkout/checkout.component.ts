import { Component, OnInit } from '@angular/core';
import { Cart, Cartproduct } from 'src/modals/cart.modals';
import { CartService } from 'src/app/services/cart.service';
import { Subscription } from 'rxjs';
import { PaymentDetails, shippingAddress } from 'src/modals/checkout.modal';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{

  cart: Cart = { items: [] }
  cartSubscription: Subscription | undefined;
  shippingAddress :shippingAddress = {
    customer_id: undefined,
    full_name: '',
    address: '',
    city: ''
  }
  addressB = false;

  selectedPaymentMethod: string | undefined;

  paymentDetails: PaymentDetails = {
    method: '',
    details: {
      card_number: '',
      expiryDate: '',
      cvv: ''
    }
  }
  
  constructor(public cartService: CartService,
    public http: HttpClient,
    public router : Router) { }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart.subscribe((cart: Cart) => {
      this.cart = cart
      console.log(this.cart)
    })

    this.shippingAddress.customer_id = this.cartService.customer_id
    

  }
  confirmShippingAddress() {
    this.addressB = true
    return this.shippingAddress
  }

  changeAddress() {
    this.shippingAddress.address = this.shippingAddress.city = this.shippingAddress.full_name = ""
    this.addressB= false
  }

paymentDetailsOnline(): PaymentDetails | undefined {
  if (this.selectedPaymentMethod == "online") {
    this.paymentDetails.method = this.selectedPaymentMethod
  }
  else if (this.selectedPaymentMethod == "cash") {
    this.paymentDetails.method = this.selectedPaymentMethod
  }

  return this.paymentDetails
}


  async submitOrder() {
    let orders = {products : this.cart.items, shippingAddress: this.confirmShippingAddress(), paymentDetails :this.paymentDetailsOnline()}
    console.log(orders)
     this.http.post("http://localhost:3000/api/orderPlaced", orders).subscribe((data)=>{
      if (data) {
         this.cartService.clearCart()
        this.router.navigate(["/orderhistory"])
      }
    })

   

    


  }
}  