/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import { AiOutlineMenu } from "react-icons/ai";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { getAuth, signOut } from "firebase/auth";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { useThemeContext } from "../contexts/themeContext";
import Input from "./input/input";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import { useTablesContext } from "../contexts/TablesContext";
const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);
const NavBar = () => {
  const { unattendedReqs } = useTablesContext();
  const { currentUser } = useUserContext();
  const Navigate = useNavigate();
  const {
    currentColor,

    activeMenu,

    setActiveMenu,
    screenSize,
    setScreenSize,
  } = useThemeContext();
  const [orderId, setOrderId] = useState("");
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else setActiveMenu(true);
  }, [screenSize]);

  return (
    <div className="flex justify-between p-2 py-5 relative">
      <NavButton
        title="Menu"
        customFunc={() => setActiveMenu(!activeMenu)}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />
      <div className="flex">
        <div className="w-[35%] md:w-[200px] md:mr-10 relative min-h-full">
          <Input
            type="text"
            value={orderId}
            handleChange={(e) => setOrderId(e.target.value)}
            placeholder="Search Waybill"
          />
          <button
            onClick={() =>
              orderId?.length > 10
                ? Navigate(`/orders/${orderId}`)
                : alert("enter a valid waybill number")
            }
            className="bg-blue-800  text-xl font-bold text-white absolute top-0 right-0 rounded-lg min-h-full w-10 flex justify-center items-center"
          >
            <HiSearch />
          </button>
        </div>
        <NavButton
          title="Notifications"
          dotColor={!unattendedReqs ? "#03C9D7" : "#f53e31"}
          customFunc={() => {}}
          color={currentColor}
          icon={<RiNotification3Line />}
        />
        <TooltipComponent
          content="Profile"
          position="BottomCenter"
          onClick={() => Navigate("/profile")}
        >
          <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg">
            <p>
              <span className="text-gray-400 text-14">Hi, </span>{" "}
              <span className="text-gray-400 font-bold ml-1 text-14">
                {currentUser ? currentUser.firstName : " loading"}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </TooltipComponent>
        <TooltipComponent content="Sign Out" position="BottomCenter">
          <div
            onClick={() => {
              const auth = getAuth();
              signOut(auth);
            }}
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
          >
            <p>
              <span className="text-gray-400 text-14">Sign Out </span>
            </p>
          </div>
        </TooltipComponent>
      </div>
    </div>
  );
};

export default NavBar;
