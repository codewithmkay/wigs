import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { posts } from './blogData'
import BlogCard from './BlogCard'

export default function BlogGrid() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.from('.bl-section-head', {
          y: 20,
          opacity: 0,
          duration: .7,
          scrollTrigger: {
            trigger: '.bl-section-head',
            start: 'top 85%',
          },
        })

        gsap.from('.bl-card', {
          y: 30,
          opacity: 0,
          duration: .7,
          stagger: .08,
          scrollTrigger: {
            trigger: '.bl-grid',
            start: 'top 85%',
          },
        })
      }, root)

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="bl-section" ref={root}>
      <div className="bl-section-head">
        <div>
          <span className="bl-eye">FROM THE JOURNAL</span>
          <h2>Latest stories</h2>
        </div>

        <p>
          A little knowledge goes a long way when it comes
          to choosing and caring for your wig.
        </p>
      </div>

      <div className="bl-grid">
        {posts.slice(1).map((post, i) => (
          <BlogCard
            key={post.id}
            post={post}
            index={i}
          />
        ))}
      </div>
    </section>
  )
}