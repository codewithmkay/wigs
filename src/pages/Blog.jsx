import BlogHero from '../components/Blog/BlogHero'
import BlogFeatured from '../components/Blog/BlogFeatured'
import BlogGrid from '../components/Blog/BlogGrid'

export default function Blog() {
  return (
    <main className="bl">
      <BlogHero />
      <BlogFeatured />
      <BlogGrid />
    </main>
  )
}