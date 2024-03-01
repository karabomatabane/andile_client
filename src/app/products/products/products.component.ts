import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/_models/product.model';
import { CustomerService } from 'src/app/_services/customer.service';
import { ProductService } from 'src/app/_services/product.service';
import { SpinnerService } from 'src/app/_services/spinner.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { QuantitySelectorComponent } from 'src/app/utils/quantity-selector/quantity-selector.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  originalProducts: Product[] = [];
  sort: boolean | undefined;
  hoverState: boolean = false;
  public userIsAuthenticated = false;
  private authListener: Subscription | undefined;
  public userIsAdmin = false;
  private roleListener: Subscription | undefined;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private customerService: CustomerService,
    private router: Router,
    private spinnerService: SpinnerService,
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getRecord(row: Product) {
    this.spinnerService.showSpinnerOverlay();
    this.productService.getProduct(row.id).subscribe({
      next: (product: Product) => {
        // this.productService.setSelectedProduct(product);
        this.router.navigate(['/site', row.name.replace(" ", "-")]);
        this.spinnerService.hideSpinnerOverlay();
      },
      error: (error: any) => {
        this.spinnerService.hideSpinnerOverlay();
        console.error(error);
      }
    });
  }

  buyProduct(event: any, product: Product) {
    let targetAttr = event.target.getBoundingClientRect();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = product;
    dialogConfig.position = {
      top: targetAttr.y + targetAttr.height - 148 + "px",
      left: targetAttr.x + 45 + "px"
    };

    const dialogRef = this.dialog.open(QuantitySelectorComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => this.getProducts());
  }

  addProduct() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(ProductFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => this.getProducts());
  }

  getProducts(isAdmin: boolean = false) {
    this.spinnerService.showSpinnerOverlay();
      this.productService.getProducts().subscribe({
        next: (products: Product[]) => {
          this.products = products;
          this.originalProducts = products;
          console.log("products: ", products);
          setTimeout(() => {
            this.spinnerService.hideSpinnerOverlay();
          }, 100);
        },
        error: (error: any) => {
          console.error(error);
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    let filteredProducts: Product[] = [];
    for (let product of this.originalProducts) {
      if (product.name.toLowerCase().includes(filterValue) || product.description.toLowerCase().includes(filterValue)) {
        filteredProducts.push(product);
      }
    }
    this.products = filteredProducts;
  }

  sortAscending() {
    this.products.sort((a, b) => a.name.localeCompare(b.name));
  }

  sortDescending() {
    this.products.sort((a, b) => b.name.localeCompare(a.name));
  }

  applySort() {
    this.sort = !this.sort;
    if (this.sort) {
      this.sortAscending();
    } else {
      this.sortDescending();
    }
  }

  clearFilters() {
    this.products = this.originalProducts;
    let txtSearch = document.getElementById("txtSearch") as HTMLInputElement;
    if (txtSearch != null) {
      txtSearch.value = "";
    }
    this.sort = undefined;
  }

  truncateDesc(description: string, maxLength: number): string {
    const words = description.split(' ');
    if (words.length > maxLength) {
      return words.slice(0, maxLength).join(' ') + '...';
    } else {
      return description;
    }
  }

}
