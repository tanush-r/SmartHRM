import { Component } from '@angular/core';
import { RouterLink, RouterOutlet,RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet,RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
 // Variable to track whether the sidebar is collapsed
 isCollapsed: boolean = false;

 // Function to toggle sidebar collapse
 toggleSidebar(): void {
   this.isCollapsed = !this.isCollapsed;  // Toggle the state between collapsed and expanded
 }
}

