import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

declare const google: any;
declare const FB: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.initializeGoogleSignIn();
    this.initializeFacebookSDK();
    // this.handleGoogleCredentialResponse({credential: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc2M2Y3YzRjZDI2YTFlYjJiMWIzOWE4OGY0NDM0ZDFmNGQ5YTM2OGIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzMDUyMzI1NDg3MTktamk4YXZvcjJtMnEwYmlyaGRmaW12MDJhY2JsZW5laDUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzMDUyMzI1NDg3MTktamk4YXZvcjJtMnEwYmlyaGRmaW12MDJhY2JsZW5laDUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI2NTg4OTk2ODU0MDU0Nzg5MjkiLCJlbWFpbCI6InNyaXZhc3RhdmFwcmF2ZXNoMjRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTc0MDY2ODI5MCwibmFtZSI6IlByYXZlc2ggU3JpdmFzdGF2YSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJNU5IZ0otSWNNeVBOTTdRY0w3YS1aMlJ5YXRZby01aURGWDRYWUd2STBPR0FhLVQzc1dnPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlByYXZlc2giLCJmYW1pbHlfbmFtZSI6IlNyaXZhc3RhdmEiLCJpYXQiOjE3NDA2Njg1OTAsImV4cCI6MTc0MDY3MjE5MCwianRpIjoiZjk5NjIwN2E0NzhmM2U4MGVkOTdmMWE3MWY4NjQxOGY1NmQ3YjE4ZiJ9.MfzcfeGBVCIkOUrRAFk9yRVBcbOW12fo52IyUA6T9mdCsdvhgcY6uTShmz9Ip7Cib2lfUHPXZZUfKAGtZuGeMHM-gPciSDUwpeQnjOgUc6OGhZjZwhVJrvkMCoBLvVoVExcuU1vOJxY7mEsSkPs-6opnVEyjXlHrcXkUKNinNBGxSSfTCznXCfcrPOJAPszp9L7z6shPn94EfgepBtU2Kv4PmIi-bEMQX0UjRopvMSe0T9J3nxA_xS7bg6KWe-VWAV5xmIsCaAZ-3LRPytT4y7_FxKvjkjT__Hln33s3rX0deKx-sDH91tR-yhDfM1TDxQwdeRjbLoFB2VOOxY0eig"});
  }

  private initializeGoogleSignIn(): void {
    // Initialize Google Sign-In button
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: '305232548719-ji8avor2m2q0birhdfimv02acbleneh5.apps.googleusercontent.com',
        callback: this.handleGoogleCredentialResponse.bind(this),
        auto_select: false
      });

      // Render the Google Sign-In button
      google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { 
          theme: 'filled_blue', 
          size: 'large', 
          width: '100%', 
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        }
      );
    } else {
      console.error('Google Sign-In SDK not loaded properly');
      this.errorMessage = 'Google Sign-In service is currently unavailable';
    }
  }

  private initializeFacebookSDK(): void {
    // Facebook initialization
  }

  signInWithGoogle(): void {
    this.loading = true;
    this.errorMessage = '';
    google.accounts.id.prompt();
  }

  signInWithFacebook(): void {
    this.loading = true;
    this.errorMessage = '';
    
    if (typeof FB !== 'undefined') {
      FB.login((response: any) => {
        if (response.authResponse) {
          this.authService.login(response.authResponse.accessToken,'facebook').subscribe({
            next: () => this.navigateToDashboard(),
            error: (error) => {
              this.loading = false;
              this.errorMessage = 'Facebook login failed. Please try again.';
              console.error('Facebook login error:', error);
            }
          });
        } else {
          this.loading = false;
          this.errorMessage = 'Facebook login was cancelled';
        }
      }, { scope: 'email,public_profile' });
    } else {
      this.loading = false;
      this.errorMessage = 'Facebook SDK not loaded properly';
      console.error('Facebook SDK not loaded');
    }
  }

  handleGoogleCredentialResponse(response: any): void {
    this.loading = true;
    
    if (response && response.credential) {
      this.authService.login(response.credential,'google').subscribe({
        next: () => this.ngZone.run(() => this.navigateToDashboard()),
        error: (error) => {
          this.ngZone.run(() => {
            this.loading = false;
            this.errorMessage = 'Google login failed. Please try again.';
            console.error('Google login error:', error);
          });
        }
      });
    } else {
      this.loading = false;
      this.errorMessage = 'Invalid Google response';
    }
  }

  private navigateToDashboard(): void {
    this.loading = false;
    this.router.navigate(['/dashboard']);
  }
}