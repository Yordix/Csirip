import { Link } from "react-router-dom";
import { useI18n } from "../context/I18nContext";

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <section className="container section small-section">
      <h1>{t("notFound.title")}</h1>
      <p>{t("notFound.text")}</p>
      <Link to="/" className="cta-btn inline-cta">
        {t("notFound.backHome")}
      </Link>
    </section>
  );
}
