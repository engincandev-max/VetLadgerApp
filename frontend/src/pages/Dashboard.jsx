import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";


import api from "../lib/api";
import AppShell from "../components/AppShell";

const StatCard = ({ label, value, helper }) => (
  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
    <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
      {label}
    </div>
    <div className="text-3xl font-black text-slate-900 mt-3">{value}</div>
    {helper && <div className="text-xs text-slate-400 font-semibold mt-2">{helper}</div>}
  </div>
);

const EmptyCard = ({ title, description }) => (
  <div className="bg-white rounded-[2rem] border border-dashed border-slate-200 p-8 text-center">
    <div className="text-sm font-bold text-slate-900">{title}</div>
    <p className="text-xs text-slate-400 font-medium mt-2">{description}</p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([
          api.get("/transactions/stats"),
          api.get("/transactions/recent", { params: { limit: 6 } }),
        ]);
        setStats(statsRes.data);
        setRecent(recentRes.data || []);
      } catch (err) {
        setError(err?.response?.data?.error || "Dashboard verileri alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const formattedReceivable = useMemo(() => {
    const total = Number(stats?.totalReceivables || 0);
    return `₺${total.toLocaleString("tr-TR")}`;
  }, [stats]);

  return (
    <AppShell
      title="Genel Bakış"
      subtitle="Kliniğinizin güncel finansal özetini ve müşteri hareketlerini takip edin."
      actions={
        <Link
          to="/transactions/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          Yeni İşlem
        </Link>
      }
    >
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-center">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <StatCard
          label="Toplam Alacak"
          value={loading ? "..." : formattedReceivable}
          helper="Müşteri bakiye toplamı"
        />
        <StatCard
          label="Toplam Müşteri"
          value={loading ? "..." : `${stats?.customerCount ?? 0}`}
          helper="Aktif + bekleyen müşteri sayısı"
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm font-bold text-slate-900">Son İşlemler</div>
              <div className="text-xs text-slate-400 font-semibold">En güncel hareketler</div>
            </div>
            <Link
              to="/transactions"
              className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl"
            >
              Tümünü Gör
            </Link>
          </div>
          <div className="space-y-4">
            {loading && (
              <div className="text-sm text-slate-400">Yükleniyor...</div>
            )}
            {!loading && recent.length === 0 && (
              <EmptyCard
                title="Henüz işlem yok"
                description="Yeni bir tahsilat veya ödeme girişi yaptığınızda burada görünecek."
              />
            )}
            {!loading &&
              recent.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-slate-50/70"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {transaction.description || "İşlem"}
                    </div>
                    <div className="text-xs text-slate-400 font-semibold">
                      {transaction.created_at
                        ? new Date(transaction.created_at).toLocaleDateString("tr-TR")
                        : "Tarih belirtilmedi"}
                    </div>
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    ₺{Number(transaction.amount || 0).toLocaleString("tr-TR")}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
            <div className="text-sm font-bold text-slate-900">Hızlı Aksiyonlar</div>
            <p className="text-xs text-slate-400 font-semibold mt-2">
              Müşteri yönetimini tek merkezden yönetin.
            </p>
            <div className="mt-5 space-y-3">
              <Link
                to="/customers/new"
                className="w-full text-left px-4 py-3 rounded-2xl bg-slate-50 text-sm font-bold text-slate-600 hover:bg-white hover:shadow-sm transition-all"
              >
                + Yeni Müşteri Oluştur
              </Link>
              <Link
                to="/transactions/new?type=odeme"
                className="w-full text-left px-4 py-3 rounded-2xl bg-slate-50 text-sm font-bold text-slate-600 hover:bg-white hover:shadow-sm transition-all"
              >
                + Tahsilat Girişi
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
            <div className="text-sm font-bold text-slate-900">Durum Özeti</div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Veri Senkronu</span>
                <span className="text-emerald-500">Aktif</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>API Bağlantısı</span>
                <span className="text-indigo-600">Bağlı</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
