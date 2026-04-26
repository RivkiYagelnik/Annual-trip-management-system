import styles from "../pages/DataPage.module.css";

export default function DataTable({ columns, rows, emptyMessage, fetching }) {
  if (fetching) return <p className={styles.info}>טוענת...</p>;
  if (rows.length === 0) return <p className={styles.info}>{emptyMessage}</p>;

  return (
    <table className={styles.table}>
      <thead>
        <tr>{columns.map((col) => <th key={col.key}>{col.label}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row._id}>
            {columns.map((col) => <td key={col.key}>{row[col.key]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}