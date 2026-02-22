import { NavLink } from "react-router-dom";
import { useI18n } from "../context/I18nContext";

export default function Header() {
  const { t, language, setLanguage } = useI18n();

  const menu = [
    ["/", t("nav.home")],
    ["/rolunk", t("nav.about")],
    ["/galeria", t("nav.gallery")],
    ["/kikapcsolodas", t("nav.relax")],
    ["/kapcsolat", t("nav.contact")],
    ["/blog", t("nav.blog")]
  ];

  return (
    <header className="header">
      <div className="container nav-wrap">
        <NavLink to="/" className="brand">
          {t("site.title")}
        </NavLink>

        <nav className="nav">
          {menu.map(([path, label]) => (
            <NavLink key={path} to={path} className="nav-link">
              {label}
            </NavLink>
          ))}

          <div className="lang-switch" role="group" aria-label={t("common.languageSwitcher")}>
            <button className={language === "hu" ? "lang-btn active" : "lang-btn"} onClick={() => setLanguage("hu")}>
              HU
            </button>
            <button className={language === "en" ? "lang-btn active" : "lang-btn"} onClick={() => setLanguage("en")}>
              EN
            </button>
          </div>

          <NavLink to="/foglalas" className="cta-btn">
            {t("nav.booking")}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
