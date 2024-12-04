import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) {}

  // Method to get the current user as an observable
  getUser(): Observable<User | null> {
    return authState(this.auth);    
  }

  // Method to log in a user
  login(username: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, username, password);
  }

  // Method to log out the user
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  // Method to check if the user is authenticated
  isAuthenticated(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.getUser().subscribe(user => {
        observer.next(!!user); 
      });
    });
  }

  // Method to get the user's email
  getUserEmail(): Observable<string | null> {
    return new Observable<string | null>((observer) => {
      this.getUser().subscribe(user => {
        observer.next(user ? user.email : null); // Return the email or null
      });
    });
  }
}
