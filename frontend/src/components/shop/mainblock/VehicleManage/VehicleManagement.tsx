import { faAngleLeft, faAngleRight, faPencil, faPlus, faTrash, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { HttpStatusCode, Vehicle } from '../../../utilities/interface';
import { addNewVehicle, deleteNewVehicle, editNewVehicle, fetchAllShopVehicle } from '../../../../services/shopService';



const VehicleManagement:React.FC = () => {
    const [vehicles,setVehicles] = useState<Vehicle[]>([])
    const [newVehicle, setNewVehicle] = useState<Vehicle>({ brand:'',vehicleModel:'', year:[] });
    const [newVehicleError, setNewVehicleError] = useState({ brand:'',vehicleModel:'', year:'' });
    const [selectedYear,setSelectedYear]  = useState<number | ''>('')
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [actionType, setActionType] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [showConfirmModal, setShowConfirmModal] =useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null)
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(1);

    const fetchShopVehicle = async (page:number) => {
        try {
            const vehicleDetails = await fetchAllShopVehicle(page);
            if(!vehicleDetails || !vehicleDetails.shopVehicle ) throw new Error('shop vehicle fetching error')
                setVehicles(vehicleDetails.shopVehicle);
                setTotalPages(vehicleDetails.totalPages);
        } catch (error) {
            console.log('failed to fetch user:',error);
            // const err = error as AxiosError<ErrorResponse>;
        // const errorMessage = err?.response?.data?.message || 'Login failed. Please try again.';
        const errorMessage = error instanceof Error?error.message:'error on fetching shop vehicle';
        //   toast.error(errorMessage, {
          toast.error(errorMessage, {
            position: "bottom-right", autoClose: 3000,
            hideProgressBar: false, closeOnClick: true,
            pauseOnHover: true, draggable: true,
            progress: undefined, theme: "dark",
            transition: Bounce,
            })
        }
    };

    const addVehicle = async () => {
        if(newVehicle.brand.trim().length == 0){
            setNewVehicleError((prev)=>({...prev,brand:'enter brand name'}))
            return;
        }else{setNewVehicleError((prev)=>({...prev,brand:''}))} 
        if(newVehicle.vehicleModel.trim().length == 0){
            setNewVehicleError((prev)=>({...prev,vehicleModel:'enter model name'}))
            return;
        }else {setNewVehicleError((prev)=>({...prev,vehicleModel:''}))}
        if(newVehicle.year.length ==0){
            setNewVehicleError((prev)=>({...prev,year:'enter atleast one model year'}))
            return
        }else{setNewVehicleError((prev)=>({...prev,year:''}))}

        try {
            await addNewVehicle(newVehicle);
            setShowAddModal(false);
            fetchShopVehicle(currentPage);
            toast.success('vehicle added successfully', {
                position: "bottom-right", autoClose: 3000,
                hideProgressBar: false, closeOnClick: true,
                pauseOnHover: true, draggable: true,
                progress: undefined, theme: "dark",
                transition: Bounce,
                })
        } catch (error) {
            console.log('eror to add vehicle')
            const errorMessage = error instanceof Error?error.message:'error on adding vehicle';
            toast.error(errorMessage, {
                position: "bottom-right", autoClose: 3000,
                hideProgressBar: false, closeOnClick: true,
                pauseOnHover: true, draggable: true,
                progress: undefined, theme: "dark",
                transition: Bounce,
                })
        }
    }

    const handleAddYear = () => {
        if(selectedYear === ''){
            toast.error('select year', {
                position: "bottom-right", autoClose: 3000,
                hideProgressBar: false, closeOnClick: true,
                pauseOnHover: true, draggable: true,
                progress: undefined, theme: "dark",
                transition: Bounce,
                })
                return 
        };

        if(newVehicle.year.includes(selectedYear)){
            toast.error('already added', {
                position: "bottom-right", autoClose: 3000,
                hideProgressBar: false, closeOnClick: true,
                pauseOnHover: true, draggable: true,
                progress: undefined, theme: "dark",
                transition: Bounce,
                })
            return;
        }
        setNewVehicle((prevVehicle)=> ({...prevVehicle,year:[...prevVehicle.year,selectedYear]}));
        setSelectedYear('');
    }

    const handleRemoveYear = (yearToRemove:number) => {
        setNewVehicle((prev) => ({...prev,year:prev.year.filter((year)=> year!==yearToRemove)}));
    }

    const openEditModel = (vehicle:Vehicle) => {
      setIsEditMode(true);
      setSelectedVehicle(vehicle);
      setNewVehicle({
        brand:vehicle.brand,
        vehicleModel: vehicle.vehicleModel,
        year:vehicle.year
      });
      setShowAddModal(true);
    }

    const openDeleteConfirm = (vehicle:Vehicle) => {
      setVehicleToDelete(vehicle);
      setActionType("delete");
      setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
      try {
        if(!vehicleToDelete?._id) throw new Error('unable to find id to delete vehicle')
          const response = await deleteNewVehicle(vehicleToDelete?._id)
        if(response.status == HttpStatusCode.SUCCESS){
          setVehicles((prev)=>
            prev.filter((v)=>(v._id !== vehicleToDelete._id )));
  
          toast.success('vehicle updated successfully');
        }else{
          toast.error('failed to delete vehicle.');
        }
      } catch (error) {
        console.log('error in deleting vehicle',error)
        toast.error('failed to delete vehicle.')        
      }finally{
        setShowConfirmModal(false);
      }
    }
    
    const confirmEdit = async () => {
      if(newVehicle.brand.trim().length == 0){
        setNewVehicleError((prev)=>({...prev,brand:'enter brand name'}))
        return;
    }else{setNewVehicleError((prev)=>({...prev,brand:''}))} 
    if(newVehicle.vehicleModel.trim().length == 0){
        setNewVehicleError((prev)=>({...prev,vehicleModel:'enter model name'}))
        return;
    }else {setNewVehicleError((prev)=>({...prev,vehicleModel:''}))}
    if(newVehicle.year.length ==0){
        setNewVehicleError((prev)=>({...prev,year:'enter atleast one model year'}))
        return
    }else{setNewVehicleError((prev)=>({...prev,year:''}))}

      try {
        if(!selectedVehicle?._id) throw new Error('unable to find id to edit vehicle')
        const response = await editNewVehicle(selectedVehicle?._id, newVehicle);
        if(response){
          setVehicles((prev)=>
          prev.map((v)=>(v._id === selectedVehicle._id ? response.data.vehicle : v)));

          toast.success('vehicle updated successfully');
        }else{
          toast.error('failed to update vehicle.');
        }
      } catch (error) {
        console.log('error in deleting vehicle',error)
        toast.error('error updating vehicle');
      }finally{
        setShowConfirmModal(false);
        setShowAddModal(false);
      }
    }

    const handleSubmit = () => {
      if(isEditMode){
        setActionType("edit");
        setShowConfirmModal(true);
      }else{
        addVehicle();
      }
    }

    useEffect(()=>{
        fetchShopVehicle(currentPage)
      },[currentPage]);
  return (
    <div className='p-4'>

          <ToastContainer />

    <div className="flex justify-between mt-1 mb-4 pe-1">
        <h2 className="text-2xl font-bold ms-1 text-gray-800">
            Specialized Vehicles.
        </h2>
        <button
          // className="font-medium rounded bg-maincol text-white px-2 hover:bg-maincoldark"
          className="btn-primary"
          onClick={() => 
            {setShowAddModal(true); setIsEditMode(false); setNewVehicle({brand:"",vehicleModel:"",year:[]}) }}
        >
          <FontAwesomeIcon icon={faPlus} /> Add vehicle
        </button>
      </div>

    <div className="relative overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500  dark:text-gray-400 ">
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th className="py-3 px-6" scope='col'>Brand</th>
            <th className="py-3 px-6" scope='col'>Model</th>
            <th className="py-3 px-6" scope='col'>Year</th>
            <th className="py-3 px-6" scope='col'>Action</th>
          </tr>
        </thead>
        <tbody>
          {vehicles && vehicles.length > 0 ? (
            vehicles.map((vehicle)=>(
          <tr key={vehicle._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:opacity-95 dark:hover:opacity-95">
            <th scope='row' className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">{vehicle.brand}</th>
            <td className="py-4 px-6">{vehicle.vehicleModel}</td>
            <td className="py-4 px-6">{vehicle.year.join(' ')}</td>
            <td 
            className='py-3 px-4  text-center'>
                <button className='me-3' onClick={()=>openEditModel(vehicle)}>
                    <FontAwesomeIcon icon={faPencil} />
                </button>
                <button onClick={()=> openDeleteConfirm(vehicle)}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </td>
          </tr>
          ))
         ):(
          <tr>
              <td colSpan={4} className="text-center py-3">
                No vehicle added.
              </td>
            </tr>
          )} 
        </tbody>
      </table>
    </div>

    <div className="flex justify-center items-center mt-4">
      <button
      onClick={()=>setCurrentPage((prev)=> Math.max(prev-1,1))}
      disabled={currentPage ===1}
      // className="px-4 py-2 bg-maincol text-white rounded hover:bg-maincoldark hover:cursor-pointer disabled:bg-gray-200">
      className="btn-primary disabled:bg-gray-200">
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <span className='text-sm mx-2 text-gray-600'>
        Page {currentPage} of { totalPages }
      </span>
      <button
      onClick={()=>setCurrentPage((prev)=> Math.min(prev+1,totalPages))}
      disabled={currentPage === totalPages}
      //  className="px-4 py-2 bg-maincol text-white rounded hover:bg-maincoldark hover:cursor-pointer disabled:bg-gray-200">
       className="btn-primary disabled:bg-gray-200">
        <FontAwesomeIcon icon={faAngleRight} />
       </button>
    </div>

    
    {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-scroll ">
          <div className="bg-white m-5 p-6 rounded shadow-md w-full  max-w-md">
            <h3 className="text-lg font-bold  mb-4">{isEditMode? "Edit Vehicle" :"Add New Vehicle"}</h3>

              <div className="w-full">
              <label className=" text-sm  font-medium text-gray-700">
                Brand Name
              </label>
              <input
                type="text"
                value={newVehicle.brand}
                onChange={(e) =>
                    setNewVehicle({ ...newVehicle, brand: e.target.value })
                }
                placeholder='Eg: Tata'
                style={newVehicleError.brand.length !== 0 ?{outline: 'none', boxShadow: '0 0 0 1px red'}:{}}
                className="mt-1 flex w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              />
              <p className='text-red-300'>{newVehicleError.brand}</p>
              </div>

              <div className='w-full mt-4'>
              <label className=" text-sm font-medium text-gray-700">
                Model Name
              </label>
              <input
                type="text"
                value={newVehicle.vehicleModel}
                onChange={(e) =>
                    setNewVehicle({ ...newVehicle, vehicleModel: e.target.value })
                }
                placeholder='Eg: Punch'
                className="mt-1 flex w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none "
                style={newVehicleError.vehicleModel.length !== 0 ?{outline: 'none', boxShadow: '0 0 0 1px red'}:{}}
                />
                <p className='text-red-300'>{newVehicleError.vehicleModel}</p>
                </div>

             
              <div className='w-full mt-4'>
              <label className="block text-sm font-medium text-gray-700">
                Years
              </label>
              <div className="flex items-center gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value) || '')}
                style={newVehicleError.year.length !== 0 ?{outline: 'none', boxShadow: '0 0 0 1px red'}:{}}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none ">
                <option value="">Select a Year</option>
                {Array.from({length:2024 - 1990 +1},(_,i) => 1990 + i).map((year) => (
                    <option key={year} value={year}>{year}</option>
                ))}
                </select>
                <button 
                onClick={handleAddYear}
                // className="px-4 py-2 mt-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                className="px-4 py-2 mt-1 btn-primary">
                    Add
                </button>
                <button 
                onClick={()=>setNewVehicle((prev)=>({...prev,year:[]}))}
                className="px-4 py-2 mt-1 btn-secondary">
                    Clear
                </button>
                </div>
                <p className='text-red-300'>{newVehicleError.year}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                    {newVehicle.year.map((year) => (
                        <div 
                        key={year}
                        className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full">
                            <span>{year}</span>
                            <button
                            onClick={() => handleRemoveYear(year)} 
                            className="ml-2 text-gray-400 hover:text-gray-500">
                                <FontAwesomeIcon icon={faX} />
                            </button>
                        </div>
                    ))}
                </div>
                
              </div>




            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                // className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-300"
                className="btn-secondary mr-2 "
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                // className="bg-maincol text-white px-4 py-2 rounded hover:bg-maincoldark"
                className="btn-primary"
              >
                {isEditMode? "Update" : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

{showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Are you sure you want to {actionType} this vehicle?
            </h3>
            <div className="flex items-center justify-end">
              <button
                className="btn-secondary mr-2"
                // className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 mr-2"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                // className="bg-maincol text-white px-4 py-2 rounded-md hover:bg-maincoldark"
                className="btn-primary"
                onClick={actionType === "delete" ? confirmDelete : confirmEdit}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}


 </div>
  )
}

export default VehicleManagement