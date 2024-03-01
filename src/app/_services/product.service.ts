import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../_models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  //product => POST
  createProduct(product: Product) {
    return this.http.post<Product>(this.baseUrl + '/product', product);
  }

  //remove-products => POST
  removeProduct(productIds: string[]): Observable<Product> {
    return this.http.post<Product>(this.baseUrl + '/remove-products', { ids: productIds });
  }

  //products => POST
  getProducts(productIds?: string[]): Observable<Product[]>{
    return this.http.post<Product[]>(this.baseUrl + '/products', { ids: productIds });
  }

  //product/{id} => GET
  getProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(this.baseUrl + '/product/' + productId);
  }
}
