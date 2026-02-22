import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBlogPosts } from "../api/client";
import { useI18n } from "../context/I18nContext";

export default function BlogPage() {
  const { t } = useI18n();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getBlogPosts().then(setPosts);
  }, []);

  return (
    <section className="container section">
      <h1>{t("blog.title")}</h1>
      <div className="card-row three-col">
        {posts.map((post) => (
          <article key={post.id} className="card">
            {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="card-image" />}
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <div className="tag-row inline">
              {post.tags.map((tag) => (
                <span key={tag} className="tag static">
                  {tag}
                </span>
              ))}
            </div>
            <Link to={`/blog/${post.slug}`} className="text-link">
              {t("blog.more")}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
