import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const IconLock = (props) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);

const IconUser = (props) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const { loginVet, loginCustomer } = useAuth();

  const [mode, setMode] = useState("vet");
  const [password, setPassword] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      if (mode === "vet") {
        await loginVet({ password });
      } else {
        await loginCustomer({ customerId });
      }
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || "Giriş bilgileri hatalı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-[#f8fafc]">
      {/* Hafif Arkaplan Desenleri */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-50 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-50 blur-[120px]" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Beyaz Kart Yapısı */}
        <div className="bg-white px-8 py-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-[2rem]">
          
          <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-10">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 transform -rotate-3">
              <span className="text-white font-black text-2xl italic">V</span>
            </div>
            <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
              VetLedger'a Hoş Geldiniz
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500 font-medium">
              Devam etmek için giriş yapın
            </p>
          </div>

          {/* Segmented Control (Açık Tema) */}
          <div className="flex p-1.5 bg-slate-100/80 rounded-2xl mb-8">
            <button
              onClick={() => setMode("vet")}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${
                mode === "vet" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Veteriner
            </button>
            <button
              onClick={() => setMode("customer")}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${
                mode === "customer" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Müşteri
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-2">
                {mode === "vet" ? "Klinik Şifresi" : "Müşteri Numarası"}
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  {mode === "vet" ? <IconLock className="h-5 w-5" /> : <IconUser className="h-5 w-5" />}
                </div>
                <input
                  type={mode === "vet" ? "password" : "text"}
                  required
                  value={mode === "vet" ? password : customerId}
                  onChange={(e) => mode === "vet" ? setPassword(e.target.value) : setCustomerId(e.target.value)}
                  placeholder={mode === "vet" ? "••••••••" : "Örn: 10245"}
                  className="block w-full rounded-2xl bg-slate-50 border-transparent pl-12 pr-4 py-3 text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none border"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-[0.98] shadow-lg shadow-indigo-100 disabled:opacity-70"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Giriş Yap"
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-10 text-center text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
          Powered by VetLedger Cloud v1.0
        </p>
      </div>
    </div>
  );
}