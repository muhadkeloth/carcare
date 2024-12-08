import { faAngleLeft, faAngleRight, faPencil, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { Estimate, HttpStatusCode } from '../../../utilities/interface';
import { createShopEstimate, deleteShopEstimate, editEstimate, fetchAllestimates } from '../../../../services/shopService';
import { ToastActive } from '../../../utilities/functions';
import { nameValidation } from '../../../utilities/validation';
import Table from '../../../reuseComponents/Table';



const EstimateMangement:React.FC = () => {
    const [estimates,setEstimates] = useState<Estimate[]>([])
    const [newEstimate, setNewEstimate] = useState<Estimate>({ work:'',priceStart:null,priceEnd:null });
    const [newEstimateError, setNewEstimateError] = useState<Record<string,string>|null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [actionType, setActionType] = useState("");
    const [showConfirmModal, setShowConfirmModal] =useState(false);
    const [estimateToDelete, setEstimateToDelete] = useState<Estimate | null>(null)
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(1);


    const openEditModel = (estimate:Estimate) => {
        setIsEditMode(true);
        setNewEstimate(estimate);
        setShowAddModal(true);
      }
  
      const openDeleteConfirm = (estimate:Estimate) => {
        setEstimateToDelete(estimate);
        setActionType("delete");
        setShowConfirmModal(true);
      };

      const fetchEstimates = async (page: number) => {
        try {
          const estimateData = await fetchAllestimates(page);
          if (!estimateData || !estimateData.Estimate)
            throw new Error("estimate data not found");
          setEstimates(estimateData.Estimate);
          setTotalPages(estimateData.totalPages);
        } catch (error) {
          const errorMessage = (error as Error).message;
          ToastActive("error", errorMessage);
        }
      }; 

      const addEstimate = async () => {   
        let flag = false;  
        setNewEstimateError(null);  
        setNewEstimate((prev) => ({...prev,work: newEstimate?.work.trim()}));
        if(nameValidation(newEstimate.work)){
          setNewEstimateError((prev)=>({...prev,work:'enter work name'}))
          flag = true;
        }        
        if(!newEstimate?.priceStart || newEstimate?.priceStart <= 0){
          setNewEstimateError((prev)=>({...prev,priceStart:'fix range price'}))
          flag = true;
        }        
        if(!newEstimate?.priceEnd || !newEstimate?.priceStart || newEstimate?.priceEnd <= newEstimate?.priceStart){
          setNewEstimateError((prev)=>({...prev,priceEnd:'fix range price'}))
          flag = true;
        }
        if(flag) return;

        try {
            await createShopEstimate(newEstimate);
            setShowAddModal(false);
            fetchEstimates(currentPage);
            ToastActive('success','vehicle added successfully')
        } catch (error) {
          const errorMessage = (error as Error).message;
          ToastActive('error',errorMessage)
        }
    }

      const confirmDelete = async () => {
        try {
            const response = await deleteShopEstimate(estimateToDelete?.work || '')
          if(response.status == HttpStatusCode.SUCCESS){
            setEstimates((prev)=>
              prev.filter((v)=>(v.work !== estimateToDelete?.work )));
    
            ToastActive('success','vehicle deleted successfully');
          }else{
            ToastActive('error','failed to delete vehicle.');
          }
        } catch (error) {
          const errorMessage = (error as Error).message;
          ToastActive('error',errorMessage)
        }finally{
          setShowConfirmModal(false);
        }
      }
      
      const confirmEdit = async () => {
        let flag = false;  
        setNewEstimateError(null);  
        setNewEstimate((prev) => ({...prev,work: newEstimate?.work.trim()}));
        if(nameValidation(newEstimate.work)){
          setNewEstimateError((prev)=>({...prev,work:'enter work name'}))
          flag = true;
      }
      if(!newEstimate?.priceStart || newEstimate?.priceStart <= 0){
          setNewEstimateError((prev)=>({...prev,priceStart:'fix range price'}))
          flag = true;
      }
      if(!newEstimate?.priceEnd || !newEstimate?.priceStart || newEstimate?.priceEnd <= newEstimate?.priceStart){
        setNewEstimateError((prev)=>({...prev,priceEnd:'fix range price'}))
        flag = true;
      }

      if(flag) setShowConfirmModal(false);
  
        try {
          const response = await editEstimate(newEstimate);
          if(response){
            const { Estimate } = response.data;             
            setEstimates((prev)=>
            prev.map((v)=> v.work == Estimate.work ? {...v, priceStart:Estimate.priceStart, priceEnd:Estimate.priceEnd } : v ));
  
            ToastActive('success','estimate updated successfully');
          }else{
            ToastActive('error','failed to update estimate.');
          }
        } catch (error) {
          const errorMessage = (error as Error).message;
          ToastActive('error',errorMessage)
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
          addEstimate();
        }
      }

      const tableHeaders = [
        { label: 'work', key: 'work' },
        { label: 'Price start', key: 'priceStart' },
        { label: 'Price end', key: 'priceEnd' },
      ];
  
      const renderActions = (estimate: any) => (
        <div className='flex py-1 px-4 gap-4 text-center' >
          <button className='text-white' onClick={() => openEditModel(estimate)}><FontAwesomeIcon icon={faPencil} /></button>
          <button className='text-red-600' onClick={() => openDeleteConfirm(estimate)}><FontAwesomeIcon icon={faTrash} /></button>
        </div>
      );

      useEffect(()=>{
        fetchEstimates(currentPage)
      },[currentPage]);

  return (
    <div className="p-4">
      <div className="flex justify-between mt-1 mb-4 pe-1">
        <h2 className="text-2xl font-bold ms-1 text-gray-800">
          Estimate Management
        </h2>
        <button
          className="btn-primary"
          onClick={() => {
            setShowAddModal(true);
            setIsEditMode(false);
            setNewEstimate({ work: "", priceStart: null, priceEnd: null });
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Estimate
        </button>
      </div>
      <Table
        headers={tableHeaders}
        data={estimates}
        renderActions={renderActions}
      />

      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="btn-primary disabled:bg-gray-200"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <span className="text-sm mx-2 text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="btn-primary disabled:bg-gray-200"
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-scroll ">
          <div className="bg-white m-5 p-6 rounded shadow-md w-full  max-w-md">
            <h3 className="text-lg font-bold  mb-4">
              {isEditMode ? "Edit Vehicle" : "Add New Vehicle"}
            </h3>

            <div className="w-full">
              <label className=" text-sm  font-medium text-gray-700">
                Work Name
              </label>
              <input
                type="text"
                value={newEstimate.work}
                onChange={(e) =>
                  setNewEstimate({ ...newEstimate, work: e.target.value })
                }
                placeholder="Eg: Engine Oil"
                style={
                  newEstimateError?.work
                    ? { outline: "none", boxShadow: "0 0 0 1px red" }
                    : {}
                }
                className="mt-1 flex w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                readOnly={isEditMode}
              />
              <p className="text-red-300">{newEstimateError?.work}</p>
            </div>

            <div className="w-full mt-4">
              <label className=" text-sm font-medium text-gray-700">
                price range start:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={newEstimate.priceStart ?? ""}
                  onChange={(e) =>
                    setNewEstimate({
                      ...newEstimate,
                      priceStart: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 flex w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none "
                  style={
                    newEstimateError?.priceStart
                      ? { outline: "none", boxShadow: "0 0 0 1px red" }
                      : {}
                  }
                />
              </div>
              <p className="text-red-300">{newEstimateError?.priceStart}</p>
              <label className=" text-sm font-medium text-gray-700">
                price range end:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={newEstimate.priceEnd ?? ""}
                  onChange={(e) =>
                    setNewEstimate({
                      ...newEstimate,
                      priceEnd: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 flex w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none "
                  style={
                    newEstimateError?.priceEnd
                      ? { outline: "none", boxShadow: "0 0 0 1px red" }
                      : {}
                  }
                />
              </div>
              <p className="text-red-300">{newEstimateError?.priceEnd}</p>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-secondary mr-2 "
              >
                Cancel
              </button>
              <button onClick={handleSubmit} className="btn-primary">
                {isEditMode ? "Update" : "Add"}
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
                onClick={() => {
                  setShowConfirmModal(false);
                  setNewEstimateError({
                    work: "",
                    priceStart: "",
                    priceEnd: "",
                  });
                }}
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
  );
}

export default EstimateMangement