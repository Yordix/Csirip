import { useEffect, useState } from "react";
import { createBlogPost, getSiteData, updateSiteMeta, updateTheme } from "../api/client";
import { useI18n } from "../context/I18nContext";

export default function AdminContentPage() {
  const { t } = useI18n();
  const [theme, setTheme] = useState({
    primary: "#2d5a4a",
    secondary: "#f2efe6",
    accent: "#d97b2b",
    background: "#f8f5ef",
    text: "#1f2926"
  });
  const [siteName, setSiteName] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    getSiteData().then((data) => {
      setTheme(data.theme);
      setSiteName(data.site.name);
    });
  }, []);

  async function submitTheme(event) {
    event.preventDefault();
    const token = localStorage.getItem("admin_token");

    try {
      await updateTheme(token, theme);
      setStatus(t("adminContent.successTheme"));
    } catch (err) {
      setStatus(`${t("common.errorPrefix")} ${err.message}`);
    }
  }

  async function submitSiteMeta(event) {
    event.preventDefault();
    const token = localStorage.getItem("admin_token");

    try {
      await updateSiteMeta(token, { name: siteName });
      setStatus(t("adminContent.successSite"));
    } catch (err) {
      setStatus(`${t("common.errorPrefix")} ${err.message}`);
    }
  }

  async function submitBlog(event) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const token = localStorage.getItem("admin_token");
    const formData = new FormData(formEl);

    const payload = {
      title: String(formData.get("title") || ""),
      excerpt: String(formData.get("excerpt") || ""),
      content: String(formData.get("content") || ""),
      tags: String(formData.get("tags") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      imageUrl: String(formData.get("imageUrl") || ""),
      featured: formData.get("featured") === "on"
    };

    try {
      await createBlogPost(token, payload);
      setStatus(t("adminContent.successPost"));
      formEl.reset();
    } catch (err) {
      setStatus(`${t("common.errorPrefix")} ${err.message}`);
    }
  }

  return (
    <div className="admin-page">
      <h1>{t("adminContent.title")}</h1>

      <div className="admin-grid-2">
        <form className="admin-card form" onSubmit={submitTheme}>
          <h3>{t("adminContent.themeTitle")}</h3>
          <label>
            {t("adminContent.primary")}
            <input value={theme.primary} onChange={(e) => setTheme({ ...theme, primary: e.target.value })} />
          </label>
          <label>
            {t("adminContent.secondary")}
            <input value={theme.secondary} onChange={(e) => setTheme({ ...theme, secondary: e.target.value })} />
          </label>
          <label>
            {t("adminContent.accent")}
            <input value={theme.accent} onChange={(e) => setTheme({ ...theme, accent: e.target.value })} />
          </label>
          <label>
            {t("adminContent.background")}
            <input value={theme.background} onChange={(e) => setTheme({ ...theme, background: e.target.value })} />
          </label>
          <label>
            {t("adminContent.text")}
            <input value={theme.text} onChange={(e) => setTheme({ ...theme, text: e.target.value })} />
          </label>
          <button className="admin-btn" type="submit">
            {t("common.save")}
          </button>
        </form>

        <form className="admin-card form" onSubmit={submitSiteMeta}>
          <h3>{t("adminContent.siteTitle")}</h3>
          <label>
            {t("adminContent.siteName")}
            <input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
          </label>
          <button className="admin-btn" type="submit">
            {t("common.save")}
          </button>
        </form>
      </div>

      <form className="admin-card form" onSubmit={submitBlog}>
        <h3>{t("adminContent.newPost")}</h3>
        <input name="title" placeholder={t("adminContent.postTitle")} required />
        <input name="excerpt" placeholder={t("adminContent.postExcerpt")} required />
        <textarea name="content" rows="6" placeholder={t("adminContent.postContent")} required />
        <input name="tags" placeholder={t("adminContent.postTags")} />
        <input name="imageUrl" placeholder={t("adminContent.postImage")} />
        <label>
          <input type="checkbox" name="featured" /> {t("adminContent.postFeatured")}
        </label>
        <button className="admin-btn" type="submit">
          {t("adminContent.savePost")}
        </button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
}
