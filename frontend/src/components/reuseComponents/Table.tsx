import React from 'react'
import {  TableProps } from '../utilities/interface';
import { getPaymentStatusColor } from '../utilities/functions';




const Table:React.FC<TableProps> = ({headers, data, renderActions, onRowClick}) => {
  return (
    <div className="relative overflow-x-auto shadow-md rounded-lg">   
    <table className="w-full text-sm text-left rtl:text-right text-gray-500  dark:text-gray-400 ">
      <thead className="text-sm text-gray-700 uppercase leading-normal bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {headers.map((header) => (
            <th key={header.key} className='py-3 px-6 ' scope="col" >{header.label} </th>
          ))}
           {renderActions && <th className="py-3 px-6 ">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
            data.map((item,index) => (
            <tr key={index} 
            onClick={() => onRowClick && onRowClick(item) }
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:opacity-95 dark:hover:opacity-95" >
              {headers.map((header) => (
                 <td key={header.key} className={`py-3 px-4 ${header?.className ? getPaymentStatusColor(item[header.key]) : "" }`}>
                 {header.key === 'image' ? (
                     <img src={item[header.key]} alt="" className="w-16 h-16 object-cover rounded " />
                    )  : typeof item[header.key] === 'object' ? (
                        Object.values(item[header.key]).join(' ')
                    ) : Array.isArray(item[header.key]) ? (
                        item[header.key].join(', ')
                    ) : (
                        item[header.key]
                    )}
               </td>
              ))}
               {renderActions && <td className="py-3 px-4">{renderActions(item)}</td>}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length + 1} className="text-center py-3">
             No data available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
        </div>
  )
}

export default Table;
