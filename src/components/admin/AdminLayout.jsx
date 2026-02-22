import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";

export default function AdminLayout() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  const menu = [
    ["/admin/app/dashboard", t("adminMenu.dashboard")],
    ["/admin/app/statisztikak", t("adminMenu.stats")],
    ["/admin/app/szamlazas", t("adminMenu.billing")],
    ["/admin/app/kepek", t("adminMenu.images")],
    ["/admin/app/tartalom", t("adminMenu.content")],
    ["/admin/app/lokalizacio", t("adminMenu.localization")],
    ["/", t("adminMenu.publicSite")]
  ];

  function logout() {
    localStorage.removeItem("admin_token");
    navigate("/admin", { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>{t("adminMenu.title")}</h2>
        <nav>
          {menu.map(([path, label]) => (
            <NavLink key={path} to={path} className="admin-nav-item">
              {label}
            </NavLink>
          ))}
        </nav>
        <button className="admin-logout" onClick={logout}>
          {t("adminMenu.logout")}
        </button>
      </aside>

      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}
