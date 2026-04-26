import { useEffect, useState } from "react";
import { getMyStudents } from "../api/teachers.api";
import { useAuth } from "../context/AuthContext";
import styles from "./DataPage.module.css";
import DataTable from "../components/DataTable";

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
        {error ? (
          <p className={styles.apiError}>{error}</p>
        ) : (
          <DataTable
            fetching={fetching}
            emptyMessage="לא נמצאו תלמידות בכיתה זו"
            columns={[
              { key: "firstName", label: "שם פרטי" },
              { key: "lastName",  label: "שם משפחה" },
              { key: "idNumber",  label: 'ת"ז' },
            ]}
            rows={students}
          />
        )}
      </div>
    </div>
  );
}