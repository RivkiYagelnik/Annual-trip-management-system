import { useEffect, useState } from "react";
import { getAllStudents, createStudent } from "../api/students.api";
import FormInput from "../components/FormInput";
import styles from "./DataPage.module.css";

const CLASSES = ["א", "ב", "ג", "ד", "ה", "ו"];

const emptyForm = { firstName: "", lastName: "", idNumber: "", class: "" };

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [form,     setForm]     = useState(emptyForm);
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getAllStudents()
      .then((res) => setStudents(res.data))
      .catch(() => setApiError("לא ניתן לטעון את רשימת התלמידות"))
      .finally(() => setFetching(false));
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "שדה חובה";
    if (!form.lastName.trim())  errs.lastName  = "שדה חובה";
    if (!/^\d{9}$/.test(form.idNumber)) errs.idNumber = "תעודת זהות חייבת להכיל 9 ספרות";
    if (!form.class)            errs.class     = "שדה חובה";
    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await createStudent(form);
      setStudents((prev) => [...prev, res.data]);
      setForm(emptyForm);
    } catch {
      setApiError("אירעה שגיאה, נסי שוב");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>הוספת תלמידה</h2>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <FormInput label="שם פרטי"   name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} />
          <FormInput label="שם משפחה"  name="lastName"  value={form.lastName}  onChange={handleChange} error={errors.lastName} />
          <FormInput label="ז'מספר ת\" name="idNumber"  value={form.idNumber}  onChange={handleChange} error={errors.idNumber} />

          <div className={styles.field}>
            <label className={styles.label}>כיתה</label>
            <select name="class" value={form.class} onChange={handleChange} className={`${styles.select} ${errors.class ? styles.selectError : ""}`}>
              <option value="">בחרי כיתה</option>
              {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.class && <span className={styles.error}>{errors.class}</span>}
          </div>

          {apiError && <p className={styles.apiError}>{apiError}</p>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "שומרת..." : "הוספה"}
          </button>
        </form>
      </div>

      <div className={styles.listSection}>
        <h2 className={styles.sectionTitle}>רשימת תלמידות</h2>
        {fetching ? (
          <p className={styles.info}>טוענת...</p>
        ) : students.length === 0 ? (
          <p className={styles.info}>אין תלמידות במערכת</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>שם פרטי</th>
                <th>שם משפחה</th>
                <th>ת"ז</th>
                <th>כיתה</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td>{s.firstName}</td>
                  <td>{s.lastName}</td>
                  <td>{s.idNumber}</td>
                  <td>{s.class}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}