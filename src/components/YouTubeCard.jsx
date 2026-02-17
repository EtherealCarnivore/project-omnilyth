const CHANNEL_URL = 'https://www.youtube.com/@Iva_m1';
const CHANNEL_NAME = 'Iva';
const CHANNEL_HANDLE = '@Iva_m1';
const BANNER_URL = 'https://yt3.googleusercontent.com/ryFauGNsarG1c-pX7vgK1WIAGjmOcHOyUqE09DcJlAZ0w1w7B3QkFufgOptQSxKRTvyO9lXHZg=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj';
const AVATAR_URL = 'https://yt3.googleusercontent.com/_lzsI2gEgcOiuwp8V5zirNrkFrOB16KTMQwjUTvX4BihEL39hnfkQ_26ACQx6uKcnlUBRF2Trg=s160-c-k-c0x00ffffff-no-rj';

export default function YouTubeCard() {
  return (
    <div className="max-w-md mx-auto mt-8 mb-4">
      <p className="text-2xl text-center mb-3">ᛃ IV ᛃ</p>
      <a
        href={CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl overflow-hidden border border-white/[0.08] bg-zinc-900/40 hover:border-red-500/40 transition-all duration-200 group"
      >
        {/* Banner */}
        <div className="h-20 sm:h-24 overflow-hidden bg-gradient-to-r from-red-900/40 via-zinc-900/40 to-red-900/40">
          <img
            src={BANNER_URL}
            alt=""
            className="w-full h-full object-cover"
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* Profile section */}
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800/60 shrink-0">
            <img
              src={AVATAR_URL}
              alt={CHANNEL_NAME}
              className="w-full h-full object-cover"
              onError={e => {
                const parent = e.target.parentElement;
                e.target.style.display = 'none';
                // Safe DOM manipulation - no XSS risk
                const fallback = document.createElement('div');
                fallback.className = 'w-full h-full flex items-center justify-center text-lg font-bold text-red-400 bg-zinc-800/60';
                fallback.textContent = CHANNEL_NAME[0]; // textContent is safe, not innerHTML
                parent.appendChild(fallback);
              }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-zinc-100 font-semibold text-sm truncate">{CHANNEL_NAME}</p>
            <p className="text-zinc-400 text-xs">{CHANNEL_HANDLE}</p>
          </div>

          <span className="shrink-0 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-semibold group-hover:bg-red-500 transition-colors">
            Subscribe
          </span>
        </div>
      </a>
      <p className="text-2xl text-center mt-3">❤️</p>
    </div>
  );
}
