import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'posts/create',
    loadComponent: () => import('./features/posts/create-post/create-post.component').then(m => m.CreatePostComponent),
    canActivate: [authGuard]
  },
  {
    path: 'posts/edit/:id',
    loadComponent: () => import('./features/posts/edit-post/edit-post.component').then(m => m.EditPostComponent),
    canActivate: [authGuard]
  },
  {
    path: 'posts/:id',
    loadComponent: () => import('./features/posts/post-detail/post-detail.component').then(m => m.PostDetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];