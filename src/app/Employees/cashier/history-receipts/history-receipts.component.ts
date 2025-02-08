import { Component } from '@angular/core';
import { LockerService } from './../../../locker.service';
import { Receipt } from '../../../module/productData';

@Component({
  selector: 'app-history-receipts',
  templateUrl: './history-receipts.component.html',
  styleUrls: ['./history-receipts.component.css'],
})
export class HistoryReceiptsComponent {
  searchTerm: string = '';
  historyReceipts: Receipt[] = [];

  constructor(private lockerService: LockerService) {}

  ngOnInit(): void {
    this.getHistoryReceipts(); // استدعاء الدالة لتحميل الفواتير
  }

  // استدعاء بيانات الفواتير من API
  getHistoryReceipts(): void {
    this.lockerService.getHistoryReseipts().subscribe(
      (data) => {
        this.historyReceipts = data;
        // بعد تحميل البيانات، يمكن تصفية الفواتير بناءً على searchTerm
        this.filteredReceipts();
      },
      (error) => {
        console.error('Error loading receipts:', error);
      }
    );
  }

  filteredReceipts(): void {
    this.historyReceipts = this.historyReceipts.filter(receipt =>
      receipt.reseipte_id.toString().includes(this.searchTerm) ||
      receipt.reseipte_date.includes(this.searchTerm)
    );
  }


  getTotal(receipt: Receipt): number {
    return receipt.items.reduce((sum, item) => {
      // تحقق من أن القيمة هي عدد صالح
      const itemTotal = item.total && !isNaN(item.total) ? item.total : 0;
      return sum + itemTotal;
    }, 0);
  }


  // طباعة الفاتورة
  printReceipt(receipt: Receipt): void {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(
        '<html><head><title>طباعة الفاتورة</title></head><body>'
      );
      printWindow.document.write('<h1>تفاصيل الفاتورة</h1>');
      printWindow.document.write(`<p>رقم الفاتورة: ${receipt.reseipte_id}</p>`);
      printWindow.document.write(`<p>التاريخ: ${receipt.reseipte_date}</p>`);
      printWindow.document.write(`<p>اسم المنتج: ${receipt.product_names}</p>`);
      printWindow.document.write(`<p>الباركود: ${receipt.product_parcodes}</p>`);
      printWindow.document.write(`<p>السعر الإجمالي: ${receipt.total_invoice_amount}</p>`);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error('فشل فتح نافذة الطباعة');
    }
  }

  // عرض تفاصيل الفاتورة في الـ Console
  viewDetails(receipt: Receipt) {
    console.log('تفاصيل الفاتورة:', receipt);
  }



  // دالة لجلب الأصناف بناءً على رقم الفاتورة
  getItemsForReceipt(receiptId: number): any[] {
    const receipt = this.historyReceipts.find(item => item.reseipte_id === receiptId);
    if (receipt) {
      // تقسيم النصوص المفصولة بفواصل إلى مصفوفات
      const productNames = receipt.product_names.split(', ');
      const productParcodes = receipt.product_parcodes.split(', ');

      // دمج الأسماء والباركودات في مصفوفات مفردة
      return productNames.map((name, index) => ({
        product_name: name,
        product_parcode: productParcodes[index] || ''
      }));
    }
    return [];
  }



}
