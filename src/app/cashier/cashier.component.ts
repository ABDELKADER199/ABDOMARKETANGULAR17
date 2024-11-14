import { Router } from '@angular/router';
import { LockerService } from './../locker.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { Product, products } from '../module/productData';
import { jsPDF } from 'jspdf';
import { response } from 'express';
import { log } from 'console';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css'],
})
export class CashierComponent implements OnInit {
  productCode: string = '';
  foundProduct?: Product;
  errorMessage: string = '';
  invoiceItems: Product[] = [];
  invoiceCreated: boolean = false;
  inputQuantity: number = 0;
  showTable = false;
  selectedProduct?: Product;
  lockerId: any;

  constructor(
    private lockerService: LockerService,
    private router: Router,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    const storedItems = sessionStorage.getItem('invoiceItem');
    if (storedItems) {
      this.invoiceItems = JSON.parse(storedItems);
    }
  }

  openNewLocker(): void {
    const newLockerData = {
      employees_id: 1,
      status: 'open',
    };
    this.lockerService.openNewLocker(newLockerData).subscribe(
      (response) => {
        console.log('Locker opened successfully:', response);
      },
      (error) => {
        console.log('Error opening locker:', error);
      }
    );
  }

  searchProduct() {
    this.foundProduct = products.find((pro) => pro.code === this.productCode);
    if (!this.foundProduct) {
      this.errorMessage = 'لم يتم العثور علي المنتج';
      return;
    }

    this.errorMessage = '';
    this.inputQuantity = Number(this.foundProduct.quantity);

    const existingItemIndex = this.invoiceItems.findIndex(
      (item) => item.code === this.foundProduct!.code
    );

    if (existingItemIndex !== -1) {
      this.invoiceItems[existingItemIndex].quantity += this.inputQuantity;
    } else {
      const maxId = this.invoiceItems.reduce(
        (max, item) => (item.id > max ? item.id : max),
        0
      );
      const newId = maxId + 1;
      const newProduct = {
        ...this.foundProduct,
        quantity: this.inputQuantity,
        id: newId,
      };
      this.invoiceItems.push(newProduct);
    }

    sessionStorage.setItem('invoiceItem', JSON.stringify(this.invoiceItems));
    console.log('Invoice items:', this.invoiceItems);
    this.clearProductCode();
  }

  selectProduct(product: Product) {
    this.selectedProduct = product;
    this.inputQuantity = product.quantity; // Set input quantity to current quantity
  }

  updateQuantity() {
    if (this.selectedProduct) {
      const existingItemIndex = this.invoiceItems.findIndex(
        (item) => item.code === this.selectedProduct?.code
      );
      if (existingItemIndex !== -1) {
        this.invoiceItems[existingItemIndex].quantity = this.inputQuantity;
        sessionStorage.setItem(
          'invoiceItem',
          JSON.stringify(this.invoiceItems)
        );
        console.log('Updated Invoice items:', this.invoiceItems);
      }
    }
    this.showTable = false; // Optionally hide the table after update
  }

  clearProductCode() {
    this.productCode = '';
  }

  createInvoice() {
    const invoiceData = this.invoiceItems.map((item) => ({
      product_name: item.name,
      product_parcode: item.code,
      product_price: item.price,
      quantity: item.quantity,
      total_item: item.price * item.quantity,
      total: this.calculateTotal(),
    }));

    this.lockerService.addInvoice({ invoices: invoiceData }).subscribe(
      (response) => {
        console.log('Invoice saved successfully:', response);
        this.generatePDF();
        sessionStorage.clear();
        this.router.navigate(['/cashier']);
      },
      (error) => {
        console.log('Error saving invoice:', error);
      }
    );
  }

