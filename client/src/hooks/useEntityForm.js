import { useEffect, useState } from "react";

export function useEntityForm({ fetchFn, createFn, emptyForm, validate }) {
  const [items,    setItems]    = useState([]);
  const [form,     setForm]     = useState(emptyForm);
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchFn()
      .then((res) => setItems(res.data))
      .catch(() => setApiError("לא ניתן לטעון את הנתונים"))
      .finally(() => setFetching(false));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await createFn(form);
      setItems((prev) => [...prev, res.data]);
      setForm(emptyForm);
    } catch (err) {
      setApiError(err.response?.data?.message || "אירעה שגיאה, נסי שוב");
    } finally {
      setLoading(false);
    }
  };

  return { items, form, errors, apiError, loading, fetching, handleChange, handleSubmit };
}