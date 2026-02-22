import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useThemeData } from "../context/ThemeContext";
import { useI18n } from "../context/I18nContext";

export default function Layout() {
  const { loading, error } = useThemeData();
  const { t } = useI18n();

  if (loading) {
    return <div className="state-box">{t("common.loading")}</div>;
  }

  if (error) {
    return <div className="state-box">{t("common.errorPrefix")} {error}</div>;
  }

  return (
    <div className="page-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
