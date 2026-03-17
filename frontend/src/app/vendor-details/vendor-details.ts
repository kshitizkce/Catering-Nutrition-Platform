import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuService } from '../services/menu/menu';

@Component({
  selector: 'app-vendor-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-details.html',
  styleUrls: ['./vendor-details.css']
})
export class VendorDetailsComponent implements OnInit {

  menuItems:any[] = [];
  vendorId:number = 0;

  constructor(
    private route:ActivatedRoute,
    private menuService:MenuService
  ){}

  ngOnInit(){

    // get vendor id from URL
    this.vendorId = Number(this.route.snapshot.paramMap.get('name'));

    // call API
    this.menuService.getVendorMenu(this.vendorId).subscribe((data:any)=>{

      console.log("menu items:",data);

      this.menuItems = data;

    });

  }

}