import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // AngularFireAuth for compat mode
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Firebase modular auth

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private afAuth: AngularFireAuth) {}
   
  // Login method using Firebase Authentication
  login(username: string, password: string) {
    // Get Firebase Auth instance using compat mode
    const auth = getAuth();

    return signInWithEmailAndPassword(auth, username, password);
  }
}
