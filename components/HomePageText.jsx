import { Sora } from 'next/font/google';

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

export default function HeroText() {
  return (
    <h1
      className={`${sora.className} text-center text-5xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]`}
    >
      Swap & Bridge <br />
      <span className="inline-block mt-2 bg-[#E0E7FF] text-slate-900 px-4 pt-1 pb-2 rounded-md">
        with LI.FI.
      </span>
    </h1>
  );
}