import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './_services/auth.service';
import { CartService } from './_services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'andile store';
  username: string = '';
  cartCount: number = 0;
  public userIsAuthenticated = false;
  public userIsAdmin = false;
  private authListenerSubs: Subscription | undefined;
  private roleListenerSubs: Subscription | undefined;

  constructor(private authService: AuthService, 
    private router: Router, private cartService: CartService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getAuthStatus();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated: boolean) => {
        this.userIsAuthenticated = isAuthenticated;
      });

      this.userIsAdmin = this.authService.getRole();

      this.roleListenerSubs = this.authService.getRoleListener()
      .subscribe((isAdmin: boolean) => {
        this.userIsAdmin = isAdmin;
      });

      if (this.userIsAuthenticated) {
        this.username = this.authService.getUsername();
      }

      this.cartService.cartCount$.subscribe(count => {
        this.cartCount = count;
        console.log('cart count', this.cartCount);
      });

      this.refreshCart();
  }

  refreshCart() {
    this.cartService.getCart().subscribe((data: any) => {
      console.log("cart badge refreshed!");
    });
  }

  onLogOut() {
    this.authService.logOut();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.authListenerSubs?.unsubscribe();
    this.roleListenerSubs?.unsubscribe();
  }
}
