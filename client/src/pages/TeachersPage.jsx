import { getAllTeachers, createTeacher } from "../api/teachers.api";
import { useEntityForm } from "../hooks/useEntityForm";
import FormInput from "../components/FormInput";
import DataTable from "../components/DataTable";
import styles from "./DataPage.module.css";

const CLASSES = ["א", "ב", "ג", "ד", "ה", "ו"];

const emptyForm = { firstName: "", lastName: "", idNumber: "", class: "", password: "" };

const validate = (form) => {
  const errs = {};
  if (!form.firstName.trim()) errs.firstName = "שדה חובה";
  if (!form.lastName.trim())  errs.lastName  = "שדה חובה";
  if (!/^\d{9}$/.test(form.idNumber)) errs.idNumber = "תעודת זהות חייבת להכיל 9 ספרות";
  if (!form.class)            errs.class    = "שדה חובה";
  if (!form.password.trim())  errs.password = "שדה חובה";
  return errs;
};

const COLUMNS = [
  { key: "firstName", label: "שם פרטי" },
  { key: "lastName",  label: "שם משפחה" },
  { key: "idNumber",  label: 'ת"ז' },
  { key: "class",     label: "כיתה" },
];

export default function TeachersPage() {
  const { items: teachers, form, errors, apiError, loading, fetching, handleChange, handleSubmit } =
    useEntityForm({ fetchFn: getAllTeachers, createFn: createTeacher, emptyForm, validate });

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
        <DataTable fetching={fetching} emptyMessage="אין מורות במערכת" columns={COLUMNS} rows={teachers} />
      </div>
    </div>
  );
}