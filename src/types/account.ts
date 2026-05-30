export interface Account {
  id: string;
  name: string;
  type: "bank" | "cash" | "wallet";
  balance: number;
  createdAt: string;
}

export interface AccountFormData {
  name: string;
  type: "bank" | "cash" | "wallet";
  balance: number;
}
