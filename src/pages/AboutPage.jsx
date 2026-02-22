import { useThemeData } from "../context/ThemeContext";
import { useI18n } from "../context/I18nContext";

export default function AboutPage() {
  const { siteData } = useThemeData();
  const { t } = useI18n();
  const { about, site } = siteData;

  return (
    <section className="container section about-grid">
      <div>
        <h1>{t("about.title")}</h1>
        <p>{about.intro}</p>
        <p>{about.details}</p>

        <div className="card-row two-col">
          <article className="card">
            <h3>{t("about.area")}</h3>
            <p>{about.size}</p>
          </article>
          <article className="card">
            <h3>{t("about.floorplan")}</h3>
            <p>{about.layout}</p>
          </article>
        </div>

        <article className="card village-card">
          <h3>{t("about.village")}</h3>
          <p>{about.villagePitch}</p>
          <p>
            {t("home.location")}: {site.location}
          </p>
        </article>
      </div>

      <img
        src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200&auto=format&fit=crop"
        alt={t("about.imageAlt")}
      />
    </section>
  );
}

