import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
selector: 'app-admin-menu',
standalone: true,
imports:[CommonModule,FormsModule],
templateUrl:'./admin-menu.html',
styleUrls:['./admin-menu.css']
})
export class AdminMenuComponent implements OnInit{

menuItems:any[] = [];

name:string='';
category:string='';
price:number=0;
description:string='';
image:string='';

ngOnInit(){

const storedMenu = localStorage.getItem('menuItems');

if(storedMenu){
this.menuItems = JSON.parse(storedMenu);
}

}

addMenu(){

const newItem = {
name:this.name,
category:this.category,
price:this.price,
description:this.description,
image:this.image
};

this.menuItems.push(newItem);

localStorage.setItem('menuItems', JSON.stringify(this.menuItems));

this.name='';
this.category='';
this.price=0;
this.description='';
this.image='';

alert("Menu item added");

}

deleteItem(index:number){

this.menuItems.splice(index,1);

localStorage.setItem('menuItems', JSON.stringify(this.menuItems));

}

}