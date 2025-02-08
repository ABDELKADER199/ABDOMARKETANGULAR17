import { Component } from '@angular/core';
import { Product, products } from '../../../module/productData';

@Component({
  selector: 'app-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrl: './inquiry.component.css'
})
export class InquiryComponent {
  foundProduct?:Product;
  productCode:string = '';
  errorMessage: string = '';

  searchProduct(){
    this.foundProduct = products.find((pro)=> pro.code === this.productCode);
    this.productCode = '';
  }
}
