export interface Product {
  quantity: any;
  id: number;
  name: string;
  code: string;
  price: number;
}

export interface Receipt {
  items: any[];
  reseipte_id: number;
  reseipte_date: string;
  product_parcodes: string;
  product_names: string;
  product_quantity: number;
  product_price: number;
  total_invoice_amount: number;
  total_quantity:number;
  locker_total_cash: number;
  locker_total_computer:number;
  locker_deficit:number;
}


export const products: Product[] = [
  {
    name: 'بيض احمر',
    code: '59522',
    price: 6,
    id: 0,
    quantity: 1,
  },
  {
    name: 'بيض ابيض',
    code: '500050',
    price: 6,
    id: 0,
    quantity: 1,
  },
  {
    name: 'جبنه براميلي',
    code: '200200',
    price: 100,
    id: 0,
    quantity: 1,
  },
  {
    name: 'شيبسي',
    code: '101010',
    price: 10,
    id: 0,
    quantity: 1,
  },
  {
    name: 'لبن',
    code: '5555',
    price: 20,
    id: 0,
    quantity: 1,
  },
  {
    name: 'زبادي جهينه',
    code: '0111',
    price: 9,
    id: 0,
    quantity: 1,
  },
  {
    name: 'زبادي دانون',
    code: '0222',
    price: 10,
    id: 0,
    quantity: 1,
  },
  {
    name: 'زبادي يوناني',
    code: '0555',
    price: 10,
    id: 0,
    quantity: 1,
  },
  {
    name: 'لانشون المراعي',
    code: '05001',
    price: 200,
    id: 0,
    quantity: 1,
  },
  {
    name: ' 1  بيبسي لتر',
    code: '2020',
    price: 30,
    id: 0,
    quantity: 1,
  },
];
