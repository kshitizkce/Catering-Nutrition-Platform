import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
selector:'app-vendor-settings',
standalone:true,
imports:[CommonModule, FormsModule],
templateUrl:'./vendor-settings.html',
styleUrls:['./vendor-settings.css']
})

export class VendorSettingsComponent{

settings:any={
businessName:'',
ownerName:'',
email:'',
phone:'',
contactEmail:'',
contactPhone:'',
address:'',
website:'',
description:'',
logo:'',
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

constructor(){

const savedProfile=localStorage.getItem('vendorProfile');

if(savedProfile){

const data=JSON.parse(savedProfile);

this.settings=data.settings || this.settings;
this.hours=data.hours || this.hours;

}

}

uploadLogo(event:any){

const file=event.target.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=()=>{

this.settings.logo=reader.result;

};

reader.readAsDataURL(file);

}

saveSettings(){

const data={
settings:this.settings,
hours:this.hours
};

localStorage.setItem(
'vendorProfile',
JSON.stringify(data)
);

alert('Vendor settings saved successfully');

}

}