import {
  MdAccountBalance,
  MdAddBusiness,
  MdAltRoute,
  MdSummarize,
} from "react-icons/md";
import {
  FaUserAlt,
  FaUserPlus,
  FaUsers,
  FaWarehouse,
  FaShuttleVan,
} from "react-icons/fa";
import { AiOutlineSend } from "react-icons/ai";
import { RiLoginBoxFill } from "react-icons/ri";
import { GiWindyStripes } from "react-icons/gi";
import { BiTrip } from "react-icons/bi";
import { GiBattleship } from "react-icons/gi";
import { HiOfficeBuilding, HiUserGroup } from "react-icons/hi";
import { GiExpense } from "react-icons/gi";
import { IoIosBusiness } from "react-icons/io";

export const links = [
  {
    title: "Dashboard",
    links: [
      {
        name: "Summary",
        icon: <MdSummarize />,
        link: "/",
      },
      {
        name: "Profile",
        icon: <FaUserAlt />,
        link: "/profile",
      },
    ],
  },

  {
    title: "Waybills",
    links: [
      {
        name: "New Waybill",
        icon: <FaWarehouse />,
        link: "/new-waybill",
      },
      {
        name: "OutBound",
        icon: <AiOutlineSend />,
        link: "/outbound",
      },
      {
        name: "Inbound",
        icon: <RiLoginBoxFill />,
        link: "/inbound",
      },
      {
        name: "Ware House",
        icon: <FaWarehouse />,
      },
    ],
  },
  {
    title: "Operations",
    links: [
      {
        name: "Create New Trip",
        icon: <GiWindyStripes />,
        link: "/create-trip",
      },

      {
        name: "Assign Trip",
        icon: <BiTrip />,
        link: "/assign-trip",
      },
      {
        name: "Transshipment",
        icon: <GiBattleship />,
      },
    ],
  },
  {
    title: "Admin",
    links: [
      {
        name: "Station Summary",
        icon: <HiOfficeBuilding />,
      },
      {
        name: "Account Summary",
        icon: <MdAccountBalance />,
      },

      {
        name: "Expense Summary",
        icon: <GiExpense />,
      },
      {
        name: "station Staff",
        icon: <FaUsers />,
      },
      {
        name: "Customers",
        icon: <HiUserGroup />,
      },
      {
        name: "E-Commerce customers",
        icon: <HiUserGroup />,
      },
    ],
  },
  {
    title: "Director",
    links: [
      {
        name: "Create New Staff",
        icon: <FaUserPlus />,
        link: "/admin/staff-registration",
      },
      {
        name: "Register Ecommerce",
        icon: <MdAddBusiness />,
        link: "/admin/new-ecommerce-customer",
      },

      {
        name: "Manage Stations",
        icon: <IoIosBusiness />,
        link: "/admin/stations",
      },
      {
        name: "Add Station",
        icon: <IoIosBusiness />,
        link: "/admin/add-stations",
      },
      {
        name: "Add New Vehicle",
        icon: <FaShuttleVan />,
        link: "/admin/add-vehicle",
      },
      {
        name: "Create New Route",
        icon: <MdAltRoute />,
        link: "/admin/create-route",
      },
    ],
  },
];
