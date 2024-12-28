import React, { useState } from "react";
import { faPencilAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationPicker from "../../../../reuseComponents/LocationPicker";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import {fetchUpdateProfileDetails,fetchUploadProfileImage,} from "../../../../../services/shopService";
import { HttpStatusCode, shopProfile } from "../../../../utilities/interface";
import {getAddressFromCoordinates,ToastActive,} from "../../../../utilities/functions";
import {emailValidation,handleInputValue,nameValidation,phoneNumberValidation,} from "../../../../utilities/validation";
import { ThreeDots } from "react-loader-spinner";

const EditProfile: React.FC = () => {
  const shopUserDetails = useSelector(
    (state: RootState) => state.shop.shopDetails
  );
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(
    shopUserDetails?.location?.coordinates
      ? [
          shopUserDetails.location.coordinates[0],
          shopUserDetails.location.coordinates[1],
        ]
      : null
  );
  const [editedShopUser, setEditedShopUser] = useState<shopProfile | null>(
    shopUserDetails || null
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string } | null>(null);
  const [isImageLoading, setImageIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (key: keyof shopProfile, value: any) => {
    setEditedShopUser((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      try {
        setImageIsLoading(true);
        const response = await fetchUploadProfileImage(formData);
        if (response.status !== HttpStatusCode.CREATED)
          throw new Error("failed to upload image.");
        handleInputChange("image", response.data.imagePath);
        ToastActive("success", "Image updated successfully.");
      } catch (error) {
        ToastActive("error", "error uploading image.");
      } finally {
        setImageIsLoading(false);
      }
    }
  };

  const handleSaveChanges = async () => {
    setShowConfirmModal(false);
    let flag = false;
    setErrors(null);
    if (!editedShopUser) {
      ToastActive("error", "error occured");
      return;
    }
    if (!editedShopUser?.shopName || nameValidation(editedShopUser?.shopName)) {
      setErrors((prev) => ({ ...prev, shopName: "Shop Name is required." }));
      flag = true;
    }
    if (
      !editedShopUser?.ownerName ||
      nameValidation(editedShopUser?.ownerName)
    ) {
      setErrors((prev) => ({ ...prev, ownerName: "Owner Name is required." }));
      flag = true;
    }
    if (!editedShopUser?.email || !emailValidation(editedShopUser?.email)) {
      setErrors((prev) => ({ ...prev, email: "Email is required." }));
      flag = true;
    }
    if (
      !editedShopUser?.phoneNumber ||
      phoneNumberValidation(editedShopUser?.phoneNumber)
    ) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: "Phone Number is required.",
      }));
      flag = true;
    }
    if (flag) return;

    const changesMade =
      JSON.stringify(editedShopUser) !== JSON.stringify(shopUserDetails);
    const locationChanged =
      JSON.stringify(selectedLocation) !==
      JSON.stringify(shopUserDetails?.location?.coordinates);
    if (!changesMade && !locationChanged) {
      ToastActive("info", "No changes applied.");
      return;
    }

    if (locationChanged) {
      try {
        setIsLoading(true);
        const address = await getAddressFromCoordinates(
          selectedLocation || [0, 0]
        );
        setEditedShopUser((prev) =>
          prev ? { ...prev, address: address } : null
        );
      } catch (error) {
        const errorMessage = (error as Error).message;
        ToastActive("error", errorMessage);
        setIsLoading(false);
      }
    }

    try {
      setIsLoading(true);
      const response = await fetchUpdateProfileDetails(
        "/shop/updateprofiledetails",
        {
          ...editedShopUser,
          location: { type: "Point", coordinates: selectedLocation },
        }
      );
      if (response.data.success) {
        ToastActive("success", "shop details updated successfully");
      } else {
        ToastActive("error", "failed to update shop details.");
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      ToastActive("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row my-6 sm:mx-4">
      <div className="flex flex-col flex-grow sm:ms-4">
        <div className="flex flex-col items-center  mb-6 ">
          <div className="relative w-48 h-48">
            {editedShopUser?.image ? (
              <img
                src={editedShopUser.image}
                alt="Profile img"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="flex justify-center items-center w-full h-full rounded-full bg-gray-300">
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="text-gray-500 text-9xl"
                />
              </div>
            )}
            <label
              htmlFor="profileImage"
              className="absolute bottom-2  right-2 bg-gray-200 px-3 py-2 rounded-full cursor-pointer hover:bg-gray-300"
            >
              {isImageLoading ? (
                <ThreeDots height="" color="black" wrapperClass="w-10 h-6" />
              ) : (
                <FontAwesomeIcon icon={faPencilAlt} />
              )}
              <input
                type="file"
                id="profileImage"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Shop Name</label>
              <input
                type="text"
                className={`w-full border ${
                  errors?.shopName ? "border-gray-500" : "border-gray-300"
                } rounded-md p-2`}
                placeholder="Enter Shop Name"
                value={editedShopUser?.shopName || ""}
                onChange={(e) => handleInputChange("shopName", e.target.value)}
              />
              {errors?.shopName && (
                <span className="text-red-500 text-sm">{errors?.shopName}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Owner Name</label>
              <input
                type="text"
                className={`w-full border ${
                  errors?.ownerName ? "border-gray-500" : "border-gray-300"
                } rounded-md p-2`}
                placeholder="Enter Owner Name"
                value={editedShopUser?.ownerName || ""}
                onChange={(e) => handleInputChange("ownerName", e.target.value)}
              />
              {errors?.ownerName && (
                <span className="text-red-500 text-sm">
                  {errors?.ownerName}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Email{" "}
                <span className="font-thin text-xs">(unable to change)</span>
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
                placeholder="user@example.com"
                value={editedShopUser?.email || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="text"
                className={`w-full border ${
                  errors?.phoneNumber ? "border-gray-500" : "border-gray-300"
                } rounded-md p-2`}
                placeholder="Enter Phone Number Name"
                value={editedShopUser?.phoneNumber || ""}
                onChange={(e) =>
                  handleInputValue(e, 10) &&
                  handleInputChange("phoneNumber", e.target.value)
                }
              />
              {errors?.phoneNumber && (
                <span className="text-red-500 text-sm">
                  {errors?.phoneNumber}
                </span>
              )}
            </div>
          </div>
          <div className="relative z-0 w-full ">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Location
            </label>

            <MapContainer
              center={[11.87508, 75.373848]}
              zoom={10}
              className="h-72 w-full z-0"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               attribution="&copy; OpenStreetMap contributors"  />
              <LocationPicker
                onLocationChange={setSelectedLocation}
                initialPosition={selectedLocation ? [selectedLocation] : selectedLocation}
              />
            </MapContainer>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="btn-primary"
            >
              {isLoading ? (
                <ThreeDots height="" color="white" wrapperClass="w-10 h-6" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0  bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Are you sure you want to confirm Edit this Profile?
            </h3>
            <div className="flex items-center justify-end">
              <button
                className="btn-secondary mr-2"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveChanges}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
