/** Inline error banner — used by /dashboard when the API is unreachable */
export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-7xl px-8 py-20 flex flex-col items-center gap-6 text-center md:px-14">
      {/* Pulsing indicator */}
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF3831] opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF3831]" />
      </span>
      <div>
        <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.5em] text-white/25">
          System Status · Data Pipeline
        </p>
        <p className="font-serif text-2xl font-black text-white">
          AWAITING BACKEND CONNECTION
        </p>
        <p className="mt-3 font-mono text-[10px] leading-relaxed text-white/30 max-w-sm mx-auto">
          The SPECTRAVEIN intelligence pipeline is unreachable.
          Ensure the FastAPI server is running on{' '}
          <span className="text-white/50">
            {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
          </span>
        </p>
        <p className="mt-2 font-mono text-[9px] text-white/20">ERR: {message}</p>
      </div>
    </div>
  );
}
