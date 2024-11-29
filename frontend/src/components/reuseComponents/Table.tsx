import React from 'react'



interface TableProps{
    headers:{label:string; key: string}[];
    data:any[];
    renderActions?:(item:any)=> JSX.Element;
}

const Table:React.FC<TableProps> = ({headers, data, renderActions}) => {
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
            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:opacity-95 dark:hover:opacity-95" >
              {headers.map((header) => (
                 <td key={header.key} className="py-3 px-4">
                 {header.key === 'image' ? (
                     <img src={item[header.key]} alt="" className="w-16 h-16 object-cover rounded" />
                    ) : header.key === 'address'  ? (
                        Object.values(item[header.key]).join(' ')
                    ) : header.key === 'vehicleModel' ? (
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
