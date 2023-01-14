import React from "react";
import { Outlet } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import NavBar from "./NavBar";
import Sidebar from "./SideBar";

import ThemeSettings from "./ThemeSettings";

import { useThemeContext } from "../contexts/themeContext";

const Layout = () => {
  const {
    currentColor,
    activeMenu,

    themeSettings,
    setThemeSettings,
  } = useThemeContext();

  return (
    <div className="relative flex dark:bg-main-dark-bg">
      {/* {modalOn && <ModalUnderlay />} */}
      <div className="fixed right-4 bottom-4 " style={{ zIndex: 1000 }}>
        <TooltipComponent content="settings" position="Top">
          <button
            type="button"
            className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
            style={{ background: currentColor, borderRadius: "50%" }}
            onClick={() => setThemeSettings(!themeSettings)}
          >
            <FiSettings />
          </button>
        </TooltipComponent>
      </div>
      {activeMenu ? (
        <div
          className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white  pt-10"
          style={{ zIndex: 1000 }}
        >
          <Sidebar />
        </div>
      ) : (
        <div className="w-0 dark:bg-secondary-dark-bg ">
          <Sidebar />
        </div>
      )}
      <div
        className={`dark:bg-main-dark-bg bg-main-bg min-h-screen  w-full ${
          activeMenu ? "md:ml-72" : "flex-2"
        }`}
      >
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
          <NavBar />
        </div>
        {themeSettings && <ThemeSettings />}
        <div className="m-10 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
