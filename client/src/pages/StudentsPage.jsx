import { getAllStudents, createStudent } from "../api/students.api";
import { useEntityForm } from "../hooks/useEntityForm";
import FormInput from "../components/FormInput";
import DataTable from "../components/DataTable";
import styles from "./DataPage.module.css";
import ClassSelect from "../components/ClassSelect";

const CLASSES = ["א", "ב", "ג", "ד", "ה", "ו"];
const emptyForm = { firstName: "", lastName: "", idNumber: "", class: "" };

const validate = (form) => {
  const errs = {};
  if (!form.firstName.trim()) errs.firstName = "שדה חובה";
  if (!form.lastName.trim())  errs.lastName  = "שדה חובה";
  if (!/^\d{9}$/.test(form.idNumber)) errs.idNumber = "תעודת זהות חייבת להכיל 9 ספרות";
  if (!form.class)            errs.class    = "שדה חובה";
  return errs;
};

const COLUMNS = [
  { key: "firstName", label: "שם פרטי" },
  { key: "lastName",  label: "שם משפחה" },
  { key: "idNumber",  label: 'ת"ז' },
  { key: "class",     label: "כיתה" },
];

export default function StudentsPage() {
  const { items: students, form, errors, apiError, loading, fetching, handleChange, handleSubmit } =
    useEntityForm({ fetchFn: getAllStudents, createFn: createStudent, emptyForm, validate });

  return (
    <div className={styles.page}>
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>הוספת תלמידה</h2>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <FormInput label="שם פרטי"   name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} />
          <FormInput label="שם משפחה"  name="lastName"  value={form.lastName}  onChange={handleChange} error={errors.lastName} />
          <FormInput label="מספר ת\ז'" name="idNumber"  value={form.idNumber}  onChange={handleChange} error={errors.idNumber} />

          <ClassSelect value={form.class} onChange={handleChange} error={errors.class} />

          {apiError && <p className={styles.apiError}>{apiError}</p>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "שומרת..." : "הוספה"}
          </button>
        </form>
      </div>

      <div className={styles.listSection}>
        <h2 className={styles.sectionTitle}>רשימת תלמידות</h2>
        <DataTable fetching={fetching} emptyMessage="אין תלמידות במערכת" columns={COLUMNS} rows={students} />
      </div>
    </div>
  );
}