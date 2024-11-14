export interface Product {
  quantity: any;
  id: number;
  name: string;
  code: string;
  price: number;
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
];
