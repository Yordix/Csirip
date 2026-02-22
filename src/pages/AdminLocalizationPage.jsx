import { useEffect, useMemo, useState } from "react";
import { getAdminLocalization, upsertAdminLocalization } from "../api/client";
import { useI18n } from "../context/I18nContext";

const PAGE_SIZE = 20;

function flatten(obj, prefix = "") {
  const out = {};
  Object.entries(obj || {}).forEach(([key, value]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(out, flatten(value, next));
    } else {
      out[next] = String(value);
    }
  });
  return out;
}

export default function AdminLocalizationPage() {
  const { t } = useI18n();
  const [data, setData] = useState({ hu: {}, en: {} });
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [keyPath, setKeyPath] = useState("");
  const [enValue, setEnValue] = useState("");
  const [huValue, setHuValue] = useState("");

  const rows = useMemo(() => {
    const enFlat = flatten(data.en);
    const huFlat = flatten(data.hu);
    const keys = Array.from(new Set([...Object.keys(enFlat), ...Object.keys(huFlat)])).sort();
    return keys.map((k) => ({ key: k, en: enFlat[k] || "", hu: huFlat[k] || "" }));
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, safePage]);

  async function load() {
    const token = localStorage.getItem("admin_token");
    const result = await getAdminLocalization(token);
    setData(result);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  async function onSubmit(event) {
    event.preventDefault();
    const token = localStorage.getItem("admin_token");

    if (!keyPath.trim() || !enValue.trim() || !huValue.trim()) {
      setStatus(t("adminLocalization.errorRequired"));
      return;
    }

    try {
      const next = await upsertAdminLocalization(token, {
        key: keyPath.trim(),
        en: enValue.trim(),
        hu: huValue.trim()
      });
      setData(next);
      setStatus(t("adminLocalization.success"));
      setKeyPath("");
      setEnValue("");
      setHuValue("");
      setPage(1);
    } catch (err) {
      setStatus(`${t("common.errorPrefix")} ${err.message}`);
    }
  }

  return (
    <div className="admin-page">
      <h1>{t("adminLocalization.title")}</h1>
      <p>{t("adminLocalization.subtitle")}</p>

      <form className="admin-card form" onSubmit={onSubmit}>
        <h3>{t("adminLocalization.newKey")}</h3>
        <input value={keyPath} onChange={(e) => setKeyPath(e.target.value)} placeholder={t("adminLocalization.keyPlaceholder")} required />

        <div className="admin-grid-2">
          <div>
            <label>{t("adminLocalization.english")}</label>
            <textarea value={enValue} onChange={(e) => setEnValue(e.target.value)} rows="3" placeholder={t("adminLocalization.englishPlaceholder")} required />
          </div>
          <div>
            <label>{t("adminLocalization.hungarian")}</label>
            <textarea value={huValue} onChange={(e) => setHuValue(e.target.value)} rows="3" placeholder={t("adminLocalization.hungarianPlaceholder")} required />
          </div>
        </div>

        <button className="admin-btn" type="submit">
          {t("common.save")}
        </button>
        {status && <p>{status}</p>}
      </form>

      <section className="admin-card">
        <h3>{t("adminLocalization.saved")}</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t("adminLocalization.cols.key")}</th>
              <th>{t("adminLocalization.cols.en")}</th>
              <th>{t("adminLocalization.cols.hu")}</th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row) => (
              <tr key={row.key}>
                <td>{row.key}</td>
                <td>{row.en}</td>
                <td>{row.hu}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="tag-row" style={{ justifyContent: "space-between" }}>
          <button className="admin-btn" type="button" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            {t("common.prev")}
          </button>
          <span>{t("adminLocalization.page")} {safePage} / {totalPages}</span>
          <button className="admin-btn" type="button" disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            {t("common.next")}
          </button>
        </div>
      </section>
    </div>
  );
}
