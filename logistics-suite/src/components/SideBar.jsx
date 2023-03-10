import React from "react";
import { Link, NavLink } from "react-router-dom";

import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import Logo from "./assets/fll.png";
import { links } from "../utils/links";
import { useThemeContext } from "../contexts/themeContext";
import { useUserContext } from "../contexts/CurrentUser.Context";
const Sidebar = () => {
  const { currentUser } = useUserContext();
  const { activeMenu, setActiveMenu, screenSize, currentColor } =
    useThemeContext();
  const handleCloseSideBar = () => {
    if (activeMenu && screenSize <= 900) setActiveMenu(false);
  };
  const activeLink =
    "flex item-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2";
  const normalLink =
    "flex item-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-md  text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";
  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center ">
            <Link
              to="/"
              onClick={() => setActiveMenu(false)}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              <img
                src={Logo}
                alt="first line logistics logo"
                className="h-12"
              />
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => {
                  setActiveMenu(false);
                }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          {currentUser && currentUser !== "loading" && (
            <div className="mt-10">
              {links.map(
                (item) =>
                  item.authorized.includes(currentUser.adminRight) && (
                    <div key={item.title}>
                      <p className="text-gray-400 m-3 mt-4 uppercase">
                        {item.title}
                      </p>
                      {item.links.map((link) => (
                        <NavLink
                          key={link.name}
                          to={link.link ? link.link : ""}
                          onClick={handleCloseSideBar}
                          style={({ isActive }) => ({
                            backgroundColor: isActive ? currentColor : "",
                          })}
                          className={({ isActive }) =>
                            isActive ? activeLink : normalLink
                          }
                        >
                          {link.icon}
                          <span className="capitalize">{link.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Sidebar;
