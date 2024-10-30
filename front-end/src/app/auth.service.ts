import { Injectable, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth);
  firebaseFirestore = inject(Firestore);

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(async (userCredential) => {
        // User successfully logged in
        const user = userCredential.user;

        // Create a document reference for the user
        const userRef = doc(this.firebaseFirestore, 'users', user.uid);
        
        // Fetch user info from Firestore
        const userDoc = await getDoc(userRef);
        let username: string | null = null;

        if (userDoc.exists()) {
          username = userDoc.data()?.['username'] || null; // Fetch username
        }

        // Store user info in local storage for session management
        localStorage.setItem("user", JSON.stringify({ email: user.email, uid: user.uid, username }));
      })
      .catch((error) => {
        console.error('Login failed', error);
        throw error;
      });

    return from(promise);
  }
  isAuthenticated():boolean{
    return !!localStorage.getItem('user');
  }
}