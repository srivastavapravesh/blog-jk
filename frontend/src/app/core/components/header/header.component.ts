import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          <div>
            <a routerLink="/" class="text-xl font-bold text-blue-600">Blog App</a>
          </div>
          <nav>
            <ul class="flex space-x-6">
              <li><a routerLink="/" class="text-gray-600 hover:text-blue-600">Home</a></li>
              <ng-container *ngIf="isAuthenticated">
                <li><a routerLink="/dashboard" class="text-gray-600 hover:text-blue-600">Dashboard</a></li>
                <li><a routerLink="/posts/create" class="text-gray-600 hover:text-blue-600">Create Post</a></li>
                <li><button (click)="logout()" class="text-gray-600 hover:text-blue-600">Logout</button></li>
              </ng-container>
              <ng-container *ngIf="!isAuthenticated">
                <li><a routerLink="/login" class="text-gray-600 hover:text-blue-600">Login</a></li>
              </ng-container>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/';
  }
}