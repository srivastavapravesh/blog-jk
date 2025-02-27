import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PostService } from '../../core/services/post.service';
import { Post } from '../../shared/models/post.model';
import { AuthService } from '../../core/services/auth.service';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">Welcome to Our Blog</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover interesting articles and share your thoughts with the community.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let post of posts" class="card hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-bold mb-2">{{ post.title }}</h2>
          <p class="text-gray-600 mb-4">
            {{ post.body.length > 150 ? (post.body | slice:0:150) + '...' : post.body }}
          </p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">
              By {{ post.user.name }} on {{ post.createdAt | date }}
            </span>
            <a [routerLink]="['/posts', post.id]" class="text-blue-600 hover:underline" [attr.aria-label]="'Read more about ' + post.title">Read more</a>
          </div>
        </div>
      </div>
      
      <div *ngIf="posts.length === 0" class="text-center py-8">
        <p class="text-gray-600">No posts available yet.</p>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.error = null;

    this.postService.getPosts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (posts: any) => {
          this.posts = posts.posts;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Failed to load posts. Please try again later.';
          console.error('Error loading posts:', error);
        }
      });
  }

  refreshPosts(): void {
    this.loadPosts();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions when component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }
}