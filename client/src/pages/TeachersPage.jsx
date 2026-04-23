import { useEffect, useState } from "react";
import { getAllTeachers, createTeacher } from "../api/teachers.api";
import FormInput from "../components/FormInput";
import styles from "./DataPage.module.css";

const CLASSES = ["א", "ב", "ג", "ד", "ה", "ו"];

const emptyForm = { firstName: "", lastName: "", idNumber: "", class: "", password: "" };

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [form,     setForm]     = useState(emptyForm);
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getAllTeachers()
      .then((res) => setTeachers(res.data))
      .catch(() => setApiError("לא ניתן לטעון את רשימת המורות"))
      .finally(() => setFetching(false));
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "שדה חובה";
    if (!form.lastName.trim())  errs.lastName  = "שדה חובה";
    if (!/^\d{9}$/.test(form.idNumber)) errs.idNumber = "תעודת זהות חייבת להכיל 9 ספרות";
    if (!form.class)            errs.class     = "שדה חובה";
    if (!form.password.trim())  errs.password  = "שדה חובה";
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
      const res = await createTeacher(form);
      setTeachers((prev) => [...prev, res.data]);
      setForm(emptyForm);
    } catch (err) {
      setApiError(
        err.response?.status === 409
          ? "מורה עם תעודת זהות זו כבר קיימת"
          : "אירעה שגיאה, נסי שוב"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>הוספת מורה</h2>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <FormInput label="שם פרטי"   name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} />
          <FormInput label="שם משפחה"  name="lastName"  value={form.lastName}  onChange={handleChange} error={errors.lastName} />
          <FormInput label="מספר ת\ז'" name="idNumber"  value={form.idNumber}  onChange={handleChange} error={errors.idNumber} />
          <FormInput label="סיסמה"     name="password"  value={form.password}  onChange={handleChange} error={errors.password} type="password" />

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
        <h2 className={styles.sectionTitle}>רשימת מורות</h2>
        {fetching ? (
          <p className={styles.info}>טוענת...</p>
        ) : teachers.length === 0 ? (
          <p className={styles.info}>אין מורות במערכת</p>
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
              {teachers.map((t) => (
                <tr key={t._id}>
                  <td>{t.firstName}</td>
                  <td>{t.lastName}</td>
                  <td>{t.idNumber}</td>
                  <td>{t.class}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}