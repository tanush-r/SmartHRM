import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // Import AuthService
import { Subscription } from 'rxjs'; // Import Subscription

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'] // Fixed typo: should be styleUrls
})
export class LayoutComponent implements OnInit, OnDestroy {
  isCollapsed: boolean = false;
  userEmail: string | null = ''; // Declare userEmail property
  private emailSubscription: Subscription | null = null; // Subscription for user email

  constructor(private authService: AuthService, private router: Router) {} // Inject AuthService and Router

  ngOnInit(): void {
    // Subscribe to get user's email
    this.emailSubscription = this.authService.getUserEmail().subscribe(email => {
      this.userEmail = email; // Set userEmail to the retrieved email
    });
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  // Logout function
  logout(): void {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['/login']); // Redirect to login after logout
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.emailSubscription) {
      this.emailSubscription.unsubscribe();
    }
  }
}
