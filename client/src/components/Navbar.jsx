import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <span className={styles.brand}>בנות משה – טיול שנתי</span>
      <div className={styles.links}>
        <NavLink to="/"            className={({ isActive }) => isActive ? styles.active : ""}>ראשי</NavLink>
        <NavLink to="/teachers"    className={({ isActive }) => isActive ? styles.active : ""}>מורות</NavLink>
        <NavLink to="/students"    className={({ isActive }) => isActive ? styles.active : ""}>תלמידות</NavLink>
        <NavLink to="/my-students" className={({ isActive }) => isActive ? styles.active : ""}>הכיתה שלי</NavLink>
        <NavLink to="/map"         className={({ isActive }) => isActive ? styles.active : ""}>מפה</NavLink>
      </div>
      <button className={styles.logout} onClick={logout}>
        התנתקות ({user?.class})
      </button>
    </nav>
  );
}