interface Driver {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  password?: string;
  url_img: string;
  public_img_id: string;
  phone: string;
  address: string;
  role: "customer" | "admin" | "driver";
  create_at: string; // timestamp
  update_at: string;
}
