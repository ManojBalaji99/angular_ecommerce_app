import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { StoreService } from 'src/app/services/store.service';
import { Product } from 'src/modals/product.modal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
  
  

export class HomeComponent implements OnInit {

  ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

  cols = 3
  rowHeight : number=  this.ROWS_HEIGHT[this.cols];

  category !: string;
  itemsShowCount: number = 10;
  sortMethod: string = "desc";
  products: Product[] | undefined;
  customer_id: string | undefined;
  

  constructor(public storeService: StoreService,
              public authService : AuthService) { }
  
  getCategory(selectedCategory: string) {
    this.category = selectedCategory
    this.getProducts()
  }
  

  getColsCount(colsCount: number) {
    this.cols = colsCount
    this.getProducts()
  }

  getItemsShowCount(count: number) {
    this.itemsShowCount = count
    this.getProducts()
  }

  getSortMethod(method : string) {
    this.sortMethod = method
    this.getProducts()

  }


  onAddToCart(product: any) {
  
    console.log(product)

}
  
  getProducts() {

    
    if (this.category == "All") {
      this.category = ""
      this.storeService.getProducts(this.itemsShowCount, this.sortMethod, this.category).subscribe((products) => {
      this.products = products
        
      })
    }
    else {
      this.storeService.getProducts(this.itemsShowCount, this.sortMethod, this.category).subscribe((products) => {
        this.products=products
      })
    }
  }
  


  ngOnInit(): void {
    this.customer_id = this.authService.customer_id;
    console.log(this.customer_id)
    this.getProducts()
  }

  
}
