import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
    customer_id : string| undefined

  constructor(public http : HttpClient, public authService:AuthService) { }

  getorderHistory() {
   
    let headers = this.authService.headers()
    return this.http.get(`http://localhost:3000/api/getorderhistory?customer_id=${this.customer_id}`,{headers})
  }
  
  cancelOrder(order_id: string) {
   
    let headers = this.authService.headers()
    let body = {customer_id:this.customer_id,order_id : order_id}
    return this.http.put("http://localhost:3000/api/orderCancelled",body,{headers})
   
  }

  deliverOrder(order_id:string) {
   
    let headers = this.authService.headers()
     let body = {customer_id:this.customer_id,order_id : order_id}
    return this.http.put("http://localhost:3000/api/orderDelivered",body,{headers})
  }
}
