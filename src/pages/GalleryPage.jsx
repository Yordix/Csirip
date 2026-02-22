import { useThemeData } from "../context/ThemeContext";
import { useI18n } from "../context/I18nContext";

export default function GalleryPage() {
  const { siteData } = useThemeData();
  const { t } = useI18n();

  return (
    <section className="container section">
      <h1>{t("gallery.title")}</h1>
      <p>{t("gallery.subtitle")}</p>

      <div className="gallery-grid">
        {siteData.gallery.map((item) => (
          <figure key={item.id} className="media-card">
            <img src={item.imageUrl} alt={item.title} />
            <figcaption>{item.title}</figcaption>
          </figure>
        ))}
      </div>

      <article className="card video-placeholder">
        <h3>{t("gallery.videoTitle")}</h3>
        <p>{t("gallery.videoText")}</p>
      </article>
    </section>
  );
}
