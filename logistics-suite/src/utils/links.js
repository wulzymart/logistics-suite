import {
  MdAccountBalance,
  MdAddBusiness,
  MdAltRoute,
  MdOutlineReviews,
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
import { GiMoneyStack, GiWindyStripes } from "react-icons/gi";
import { BiGitPullRequest, BiTrip } from "react-icons/bi";
import { GiBattleship } from "react-icons/gi";
import { HiOfficeBuilding, HiUserGroup } from "react-icons/hi";
import { GiExpense } from "react-icons/gi";
import { IoIosBusiness } from "react-icons/io";
import { GrUserWorker } from "react-icons/gr";

export const links = [
  {
    title: "Dashboard",
    authorized: ["Normal User", "Admin", "Super Admin"],
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
    authorized: ["Normal User", "Admin", "Super Admin"],
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
    ],
  },
  {
    title: "Operations",
    authorized: ["Normal User", "Admin", "Super Admin"],
    links: [
      {
        name: "Assign Trip",
        icon: <BiTrip />,
        link: "/assign-trip",
      },
      {
        name: "Assign Local Trip",
        icon: <BiTrip />,
        link: "assign-local-trip",
      },
      {
        name: "Trips",
        icon: <GiBattleship />,
        link: "/trips",
      },
      {
        name: "New Expense",
        icon: <GiExpense />,
        link: "/new-expense",
      },

      {
        name: "Customers",
        icon: <HiUserGroup />,
        link: "/customers",
      },
      {
        name: "Pickup Requests",
        icon: <BiGitPullRequest />,
        link: "/pickup-requests",
      },
    ],
  },
  {
    title: "Admin",
    authorized: ["Admin", "Super Admin"],
    links: [
      {
        name: "Create New Trip",
        icon: <GiWindyStripes />,
        link: "/create-trip",
      },
      {
        name: "Station Expenses",
        icon: <GiMoneyStack />,
        link: "/admin/expenses",
      },

      {
        name: "Station Summary",
        icon: <HiOfficeBuilding />,
        link: "/admin/station-summary",
      },
    ],
  },
  {
    title: "Accounts",
    authorized: ["Super Admin"],
    links: [
      {
        name: "Manage Expenses",
        icon: <GiMoneyStack />,
        link: "/super-admin/manage-expenses",
      },
      {
        name: "Inflow",
        icon: <MdAccountBalance />,
        link: "/super-admin/money-in",
      },
      {
        name: "Outflow",
        icon: <MdAccountBalance />,
        link: "/super-admin/money-out",
      },
    ],
  },
  {
    title: "Director",
    authorized: ["Super Admin"],
    links: [
      {
        name: "Register E-commerce",
        icon: <MdAddBusiness />,
        link: "/super-admin/new-ecommerce-customer",
      },
      {
        name: "Add New Staff",
        icon: <FaUserPlus />,
        link: "/super-admin/staff-registration",
      },
      {
        name: "Staff",
        icon: <FaUsers />,
        link: "/super-admin/staff",
      },

      {
        name: "Manage Stations",
        icon: <IoIosBusiness />,
        link: "/super-admin/stations",
      },
      {
        name: "Add Station",
        icon: <IoIosBusiness />,
        link: "/super-admin/add-stations",
      },
      {
        name: "Add New Vehicle",
        icon: <FaShuttleVan />,
        link: "/super-admin/add-vehicle",
      },
      {
        name: "Create New Route",
        icon: <MdAltRoute />,
        link: "/super-admin/create-route",
      },
      {
        name: "Manage Pricing",
        icon: <FaShuttleVan />,
        link: "/super-admin/manage-pricing",
      },
      {
        name: "Reviews",
        icon: <MdOutlineReviews />,
        link: "/super-admin/reviews",
      },
      {
        name: "Place Job Adverts",
        icon: <GrUserWorker />,
        link: "/super-admin/jobs",
      },
    ],
  },
];
