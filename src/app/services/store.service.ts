import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from 'src/modals/product.modal';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(public http : HttpClient) { }

   getProducts(limit: number = 10, sort: string = 'asc', category?: string): Observable<Product[]> {
    const apiUrl = `http://localhost:3000/api/products?limit=${limit}&sort=${sort}${category ? `&category=${category}` : ''}`;
    return this.http.get<Product[]>(apiUrl);
  }
}
