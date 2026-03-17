import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- MUST import


@Component({
  selector: 'app-role-select',
  standalone: true,           // <-- required for standalone component
  imports: [CommonModule], 
  templateUrl: './role-select.html',
  styleUrls: ['./role-select.css']
})
export class RoleSelectComponent {
  roles: string[] = [];

  constructor(private router: Router, private ngZone: NgZone) {
    const storedRoles = localStorage.getItem("userRoles");
    this.roles = storedRoles ? JSON.parse(storedRoles) : [];
  }

  selectRole(role: string) {
    this.ngZone.run(() => {
      if (role === "Customer") this.router.navigate(['/home']);
      else if (role === "Vendor") this.router.navigate(['/vendor-dashboard']);
      else if (role === "Admin") this.router.navigate(['/admin-profile']);
    });
  }
}