import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../_models/product.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Cart } from '../_models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = environment.apiUrl;
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.baseUrl + '/cart').pipe(
      map((cart: Cart) => {
        this.updateCartCount(cart.products.length);
        return cart;
      })
    );
  }

  addToCart(product: Product, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(this.baseUrl + '/cart',
      { product: product, quantity: quantity }).pipe(
        map((cart: Cart) => {
          this.updateCartCount(cart.products.length);
          return cart;
        })
      );
  }

  updateCart(productId: string, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(this.baseUrl + '/cart/' + productId,
      { quantity: quantity }).pipe(map((cart: Cart) => {
        this.updateCartCount(cart.products.length);
        return cart;
      }));
  }

  updateCartCount(newCount: number) {
    this.cartCountSubject.next(newCount);
  }

  deleteFromCart(productId: string): Observable<Cart> {
    return this.http.delete<Cart>(this.baseUrl + '/cart/' + productId).pipe(
      map((cart: Cart) => {
        this.updateCartCount(cart.products.length);
        return cart;
      })
    );
  }

  clearCart(): Observable<Cart> {
    return this.http.delete<Cart>(this.baseUrl + '/cart').pipe(map(
      (cart: Cart) => {
        this.updateCartCount(cart.products.length);
        return cart;
      }));
  }
}
