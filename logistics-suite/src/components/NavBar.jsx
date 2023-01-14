/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

import { AiOutlineMenu } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { getAuth, signOut } from "firebase/auth";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { useThemeContext } from "../contexts/themeContext";
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
  const { currentUser } = useUserContext();
  const {
    currentColor,

    activeMenu,

    setActiveMenu,
    screenSize,
    setScreenSize,
  } = useThemeContext();
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
    <div className="flex justify-between p-2 md:mx-6relative">
      <NavButton
        title="Menu"
        customFunc={() => setActiveMenu(!activeMenu)}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />
      <div className="flex">
        <NavButton
          title="Chat"
          dotColor="#03C9D7"
          customFunc={() => {}}
          color={currentColor}
          icon={<BsChatLeft />}
        />
        <NavButton
          title="Notifications"
          dotColor={"#03C9D7"}
          customFunc={() => {}}
          color={currentColor}
          icon={<RiNotification3Line />}
        />
        <TooltipComponent
          content="Profile"
          position="BottomCenter"
          onClick={() => {}}
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
              signOut(auth)
                .then(() => {
                  // navigate("/login");
                })
                .catch((error) => {
                  // An error happened.
                });
            }}
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
          >
            <p>
              <span className="text-gray-400 text-14">Sign Out </span>
            </p>
          </div>
        </TooltipComponent>
      </div>
      {/* {isClicked.chat && <Chat />}
      {isClicked.cart && <Cart />}
      {isClicked.notification && <Notification />}
      {isClicked.userProfile && <UserProfile />} */}
    </div>
  );
};

export default NavBar;
