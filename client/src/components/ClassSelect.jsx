import styles from "../pages/DataPage.module.css";

const CLASSES = ["א", "ב", "ג", "ד", "ה", "ו"];

export default function ClassSelect({ value, onChange, error }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>כיתה</label>
      <select
        name="class"
        value={value}
        onChange={onChange}
        className={`${styles.select} ${error ? styles.selectError : ""}`}
      >
        <option value="">בחרי כיתה</option>
        {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}