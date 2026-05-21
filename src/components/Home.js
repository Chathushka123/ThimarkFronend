import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../utils/Common';
import { getPOSummary } from './pages/dashboards/dashboard';

// ─── Formatters ───────────────────────────────────────────────────────────────
const fmt = (n) => Number(n || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtN = (n) => Number(n || 0).toLocaleString('en-LK');

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
};

const formatDate = () =>
    new Date().toLocaleDateString('en-LK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// ─── Module definitions ───────────────────────────────────────────────────────
const MODULE_GROUPS = [
    {
        group: 'Dashboards',
        icon: 'fa-tachometer-alt',
        accent: '#1565c0',
        modules: [
            { label: 'Active PO Dashboard', sub: 'Live view of approved, sent & received POs', to: '/posDashboard', icon: 'fa-shopping-cart', color: '#1565c0', bg: '#e3f2fd' },
            { label: 'Procurement Dashboard', sub: 'Full PO analytics across all statuses', to: '/procuremntDashboard', icon: 'fa-chart-bar', color: '#6a1fb5', bg: '#f3e8ff' },
            { label: 'Inventory', sub: 'View and manage stock levels', to: '/inventory', icon: 'fa-boxes', color: '#37474f', bg: '#eceff1' },
        ],
    },
    {
        group: 'Reports',
        icon: 'fa-chart-line',
        accent: '#b71c1c',
        modules: [
            { label: 'Current Stock', sub: 'Snapshot of current inventory levels', to: '/currentStock', icon: 'fa-table', color: '#b71c1c', bg: '#ffebee' },
            { label: 'Inventory', sub: 'View and manage stock levels', to: '/inventory', icon: 'fa-boxes', color: '#37474f', bg: '#eceff1' },
        ],
    },
];

// ─── KPI card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, icon, accent, loading }) => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '18px 22px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', borderLeft: `4px solid ${accent}`, display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: `${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className={`fas ${icon}`} style={{ color: accent, fontSize: '18px' }}></i>
        </div>
        <div>
            <div style={{ fontSize: '11px', color: '#718096', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '17px', fontWeight: '800', color: '#1a202c', fontFamily: 'monospace' }}>
                {loading ? <span style={{ color: '#cbd5e0' }}>—</span> : value}
            </div>
        </div>
    </div>
);

// ─── Module card ──────────────────────────────────────────────────────────────
const ModuleCard = ({ label, sub, to, icon, color, bg }) => (
    <Link to={to} style={{ textDecoration: 'none' }}>
        <div style={{ background: '#fff', border: '1.5px solid #edf2f7', borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: '14px', transition: 'box-shadow 0.15s, border-color 0.15s, transform 0.1s', cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 6px 20px ${color}22`; e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#edf2f7'; e.currentTarget.style.transform = 'none'; }}
        >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={`fas ${icon}`} style={{ color, fontSize: '15px' }}></i>
            </div>
            <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a202c', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
                <div style={{ fontSize: '11.5px', color: '#718096', lineHeight: 1.4 }}>{sub}</div>
            </div>
            <i className="fas fa-chevron-right" style={{ color: '#cbd5e0', fontSize: '10px', marginLeft: 'auto', flexShrink: 0, alignSelf: 'center' }}></i>
        </div>
    </Link>
);

// ═════════════════════════════════════════════════════════════════════════════
const Home = () => {
    const user = getUser();
    const [kpi, setKpi] = useState(null);
    const [kpiLoading, setKpiLoading] = useState(true);

    useEffect(() => {
        setKpiLoading(true);
        getPOSummary()
            .then((res) => {
                const payload = res?.data ?? res ?? {};
                const pos = Object.values(payload);
                const allPOs = pos.flatMap((s) => s?.po_details || []);
                setKpi({
                    count: pos.reduce((a, s) => a + (s?.no_of_pos || 0), 0),
                    amount: allPOs.reduce((a, p) => a + (p.total_amount?.amount || 0), 0),
                    paid: allPOs.reduce((a, p) => a + (p.paid_amount?.amount || 0), 0),
                    balance: allPOs.reduce((a, p) => a + (p.balance?.amount || 0), 0),
                });
            })
            .catch(() => setKpi(null))
            .finally(() => setKpiLoading(false));
    }, []);

    return (
        <div style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif", background: '#f0f2f8', minHeight: '100vh' }}>

            {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
            <div style={{ background: 'linear-gradient(135deg, #000841 0%, #0d1b8e 100%)', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>
                        <i className="fas fa-calendar-day" style={{ marginRight: '6px' }}></i>{formatDate()}
                    </div>
                    <div style={{ color: '#fff', fontSize: '24px', fontWeight: '800' }}>
                        {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' }}>
                        Welcome back to the PMS — Procurement & Manufacturing System.
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    {user?.role && (
                        <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '4px 14px', color: '#fff', fontSize: '11.5px', fontWeight: '600' }}>
                            <i className="fas fa-user-circle" style={{ marginRight: '6px' }}></i>{user.role}
                        </div>
                    )}
                    <Link to="/dashboard" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '6px', padding: '6px 16px', fontSize: '11.5px', fontWeight: '600', textDecoration: 'none' }}>
                        <i className="fas fa-tachometer-alt" style={{ marginRight: '6px' }}></i>All Dashboards
                    </Link>
                </div>
            </div>

            <div style={{ padding: '24px 32px' }}>

                {/* ── Live KPI Strip ──────────────────────────────────────────────── */}
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ fontSize: '10.5px', fontWeight: '700', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
                        <i className="fas fa-circle" style={{ fontSize: '7px', marginRight: '6px', color: kpiLoading ? '#a0aec0' : '#48bb78' }}></i>
                        Live — Active Purchase Orders (Approved · Sent · Received)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                        <KpiCard label="Active POs" value={fmtN(kpi?.count)} icon="fa-file-alt" accent="#4a5568" loading={kpiLoading} />
                        <KpiCard label="Total PO Value" value={`LKR ${fmt(kpi?.amount)}`} icon="fa-coins" accent="#1565c0" loading={kpiLoading} />
                        <KpiCard label="Total Paid" value={`LKR ${fmt(kpi?.paid)}`} icon="fa-check-circle" accent="#2e7d32" loading={kpiLoading} />
                        <KpiCard label="Outstanding Balance" value={`LKR ${fmt(kpi?.balance)}`} icon="fa-balance-scale" accent="#e65100" loading={kpiLoading} />
                    </div>
                </div>

                {/* ── Module Groups ───────────────────────────────────────────────── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                    {MODULE_GROUPS.map(({ group, icon, accent, modules }) => (
                        <div key={group}>
                            {/* Section heading */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className={`fas ${icon}`} style={{ color: accent, fontSize: '13px' }}></i>
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#1a202c', letterSpacing: '0.3px' }}>{group}</span>
                                <div style={{ flex: 1, height: '1px', background: '#e2e8f0', marginLeft: '4px' }}></div>
                            </div>

                            {/* Module cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                                {modules.map((m) => <ModuleCard key={m.to} {...m} />)}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Home;
