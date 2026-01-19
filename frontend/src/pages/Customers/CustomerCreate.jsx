import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import AppShell from "../../components/AppShell";

export default function CustomerCreate() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError("");
      const res = await api.post("/customers", { name });
      navigate(`/customers/${res.data?.id || ""}`);
    } catch (err) {
      setError(err?.response?.data?.error || "Müşteri oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Yeni Müşteri"
      subtitle="Klinik kayıtlarına yeni hasta sahibi ekleyin."
    >
      <div className="max-w-2xl">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-center">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6"
        >
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-2">
              Müşteri Adı Soyadı
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Örn: Ayşe Demir"
              className="block w-full rounded-2xl bg-slate-50 border-transparent px-4 py-3 text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none border"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="px-4 py-2.5 rounded-2xl text-sm font-bold border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-white transition-all"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-70"
            >
              {loading ? "Kaydediliyor..." : "Müşteri Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
