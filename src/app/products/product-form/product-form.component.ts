import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup | undefined;
  constructor(private builder: FormBuilder,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    private productService: ProductService,
    private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.productForm = this.builder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.productForm?.valid) {
      this.productService.createProduct(this.productForm?.value).subscribe({
        next: (res: any) => {
          this._snackBar.open("Product successfully added", "Okay");
          this.close(res);
        },
        error: (error: any) => {
          console.error(error);
          this._snackBar.open("Error adding product", "Okay");
        }
      });
    }
  }

  get formControls() {
    return this.productForm?.controls;
  }

  close(result?: any): void {
    this.dialogRef.close(result);
  }
}
