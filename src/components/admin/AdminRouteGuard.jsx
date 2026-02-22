import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAdminMe } from "../../api/client";
import { useI18n } from "../../context/I18nContext";

export default function AdminRouteGuard() {
  const { t } = useI18n();
  const [state, setState] = useState({ loading: true, authorized: false });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      setState({ loading: false, authorized: false });
      return;
    }

    getAdminMe(token)
      .then(() => setState({ loading: false, authorized: true }))
      .catch(() => {
        localStorage.removeItem("admin_token");
        setState({ loading: false, authorized: false });
      });
  }, []);

  if (state.loading) {
    return <div className="state-box">{t("common.checking")}</div>;
  }

  if (!state.authorized) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
