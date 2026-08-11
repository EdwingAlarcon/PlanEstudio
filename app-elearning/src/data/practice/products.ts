export interface PracticeProduct {
  productid: string;
  name: string;
  category: "Tecnologia" | "Servicios" | "Operaciones";
  stock: number;
}

export const PRACTICE_PRODUCTS: PracticeProduct[] = [
  { productid: "prd-001", name: "Laptop de campo", category: "Tecnologia", stock: 12 },
  { productid: "prd-002", name: "Mesa de servicio", category: "Servicios", stock: 4 },
  { productid: "prd-003", name: "Tablet de inspeccion", category: "Tecnologia", stock: 7 },
  { productid: "prd-004", name: "Kit operativo", category: "Operaciones", stock: 20 },
];
