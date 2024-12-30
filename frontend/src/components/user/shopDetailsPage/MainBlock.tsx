import React, { useEffect, useState } from "react";
import ShopHeader from "./ShopHeader";
import ShopOverview from "./ShopOverview";
import ShopServices from "./ShopServices";
import ShopReviews from "./ShopReviews";
import BookingPanel from "./BookingPanel";
import { clearestimateDetails } from "../../../features/estimateSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useNavigate } from "react-router-dom";
import { navigateFindWorkShop } from "../../utilities/navigate/userNavigator";

const MainBlock: React.FC = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const dispatch = useDispatch();
  const shopDetails = useSelector((state:RootState) => state.shop.shopDetails)
  const navigate = useNavigate();

  useEffect(()=> {
    if(!shopDetails){
      navigateFindWorkShop(navigate)
    }
  },[shopDetails]);
  
  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };


  useEffect(() => {
    dispatch(clearestimateDetails());
    scrollToSection('overview')
  }, []);

  return (
      <div className="min-h-screen bg-gray-50">
              <ShopHeader activeSection={activeSection} onSectionChange={scrollToSection} />
              <div className="container max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-12">
                    <ShopOverview />
                    <ShopServices />
                    <ShopReviews />
                  </div>
                  <div className="lg:col-span-1">
                    <BookingPanel />
                  </div>
                </div>
              </div>
      </div>
  );
};

export default MainBlock;