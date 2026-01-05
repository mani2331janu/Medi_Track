// AppSidebar.jsx
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  sidebarClasses,
} from "react-pro-sidebar";
import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaCogs,
  FaMinusSquare,
  FaTimesCircle,
} from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import {
  MdAdminPanelSettings,
  MdOutlineAdminPanelSettings,
} from "react-icons/md";
import { FaSuitcaseMedical } from "react-icons/fa6";
import { GoPersonAdd } from "react-icons/go";
import { IoIosArrowForward } from "react-icons/io";

import { useTheme } from "../../../context/ThemeContext";
import "../../../App.css";

export default function AppSidebar({ collapsed, isMobile, onToggle }) {
  const { theme } = useTheme();

  const colors =
    theme === "dark"
      ? {
          sidebarBg: "#1f2937",
          text: "#f3f4f6",
          hoverBg: "#374151",
          hoverText: "#fbbf24",
          activeBg: "#111827",
          activeText: "#fbbf24",
          submenuBg: "#111827",
        }
      : {
          sidebarBg: "#1447E6", 
          text: "#fff",
          hoverBg: "rgba(32, 30, 30, 0.2)", 
          hoverText: "#fff",
          activeBg: "rgba(0,0,0,0.2)", 
          activeText: "#fff",
          submenuBg: "rgba(255,255,255,0.1)", 
          submenuText: "#000000",
        };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ${
        isMobile ? `w-${collapsed ? "0" : "64"} overflow-hidden` : ""
      }`}
      style={{
        width: isMobile ? (collapsed ? 0 : 250) : collapsed ? 80 : 250,
        background: colors.sidebarBg,
      }}
    >
      <Sidebar
        collapsed={collapsed}
        backgroundColor="transparent"
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            background: colors.sidebarBg,
            height: "100vh",
            borderRight: "0",
            color: colors.text,
            overflowY: "auto",
            paddingTop: 20,
          },
        }}
      >
        {/* Header / Toggle */}
        <div className="flex items-center justify-between px-6 py-4">
          {!collapsed && !isMobile && (
            <span className="font-bold text-xl font-serif tracking-wide text-white">
              Medi Track
            </span>
          )}
          <button
            onClick={onToggle}
            className="text-white hover:text-gray-300 transition"
          >
            {collapsed ? (
              <FaMinusSquare size={22} />
            ) : (
              <FaTimesCircle size={22} />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <Menu
          menuItemStyles={{
            button: {
              color: colors.text,
              borderRadius: 12,
              padding: "10px 16px",
              margin: "6px 12px",
              fontWeight: 500,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: colors.hoverBg,
                color: colors.hoverText,
              },
              "&.active": {
                backgroundColor: colors.activeBg,
                color: colors.activeText,
                fontWeight: 700,
              },
            },

            // ⭐ FIX — submenu label text always visible
            label: {
              color: theme === "dark" ? "#f3f4f6" : "#000",
            },

            // ⭐ FIX — submenu items text visible normally (NOT only on hover)
            subMenuContent: {
              backgroundColor: colors.submenuBg,
              borderRadius: 12,
              paddingLeft: 12,
              marginTop: 4,
              color: theme === "dark" ? "#f3f4f6" : "#000",
            },
          }}
        >
          <MenuItem icon={<FaTachometerAlt />} component={<NavLink to="/" />}>
            Dashboard
          </MenuItem>

          <SubMenu
            icon={<MdOutlineAdminPanelSettings />}
            label="Administration"
          >
            <SubMenu icon={<GoPersonAdd />} label="Employee Management">
              <MenuItem
                icon={<IoIosArrowForward />}
                component={<NavLink to="administration/employee/list" />}
              >
                Employee
              </MenuItem>
            </SubMenu>
            <MenuItem
              icon={<MdAdminPanelSettings />}
              component={<NavLink to="administration/upload-log/list" />}
            >
              Upload Log
            </MenuItem>
          </SubMenu>

          <SubMenu icon={<FaCogs />} label="Master">
            <MenuItem
              icon={<GrMapLocation />}
              component={<NavLink to="master/location/list" />}
            >
              Location Master
            </MenuItem>
            <MenuItem
              icon={<FaSuitcaseMedical />}
              component={<NavLink to="master/medical/list" />}
            >
              Medical Master
            </MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </aside>
  );
}
