import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { Post } from '../../../shared/models/post.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-3xl mx-auto">
      <div *ngIf="loading" class="text-center py-8">
        <p>Loading post...</p>
      </div>
      
      <div *ngIf="!loading && post" class="space-y-6">
        <div class="card">
          <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
          
          <div class="flex items-center text-gray-600 mb-6">
            <span>By {{ post.user.name }}</span>
            <span class="mx-2">•</span>
            <span>{{ post.createdAt | date:'medium' }}</span>
            <span *ngIf="post.createdAt !== post.updatedAt" class="ml-2 text-sm">
              (Updated: {{ post.updatedAt | date:'medium' }})
            </span>
          </div>
          
          <div class="prose max-w-none">
            <p>{{ post.body }}</p>
          </div>
        </div>
        
        <div *ngIf="isAuthor" class="flex justify-end space-x-4">
          <a [routerLink]="['/posts/edit', post.id]" class="btn btn-secondary">Edit Post</a>
          <button (click)="deletePost()" class="btn btn-danger">Delete Post</button>
        </div>
        
        <div class="mt-8">
          <a routerLink="/" class="text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
      
      <div *ngIf="!loading && !post" class="text-center py-8 card">
        <p class="text-gray-600 mb-4">The post you're looking for doesn't exist or has been removed.</p>
        <a routerLink="/" class="btn btn-primary">Back to Home</a>
      </div>
    </div>
  `
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  loading = true;
  isAuthor = false;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadPost(postId);
    } else {
      this.loading = false;
    }
  }

  loadPost(id: string): void {
    this.loading = true;
    this.postService.getPostById(id).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;
        
        // Check if current user is the author
        this.authService.currentUser$.subscribe(user => {
          if (user && post.user.id === user.id) {
            this.isAuthor = true;
          }
        });
      },
      error: (error) => {
        console.error('Error loading post:', error);
        this.loading = false;
      }
    });
  }

  deletePost(): void {
    if (!this.post || !this.isAuthor) return;
    
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(this.post.id).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error deleting post:', error);
        }
      });
    }
  }
}