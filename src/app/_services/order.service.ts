import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Order } from '../_models/order.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  //order => POST
  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.baseUrl + '/order', order);
  }

  //orders => POST
  getOrders(orderIds?: string[], customerId?: string): Observable<Order[]> {
    const filters = {
      ids: orderIds,
      customerId: customerId
    };
    return this.http.post<Order[]>(this.baseUrl + '/orders', filters);
  }

  //order/{id} => PUT
  updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(this.baseUrl + '/order/' + order.id, order);
  }
}
