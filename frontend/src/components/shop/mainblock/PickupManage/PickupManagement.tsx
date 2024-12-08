import React, { useEffect, useState } from "react";
import Table from "../../../reuseComponents/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { ToastActive } from "../../../utilities/functions";
import { PickupsDetails } from "../../../utilities/interface";
import { fetchAllPickupsByShopId } from "../../../../services/shopService";
import Modal from "../../../reuseComponents/Modal";
import OrderDetails from "./OrderDetails";



const PickupManagement: React.FC = () => {
  const [pickups, setPickups] = useState<PickupsDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<PickupsDetails | null>(null);

  const fetchPickupsByShopId = async (page: number) => {
    try {
      const { data } = await fetchAllPickupsByShopId(page);
      if (!data || !data.PuckupsData)
        throw new Error("pickup details not found");
      setPickups(data.PuckupsData);
      setTotalPages(data.totalPages);
    } catch (error) {
      const errorMessage = (error as Error).message;
      ToastActive("error", errorMessage);
    }
  };

  const tableHeaders = [
    { label: "Customer", key: "userId.username" },
    { label: "Vehicle", key: "userId.username" },
    { label: "Date", key: "shedule" },
    { label: "Amount", key: "amount" },
    { label: "Payment Status", key: "paymentStatus" },
    { label: "Pickup Status", key: "status" },
  ];


  const handleRowClick = (rowData: PickupsDetails) => {
    setSelectedOrder(rowData);
  };

  const handlesetPickupData = (updatedPickpDetails: PickupsDetails) => {
    setPickups?.((prev) =>
      prev.map((pickup) =>
        pickup._id === updatedPickpDetails._id ? updatedPickpDetails : pickup
      )
    );
    setSelectedOrder(updatedPickpDetails);
  };

  useEffect(() => {
    fetchPickupsByShopId(currentPage);
  }, [currentPage]);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Pickup Management
      </h2>

      <Table headers={tableHeaders} data={pickups} onRowClick={handleRowClick}/>

      <div className="flex justify-center items-center mt-4">
        <button
          disabled={currentPage === 1}
          className="btn-primary disabled:bg-gray-200"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <span className="text-sm mx-2 text-gray-600">
          {" "}
          Page {currentPage} of {totalPages}{" "}
        </span>
        <button
          disabled={currentPage === totalPages}
          className="btn-primary disabled:bg-gray-200"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>

      <Modal
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        title={`Repair Pickup `}
      >
        {selectedOrder && (
          <OrderDetails
          bookingDetails={selectedOrder}
          handlesetPickupData={handlesetPickupData}
          />
        )}
      </Modal>
    </>
  );
};

export default PickupManagement;
