import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../../core/services/post.service';
import { AuthService } from '../../core/services/auth.service';
import { Post } from '../../shared/models/post.model';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold">Your Dashboard</h1>
        <a routerLink="/posts/create" class="btn btn-primary">Create New Post</a>
      </div>
      
      <div *ngIf="currentUser" class="card mb-6">
        <h2 class="text-xl font-semibold mb-2">Welcome, {{ currentUser.name }}!</h2>
        <p class="text-gray-600">Manage your posts and create new content.</p>
      </div>
      
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold">Your Posts</h2>
        
        <div *ngIf="loading" class="text-center py-4">
          <p>Loading your posts...</p>
        </div>
        
        <div *ngIf="!loading && posts.length === 0" class="text-center py-8 card">
          <p class="text-gray-600 mb-4">You haven't created any posts yet.</p>
          <a routerLink="/posts/create" class="btn btn-primary">Create Your First Post</a>
        </div>
        
        <div *ngFor="let post of posts" class="card hover:shadow-lg transition-shadow">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold">{{ post.title }}</h3>
            <div class="flex space-x-2">
              <a [routerLink]="['/posts/edit', post.id]" class="text-blue-600 hover:text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </a>
              <button (click)="deletePost(post.id)" class="text-red-600 hover:text-red-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <p class="text-gray-600 my-4">
            {{ post.body.length > 150 ? (post.body | slice:0:150) + '...' : post.body }}
          </p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">
              Created on {{ post.createdAt | date }}
            </span>
            <a [routerLink]="['/posts', post.id]" class="text-blue-600 hover:underline">View Post</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  posts: Post[] = [];
  currentUser: User | null = null;
  loading = true;

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.loadUserPosts();
  }

  loadUserPosts(): void {
    this.loading = true;
    this.postService.getUserPosts().subscribe({
      next: (posts: any) => {
        this.posts = posts.posts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user posts:', error);
        this.loading = false;
      }
    });
  }

  deletePost(id: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(id).subscribe({
        next: () => {
          this.posts = this.posts.filter(post => post.id !== id);
        },
        error: (error) => {
          console.error('Error deleting post:', error);
        }
      });
    }
  }
}