import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export default function CustomerList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setError("");
        const res = await api.get("/customers");
        setCustomers(res.data || []);

        const balanceEntries = await Promise.all(
          (res.data || []).map(async (customer) => {
            try {
              const balanceRes = await api.get("/transactions/balance", {
                params: { customerId: customer.id },
              });
              return [customer.id, balanceRes.data?.balance ?? 0];
            } catch (err) {
              return [customer.id, null];
            }
          })
        );

        setBalances(Object.fromEntries(balanceEntries));
      } catch (err) {
        setError(err?.response?.data?.error || "Müşteriler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return customers;
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(normalized) ||
        String(customer.id).includes(normalized)
    );
  }, [customers, searchTerm]);

  return (
    <AppShell
      title="Müşteri Rehberi"
      subtitle="Kayıtlı tüm hasta sahipleri ve bakiye durumlarını yönetin."
      actions={
        <>
          <div className="relative">
            <input
              type="text"
              placeholder="Müşteri ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-64 transition-all"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Link
            to="/customers/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            + Yeni Müşteri
          </Link>
        </>
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
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Müşteri Bilgisi
              </th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                İletişim
              </th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Durum
              </th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                Bakiye
              </th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredCustomers.map((customer) => {
              const balance = balances[customer.id];
              const isDebt = typeof balance === "number" && balance > 0;
              return (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{customer.name}</div>
                        <div className="text-xs text-slate-400 font-medium">ID: {customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-slate-600 text-sm font-medium">
                    {customer.phone || "Girilmemiş"}
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={customer.status} />
                  </td>
                  <td className={`px-8 py-5 text-right font-black ${isDebt ? "text-red-500" : "text-slate-900"}`}>
                    {balance === null || balance === undefined
                      ? "—"
                      : `₺${Math.abs(balance).toLocaleString("tr-TR")}`}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => navigate(`/customers/${customer.id}`)}
                      className="p-2 hover:bg-white rounded-xl hover:shadow-sm border border-transparent hover:border-slate-100 transition-all text-slate-400 hover:text-indigo-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && !loading && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-medium">Aradığınız kriterlere uygun müşteri bulunamadı.</p>
          </div>
        )}

        {loading && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-medium">Müşteriler yükleniyor...</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
