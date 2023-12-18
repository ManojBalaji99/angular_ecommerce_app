import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from 'src/modals/product.modal';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(public http : HttpClient, public authService:AuthService) { }

  getProducts(limit: number = 10, sort: string = 'asc', category?: string): Observable<Product[]> {
    const headers = this.authService.headers()
    const apiUrl = `http://localhost:3000/api/products?limit=${limit}&sort=${sort}${category ? `&category=${category}` : ''}`;
    return this.http.get<Product[]>(apiUrl,{headers});
  }
}
