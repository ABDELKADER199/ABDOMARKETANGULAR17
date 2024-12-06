import { inject, Injectable } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../login.service';

export const AuthGuard: CanMatchFn = (route, segments) =>{
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()){
    return true;
  } else {
    router.navigate(['/login']);

    return false;
  }
};


