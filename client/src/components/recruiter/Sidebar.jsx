import React from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", icon: assets.home_icon, label: "Dashboard" },
    { path: "/dashboard/add-job", icon: assets.add_icon, label: "Add Job" },
    { path: "/dashboard/manage-jobs", icon: assets.suitcase_icon, label: "Manage Jobs" },
    { path: "/dashboard/view-applications", icon: assets.person_icon, label: "View Applications" },
  ];

  return (
    <aside className="recruiter-sidebar">
      <ul>
        {navItems.map((item) => (
          <li key={item.path} className={location.pathname === item.path ? "active" : ""}>
            <Link to={item.path}>
              <img src={item.icon} alt={item.label} />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
