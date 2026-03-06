'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

const NAV_LINKS = [
  { href: '/',           label: 'Home' },
  { href: '/dashboard',  label: 'Dashboard' },
  { href: '/analytics',  label: 'Analytics' },
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-8 py-5 md:px-14"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      // Subtle backdrop so nav stays legible over any page content
      style={{ background: 'linear-gradient(to bottom, rgba(24,22,22,0.9) 0%, transparent 100%)' }}
    >
      {/* Logo + wordmark */}
      <Link href="/" className="group flex items-center gap-3">
        <div className="relative h-7 w-7 overflow-hidden rounded-full ring-1 ring-white/10 transition group-hover:ring-white/30">
          <Image src="/logo.png" alt="SPECTRAVEIN" fill className="object-cover" />
        </div>
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-white/60 transition group-hover:text-white">
          SPECTRAVEIN
        </span>
      </Link>

      {/* Nav links */}
      <nav className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map(({ href, label }) => {
          // Exact match for `/`, prefix match for sub-routes
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="group relative font-mono text-[11px] uppercase tracking-widest transition-colors duration-200"
              style={{ color: active ? '#FF3831' : 'rgba(255,255,255,0.3)' }}
            >
              {label}
              {/* Active underline */}
              {active && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-px"
                  style={{ backgroundColor: '#FF3831' }}
                  transition={{ duration: 0.3, ease }}
                />
              )}
              {/* Hover underline (non-active) */}
              {!active && (
                <span className="absolute -bottom-1 left-0 right-0 h-px origin-left scale-x-0 bg-white/30 transition-transform duration-200 group-hover:scale-x-100" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Status pill */}
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/25">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF3831]" />
        <span className="hidden sm:block">System Online</span>
      </div>
    </motion.header>
  );
}
