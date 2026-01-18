import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../lib/api";
import AppShell from "../../components/AppShell";

const typeOptions = [
  { value: "borc", label: "Borç" },
  { value: "odeme", label: "Ödeme" },
];

export default function TransactionCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("borc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const presetCustomerId = searchParams.get("customerId");
    const presetType = searchParams.get("type");

    if (presetCustomerId) {
      setCustomerId(presetCustomerId);
    }
    if (presetType && typeOptions.some((option) => option.value === presetType)) {
      setType(presetType);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/customers");
        setCustomers(res.data || []);
      } catch (err) {
        setError(err?.response?.data?.error || "Müşteri listesi alınamadı.");
      }
    };

    fetchCustomers();
  }, []);

  const selectedCustomer = useMemo(
    () => customers.find((customer) => String(customer.id) === String(customerId)),
    [customers, customerId]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError("");
      await api.post("/transactions", {
        customerId,
        amount,
        description,
        type,
      });
      navigate("/transactions");
    } catch (err) {
      setError(err?.response?.data?.error || "İşlem oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Yeni İşlem"
      subtitle="Müşteri için borç ya da ödeme işlemi oluşturun."
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
              Müşteri
            </label>
            <select
              required
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
              className="block w-full rounded-2xl bg-slate-50 border-transparent px-4 py-3 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none border"
            >
              <option value="">Seçiniz</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} (#{customer.id})
                </option>
              ))}
            </select>
            {selectedCustomer && (
              <p className="text-xs text-slate-400 font-semibold mt-2">
                Seçilen müşteri: {selectedCustomer.name}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-2">
                İşlem Tipi
              </label>
              <select
                required
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="block w-full rounded-2xl bg-slate-50 border-transparent px-4 py-3 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none border"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-2">
                Tutar (₺)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Örn: 1200"
                className="block w-full rounded-2xl bg-slate-50 border-transparent px-4 py-3 text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none border"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-2">
              Açıklama
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Örn: Doğum müdahalesi"
              className="block w-full rounded-2xl bg-slate-50 border-transparent px-4 py-3 text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none border"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/transactions")}
              className="px-4 py-2.5 rounded-2xl text-sm font-bold border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-white transition-all"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-70"
            >
              {loading ? "Kaydediliyor..." : "İşlem Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
