import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from 'src/modals/product.modal';

@Component({
  selector: 'app-product-container',
  templateUrl: './product-container.component.html',
  styleUrls: ['./product-container.component.css']
})
export class ProductContainerComponent {

  @Input() fullWidthMode = false;
  @Input() product: Product | undefined;
  @Output() addToCart = new EventEmitter();

  



  quantity: number = 1;

  constructor() {}

  onAddToCart(): void {
    
    if (this.product) {
      this.product.quantity = this.quantity
    }
    this.addToCart.emit(this.product);
  
  }

  printProduct() {
   
 }
}
