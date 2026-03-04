import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-profile.html',
  styleUrls: ['./customer-profile.css']
})
export class CustomerProfileComponent implements OnInit {

  userEmail: string = '';
  userName: string = '';

  activeSection: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {

    const storedEmail = localStorage.getItem('userEmail');
    const storedName = localStorage.getItem('userName');

    if (storedEmail) {
      this.userEmail = storedEmail;
    }

    if (storedName) {
      this.userName = storedName;
    } 
    else if (storedEmail) {
      this.userName = storedEmail.split('@')[0];
    }

  }

  openSection(section: string): void {
    this.activeSection = section;
  }

  editProfile(): void {
    this.activeSection = 'edit';
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  goMenu(): void {
    this.router.navigate(['/menu']).catch(() => {
      alert('Menu page coming soon');
    });
  }

  goAccount(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }

}