import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low w-full py-12 border-t border-surface-container">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto space-y-6 md:space-y-0">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-headline font-extrabold text-on-surface text-xl">
            하루한답
          </span>
          <p className="font-body text-xs tracking-wide uppercase text-on-surface-variant/60 mt-1">
            &copy; 2025 HaruHandap. 매일 한 문제, 꾸준한 면접 준비.
          </p>
        </div>
        <div className="flex gap-8 items-center">
          <Link
            to="/"
            className="font-body text-xs tracking-wide uppercase text-on-surface-variant/60 hover:text-primary transition-colors"
          >
            서비스 소개
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs tracking-wide uppercase text-on-surface-variant/60 hover:text-primary transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
