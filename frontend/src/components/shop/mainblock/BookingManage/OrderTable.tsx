// import React, { useState } from 'react';
// import OrderDetails from './OrderDetails';
// import Modal from '../../../reuseComponents/Modal';
// import { Order, OrderTableProps } from '../../../utilities/interface';



// const OrderTable:React.FC<OrderTableProps> = ({ orders }) => {
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//   const getPaymentStatusColor = (status: Order['paymentStatus']) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       paid: 'bg-green-100 text-green-800',
//       failed: 'bg-red-100 text-red-800',
//       refunded: 'bg-gray-100 text-gray-800'
//     };
//     return colors[status];
//   };

//   return (
//     <>
//       <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
//         <table className="min-w-full divide-y divide-gray-300">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
//               <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Vehicle</th>
//               <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
//               <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
//               <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Payment</th>
//               <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
//               <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 bg-white">
//             {orders.map((order) => (
//               <tr 
//                 key={order.id}
//                 className="hover:bg-gray-50 cursor-pointer"
//                 onClick={() => setSelectedOrder(order)}
//               >
//                 <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
//                   {order.id}
//                 </td>
//                 <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                   {order.vehicleDetails.year} {order.vehicleDetails.make} {order.vehicleDetails.model}
//                 </td>
//                 <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                   {order.userDetails.firstName} {order.userDetails.lastName}
//                 </td>
//                 <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                   {new Date(order.date).toLocaleDateString()}
//                 </td>
//                 <td className="whitespace-nowrap px-3 py-4 text-sm">
//                   <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
//                     {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
//                   </span>
//                 </td>
//                 <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                   ${order.amount.toFixed(2)}
//                 </td>
//                 <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                   -
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Modal
//         isOpen={selectedOrder !== null}
//         onClose={() => setSelectedOrder(null)}
//         title={`Repair Order - ${selectedOrder?.id || ''}`}
//       >
//         {selectedOrder && <OrderDetails order={selectedOrder} />}
//       </Modal>
//     </>
//   );
// }

// export default OrderTable