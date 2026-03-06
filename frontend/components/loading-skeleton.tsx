/** Inline error banner — used by /dashboard when the API is unreachable */
export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-7xl px-8 py-16 flex flex-col items-center gap-4 text-center md:px-14">
      <div className="flex h-12 w-12 items-center justify-center border border-red-500/30">
        <span className="font-mono text-lg text-red-400">!</span>
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-red-400">
          API Connection Error
        </p>
        <p className="mt-2 font-mono text-[11px] text-white/25 max-w-sm">{message}</p>
        <p className="mt-1.5 font-mono text-[10px] text-white/15">
          Ensure the FastAPI server is running on{' '}
          <span className="text-white/30">http://localhost:8000</span>
        </p>
      </div>
    </div>
  );
}
