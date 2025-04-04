export interface PayOSType {
  amount: number;
  orderCode: string;
  returnUrl: string;
  cancelUrl: string;
}

export type CheckoutRequestType = {
  orderCode: number; // Mã đơn hàng
  amount: number; // Số tiền của đơn hàng
  description: string; // Mô tả đơn hàng, được sử dụng làm nội dung chuyển khoản
  cancelUrl: string; // URL của trang web hoặc ứng dụng sẽ được chuyển hướng tới khi khách hàng hủy thanh toán
  returnUrl: string; // URL của trang web hoặc ứng dụng sẽ được chuyển hướng tới khi khách hàng thanh toán thành công
  signature?: string; // Chữ ký cho dữ liệu của đơn hàng, có chức năng kiểm tra tính toàn vẹn của dữ liệu
  items?: { name: string; quantity: number; price: number }[];
  buyerName?: string; // Tên người mua hàng
  buyerEmail?: string; // Email người mua hàng
  buyerPhone?: string; // Số điện thoại người mua hàng
  buyerAddress?: string; // Địa chỉ người mua hàng
  expiredAt?: number; // Thời gian hết hạn của link thanh toán
};

export type CheckoutResponseDataType = {
  bin: string; // Mã BIN ngân hàng
  accountNumber: string; // Số tài khoản của kênh thanh toán
  accountName: string; // Tên chủ tài khoản của kênh thanh toán
  amount: number; // Số tiền của đơn hàng
  description: string; // Mô tả đơn hàng, được sử dụng làm nội dung chuyển khoản
  orderCode: number; // Mã đơn hàng
  currency: string; // Đơn vị tiền tệ
  paymentLinkId: string; // ID link thanh toán
  status: string; // Trạng thái của link thanh toán
  checkoutUrl: string; // Đường dẫn trang thanh toán
  qrCode: string; // Mã QR thanh toán
};

export type PaymentLinkDataType = {
  id: string; // ID link thanh toán
  orderCode: number; // Mã đơn hàng
  amount: number; // Số tiền của đơn hàng
  amountPaid: number; // Số tiền đã thanh toán
  amountRemaining: number; // Số tiền cần thanh toán còn lại
  status: string; // Trạng thái của link thanh toán
  createdAt: string; // Thời gian tạo link thanh toán
  transactions: TransactionType[]; // Danh sách các giao dịch của link thanh toán
  cancellationReason: string | null; // Lý do hủy link thanh toán nếu liên kết đã bị hủy/
  canceledAt: string | null; // Thời gian hủy link thanh toán
};

type TransactionType = {
  reference: string; // Mã tham chiếu của giao dịch
  amount: number; // Số tiền chuyển khoản của giao dịch
  accountNumber: string; // Số tài khoản nhận tiền (là số tài khoản của kênh thanh toán)
  description: string; // Nội dung chuyển khoản
  transactionDateTime: string; // Ngày giờ giao dịch
  virtualAccountName: string | null; // Tên chủ tài khoản ảo
  virtualAccountNumber: string | null; // Số tài khoản ảo
  counterAccountBankId: string | null; // ID ngân hàng đối ứng
  counterAccountBankName: string | null; // Tên ngân hàng đối ứng
  counterAccountName: string | null; // Tên chủ tài khoản đối ứng
  counterAccountNumber: string | null; // Số tài khoản đối ứng
};
