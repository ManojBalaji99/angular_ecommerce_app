import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
    customer_id : string| undefined

  constructor(public http : HttpClient) { }

  getorderHistory(){
    return this.http.get(`http://localhost:3000/api/getorderhistory?customer_id=${this.customer_id}`)
  }
  
  cancelOrder(order_id: string) {
    let body = {customer_id:this.customer_id,order_id : order_id}
    return this.http.put("http://localhost:3000/api/orderCancelled",body)
   
  }

  deliverOrder(order_id:string) {
   
     let body = {customer_id:this.customer_id,order_id : order_id}
    return this.http.put("http://localhost:3000/api/orderDelivered",body)
  }
}
