import { useEffect, useState } from "react";
import { getMyStudents } from "../api/teachers.api";
import { useAuth } from "../context/AuthContext";
import styles from "./DataPage.module.css";

export default function MyStudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [error,    setError]    = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getMyStudents()
      .then((res) => setStudents(res.data))
      .catch(() => setError("לא ניתן לטעון את הנתונים"))
      .finally(() => setFetching(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.listSection} style={{ maxWidth: 700 }}>
        <h2 className={styles.sectionTitle}>תלמידות כיתה {user?.class}</h2>
        {fetching ? (
          <p className={styles.info}>טוענת...</p>
        ) : error ? (
          <p className={styles.apiError}>{error}</p>
        ) : students.length === 0 ? (
          <p className={styles.info}>לא נמצאו תלמידות בכיתה זו</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>שם פרטי</th>
                <th>שם משפחה</th>
                <th>ת"ז</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td>{s.firstName}</td>
                  <td>{s.lastName}</td>
                  <td>{s.idNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}