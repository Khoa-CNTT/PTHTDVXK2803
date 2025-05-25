// import { useRecentTransactions } from "../hooks/useDashboardData";

// const Transactions = () => {
//   const { data, isLoading, isError } = useRecentTransactions();

//   if (isLoading) return <div>Đang tải giao dịch...</div>;
//   if (isError || !data) return <div>Lỗi tải giao dịch</div>;

//   if (data.length === 0)
//     return <p style={{ textAlign: "center", padding: "2rem" }}>Không có giao dịch nào</p>;

//   return (
//     <div className="transactions">
//       <h3>Giao dịch gần đây</h3>
//       <div className="transactions__list">
//         {data.map((t, i) => (
//           <div key={i} className="transaction-item">
//             <div className="transaction-item__left">
//               <div className="transaction-item__avatar">
//                 {t.full_name.charAt(t.full_name.lastIndexOf(" ") + 1)}
//               </div>
//               <div>
//                 <div className="transaction-item__name">{t.full_name}</div>
//                 <div className="transaction-item__details">
//                   Ghế: {t.seats} • {t.transaction_id}
//                 </div>
//               </div>
//             </div>
//             <div className="transaction-item__right">
//               <div className="transaction-item__amount">
//                 {Number(t.price).toLocaleString("vi-VN")} VND
//               </div>
//               <div className="transaction-item__date">
//                 {new Date(t.create_at).toLocaleDateString("vi-VN")}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Transactions;
