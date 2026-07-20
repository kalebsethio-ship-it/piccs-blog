import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArticleBySlug, getAllSlugs } from "@/lib/articles";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Not Found" };
  const meta = article.meta;
  const image = (meta as any).image || (meta as any).featured_image || "https://piccreativespace.id/wp-content/uploads/2022/11/DSCF3550-1024x682.png";

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [image],
      imageAlt: meta.title,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { meta, content } = article;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    author: {
      "@type": "Organization",
      name: "PIC Creative Space",
      url: "https://piccreativespace.id",
    },
    publisher: {
      "@type": "Organization",
      name: "PIC Creative Space",
      logo: {
        "@type": "ImageObject",
        url: "https://blog.piccreativespace.id/logo-piccs-white.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://blog.piccreativespace.id/${slug}`,
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-piccs-gray hover:text-piccs-neon transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        Back to Blog
      </Link>

      {/* Article Header */}
      <header className="mb-10">
        {/* Featured Image */}
      {(meta as any).image || (meta as any).featured_image ? (
        <div className="mb-10 rounded-2xl overflow-hidden border border-piccs-border/50">
          <Image
            src={(meta as any).image || (meta as any).featured_image}
            alt={meta.title}
            width={1200}
            height={630}
            className="w-full h-64 sm:h-80 md:h-96 object-cover"
          />
        </div>
      ) : null}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold uppercase tracking-wider text-piccs-neon bg-piccs-neon/10 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
          {meta.title}
        </h1>

        <p className="text-lg text-piccs-gray mb-4">
          {meta.description}
        </p>

        <div className="flex items-center gap-3 text-sm text-piccs-gray">
          <span>{meta.date}</span>
          <span className="w-1 h-1 rounded-full bg-piccs-border"></span>
          <span>{meta.readingTime}</span>
        </div>
      </header>

      {/* Divider */}
      <div className="border-t border-piccs-border mb-10"></div>

      {/* Article Content */}
      <article className="article-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </article>

      {/* CTA Section */}
      <div className="border-t border-piccs-border mt-12 pt-10">
        <div className="bg-piccs-card border border-piccs-border rounded-2xl p-6 sm:p-8 text-center">
          <img
            src="/logo-piccs-inline.png"
            alt="PIC Creative Space"
            className="h-10 w-auto mx-auto mb-4 opacity-60"
          />
          <h3 className="text-xl font-bold text-white mb-2 font-display">
            Tertarik bikin event di PIC Creative Space?
          </h3>
          <p className="text-piccs-gray text-sm mb-6">
            Hubungi kami buat survey dan booking — GRATIS!
          </p>
          <a
            href="https://wa.me/62817731137"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-piccs-neon text-piccs-black font-semibold rounded-lg hover:bg-piccs-neon-dark transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
