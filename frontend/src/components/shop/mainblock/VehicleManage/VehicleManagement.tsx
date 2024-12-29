import {
  faAngleLeft,
  faAngleRight,
  faPencil,
  faPlus,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { HttpStatusCode, Vehicle } from "../../../utilities/interface";
import {
  addNewVehicle,
  deleteShopVehicle,
  editVehicle,
  fetchAllShopVehicle,
  fetchAllVehicle,
} from "../../../../services/shopService";
import { ToastActive } from "../../../utilities/functions";
import { nameValidation } from "../../../utilities/validation";
import Table from "../../../reuseComponents/Table";
import { AnimatePresence, motion } from 'framer-motion'
import { ZoomInMotionWrapper } from "../../../reuseComponents/ui/MotionWrapper ";

const VehicleManagement: React.FC = () => {
  const [shopvehicles, setShopVehicles] = useState<Vehicle[]>([]);
  const [newVehicle, setNewVehicle] = useState<Vehicle>({
    brand: "",
    vehicleModel: [],
  });
  const [newVehicleError, setNewVehicleError] = useState<Record<
    string,
    string
  > | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [actionType, setActionType] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  const fetchShopVehicle = async (page: number) => {
    try {
      const vehicleDetails = await fetchAllShopVehicle(page);
      if (!vehicleDetails || !vehicleDetails.Vehicle)
        throw new Error("shop vehicle fetching error");
      setShopVehicles(vehicleDetails.Vehicle);
      setTotalPages(vehicleDetails.totalPages);
    } catch (error) {
      const errorMessage = (error as Error).message;
      ToastActive("error", errorMessage);
    }
  };

  const fetchVehicle = async () => {
    try {
      const vehicleDetails = await fetchAllVehicle();
      if (!vehicleDetails || !vehicleDetails.Vehicle)
        throw new Error("vehicle fetching error");

      setVehicles(vehicleDetails.Vehicle);
    } catch (error) {
      console.log("failed to fetch vehicle details:", error);
    }
  };

  const addVehicle = async () => {
    setNewVehicle((prev) => ({ ...prev, brand: newVehicle.brand.trim() }));
    if (nameValidation(newVehicle.brand)) {
      setNewVehicleError((prev) => ({ ...prev, brand: "enter brand name" }));
      return;
    } else {
      setNewVehicleError((prev) => ({ ...prev, brand: "" }));
    }

    if (newVehicle.vehicleModel.length == 0) {
      setNewVehicleError((prev) => ({
        ...prev,
        vehicleModel: "enter model name",
      }));
      return;
    } else {
      setNewVehicleError((prev) => ({ ...prev, vehicleModel: "" }));
    }

    try {
      await addNewVehicle(newVehicle);
      setShowAddModal(false);
      fetchShopVehicle(currentPage);
      ToastActive("success", "vehicle added successfully");
    } catch (error) {
      const errorMessage = (error as Error).message;
      ToastActive("error", errorMessage);
    }
  };

  const handleRemoveModel = (modelToRemove: string) => {
    setNewVehicle((prev) => ({
      ...prev,
      vehicleModel: prev.vehicleModel.filter(
        (model) => model !== modelToRemove
      ),
    }));
  };

  const handleAddVehicle = () => {
    setShowAddModal(true);
    setIsEditMode(false);
    setNewVehicle({ brand: "", vehicleModel: [] });
    const existingBrands = shopvehicles.map((v) => v.brand);
    const availableBrands = vehicles
      .filter((v) => !existingBrands.includes(v.brand))
      .map((v) => v.brand);
    setBrands(availableBrands);
  };

  const openEditModel = (vehicle: Vehicle) => {
    setIsEditMode(true);
    setNewVehicle({ brand: vehicle.brand, vehicleModel: vehicle.vehicleModel });
    const filteredModels =
      vehicles.find((v) => v.brand === vehicle.brand)?.vehicleModel || [];
    setModels(filteredModels);
    setBrands([vehicle.brand]);
    setShowAddModal(true);
  };

  const openDeleteConfirm = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setActionType("delete");
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (!vehicleToDelete?.brand)
        throw new Error("unable to find id to delete vehicle");
      const response = await deleteShopVehicle(vehicleToDelete?.brand);
      if (response.status == HttpStatusCode.SUCCESS) {
        setShopVehicles((prev) =>
          prev.filter((v) => v.brand !== vehicleToDelete.brand)
        );
        ToastActive("success", "vehicle updated successfully");
      } else {
        ToastActive("error", "failed to delete vehicle.");
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      ToastActive("error", errorMessage);
    } finally {
      setShowConfirmModal(false);
    }
  };

  const confirmEdit = async () => {
    setNewVehicle((prev) => ({ ...prev, brand: newVehicle.brand.trim() }));
    if (nameValidation(newVehicle.brand)) {
      setNewVehicleError((prev) => ({ ...prev, brand: "enter brand name" }));
      setShowConfirmModal(false);
      return;
    } else {
      setNewVehicleError((prev) => ({ ...prev, brand: "" }));
    }
    if (newVehicle.vehicleModel.length == 0) {
      setNewVehicleError((prev) => ({
        ...prev,
        vehicleModel: "enter model name",
      }));
      setShowConfirmModal(false);
      return;
    } else {
      setNewVehicleError((prev) => ({ ...prev, vehicleModel: "" }));
    }

    try {
      const response = await editVehicle(newVehicle);
      if (response.status == HttpStatusCode.CREATED) {
        const { vehicle } = response.data;
        setShopVehicles((prev) =>
          prev.map((v) =>
            v.brand === vehicle.brand
              ? { ...v, vehicleModel: vehicle.vehicleModel }
              : v
          )
        );

        ToastActive("success", "vehicle updated successfully");
      } else {
        ToastActive("error", "failed to update vehicle.");
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      ToastActive("error", errorMessage);
    } finally {
      setShowConfirmModal(false);
      setShowAddModal(false);
    }
  };

  const handleSubmit = () => {
    if (isEditMode) {
      setActionType("edit");
      setShowConfirmModal(true);
    } else {
      addVehicle();
    }
  };

  const tableHeaders = [
    { label: "brand", key: "brand" },
    { label: "Model", key: "vehicleModel" },
  ];

  const renderActions = (vehicle: any) => (
    <div className="flex py-1 px-4 gap-4 text-center">
      <button className="text-white" onClick={() => openEditModel(vehicle)}>
        <FontAwesomeIcon icon={faPencil} />
      </button>
      <button
        className="text-red-600"
        onClick={() => openDeleteConfirm(vehicle)}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  useEffect(() => {
    fetchShopVehicle(currentPage);
    fetchVehicle();
  }, [currentPage]);

  return (
    <div className="p-4">
      <div className="flex justify-between mt-1 mb-4 pe-1">
        <h2 className="text-2xl font-bold ms-1 text-gray-800">
          Specialized Vehicles.
        </h2>
        <button className="btn-primary" onClick={() => handleAddVehicle()}>
          <FontAwesomeIcon icon={faPlus} /> Add vehicle
        </button>
      </div>

      <ZoomInMotionWrapper>
        <Table
          headers={tableHeaders}
          data={shopvehicles}
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
      </ZoomInMotionWrapper>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-scroll ">
          <div className="bg-white m-5 p-6 rounded shadow-md w-full  max-w-md">
            <h3 className="text-lg font-bold  mb-4">
              {isEditMode ? "Edit Vehicle" : "Add New Vehicle"}
            </h3>

            <div className="w-full">
              <label className=" text-sm  font-medium text-gray-700">
                Brand Name
              </label>
              <select
                value={newVehicle.brand}
                onChange={(e) => {
                  const selectedBrand = e.target.value;
                  setNewVehicle({
                    ...newVehicle,
                    vehicleModel: [],
                    brand: selectedBrand,
                  });
                  const filteredModels =
                    vehicles.find((v) => v.brand === selectedBrand)
                      ?.vehicleModel || [];
                  setModels(filteredModels);
                }}
                className={`mt-1 flex w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none ${
                  newVehicleError?.brand ? "border-red-500" : ""
                }`}
              >
                <option value="" disabled>
                  Select Brand
                </option>
                {brands.map((brand, index) => (
                  <option key={index} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              <p className="text-red-300">{newVehicleError?.brand}</p>
            </div>

            <div className="w-full mt-4">
              <label className=" text-sm font-medium text-gray-700">
                Model Name
              </label>
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    if (!newVehicle.vehicleModel.includes(e.target.value)) {
                      setNewVehicle((prev) => ({
                        ...prev,
                        vehicleModel: [...prev.vehicleModel, e.target.value],
                      }));
                    }
                  }}
                  value=""
                  className={`mt-1 flex w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none ${
                    newVehicleError?.vehicleModel ? "border-red-500" : ""
                  }`}
                >
                  <option value="" disabled>
                    Select Model
                  </option>
                  {models.map((model, index) => (
                    <option key={index} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    setNewVehicle((prev) => ({ ...prev, vehicleModel: [] }))
                  }
                  className="px-4 py-2 mt-1 btn-secondary"
                >
                  Clear
                </button>
              </div>
              <p className=" text-red-300">{newVehicleError?.vehicleModel}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {newVehicle.vehicleModel.map((model) => (
                  <div
                    key={model}
                    className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
                  >
                    <span>{model}</span>
                    <button
                      onClick={() => handleRemoveModel(model)}
                      className="ml-2 text-gray-400 hover:text-gray-500"
                    >
                      <FontAwesomeIcon icon={faX} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewVehicleError({ brand: "", vehicleModel: "" });
                }}
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
  );
};

export default VehicleManagement;
