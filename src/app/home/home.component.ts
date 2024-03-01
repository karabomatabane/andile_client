import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public userIsAuthenticated = false;
  public userIsAdmin = false;
  private authListenerSubs: Subscription | undefined;
  private roleListenerSubs: Subscription | undefined;
  constructor(private authService: AuthService) { }

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
  }

  ngOnDestroy() {
    this.authListenerSubs?.unsubscribe();
    this.authListenerSubs?.unsubscribe();
  }

}
