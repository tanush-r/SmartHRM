import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth'; // Import Auth and authState
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators'; // Import necessary operators
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {} // Inject Auth service
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return authState(this.auth).pipe(
      take(1), // Take the first emitted value and complete
      map(authUser => {
        const isLoginRoute = route.routeConfig?.path === 'login'; // Check if the route is 'login'
        if (authUser) {
          // If the user is authenticated and trying to access the login page, redirect to home
          if (isLoginRoute) {
            this.router.navigate(['/home']); // Redirect to home if authenticated
            return false; // Deny access to the login page
          }
          return true; // Allow access to other routes
        } else {
          // If the user is not authenticated
          if (!isLoginRoute) {
            this.router.navigate(['/login']); // Redirect to login if not authenticated
            return false; // Deny access to all other routes
          }
          return true; // Allow access to the login page
        }
      })
    );
  }
}