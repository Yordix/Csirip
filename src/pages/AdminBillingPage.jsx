import { useEffect, useMemo, useState } from "react";
import { createBillingRecord, deleteBillingRecord, getBillingRecords, updateBillingRecord, updateBillingStatus } from "../api/client";
import { useI18n } from "../context/I18nContext";

const categoryValues = ["bevetel", "kiadas", "szolgaltatas", "szerviz", "berles", "karbantartas", "egyeb"];

export default function AdminBillingPage() {
  const { t } = useI18n();
  const categories = useMemo(
    () => categoryValues.map((value) => [value, t(`adminBilling.categories.${value}`)]),
    [t]
  );

  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  async function load() {
    const token = localStorage.getItem("admin_token");
    const data = await getBillingRecords(token);
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
      invoiceNumber: String(formData.get("invoiceNumber") || ""),
      partnerName: String(formData.get("partnerName") || ""),
      category: String(formData.get("category") || "egyeb"),
      amount: Number(formData.get("amount") || 0),
      currency: String(formData.get("currency") || "HUF"),
      status: String(formData.get("status") || "draft"),
      issuedAt: String(formData.get("issuedAt") || ""),
      dueAt: String(formData.get("dueAt") || ""),
      paidAt: String(formData.get("paidAt") || ""),
      note: String(formData.get("note") || "")
    };

    try {
      await createBillingRecord(token, payload);
      setStatus(t("adminBilling.successCreate"));
      formEl.reset();
      await load();
    } catch (err) {
      setStatus(`${t("common.errorPrefix")} ${err.message}`);
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditForm({
      invoiceNumber: item.invoiceNumber,
      partnerName: item.partnerName,
      category: item.category || "egyeb",
      amount: item.amount,
      currency: item.currency,
      status: item.status,
      issuedAt: item.issuedAt,
      dueAt: item.dueAt,
      paidAt: item.paidAt || "",
      note: item.note || ""
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  async function saveEdit(id) {
    const token = localStorage.getItem("admin_token");
    try {
      await updateBillingRecord(token, id, {
        ...editForm,
        amount: Number(editForm.amount || 0)
      });
      setStatus(t("adminBilling.successUpdate"));
      cancelEdit();
      await load();
    } catch (err) {
      setStatus(`${t("common.errorPrefix")} ${err.message}`);
    }
  }

  async function removeRow(id) {
    const token = localStorage.getItem("admin_token");
    try {
      await deleteBillingRecord(token, id);
      setStatus(t("adminBilling.successDelete"));
      if (editingId === id) {
        cancelEdit();
      }
      await load();
    } catch (err) {
      setStatus(`${t("common.errorPrefix")} ${err.message}`);
    }
  }

  async function onStatusChange(id, nextStatus) {
    const token = localStorage.getItem("admin_token");
    try {
      await updateBillingStatus(token, id, nextStatus);
      setStatus(t("adminBilling.successStatus"));
      await load();
    } catch (err) {
      setStatus(`${t("common.errorPrefix")} ${err.message}`);
    }
  }

  return (
    <div className="admin-page">
      <h1>{t("adminBilling.title")}</h1>

      <form className="admin-card form" onSubmit={onSubmit}>
        <h3>{t("adminBilling.new")}</h3>

        <label>
          {t("adminBilling.fields.invoiceNumber")}
          <input name="invoiceNumber" placeholder={t("adminBilling.placeholder.invoiceNumber")} required />
        </label>

        <label>
          {t("adminBilling.fields.partner")}
          <input name="partnerName" placeholder={t("adminBilling.placeholder.partner")} required />
        </label>

        <label>
          {t("adminBilling.fields.category")}
          <select name="category" defaultValue="egyeb">
            {categories.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          {t("adminBilling.fields.amount")}
          <input name="amount" type="number" step="0.01" placeholder={t("adminBilling.placeholder.amount")} required />
        </label>

        <label>
          {t("adminBilling.fields.currency")}
          <select name="currency" defaultValue="HUF">
            <option value="HUF">HUF</option>
            <option value="EUR">EUR</option>
          </select>
        </label>

        <label>
          {t("adminBilling.fields.status")}
          <select name="status" defaultValue="draft">
            <option value="draft">draft</option>
            <option value="issued">issued</option>
            <option value="paid">paid</option>
            <option value="overdue">overdue</option>
          </select>
        </label>

        <label>
          {t("adminBilling.fields.issuedAt")}
          <input name="issuedAt" type="date" required />
        </label>

        <label>
          {t("adminBilling.fields.dueAt")}
          <input name="dueAt" type="date" required />
        </label>

        <label>
          {t("adminBilling.fields.paidAt")}
          <input name="paidAt" type="date" />
        </label>

        <label>
          {t("adminBilling.fields.note")}
          <textarea name="note" rows="3" placeholder={t("adminBilling.placeholder.note")} />
        </label>

        <button className="admin-btn" type="submit">
          {t("adminBilling.actions.create")}
        </button>
        {status && <p>{status}</p>}
      </form>

      <section className="admin-card">
        <h3>{t("adminBilling.table.title")}</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t("adminBilling.table.invoiceNumber")}</th>
              <th>{t("adminBilling.table.partner")}</th>
              <th>{t("adminBilling.table.category")}</th>
              <th>{t("adminBilling.table.amount")}</th>
              <th>{t("adminBilling.table.status")}</th>
              <th>{t("adminBilling.table.issuedAt")}</th>
              <th>{t("adminBilling.table.dueAt")}</th>
              <th>{t("adminBilling.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isEditing = editingId === item.id;

              return (
                <tr key={item.id}>
                  <td>
                    {isEditing ? (
                      <input value={editForm.invoiceNumber} onChange={(e) => setEditForm({ ...editForm, invoiceNumber: e.target.value })} />
                    ) : (
                      item.invoiceNumber
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input value={editForm.partnerName} onChange={(e) => setEditForm({ ...editForm, partnerName: e.target.value })} />
                    ) : (
                      item.partnerName
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                        {categories.map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      t(`adminBilling.categories.${item.category || "egyeb"}`)
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <>
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.amount}
                          onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                        />
                        <select value={editForm.currency} onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}>
                          <option value="HUF">HUF</option>
                          <option value="EUR">EUR</option>
                        </select>
                      </>
                    ) : (
                      <>
                        {item.amount.toLocaleString("hu-HU")} {item.currency}
                      </>
                    )}
                  </td>
                  <td>
                    <select
                      value={item.status === "paid" ? "paid" : "issued"}
                      onChange={(e) => onStatusChange(item.id, e.target.value)}
                    >
                      <option value="issued">issued</option>
                      <option value="paid">paid</option>
                    </select>
                  </td>
                  <td>
                    {isEditing ? (
                      <input value={editForm.issuedAt} type="date" onChange={(e) => setEditForm({ ...editForm, issuedAt: e.target.value })} />
                    ) : (
                      item.issuedAt
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input value={editForm.dueAt} type="date" onChange={(e) => setEditForm({ ...editForm, dueAt: e.target.value })} />
                    ) : (
                      item.dueAt
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <>
                        <button type="button" className="admin-btn" onClick={() => saveEdit(item.id)}>
                          {t("adminBilling.actions.save")}
                        </button>
                        <button type="button" className="admin-btn" onClick={cancelEdit}>
                          {t("adminBilling.actions.cancel")}
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" className="admin-btn" onClick={() => startEdit(item)}>
                          {t("adminBilling.actions.edit")}
                        </button>
                        <button type="button" className="admin-btn" onClick={() => removeRow(item.id)}>
                          {t("adminBilling.actions.delete")}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
