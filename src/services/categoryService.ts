import api from "../config/api";
import type { Category, CategoryFormData } from "../types/category";

export async function getCategories(): Promise<Category[]> {
  const res = await api.get("/categories");
  return res.data;
}

export async function createCategory(
  data: CategoryFormData,
): Promise<Category> {
  const res = await api.post("/categories", data);
  return res.data;
}

export async function updateCategory(
  id: string,
  data: CategoryFormData,
): Promise<Category> {
  const res = await api.put(`/categories/${id}`, data);
  return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}
