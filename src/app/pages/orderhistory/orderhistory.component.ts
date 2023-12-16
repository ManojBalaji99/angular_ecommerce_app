import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orderhistory',
  templateUrl: './orderhistory.component.html',
  styleUrls: ['./orderhistory.component.css']
})
export class OrderhistoryComponent implements OnInit {
  customer_id : string | undefined ;
  orderhistory: any[] = []
  count = {placedCount : 0, cancelledCount : 0, deliveredCount : 0}
  constructor(public authService: AuthService,
              public orderService : OrderService) { }
  
ngOnInit(): void {
  this.customer_id = this.authService.customer_id
  this.orderService.getorderHistory().subscribe((data : any) => {
    let transformedData = this.transformOrders(data)
    this.count = this.countOrdersByStatus(transformedData)
    this.orderhistory = transformedData
  })
 
}
  
  
 transformOrders = (inputOrders: any) => {
  const result : any[]= [];

  inputOrders.forEach((order: any) => {
  const {
    order_id,
    status,
    product_name,
    quantity,
    subtotal,
    total_amount,
    placed_time,
    cancelled_time,
    delivered_time,
    full_name,
    address,
    city
  } = order;

 
  const existingOrder = result.find((o) => o.orderid === order_id);

  if (existingOrder) {
   
    existingOrder.products.push({
      product_name: product_name,
      quantity: quantity,
      subtotal: parseFloat(subtotal),
    });

    
    existingOrder.total += parseFloat(subtotal); // Convert subtotal to number

    
    existingOrder.placed_time = placed_time;
    existingOrder.cancelled_time = cancelled_time;
    existingOrder.delivered_time = delivered_time;
  } else {
    
    const newOrder = {
      orderid: order_id,
      status: status,
      products: [
        {
          product_name: product_name,
          quantity: quantity,
          subtotal: parseFloat(subtotal) // Convert subtotal to number
        }
      ],
      total: parseFloat(total_amount), // Convert total_amount to number
      placed_time: placed_time,
      cancelled_time: cancelled_time,
      delivered_time: delivered_time,
      full_name: full_name,
      address: address,
      city : city
    };

    result.push(newOrder);
  }
});

console.log(result);
return result;

 };

//  count_order_status
  
countOrdersByStatus = (orders: any[]) => {
  return orders.reduce(
    (count, order) => {
      count[order.status.toLowerCase() + 'Count']++;
      return count;
    },
    {
      placedCount: 0,
      cancelledCount: 0,
      deliveredCount: 0,
    }
  );
};
  
  // cancel order with the placed order

  cancelOrder(order_id:string) {
    this.orderService.cancelOrder(order_id).subscribe((data) => {
      if (data) {
        this.updateOrderHistory()
      }
    })
    
  }

   deliverOrder(order_id: string) {
     this.orderService.deliverOrder(order_id).subscribe((data) => {
     this.updateOrderHistory()
   })
    
  }

  updateOrderHistory() {
     this.orderService.getorderHistory().subscribe((data : any) => {
    let transformedData = this.transformOrders(data)
    this.count = this.countOrdersByStatus(transformedData)
    this.orderhistory = transformedData
  })
  }

}
