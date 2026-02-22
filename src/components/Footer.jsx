import { useI18n } from "../context/I18nContext";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>{t("footer.brandLine")}</p>
        <a href="/admin">{t("footer.admin")}</a>
      </div>
    </footer>
  );
}
