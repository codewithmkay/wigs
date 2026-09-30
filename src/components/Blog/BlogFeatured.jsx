import { posts } from './BlogData'

export default function BlogFeatured() {
  const post = posts.find((x) => x.featured) || posts[0]

  return (
    <section className="bl-feature">
      <div className="bl-feature-img">
        <img src={post.image} alt={post.title} />
        <span className="bl-feature-no">01</span>
      </div>

      <article className="bl-feature-copy">
        <span className="bl-eye">{post.category}</span>

        <h2>{post.title}</h2>

        <p>{post.excerpt}</p>

        <div className="bl-meta">
          <time>{post.date}</time>
          <span>Featured story</span>
        </div>
      </article>
    </section>
  )
}