export default function BlogCard({ post, index }) {
  return (
    <article className="bl-card">
      <div className="bl-card-img">
        <img src={post.image} alt={post.title} loading="lazy" />
        <span>0{index + 2}</span>
      </div>

      <div className="bl-card-body">
        <div className="bl-card-top">
          <span>{post.category}</span>
          <time>{post.date}</time>
        </div>

        <h3>{post.title}</h3>

        <p>{post.excerpt}</p>

        <button className="bl-read" type="button">
          Read story
          <b>↗</b>
        </button>
      </div>
    </article>
  )
}