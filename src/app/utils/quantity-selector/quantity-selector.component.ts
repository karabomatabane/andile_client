import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from 'src/app/_models/product.model';
import { CartService } from 'src/app/_services/cart.service';

@Component({
  selector: 'app-quantity-selector',
  templateUrl: './quantity-selector.component.html',
  styleUrls: ['./quantity-selector.component.scss']
})
export class QuantitySelectorComponent implements OnInit {
  quantity: number = 1;
  constructor(
    private dialogRef: MatDialogRef<QuantitySelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public product: Product,
    private cartService: CartService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.cartService.addToCart(this.product, this.quantity).subscribe({
      next: (response: any) => {
        this.close();
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  close(result?: any): void {
    this.dialogRef.close(result);
  }
}
