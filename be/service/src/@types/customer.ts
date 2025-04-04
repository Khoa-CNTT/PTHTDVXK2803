export interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  url_img: string;
  public_img_id: string;
  phone: string;
  address: string;
  create_at: string; // timestamp
  update_at: string; // timestamp
  role: "customer" | "admin" | "user";
}
