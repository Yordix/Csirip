import { useThemeData } from "../context/ThemeContext";
import { useI18n } from "../context/I18nContext";

export default function ContactPage() {
  const { t } = useI18n();
  const { siteData } = useThemeData();
  const { contact } = siteData;

  return (
    <section className="container section">
      <h1>{t("contact.title")}</h1>

      <div className="card-row two-col">
        <article className="card">
          <p>E-mail: {contact.email}</p>
          <p>
            {t("contact.phone")}: {contact.phone}
          </p>
          <p>
            {t("contact.address")}: {contact.address}
          </p>
          <p>
            Facebook: <a href={contact.facebook}>{contact.facebook}</a>
          </p>
          <p>
            Instagram: <a href={contact.instagram}>{contact.instagram}</a>
          </p>
        </article>

        <form className="form">
          <h3>{t("contact.formTitle")}</h3>
          <input placeholder={t("contact.name")} />
          <input placeholder={t("contact.email")} type="email" />
          <textarea placeholder={t("contact.message")} rows="5" />
          <button type="button" className="cta-btn inline-cta">
            {t("contact.send")}
          </button>
        </form>
      </div>
    </section>
  );
}
