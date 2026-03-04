import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-profile.html',
  styleUrls: ['./admin-profile.css']
})
export class AdminProfileComponent {

  activePage: string = 'home';

  setPage(page: string) {
    this.activePage = page;
  }

  saveSettings() {
    alert('Settings Saved Successfully!');
  }

  requestInfo() {
    alert('Request Sent!');
  }

  logout() {
    localStorage.clear();
    window.location.href = '/';
  }
}