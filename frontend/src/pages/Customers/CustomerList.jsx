import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import api from '../../services/api'; 

export default function CustomerList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Backend: customerController.getAllCustomers
        // const res = await api.get('/customers');
        // setCustomers(res.data);
        
        // Tasarımı görmen için örnek veri:
        setCustomers([
          { id: 'C101', name: 'Ahmet Yılmaz', phone: '0532...', balance: 1250 },
          { id: 'C102', name: 'Ayşe Demir', phone: '0544...', balance: -300 },
          { id: 'C103', name: 'Mehmet Öz', phone: '0505...', balance: 0 },
        ]);
      } catch (err) {
        console.error("Müşteriler yüklenemedi", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Üst Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Müşteri Rehberi</h1>
            <p className="text-slate-500 font-medium mt-1">Kayıtlı tüm hasta sahipleri ve bakiye durumları.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <input 
                type="text"
                placeholder="Müşteri ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-64 transition-all"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95">
              + Yeni Müşteri
            </button>
          </div>
        </div>

        {/* Müşteri Tablosu */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Müşteri Bilgisi</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">İletişim</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Durum</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Bakiye</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{customer.name}</div>
                        <div className="text-xs text-slate-400 font-medium">ID: {customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-slate-600 text-sm font-medium">
                    {customer.phone || 'Girilmemiş'}
                  </td>
                  <td className="px-8 py-5">
                    {customer.balance > 0 ? (
                      <span className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-black uppercase">Borçlu</span>
                    ) : customer.balance < 0 ? (
                      <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">Alacaklı</span>
                    ) : (
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-black uppercase">Dengede</span>
                    )}
                  </td>
                  <td className={`px-8 py-5 text-right font-black ${customer.balance > 0 ? 'text-red-500' : 'text-slate-900'}`}>
                    ₺{Math.abs(customer.balance).toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => navigate(`/customers/${customer.id}`)}
                      className="p-2 hover:bg-white rounded-xl hover:shadow-sm border border-transparent hover:border-slate-100 transition-all text-slate-400 hover:text-indigo-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCustomers.length === 0 && !loading && (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-medium">Aradığınız kriterlere uygun müşteri bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}