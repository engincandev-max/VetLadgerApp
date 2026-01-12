import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LogoMark = () => (
  <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 transform -rotate-3">
    <span className="text-white font-black text-xl italic">V</span>
  </div>
);

const navLinkStyles = ({ isActive }) =>
  `px-4 py-2 rounded-xl text-sm font-bold transition-all ${
    isActive
      ? "bg-white text-indigo-600 shadow-sm"
      : "text-slate-500 hover:text-slate-900 hover:bg-white/70"
  }`;

export default function AppShell({ title, subtitle, actions, children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[15%] -left-[10%] w-[45%] h-[45%] rounded-full bg-indigo-50 blur-[140px]" />
        <div className="absolute -bottom-[20%] -right-[5%] w-[45%] h-[45%] rounded-full bg-blue-50 blur-[140px]" />
      </div>

      <header className="relative z-10 border-b border-slate-100/80 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <LogoMark />
              <div>
                <div className="text-lg font-black text-slate-900">VetLedger</div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em]">
                  Clinic Suite
                </div>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-2 bg-slate-100/70 rounded-2xl p-1.5">
              <NavLink to="/" className={navLinkStyles}>
                Dashboard
              </NavLink>
              <NavLink to="/customers" className={navLinkStyles}>
                Müşteriler
              </NavLink>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="bg-white/80 border border-slate-100 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
              <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                {(user?.name || "VL")
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {user?.name || "VetLedger Kullanıcısı"}
                </div>
                <div className="text-xs text-slate-400 font-semibold">
                  {user?.role === "vet" ? "Veteriner" : "Müşteri"}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-2xl text-sm font-bold border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-white transition-all"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-slate-500 font-medium mt-1">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>

        {children}
      </main>
    </div>
  );
}
