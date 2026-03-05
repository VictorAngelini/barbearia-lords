import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-[#111] border-b border-yellow-500/20 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-yellow-500 text-2xl">✂</span>
          <span className="text-white font-bold text-xl tracking-wide">Lords</span>
        </Link>
        <div className="flex gap-6">
          {[
            { to: '/', label: 'Início' },
            { to: '/agendar', label: 'Agendar' },
            { to: '/admin', label: 'Admin' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium transition-colors ${
                location.pathname === to
                  ? 'text-yellow-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
              {location.pathname === to && (
                <motion.div
                  layoutId="underline"
                  className="h-0.5 bg-yellow-500 mt-1"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
