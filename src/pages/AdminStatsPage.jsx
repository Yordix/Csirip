import { useEffect, useState } from "react";
import { createAdminStat, getAdminStats } from "../api/client";
import { useI18n } from "../context/I18nContext";

export default function AdminStatsPage() {
  const { t } = useI18n();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");

  async function load() {
    const token = localStorage.getItem("admin_token");
    const data = await getAdminStats(token);
    setItems(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const token = localStorage.getItem("admin_token");
    const formData = new FormData(formEl);

    const payload = {
      title: String(formData.get("title") || ""),
      metricType: String(formData.get("metricType") || "custom"),
      value: Number(formData.get("value") || 0),
      recordedAt: String(formData.get("recordedAt") || ""),
      note: String(formData.get("note") || "")
    };

    try {
      await createAdminStat(token, payload);
      setStatus(t("adminStats.successCreate"));
      formEl.reset();
      await load();
    } catch (err) {
      setStatus(`${t("common.errorPrefix")} ${err.message}`);
    }
  }

  return (
    <div className="admin-page">
      <h1>{t("adminStats.title")}</h1>

      <form className="admin-card form" onSubmit={onSubmit}>
        <h3>{t("adminStats.newRow")}</h3>
        <input name="title" placeholder={t("adminStats.placeholder.title")} required />
        <input name="metricType" placeholder={t("adminStats.placeholder.type")} />
        <input name="value" type="number" step="0.01" placeholder={t("adminStats.placeholder.value")} required />
        <input name="recordedAt" type="date" required />
        <textarea name="note" rows="3" placeholder={t("adminStats.placeholder.note")} />
        <button className="admin-btn" type="submit">
          {t("adminStats.create")}
        </button>
        {status && <p>{status}</p>}
      </form>

      <section className="admin-card">
        <h3>{t("adminStats.savedRows")}</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t("adminStats.cols.title")}</th>
              <th>{t("adminStats.cols.type")}</th>
              <th>{t("adminStats.cols.value")}</th>
              <th>{t("adminStats.cols.date")}</th>
              <th>{t("adminStats.cols.note")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.metricType}</td>
                <td>{item.value}</td>
                <td>{item.recordedAt}</td>
                <td>{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
