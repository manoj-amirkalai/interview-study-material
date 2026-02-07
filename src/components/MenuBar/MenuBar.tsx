import { Link, useLocation } from "react-router-dom";
import "./MenuBar.css";

const MenuBar = () => {
  const location = useLocation();
  const menuItemsExtra = [
    { name: "Home", value: "home", path: "/" }
  ];
  return (
    <nav className="menu-bar">
      <div className="menu-logo">MyApp</div>

      <ul className="menu-items">
        {menuItemsExtra.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MenuBar;
