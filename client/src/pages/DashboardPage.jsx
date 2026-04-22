import { useAuth } from "../context/AuthContext";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>שלום, מורת כיתה {user?.class}</h2>
      <p className={styles.sub}>בחרי פעולה מהתפריט למעלה</p>
    </div>
  );
}