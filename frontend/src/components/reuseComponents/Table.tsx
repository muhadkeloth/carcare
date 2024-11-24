// import React from 'react'


// interface Column<T> {
//     label:string;
//     accessor:keyof T | ((item:T) => React.ReactNode);
//     isImage?:boolean;
//     isAction?:boolean;
//     className?:string;
// }

// interface TableProps<T>{
//     data:T[];
//     columns:Column<T>[];
//     onAction?:(id:string)=>void;
// }

// const Table = <T extends {_id:string}>({data,columns, onAction}:TableProps<T>):JSX.Element => {
//   return (
//     <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
//       <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//         <tr>
//           {columns.map((col, index) => (
//             <th key={index} className={`py-3 px-6 ${col.className || ""}`} scope="col" >{col.label} </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {data && data.length > 0 ? (
//           data.map((item) => (
//             <tr key={item._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:opacity-95 dark:hover:opacity-95" >
//               {columns.map((col, index) => {
//                 const value = typeof col.accessor === "function" ? col.accessor(item) : item[col.accessor];
//                 return (
//                   <td key={index} className={`py-4 px-6 ${ col.isAction ? "hover:cursor-pointer" : "" } ${col.className || ""}`}
//                     onClick={() => col.isAction && onAction ? onAction(item._id) : undefined } >
//                     {col.isImage ? (
                       
//                             <img src={value} alt="" className="w-16 h-16 object-cover rounded" />
                        
//                     ) : (
//                       value
//                     )}
//                   </td>
//                 );
//               })}
//             </tr>
//           ))
//         ) : (
//           <tr>
//             <td colSpan={columns.length} className="text-center py-3">
//              No data available.
//             </td>
//           </tr>
//         )}
//       </tbody>
//     </table>
//   )
// }

// export default Table