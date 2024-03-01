import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Customer } from '../_models/customer.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  //customer => POST
  createCustomer(customer: Customer) {
    return this.http.post(this.baseUrl + '/customer', customer);
  }

  //customer => GET
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl + '/customer');
  }

  //customer/{id} => GET
  getCustomer(customerId: string): Observable<Customer> {
    return this.http.get<Customer>(this.baseUrl + '/customer/' + customerId);
  }

  //customer/{id} => DELETE
  removeCustomer(customerId: string): Observable<Customer>{
    return this.http.delete<Customer>(this.baseUrl + '/customer/' + customerId);
  }
}
