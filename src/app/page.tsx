import BlogCard from "@/components/BlogCard";
import { getAllArticles } from "@/lib/articles";

export default function Home() {
  const articles = getAllArticles();
  const allTags = [...new Set(articles.flatMap((a) => a.tags))].sort();

  // Show max 8 most relevant tags
  const limitedTags = allTags.slice(0, 8);

  const featured = articles[0] || null;
  const rest = featured ? articles.slice(1) : articles;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* ─── Hero ─── */}
      <div className="mb-10 sm:mb-14">
        <p className="font-display text-sm sm:text-base font-semibold text-piccs-neon uppercase tracking-[0.15em] mb-3">
          PIC Creative Space Blog
        </p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight">
          Inspirasi &amp; Panduan<br />
          <span className="text-piccs-neon">Event di Jakarta</span>
        </h1>
        <p className="mt-4 sm:mt-5 text-piccs-gray text-base sm:text-lg max-w-xl leading-relaxed">
          Tips, inspirasi, dan panduan seputar event, venue, gathering, dan acara kreatif di Jakarta Selatan.
        </p>
        <div className="w-16 h-1 bg-piccs-neon mt-6 rounded-full"></div>
      </div>

      {/* ─── Category Tags ─── */}
      <div className="mb-10">
        <div className="flex flex-wrap gap-2">
          <button className="tag-pill active px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-default">
            Semua
          </button>
          {limitedTags.map((tag) => (
            <button
              key={tag}
              className="tag-pill px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-piccs-gray border border-piccs-border hover:text-white hover:border-piccs-neon/30 transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Articles ─── */}
      {articles.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-piccs-gray text-lg">Belum ada artikel. Nanti Hermes tulisin! 🚀</p>
        </div>
      ) : (
        <>
          {/* Featured */}
          {featured && (
            <div className="mb-8">
              <BlogCard article={featured} featured={true} />
            </div>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <>
              <div className="border-t border-piccs-border/50 my-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {rest.map((article) => (
                  <BlogCard key={article.slug} article={article} />
                ))}
              </div>
            </>
          )}

          <div className="text-center mt-12">
            <p className="text-piccs-muted text-sm">
              {articles.length} artikel · akan ada lagi minggu depan ✨
            </p>
          </div>
        </>
      )}
    </div>
  );
}
