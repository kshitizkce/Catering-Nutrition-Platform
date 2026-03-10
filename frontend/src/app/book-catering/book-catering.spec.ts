import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-catering',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-catering.html',
  styleUrls: ['./book-catering.css']
})
export class BookCateringComponent {

  eventType: string = '';
  guestCount: number = 0;
  eventDate: string = '';
  budget: string = '';

  submitForm(){
    alert("Your catering request has been submitted!");
  }

}