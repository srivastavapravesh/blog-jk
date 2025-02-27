import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-gray-800 text-white py-6">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <p>&copy; 2025 Blog Application. All rights reserved.</p>
          </div>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-blue-400">Terms</a>
            <a href="#" class="hover:text-blue-400">Privacy</a>
            <a href="#" class="hover:text-blue-400">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}