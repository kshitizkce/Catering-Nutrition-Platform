import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor/vendor-service';
import { CateringService } from '../services/customerbookcatering/Catering.service';
import { AuthService } from '../services/auth/auth';
import { NavbarComponent } from '../shared/navbar/navbar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';



@Component({
  selector: 'app-book-catering',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    NavbarComponent
  ],
  templateUrl: './book-catering.html',
  styleUrls: ['./book-catering.css']
})
export class BookCateringComponent implements OnInit {

  constructor(
    public router: Router,
    private service: CateringService,
    private vendorservice: VendorService,
    private userService: AuthService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) {}

  // ================= STATE =================
  selectedEventType: string = '';
  guests: number = 0;
  date: string = '';
  startTime: string = '';
  endTime: string = '';
  location: string = '';
  budget: string = '';
  notes: string = '';

  selectedVendorId: number = 0;
  vendorId: number = 0;

  selectedFile: File | null = null;

  selectedDietary: string[] = [];

  dietaryOptions: string[] = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Halal',
    'Kosher'
  ];

  eventTypes: string[] = [
    'Wedding',
    'Birthday',
    'Corporate',
    'Party',
    'Other'
  ];

  events: any[] = [];
  vendors: any[] = [];
  isEditMode: boolean = false;
editingEventId: number = 0;
userEmail: string = '';


  // ================= INIT =================
  ngOnInit() {
    this.initializeUser();
    this.loadEvents();
      this.loadUserEvents(); // ✅ ADD THIS

  }

  getSafeUrl(url: string): SafeUrl {
  return this.sanitizer.bypassSecurityTrustUrl(url);
}

  editEvent(e: any) {
  this.isEditMode = true;
  this.editingEventId = e.eventId;

  // Fill form
  this.selectedEventType = e.eventType;
  this.guests = e.numberOfGuests;
  this.date = e.eventDate?.split('T')[0];
  this.startTime = e.eventStartTime || '';
  this.endTime = e.eventEndTime || '';
  this.location = e.eventLocation;
  this.budget = e.budgetRange;
  this.notes = e.additionalNote || '';

  this.selectedVendorId = e.vendorId || 0;

  // ✅ Scroll to FORM (not top)
  setTimeout(() => {
    document.getElementById('formSection')?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

  // ================= EVENT SELECT =================
  selectEvent(type: string) {
    this.selectedEventType = type;
  }

  // ================= DIETARY TOGGLE =================
  toggleDiet(diet: string) {
    if (this.selectedDietary.includes(diet)) {
      this.selectedDietary = this.selectedDietary.filter(d => d !== diet);
    } else {
      this.selectedDietary.push(diet);
    }
  }

  // ================= GET LOGGED-IN USER =================
  initializeUser() {
    const user = this.userService.getUser();

    if (!user) {
      console.error("User not logged in");
      return;
    }

    const userId = user.userId;

    if (!userId) {
      console.error("User ID not found");
      return;
    }

    if (user) {
    this.userEmail = user.email;
  }
  }

  // ================= LOAD VENDORS =================
  loadEvents() {
    this.vendorservice.getMealCateringVendors().subscribe({
      next: (res: any[]) => {

        console.log('Loaded vendors:', res);

        this.vendors = [...(res || [])];

        if (this.vendors.length > 0) {
          this.selectedVendorId = this.vendors[0].vendorId;
        }

        this.cd.detectChanges();
      },
      error: err => {
        console.error('Error loading vendors:', err);
      }
    });
  }

 loadUserEvents() {
  const user = this.userService.getUser();

  if (!user || !user.userId) {
    console.error("User not found");
    return;
  }

  this.service.getUserEvents(user.userId).subscribe({
    next: (res: any) => {
      this.events = res.data || [];   // ✅ FIX HERE
      this.cd.detectChanges();
    },
    error: err => {
      console.error("Error loading user events:", err);
    }
  });
}

  // ================= FILE =================
  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  // ================= SUBMIT =================
  submitRequest() {

  const user = this.userService.getUser();

  if (!user || !user.userId) {
    alert("User not logged in");
    return;
  }

  const formData = new FormData();

  formData.append('EventType', this.selectedEventType);
  formData.append('NumberOfGuests', this.guests.toString());
  formData.append('EventDate', this.date);
  formData.append('EventStartTime', this.startTime);
  formData.append('EventEndTime', this.endTime);
  formData.append('EventLocation', this.location);
  formData.append('BudgetRange', this.budget);
  formData.append('AdditionalNote', this.notes);
  formData.append('UserId', user.userId.toString());
  formData.append('VendorId', this.selectedVendorId.toString());

  formData.append('DietaryPreferences', JSON.stringify(this.selectedDietary));

  if (this.selectedFile) {
    formData.append('CateringDetailFile', this.selectedFile);
  }

  // ✅ EDIT MODE
  if (this.isEditMode) {
  this.service.updateEvent(this.editingEventId, formData).subscribe({
    next: () => {
      alert('Event updated successfully');

      this.resetForm();

      setTimeout(() => {
        this.loadUserEvents(); // ✅ FIXED
      }, 300);
    },
    error: err => console.error(err)
  });
}
  // ✅ CREATE MODE
  else {
  this.service.createEvent(formData).subscribe({
    next: () => {
      alert('Event created successfully');
      this.resetForm();

      setTimeout(() => {this.loadUserEvents();}, 300); // 🔥 IMPORTANT (200–500ms works best)

      this.cd.detectChanges();
    },
    error: err => console.error(err)
  });
}
}

  goHome() {
    this.router.navigate(['/home']);
  }

  // 🔥 MAIN FIX (NO MENU PAGE ANYMORE)
  goToMenu() {
    this.router.navigate(['/vendors']);
  }

  goToAccount() {
    this.router.navigate(['/profile']);
  }


  // ================= RESET =================
  resetForm() {
  this.selectedEventType = '';
  this.guests = 0;
  this.date = '';
  this.startTime = '';
  this.endTime = '';
  this.location = '';
  this.budget = '';
  this.notes = '';
  this.selectedVendorId = 0;
  this.selectedFile = null;
  this.selectedDietary = [];

  // ✅ RESET EDIT MODE
  this.isEditMode = false;
  this.editingEventId = 0;
}
}