import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../core/services/post.service';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <div *ngIf="loading" class="text-center py-8">
        <p>Loading post...</p>
      </div>
      
      <div *ngIf="!loading" class="card">
        <h1 class="text-2xl font-bold mb-6">Edit Post</h1>
        
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
              {{ submitting ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EditPostComponent implements OnInit {
  postId: string = '';
  postForm: FormGroup;
  loading = true;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id') || '';
    if (this.postId) {
      this.loadPost();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  loadPost(): void {
    this.loading = true;
    this.postService.getPostById(this.postId).subscribe({
      next: (post) => {
        this.postForm.patchValue({
          title: post.title,
          body: post.body
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading post:', error);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      return;
    }

    this.submitting = true;
    
    this.postService.updatePost(this.postId, this.postForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error updating post:', error);
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}