import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogPost } from "../api/client";
import { useI18n } from "../context/I18nContext";

export default function BlogPostPage() {
  const { t } = useI18n();
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getBlogPost(slug)
      .then(setPost)
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) {
    return <section className="container section">Hiba: {error}</section>;
  }

  if (!post) {
    return <section className="container section">{t("common.loading")}</section>;
  }

  return (
    <article className="container section blog-post">
      <h1>{post.title}</h1>
      <p className="muted">
        {t("blog.published")}: {new Date(post.publishedAt).toLocaleDateString("hu-HU")}
      </p>
      {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="cover" />}
      <p>{post.content}</p>
    </article>
  );
}
