export default function Footer() {
  return (
    <footer className="border-t border-piccs-border bg-piccs-black mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <img
              src="/logo-piccs-white.png"
              alt="PIC Creative Space"
              className="h-9 w-auto mb-3"
            />
            <p className="text-sm text-piccs-gray leading-relaxed max-w-xs">
              Creative Event Space di Jakarta. Wisma Staco, Tebet, Jakarta Selatan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigasi
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="https://piccreativespace.id" className="text-sm text-piccs-gray hover:text-piccs-neon transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="https://piccreativespace.id/our-space" className="text-sm text-piccs-gray hover:text-piccs-neon transition-colors">
                  Our Space
                </a>
              </li>
              <li>
                <a href="https://piccreativespace.id/contact" className="text-sm text-piccs-gray hover:text-piccs-neon transition-colors">
                  Kontak
                </a>
              </li>
              <li>
                <a href="https://blog.piccreativespace.id" className="text-sm text-piccs-neon transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Kontak
            </h3>
            <ul className="space-y-2.5">
              <li className="text-sm text-piccs-gray">
                <span className="text-piccs-muted">WA:</span>{' '}
                <a href="https://wa.me/62817731137" className="hover:text-piccs-neon transition-colors">+62817731137</a>
              </li>
              <li className="text-sm text-piccs-gray">
                <span className="text-piccs-muted">Email:</span>{' '}
                <a href="mailto:info@piccreativespace.id" className="hover:text-piccs-neon transition-colors">info@piccreativespace.id</a>
              </li>
              <li className="text-sm text-piccs-gray">
                <span className="text-piccs-muted">IG:</span>{' '}
                <a href="https://instagram.com/piccreativespace" target="_blank" rel="noopener noreferrer" className="hover:text-piccs-neon transition-colors">@piccreativespace</a>
              </li>
              <li className="text-sm text-piccs-gray">
                <span className="text-piccs-muted">TikTok:</span>{' '}
                <a href="https://tiktok.com/@piccreativespace" target="_blank" rel="noopener noreferrer" className="hover:text-piccs-neon transition-colors">@piccreativespace</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-piccs-border/50 mt-8 pt-8 text-center">
          <p className="text-xs text-piccs-muted">
            &copy; {new Date().getFullYear()} PT. Pilar Inspirasi Citra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
