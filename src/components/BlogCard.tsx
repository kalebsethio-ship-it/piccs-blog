import Link from 'next/link';
import Image from 'next/image';

interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
  image?: string;
}

export default function BlogCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  if (featured) {
    return (
      <Link
        href={`/${article.slug}`}
        className="blog-card group block bg-piccs-card border border-piccs-border rounded-2xl overflow-hidden"
      >
        <div className="grid md:grid-cols-5 gap-0">
          {/* Thumbnail — 2 cols */}
          <div className="md:col-span-2 aspect-[4/3] md:aspect-auto bg-gradient-to-br from-piccs-dark via-piccs-card to-piccs-black flex items-center justify-center min-h-[200px] md:min-h-[300px]">
            {article.image ? (
              <Image src={article.image} alt={article.title} width={1200} height={630} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full p-8">
                <Image
                  src="/logo-piccs-white.png"
                  alt="PIC Creative Space"
                  width={240}
                  height={120}
                  className="w-full max-w-[140px] h-auto opacity-15"
                />
              </div>
            )}
          </div>

          {/* Content — 3 cols */}
          <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-3">
              {article.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="tag-pill text-[11px] font-semibold uppercase tracking-wider text-piccs-neon bg-piccs-neon/8 px-2.5 py-1 rounded-md border border-piccs-neon/10">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-piccs-neon transition-colors mb-3 leading-tight">
              {article.title}
            </h2>
            <p className="text-piccs-gray text-sm leading-relaxed mb-4 line-clamp-2">
              {article.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-piccs-muted">
              <span>{article.date}</span>
              <span className="w-1 h-1 rounded-full bg-piccs-border"></span>
              <span>{article.readingTime}</span>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm text-piccs-neon font-medium">
              <span>Baca selengkapnya</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/${article.slug}`}
      className="blog-card group block bg-piccs-card border border-piccs-border rounded-2xl overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="aspect-[16/10] bg-gradient-to-br from-piccs-dark to-piccs-card flex items-center justify-center overflow-hidden">
        {article.image ? (
          <Image src={article.image} alt={article.title} width={1200} height={630} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex items-center justify-center w-full h-full p-6">
            <Image
              src="/logo-piccs-white.png"
              alt="PIC Creative Space"
              width={200}
              height={100}
              className="w-full max-w-[100px] h-auto opacity-10"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {article.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider text-piccs-neon bg-piccs-neon/8 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>

        <h2 className="font-display text-lg font-bold text-white group-hover:text-piccs-neon transition-colors line-clamp-2 mb-2 leading-snug">
          {article.title}
        </h2>

        <p className="text-sm text-piccs-gray line-clamp-2 leading-relaxed mb-3">
          {article.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-piccs-muted">
          <span>{article.date}</span>
          <span className="w-1 h-1 rounded-full bg-piccs-border"></span>
          <span>{article.readingTime}</span>
        </div>
      </div>
    </Link>
  );
}
