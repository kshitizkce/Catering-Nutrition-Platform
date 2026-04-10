import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorService } from '../services/vendor/vendor-service';
import { AuthService } from '../services/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector:'app-vendor-settings',
  standalone:true,
  imports:[CommonModule, FormsModule],
  templateUrl:'./vendor-settings.html',
  styleUrls:['./vendor-settings.css']
})
export class VendorSettingsComponent implements OnInit{

  constructor(
    private vendorService: VendorService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ){}

  userId!: number;
  selectedLogo!: File;
  selectedFile!: File;

  settings:any={
    businessName:'',
    ownerName:'',
    email:'',
    phone:'',
    password:'',
    contactEmail:'',
    contactPhone:'',
    address:'',
    website:'',
    description:'',
    logo:'',

    // ✅ NEW FIELD
    mealCateringStatus: false,

    emailNotifications:true,
    smsAlerts:false,
    weeklyReports:true,
    reviewNotifications:true
  };

  hours:any[]=[
    {name:'Monday',open:'09:00',close:'18:00'},
    {name:'Tuesday',open:'09:00',close:'18:00'},
    {name:'Wednesday',open:'09:00',close:'18:00'},
    {name:'Thursday',open:'09:00',close:'18:00'},
    {name:'Friday',open:'09:00',close:'18:00'},
    {name:'Saturday',open:'10:00',close:'16:00'},
    {name:'Sunday',open:'10:00',close:'16:00'}
  ];

  ngOnInit() {

    const user = this.authService.getUser();

    if (!user || !user.userId) {
      alert("User not logged in");
      return;
    }

    this.userId = user.userId;
    this.cdr.detectChanges();

    this.vendorService.getVendorProfile(this.userId)
      .subscribe({
        next: (data: any) => {

          this.settings.ownerName = data.ownerName;
          this.settings.email = data.email;
          this.settings.phone = data.phone;

          this.settings.businessName = data.businessName;
          this.settings.description = data.businessDescription;
          this.settings.address = data.vendorAddress;
          this.settings.contactEmail = data.contactEmail;
          this.settings.contactPhone = data.contactPhone;

          // ✅ MAP MEAL CATERING STATUS
          this.settings.mealCateringStatus = data.mealCateringStatus === 1;

          this.settings.logo = data.businessLogo 
            ? 'https://a711-192-197-60-11.ngrok-free.app' + data.businessLogo
            : '';

          if (data.businessHours) {
            try {
              this.hours = JSON.parse(data.businessHours);
            } catch (e) {
              console.error("Invalid businessHours JSON", e);
            }
          }

          this.cdr.detectChanges();
        },
        error: (err) => {
          alert(err.error?.message || "Failed to load vendor data");
          this.cdr.detectChanges();
        }
      });
  }

  uploadLogo(event:any){
    this.selectedLogo = event.target.files[0];

    if(!this.selectedLogo) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.settings.logo = reader.result;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(this.selectedLogo);
  }

  uploadFile(event:any){
    this.selectedFile = event.target.files[0];
    this.cdr.detectChanges();
  }

  saveSettings(){

    const formData = new FormData();

    formData.append("UserId", this.userId.toString());
    formData.append("OwnerName", this.settings.ownerName);
    formData.append("Email", this.settings.email);
    formData.append("Phone", this.settings.phone);
    formData.append("Password", this.settings.password || '');

    formData.append("BusinessName", this.settings.businessName);
    formData.append("BusinessDescription", this.settings.description);
    formData.append("VendorAddress", this.settings.address);
    formData.append("ContactEmail", this.settings.contactEmail);
    formData.append("ContactPhone", this.settings.contactPhone);

    // ✅ SEND MEAL CATERING STATUS
    formData.append("MealCateringStatus", this.settings.mealCateringStatus ? "1" : "0");

    formData.append("BusinessHours", JSON.stringify(this.hours));

    if(this.selectedLogo)
      formData.append("logo", this.selectedLogo);

    if(this.selectedFile)
      formData.append("file", this.selectedFile);

    this.vendorService.saveVendorProfile(formData)
    .subscribe({
      next:(res:any)=>{
        alert(res.message);
        this.cdr.detectChanges();
      },
      error:(err)=>{
        alert(err.error?.message || "Save failed");
        this.cdr.detectChanges();
      }
    });

  }

  cancel(){
    window.location.href = "/vendor-dashboard";
  }

  logout(){
    window.location.href = "/";
  }

}