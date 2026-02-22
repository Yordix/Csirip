import { useEffect, useState } from "react";
import { deleteAdminImage, getAdminImages, uploadAdminImage } from "../api/client";
import { useI18n } from "../context/I18nContext";

function formatSize(size) {
  if (!size) return "0 KB";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export default function AdminImagesPage() {
  const { t } = useI18n();
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingPath, setDeletingPath] = useState("");

  async function loadImages() {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAdminImages(token);
      setImages(Array.isArray(data) ? data : []);
      setStatus("");
    } catch (err) {
      setStatus(`${t("common.errorPrefix")} ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function onUpload(event) {
    event.preventDefault();
    const formEl = event.currentTarget;
    if (!selectedFile) {
      setStatus(t("adminImages.selectError"));
      return;
    }

    const token = localStorage.getItem("admin_token");
    if (!token) return;

    setUploading(true);
    try {
      await uploadAdminImage(token, selectedFile);
      setSelectedFile(null);
      formEl.reset();
      setStatus(t("adminImages.successUpload"));
      await loadImages();
    } catch (err) {
      setStatus(`${t("common.errorPrefix")} ${err.message}`);
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(imagePath) {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    if (!window.confirm(t("adminImages.deleteConfirm"))) {
      return;
    }

    setDeletingPath(imagePath);
    try {
      await deleteAdminImage(token, imagePath);
      setStatus(t("adminImages.successDelete"));
      await loadImages();
    } catch (err) {
      setStatus(`${t("common.errorPrefix")} ${err.message}`);
    } finally {
      setDeletingPath("");
    }
  }

  return (
    <div className="admin-page">
      <h1>{t("adminImages.title")}</h1>

      <form className="admin-card form" onSubmit={onUpload}>
        <h3>{t("adminImages.uploadTitle")}</h3>
        <label>
          {t("adminImages.fileLabel")}
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
          />
        </label>
        <button type="submit" className="admin-btn" disabled={uploading}>
          {uploading ? t("adminImages.uploading") : t("adminImages.uploadAction")}
        </button>
        {status && <p>{status}</p>}
      </form>

      <section className="admin-card">
        <h3>{t("adminImages.savedTitle")}</h3>
        {loading ? <p>{t("common.loading")}</p> : null}
        {!loading && images.length === 0 ? <p>{t("adminImages.empty")}</p> : null}
        <div className="admin-image-grid">
          {images.map((image) => (
            <article key={image.id} className="admin-image-card">
              <img src={image.publicUrl} alt={image.name} loading="lazy" />
              <div>
                <strong>{image.name}</strong>
                <p>{formatSize(image.size)}</p>
                <p>{image.createdAt ? new Date(image.createdAt).toLocaleString("hu-HU") : "-"}</p>
                <button
                  type="button"
                  className="admin-btn admin-btn-danger"
                  onClick={() => onDelete(image.path)}
                  disabled={deletingPath === image.path}
                >
                  {deletingPath === image.path ? t("adminImages.deleting") : t("adminImages.deleteAction")}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
