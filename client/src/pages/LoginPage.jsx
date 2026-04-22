import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/FormInput";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const { login } = useAuth();

  const [form,   setForm]   = useState({ idNumber: "", password: "" });
  const [error,  setError]  = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.idNumber || !form.password) {
      setError("יש למלא את כל השדות");
      return;
    }

    setLoading(true);
    try {
      await login(form.idNumber, form.password);
    } catch (err) {
      setError(
        err.response?.data?.message === "Invalid credentials"
          ? "מספר תעודת זהות או סיסמה שגויים"
          : "אירעה שגיאה, נסי שוב"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>בנות משה</h1>
        <p className={styles.subtitle}>מערכת ניהול טיול שנתי</p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <FormInput
            label="מספר תעודת זהות"
            name="idNumber"
            type="text"
            value={form.idNumber}
            onChange={handleChange}
            placeholder="000000000"
          />
          <FormInput
            label="סיסמה"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "מתחברת..." : "כניסה"}
          </button>
        </form>
      </div>
    </div>
  );
}