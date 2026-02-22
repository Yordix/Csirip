import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin, getAdminMe } from "../api/client";
import { useI18n } from "../context/I18nContext";
import { useEffect } from "react";

export default function AdminLoginPage() {
  const { t } = useI18n();
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setChecking(false);
      return;
    }

    getAdminMe(token)
      .then(() => navigate("/admin/app/dashboard", { replace: true }))
      .catch(() => {
        localStorage.removeItem("admin_token");
        setChecking(false);
      });
  }, [navigate]);

  async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username"));
    const password = String(formData.get("password"));

    try {
      const response = await adminLogin(username, password);
      localStorage.setItem("admin_token", response.token);
      navigate("/admin/app/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  if (checking) {
    return <section className="container section small-section">{t("common.checking")}</section>;
  }

  return (
    <section className="container section small-section">
      <h1>{t("admin.loginTitle")}</h1>
      <form onSubmit={onSubmit} className="form">
        <input name="username" placeholder={t("admin.username")} required />
        <input name="password" type="password" placeholder={t("admin.password")} required />
        <button type="submit" className="cta-btn inline-cta">
          {t("admin.login")}
        </button>
        {error && <p className="error">{t("common.errorPrefix")} {error}</p>}
      </form>
    </section>
  );
}
