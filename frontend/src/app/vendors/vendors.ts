import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuService } from '../services/menu/menu';

@Component({
selector: 'app-vendors',
standalone: true,
imports:[CommonModule],
templateUrl:'./vendors.html',
styleUrls:['./vendors.css']
})

export class VendorsComponent implements OnInit {

vendors:any[] = [];

constructor(
private menuService:MenuService,
private router:Router
){}

ngOnInit(){

this.loadVendors();

}

loadVendors(){

this.menuService.getVendors().subscribe({

next:(data)=>{

console.log("Vendors from API:",data);

this.vendors=data;

},

error:(err)=>{

console.error("Vendor API error",err);

}

});

}


openVendor(vendor:any){

this.router.navigate(['/vendor',vendor.vendorId]);

}

}