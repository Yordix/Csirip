import { Link } from "react-router-dom";
import { useThemeData } from "../context/ThemeContext";
import { useI18n } from "../context/I18nContext";

export default function HomePage() {
  const { siteData } = useThemeData();
  const { t } = useI18n();
  const { logos, testimonials, attractions, houseActivities, gallery } = siteData;
  const logoIcons = ["📍", "👨‍👩‍👧‍👦", "🥾", "🍽️"];

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">{t("site.locationLabel")}</p>
            <h1>{t("site.title")}</h1>
            <p>{t("home.heroTagline", "")}</p>
            <div className="info-pills">
              <span>
                {t("home.location")}: {t("site.location")}
              </span>
              <span>
                {t("home.audience")}: {t("site.audience")}
              </span>
              <span>
                {t("home.capacity")}: {t("site.capacity")}
              </span>
            </div>
            <Link to="/foglalas" className="cta-btn inline-cta">
              {t("home.startBooking")}
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop"
            alt={t("home.heroAlt")}
          />
        </div>
      </section>

      <section className="logo-strip">
        <div className="container card-row four-col">
          {logos.map((logo, index) => (
            <Link key={logo.name} to={logo.url} className="logo-card">
              <span className="logo-card-icon" aria-hidden="true">
                {logoIcons[index] || "•"}
              </span>
              <span className="logo-card-label">{logo.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container notice">
        <p className="notice-icon">i</p>
        <p>{t("home.calmNotice", "")}</p>
      </section>

      <section className="container section">
        <h2>{t("home.reviewTitle")}</h2>
        <div className="card-row two-col">
          {testimonials.map((item) => (
            <article key={item.id} className="card">
              <p className="rating">{"★".repeat(item.rating)}</p>
              <p>{item.text}</p>
              <strong>{item.name}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2>{t("home.aboutShort")}</h2>
        <p>{t("home.aboutIntro", "")}</p>
        <Link to="/rolunk" className="text-link">
          {t("home.goAbout")}
        </Link>
      </section>

      <section className="container section">
        <h2>{t("home.attractions")}</h2>
        <div className="card-row three-col">
          {attractions.map((item) => (
            <article key={item.id} className="card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
        <Link to="/kikapcsolodas" className="text-link">
          {t("home.goRelax")}
        </Link>
      </section>

      <section className="container section">
        <h2>{t("home.houseFun")}</h2>
        <div className="card-row three-col">
          {houseActivities.map((item) => (
            <article key={item.id} className="card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
        <Link to="/kikapcsolodas" className="text-link">
          {t("home.goRelax")}
        </Link>
      </section>

      <section className="container section">
        <h2>{t("home.gallery")}</h2>
        <div className="gallery-grid compact">
          {gallery.map((item) => (
            <img key={item.id} src={item.imageUrl} alt={item.title} />
          ))}
        </div>
        <Link to="/galeria" className="text-link">
          {t("home.goGallery")}
        </Link>
      </section>
    </>
  );
}

