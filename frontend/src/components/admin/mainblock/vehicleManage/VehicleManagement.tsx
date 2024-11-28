import { faAngleLeft, faAngleRight, faPencil, faPlus, faTrash, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { HttpStatusCode, Vehicle } from '../../../utilities/interface';
import { addNewVehicle, deleteVehicle, editVehicle, fetchAllVehicle } from '../../../../services/adminService';
import Table from '../../../reuseComponents/Table';
import { ToastActive } from '../../../utilities/functions';
import { nameValidation } from '../../../utilities/validation';



const VehicleManagement:React.FC = () => { 
    const [vehicles,setVehicles] = useState<Vehicle[]>([])
    const [newVehicle, setNewVehicle] = useState<Vehicle>({ brand:'',vehicleModel:[] });
    const [error,setError] = useState<Record<string,string> | null>(null)
    // const [newVehicleError, setNewVehicleError] = useState({ brand:'',vehicleModel:'' });
    const [inputModel,setInputModel]  = useState<string>('')
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [actionType, setActionType] = useState("");
    const [showConfirmModal, setShowConfirmModal] =useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null)
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(1);

    const fetchVehicle = async (page:number) => {
        try {
            const vehicleDetails = await fetchAllVehicle(page);
            // console.log('in fetchvehicle',vehicleDetails);
            if(!vehicleDetails || !vehicleDetails.Vehicle ) throw new Error('vehicle fetching error')
              setVehicles(vehicleDetails.Vehicle);
            setTotalPages(vehicleDetails.totalPages);
        } catch (error) {
          const errorMessage = (error as Error).message;
          ToastActive('error',errorMessage)
            // console.log('failed to fetch user:',error);
        // const errorMessage = error instanceof Error?error.message:'error on fetching vehicle';
          // toast.error(errorMessage, {
          //   position: "bottom-right", autoClose: 3000,
          //   hideProgressBar: false, closeOnClick: true,
          //   pauseOnHover: true, draggable: true,
          //   progress: undefined, theme: "dark",
          //   transition: Bounce,
          //   })
        }
    };

    const addVehicle = async () => {
      let flag = false;
      setError(null);
      // setIsLoading(true);

      setNewVehicle((prev) => ({ ...prev,brand:prev.brand.trim() })); 
      if(nameValidation(newVehicle.brand)){
        setError((prev) => ({...prev,brand:"brand must be at least 4 characters."}));
        flag = true;
      }
      // if(newVehicle.brand.trim().length == 0){
        //   setNewVehicleError((prev)=>({...prev,brand:'enter brand name'}))
        //   return;
        // }else{setNewVehicleError((prev)=>({...prev,brand:''}))} 
        
        if(newVehicle.vehicleModel.length == 0){
          setError((prev) => ({...prev,vehicleModel:"enter model name"}));
          flag = true;
          // setNewVehicleError((prev)=>({...prev,vehicleModel:'enter model name'}))
        }
        // else {setNewVehicleError((prev)=>({...prev,vehicleModel:''}))}

        const iscreated = vehicles.some(vehicle => vehicle.brand == newVehicle.brand);
        if(iscreated){
          setError((prev) => ({...prev,brand:"brand name already created"}));
          flag = true;
        }
        if(flag){
          // setIsLoading(false); 
          return;
        }
        // if(iscreated){
        //     setNewVehicleError((prev)=>({...prev,brand:'brand name already created'}))
        //     return
        // }else{setNewVehicleError((prev)=>({...prev,brand:''}))}

        try {
            await addNewVehicle(newVehicle);
            setShowAddModal(false);
            fetchVehicle(currentPage);
            ToastActive('success','vehicle added successfully')
            // toast.success('vehicle added successfully', {
            //     position: "bottom-right", autoClose: 3000,
            //     hideProgressBar: false, closeOnClick: true,
            //     pauseOnHover: true, draggable: true,
            //     progress: undefined, theme: "dark",
            //     transition: Bounce,
            //     })
        } catch (error) {
          const errorMessage = (error as Error).message;
          ToastActive('error',errorMessage)
            // console.log('eror to add vehicle')
            // const errorMessage = error instanceof Error?error.message:'error on adding vehicle';
            // toast.error(errorMessage, {
            //     position: "bottom-right", autoClose: 3000,
            //     hideProgressBar: false, closeOnClick: true,
            //     pauseOnHover: true, draggable: true,
            //     progress: undefined, theme: "dark",
            //     transition: Bounce,
            //     })
        }
        // finally{
        //   setIsLoading(false); 
        // }
    }

    const handleAddModel = () => {
        if(inputModel.trim() === ''){
          ToastActive('error','Enter model')
            // toast.error('Enter model', {
            //     position: "bottom-right", autoClose: 3000,
            //     hideProgressBar: false, closeOnClick: true,
            //     pauseOnHover: true, draggable: true,
            //     progress: undefined, theme: "dark",
            //     transition: Bounce,
            //     })
                return 
        };

        if(newVehicle.vehicleModel.includes(inputModel)){
          ToastActive('error','already added')
            // toast.error('already added', {
            //     position: "bottom-right", autoClose: 3000,
            //     hideProgressBar: false, closeOnClick: true,
            //     pauseOnHover: true, draggable: true,
            //     progress: undefined, theme: "dark",
            //     transition: Bounce,
            //     })
            return;
        }
        setNewVehicle((prevVehicle)=> ({...prevVehicle,vehicleModel:[...prevVehicle.vehicleModel,inputModel]}));
        setInputModel('');
    }

    const handleRemoveModel = (modelToRemove:string) => {
        setNewVehicle((prev) => ({...prev,vehicleModel:prev.vehicleModel.filter((model)=> model!== modelToRemove)}));
    }

    const openEditModel = (vehicle:Vehicle) => {
      setIsEditMode(true);
      setNewVehicle({
        brand:vehicle.brand,
        vehicleModel: vehicle.vehicleModel,
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
        if(!vehicleToDelete?.brand) throw new Error('unable to find id to delete vehicle');
          const response = await deleteVehicle(vehicleToDelete?.brand)
        if(response.status == HttpStatusCode.SUCCESS){
          setVehicles((prev)=>
            prev.filter((v)=>(v.brand !== vehicleToDelete.brand )));
  
          ToastActive('success','vehicle deleted successfully');
        }else{
          ToastActive('error','failed to delete vehicle.');
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
        ToastActive('error',errorMessage)
        // console.log('error in deleting vehicle',error)
        // toast('error','failed to delete vehicle.')        
      }finally{
        setShowConfirmModal(false);
      }
    }
    
    const confirmEdit = async () => {
      let flag = false;
      setError(null);
      if(newVehicle.brand.trim().length == 0){
        setError((prev)=>({...prev,brand:'enter brand name'}))
        // setNewVehicleError((prev)=>({...prev,brand:'enter brand name'}))
        setShowConfirmModal(false);
        flag = true;
      }
      
      if(newVehicle.vehicleModel.length == 0){
        setError((prev)=>({...prev,vehicleModel:'enter model name'}))
        // setNewVehicleError((prev)=>({...prev,vehicleModel:'enter model name'}))
        setShowConfirmModal(false);
        flag = true;
    };
    if(flag) return;

      try {
        const response = await editVehicle(newVehicle);
        if(response){
          const { vehicle } = response.data; 
          setVehicles((prev)=>
          prev.map((v)=> v.brand == vehicle.brand ? {...v, vehicleModel:vehicle.vehicleModel } : v ));

          ToastActive('success','vehicle updated successfully');
        }else{
          ToastActive('error','failed to update vehicle.');
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
        ToastActive('error',errorMessage)
        // console.log('error in deleting vehicle',error)
        // toast.error('error updating vehicle');
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

    const tableHeaders = [
      { label: 'brand', key: 'brand' },
      { label: 'Model', key: 'vehicleModel' },
    ];

    const renderActions = (vehicle: any) => (
      <div className='flex py-1 px-4 gap-4 text-center' >
        <button onClick={() => openEditModel(vehicle)}>
          <FontAwesomeIcon icon={faPencil} />
        </button>
        <button onClick={() => openDeleteConfirm(vehicle)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    );
    

    useEffect(()=>{
        fetchVehicle(currentPage)
      },[currentPage]);


  return (
    <div className='p-4'>
          <ToastContainer />

    <div className="flex justify-between mt-1 mb-4 pe-1">
        <h2 className="text-2xl font-bold ms-1 text-gray-800">
            Vehicle Management
        </h2>
        <button
          className="btn-primary"
          onClick={() => 
            {setShowAddModal(true); setIsEditMode(false); setNewVehicle({brand:"",vehicleModel:[]}) }}
        >
          <FontAwesomeIcon icon={faPlus} /> Add vehicle
        </button>
      </div>

    {/* <div className="relative overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500  dark:text-gray-400 ">
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th className="py-3 px-6" scope='col'>Brand</th>
            <th className="py-3 px-6" scope='col'>Model</th>
            <th className="py-3 px-6" scope='col'>Action</th>
          </tr>
        </thead>
        <tbody>
          {vehicles && vehicles.length > 0 ? (
            vehicles.map((vehicle)=>(
          <tr key={vehicle._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:opacity-95 dark:hover:opacity-95">
            <th scope='row' className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">{vehicle.brand}</th>
            <td className="py-4 px-6">{vehicle.vehicleModel?.join(', ')}</td>
            <td className='flex py-3 px-4 gap-4 text-center'>
                <button onClick={()=> openEditModel(vehicle)}>
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
    </div> */}
    <Table headers={tableHeaders} data={vehicles} renderActions={renderActions}  />


    <div className="flex justify-center items-center mt-4">
      <button
      onClick={()=>setCurrentPage((prev)=> Math.max(prev-1,1))}
      disabled={currentPage ===1}
      className="btn-primary disabled:bg-gray-200">
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <span className='text-sm mx-2 text-gray-600'>
        Page {currentPage} of { totalPages }
      </span>
      <button
      onClick={()=>setCurrentPage((prev)=> Math.min(prev+1,totalPages))}
      disabled={currentPage === totalPages}
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
                style={error?.brand ?{outline: 'none', boxShadow: '0 0 0 1px red'}:{}}
                className="mt-1 flex w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              />
              <p className='text-red-300'>{error?.brand}</p>
              </div>
             
              <div className='w-full mt-4'>
              <label className="block text-sm font-medium text-gray-700">
                Model Name
              </label>
              <div className="flex items-center gap-2">
                <input
                type="text"
                value={inputModel}
                onChange={(e) =>setInputModel(e.target.value)}
                placeholder='Eg: Punch'
                className="mt-1 flex w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none "
                style={error?.vehicleModel ?{outline: 'none', boxShadow: '0 0 0 1px red'}:{}}
                />
                <p className='text-red-300'>{error?.vehicleModel}</p>

                <button  
                onClick={handleAddModel}
                className="px-4 py-2 mt-1 btn-primary">
                    Add
                </button>
                <button 
                onClick={()=>setNewVehicle((prev)=>({...prev,vehicleModel:[]}))}
                className="px-4 py-2 mt-1 btn-secondary">
                    Clear
                </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {newVehicle.vehicleModel.map((model) => (
                        <div 
                        key={model}
                        className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full">
                            <span>{model}</span>
                            <button
                            onClick={() => handleRemoveModel(model)} 
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
                className="btn-secondary mr-2 "
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
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
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
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