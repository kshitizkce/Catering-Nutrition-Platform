import { Component, NgZone, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-select.html',
  styleUrls: ['./role-select.css']
})
export class RoleSelectComponent implements OnInit {
  roles: string[] = [];

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const storedRoles = localStorage.getItem("userRoles");
    this.roles = storedRoles ? JSON.parse(storedRoles) : [];
    this.cdr.detectChanges(); // ✅ safe to call here
  }

  selectRole(role: string) {
    this.ngZone.run(() => {
      if (role === "Customer") this.router.navigate(['/home']);
      else if (role === "Vendor") this.router.navigate(['/vendor-dashboard']);
      else if (role === "Admin") this.router.navigate(['/admin-dashboard']);

      this.cdr.detectChanges();
    });
  }
}