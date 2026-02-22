import { useEffect, useMemo, useState } from "react";
import { getRelaxItems } from "../api/client";
import { useI18n } from "../context/I18nContext";

const tags = ["aktiv", "passziv", "termeszet", "epiteszet", "jatek"];

export default function RelaxPage() {
  const { t } = useI18n();
  const [activeTag, setActiveTag] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getRelaxItems(activeTag)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [activeTag]);

  const label = useMemo(
    () => (activeTag ? `${t("relax.filter")}: ${t(`relax.tags.${activeTag}`)}` : t("relax.allItems")),
    [activeTag, t]
  );

  return (
    <section className="container section">
      <h1>{t("relax.title")}</h1>
      <p>{t("relax.subtitle")}</p>

      <div className="tag-row">
        <button className={!activeTag ? "tag active" : "tag"} onClick={() => setActiveTag("")}>
          {t("relax.all")}
        </button>
        {tags.map((tag) => (
          <button key={tag} className={activeTag === tag ? "tag active" : "tag"} onClick={() => setActiveTag(tag)}>
            {t(`relax.tags.${tag}`)}
          </button>
        ))}
      </div>

      <p className="muted">{label}</p>

      {loading ? (
        <p>{t("common.loading")}</p>
      ) : (
        <div className="card-row three-col">
          {items.map((item) => (
            <article className="card" key={item.id}>
              <img src={item.imageUrl} alt={item.title} className="card-image" />
              <p className="eyebrow">{t(`relax.tags.${item.tag}`)}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