  generatePDF() {
    const rowHeight = 8;
    const baseHeight = 55;
    const totalHeight = baseHeight + this.invoiceItems.length * rowHeight + 30;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, totalHeight],
    });

    const logoPath = '/assets/PharmacyLogo.jpg';
    const img = new Image();
    img.src = logoPath;

    img.onload = () => {
      doc.addImage(img, 'JPG', 5, 3, 15, 15);
      doc.addFont('/assets/Amiri-Bold.ttf', 'Amiri', 'normal');
      doc.setFont('Amiri');
      doc.setFontSize(12);
      doc.text('عبده ماركت', 45, 8, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`التاريخ: ${new Date().toLocaleDateString()}`, 50, 15, {
        align: 'right',
      });
      doc.setFontSize(12);
      let startx = 7;
      let starty = 25;
      let colwidth = 20;
      doc.text('المنتج', startx + colwidth * 2 + 5, starty);
      doc.text('الكمية', startx + colwidth + 5, starty);
      doc.text('السعر', startx + 5, starty);
      doc.rect(startx, starty - rowHeight / 2, colwidth, rowHeight);
      doc.rect(startx + colwidth, starty - rowHeight / 2, colwidth, rowHeight);
      doc.rect(
        startx + colwidth * 2,
        starty - rowHeight / 2,
        colwidth,
        rowHeight
      );

      let yOffset = starty + rowHeight;

      this.invoiceItems.forEach((product) => {
        doc.setFontSize(10);
        doc.text(product.name, startx + colwidth * 2 + 10, yOffset, {
          align: 'center',
        });
        doc.text(String(product.quantity), startx + colwidth + 10, yOffset, {
          align: 'center',
        });
        doc.text(`$${product.price}`, startx + 10, yOffset, {
          align: 'center',
        });
        doc.rect(startx, yOffset - rowHeight / 2, colwidth, rowHeight);
        doc.rect(
          startx + colwidth,
          yOffset - rowHeight / 2,
          colwidth,
          rowHeight
        );
        doc.rect(
          startx + colwidth * 2,
          yOffset - rowHeight / 2,
          colwidth,
          rowHeight
        );
        yOffset += rowHeight;
      });

      const total = this.calculateTotal();
      const totalText = `الإجمالي: $${total}`;

      doc.setFontSize(14);
      doc.setFont('Amiri');

      const totalX = startx;
      const totalY = yOffset + 12;
      const totalWidth = colwidth * 3;
      const totalHeight = rowHeight;

      doc.setFillColor(0, 128, 0);
      doc.rect(totalX, totalY, totalWidth, totalHeight + 2, 'F');
      doc.setTextColor(0);
      doc.text(totalText, totalX + totalWidth / 2, totalY + totalHeight / 2, {
        align: 'center',
        baseline: 'middle',
      });

      const pdfBlob = doc.output('blob'); // تحويل الـ PDF إلى Blob
      const formData = new FormData();
      formData.append('file', pdfBlob, 'invoice.pdf');

      // رفع الـ PDF إلى الخادم
      this.http.post('http://127.0.0.1:8000/api/locker/upload', formData).subscribe((response: any) => {
        // بعد رفع الملف، احصل على رابط الملف من الرد
        if (response && response.fileUrl) {
          const pdfUrl = response.fileUrl;
          this.sendWhatsAppMessage(pdfUrl);
        } else {
          console.error('رابط الملف غير موجود في الرد');
        }
      }, (error) => {
        console.error('خطأ في رفع ملف PDF:', error);
      });
    };
  }


  sendWhatsAppMessage(pdfUrl: string) {
    this.http.post('http://127.0.0.1:8000/api/locker/send-whatsapp', { file_url: pdfUrl }).subscribe(
      (response: any) => {
        console.log('رسالة WhatsApp أُرسِلت بنجاح:', response);
        this.router.navigate(['/cashier']);
      },
      (error: any) => {
        console.log('خطأ في إرسال رسالة WhatsApp:', error);
      }
    );
  }


  calculateTotal(): number {
    return this.invoiceItems.reduce(
      (total, product) =>
        total + (product.price || 0) * (product.quantity || 0),
      0
    );
  }

  @HostListener('window:keydown.F5', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.preventDefault(); // Prevent the default F5 action (page reload)
    this.updateQuantity(); // Update the quantity of the selected product
    this.showTable = true; // Optionally show the table
  }
}
