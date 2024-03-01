import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/app/_models/cart.model';
import { CartService } from 'src/app/_services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: Cart = {} as Cart;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.getCart();
  }

  getCart() {
    this.cartService.getCart().subscribe((cart: Cart) => {
      this.cart = cart;
    });
  }
}
