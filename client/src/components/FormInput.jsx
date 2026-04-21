import styles from "./FormInput.module.css";

export default function FormInput({ label, error, ...props }) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={`${styles.input} ${error ? styles.inputError : ""}`} {...props} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}