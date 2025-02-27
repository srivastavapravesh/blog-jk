import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../core/services/post.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="card">
        <h1 class="text-2xl font-bold mb-6">Create New Post</h1>
        
        <form [formGroup]="postForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              id="title"
              formControlName="title"
              class="form-input"
              placeholder="Enter post title"
            >
            <div *ngIf="postForm.get('title')?.invalid && postForm.get('title')?.touched" class="text-red-600 text-sm mt-1">
              Title is required
            </div>
          </div>
          
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              id="content"
              formControlName="body"
              rows="8"
              class="form-input"
              placeholder="Write your post content here..."
            ></textarea>
            <div *ngIf="postForm.get('body')?.invalid && postForm.get('body')?.touched" class="text-red-600 text-sm mt-1">
              Content is required and must be at least 10 characters
            </div>
          </div>
          
          <div class="flex justify-end space-x-4">
            <button 
              type="button" 
              (click)="cancel()" 
              class="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="postForm.invalid || submitting" 
              class="btn btn-primary"
              [ngClass]="{'opacity-50 cursor-not-allowed': postForm.invalid || submitting}"
            >
              {{ submitting ? 'Creating...' : 'Create Post' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreatePostComponent {
  postForm: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      return;
    }

    this.submitting = true;
    
    this.postService.createPost(this.postForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error creating post:', error);
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}