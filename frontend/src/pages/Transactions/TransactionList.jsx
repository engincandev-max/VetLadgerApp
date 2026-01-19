import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import AppShell from "../../components/AppShell";

const TypeBadge = ({ type }) => {
  const map = {
    borc: "bg-red-50 text-red-600",
    odeme: "bg-emerald-50 text-emerald-600",
  };

  return (
    <span
      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
        map[type] || "bg-slate-100 text-slate-500"
      }`}
    >
      {type === "borc" ? "Borç" : type === "odeme" ? "Ödeme" : "Bilinmiyor"}
    </span>
  );
};

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setError("");
        const res = await api.get("/transactions", { params: { limit: 50 } });
        setTransactions(res.data || []);
      } catch (err) {
        setError(err?.response?.data?.error || "İşlemler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <AppShell
      title="İşlemler"
      subtitle="Son finansal hareketlerinizi listeleyin ve yönetin."
      actions={
        <Link
          to="/transactions/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          + Yeni İşlem
        </Link>
      }
    >
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-center">
          {error}
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Müşteri</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Açıklama</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Tip</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Tutar</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Tarih</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5 text-sm font-bold text-slate-900">
                  {transaction.customer_name || `#${transaction.customer_id}`}
                </td>
                <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                  {transaction.description || "—"}
                </td>
                <td className="px-8 py-5">
                  <TypeBadge type={transaction.type} />
                </td>
                <td className="px-8 py-5 text-right font-black text-slate-900">
                  ₺{Number(transaction.amount || 0).toLocaleString("tr-TR")}
                </td>
                <td className="px-8 py-5 text-right text-xs font-semibold text-slate-400">
                  {transaction.created_at
                    ? new Date(transaction.created_at).toLocaleDateString("tr-TR")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && transactions.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-medium">Henüz işlem bulunamadı.</p>
          </div>
        )}

        {loading && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-medium">İşlemler yükleniyor...</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
