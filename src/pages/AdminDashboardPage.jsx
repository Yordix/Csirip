import { useEffect, useState } from "react";
import { getAdminOverview, getAdminStats, getBillingRecords } from "../api/client";
import { useI18n } from "../context/I18nContext";

export default function AdminDashboardPage() {
  const { t } = useI18n();
  const [overview, setOverview] = useState(null);
  const [latestStats, setLatestStats] = useState([]);
  const [latestBilling, setLatestBilling] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    Promise.all([getAdminOverview(token), getAdminStats(token), getBillingRecords(token)])
      .then(([o, stats, billing]) => {
        setOverview(o);
        setLatestStats(stats.slice(0, 5));
        setLatestBilling(billing.slice(0, 5));
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p className="error">{t("common.errorPrefix")} {error}</p>;
  }

  if (!overview) {
    return <p>{t("common.loading")}</p>;
  }

  return (
    <div className="admin-page">
      <h1>{t("adminDashboard.title")}</h1>

      <div className="admin-kpis">
        <article className="admin-card">
          <h3>{t("adminDashboard.kpi.blogCount")}</h3>
          <p>{overview.blogCount}</p>
        </article>
        <article className="admin-card">
          <h3>{t("adminDashboard.kpi.statCount")}</h3>
          <p>{overview.statCount}</p>
        </article>
        <article className="admin-card">
          <h3>{t("adminDashboard.kpi.billingCount")}</h3>
          <p>{overview.billingCount}</p>
        </article>
        <article className="admin-card">
          <h3>{t("adminDashboard.kpi.unpaidCount")}</h3>
          <p>{overview.unpaidCount}</p>
        </article>
        <article className="admin-card">
          <h3>{t("adminDashboard.kpi.totalRevenue")}</h3>
          <p>{Number(overview.totalRevenue || 0).toLocaleString("hu-HU")} Ft</p>
        </article>
        <article className="admin-card">
          <h3>{t("adminDashboard.kpi.incomeTotal")}</h3>
          <p>{Number(overview.incomeTotal || 0).toLocaleString("hu-HU")} Ft</p>
        </article>
        <article className="admin-card">
          <h3>{t("adminDashboard.kpi.expenseTotal")}</h3>
          <p>{Number(overview.expenseTotal || 0).toLocaleString("hu-HU")} Ft</p>
        </article>
      </div>

      <div className="admin-grid-2">
        <section className="admin-card">
          <h3>{t("adminDashboard.latestStats")}</h3>
          {latestStats.length === 0 ? (
            <p>{t("adminDashboard.noStats")}</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t("adminDashboard.cols.name")}</th>
                  <th>{t("adminDashboard.cols.value")}</th>
                  <th>{t("adminDashboard.cols.date")}</th>
                </tr>
              </thead>
              <tbody>
                {latestStats.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.value}</td>
                    <td>{item.recordedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="admin-card">
          <h3>{t("adminDashboard.latestBilling")}</h3>
          {latestBilling.length === 0 ? (
            <p>{t("adminDashboard.noBilling")}</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t("adminDashboard.cols.invoice")}</th>
                  <th>{t("adminDashboard.cols.partner")}</th>
                  <th>{t("adminDashboard.cols.category")}</th>
                  <th>{t("adminDashboard.cols.amount")}</th>
                  <th>{t("adminDashboard.cols.status")}</th>
                </tr>
              </thead>
              <tbody>
                {latestBilling.map((item) => (
                  <tr key={item.id}>
                    <td>{item.invoiceNumber}</td>
                    <td>{item.partnerName}</td>
                    <td>{item.category || "egyeb"}</td>
                    <td>{item.amount.toLocaleString("hu-HU")} {item.currency}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
