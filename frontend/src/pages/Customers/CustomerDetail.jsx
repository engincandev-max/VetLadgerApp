import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../lib/api";
import AppShell from "../../components/AppShell";

const StatusBadge = ({ status }) => {
  const map = {
    active: "bg-emerald-50 text-emerald-600",
    pending: "bg-amber-50 text-amber-600",
    blocked: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
        map[status] || "bg-slate-100 text-slate-500"
      }`}
    >
      {status || "bilinmiyor"}
    </span>
  );
};

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const [customerRes, balanceRes, transactionsRes] = await Promise.all([
          api.get(`/customers/${id}`),
          api.get("/transactions/balance", { params: { customerId: id } }),
          api.get("/transactions", { params: { customerId: id, limit: 6 } }),
        ]);
        setCustomer(customerRes.data);
        setBalance(balanceRes.data?.balance ?? 0);
        setTransactions(transactionsRes.data || []);
      } catch (err) {
        setError(err?.response?.data?.error || "Müşteri detayları alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [id]);

  const formattedBalance = useMemo(() => {
    if (balance === null) return "...";
    return `₺${Number(balance).toLocaleString("tr-TR")}`;
  }, [balance]);

  return (
    <AppShell
      title="Müşteri Detayı"
      subtitle="Hasta sahibinin profilini ve finansal hareketlerini görüntüleyin."
      actions={
        <Link
          to="/customers"
          className="px-4 py-2.5 rounded-2xl text-sm font-bold border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-white transition-all"
        >
          ← Listeye Dön
        </Link>
      }
    >
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-center">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg">
                  {(customer?.name || "??")
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900">
                    {loading ? "Yükleniyor..." : customer?.name}
                  </div>
                  <div className="text-xs text-slate-400 font-semibold">
                    ID: {customer?.id || id}
                  </div>
                </div>
              </div>
              <StatusBadge status={customer?.status} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50/70 p-4">
                <div className="text-xs font-semibold text-slate-400">Telefon</div>
                <div className="text-sm font-bold text-slate-900 mt-1">
                  {customer?.phone || "Belirtilmedi"}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-4">
                <div className="text-xs font-semibold text-slate-400">Adres</div>
                <div className="text-sm font-bold text-slate-900 mt-1">
                  {customer?.address || "Belirtilmedi"}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-4">
                <div className="text-xs font-semibold text-slate-400">Davet Kodu</div>
                <div className="text-sm font-bold text-slate-900 mt-1">
                  {customer?.invite_code || "—"}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-4">
                <div className="text-xs font-semibold text-slate-400">Oluşturulma</div>
                <div className="text-sm font-bold text-slate-900 mt-1">
                  {customer?.created_at
                    ? new Date(customer.created_at).toLocaleDateString("tr-TR")
                    : "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm font-bold text-slate-900">Son İşlemler</div>
                <div className="text-xs text-slate-400 font-semibold">Son 6 finansal hareket</div>
              </div>
              <Link
                to={`/transactions/new?customerId=${id}`}
                className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl"
              >
                Yeni İşlem
              </Link>
            </div>
            <div className="space-y-4">
              {loading && <div className="text-sm text-slate-400">Yükleniyor...</div>}
              {!loading && transactions.length === 0 && (
                <div className="text-sm text-slate-400">Henüz işlem yok.</div>
              )}
              {!loading &&
                transactions.map((transaction) => (
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
                          : "Tarih yok"}
                      </div>
                    </div>
                    <div className="text-sm font-black text-slate-900">
                      ₺{Number(transaction.amount || 0).toLocaleString("tr-TR")}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Bakiye Durumu
            </div>
            <div className="text-3xl font-black text-slate-900 mt-4">{formattedBalance}</div>
            <p className="text-xs text-slate-400 font-semibold mt-2">
              Pozitif değer alacak, negatif değer borç anlamına gelir.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
            <div className="text-sm font-bold text-slate-900">Hızlı Notlar</div>
            <p className="text-xs text-slate-400 font-semibold mt-2">
              Bu alanı müşteri özel notları için kullanabilirsiniz.
            </p>
            <div className="mt-4 rounded-2xl bg-slate-50/70 p-4 text-xs text-slate-500">
              {customer?.address
                ? "Adres bilgisi güncel görünüyor."
                : "Adres bilgisi eksik. Kaydı güncelleyebilirsiniz."}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
