export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
}

export interface CategoryFormData {
  name: string;
  type: "income" | "expense";
  color: string;
}
