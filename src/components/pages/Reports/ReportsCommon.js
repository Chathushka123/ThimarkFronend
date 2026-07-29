// Shared look for every report screen: a single filters+result panel (no
// separate colored header bars), nice gradient action buttons, and a clean
// table header color - kept in one place so every report stays in sync.

export const REPORT_STYLES = {
    card: {
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        border: '2px solid #e2e8f0',
        marginBottom: '24px',
        overflow: 'hidden',
    },
    cardBody: { padding: '24px' },
    label: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#4c5fd5',
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        marginBottom: '6px',
        display: 'block',
    },
    runBtn: {
        padding: '9px 22px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: 'none',
        fontWeight: '700',
        fontSize: '13px',
        boxShadow: '0 3px 10px rgba(102, 126, 234, 0.35)',
        transition: 'all 0.2s ease',
    },
    downloadBtn: {
        padding: '9px 22px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#fff',
        border: 'none',
        fontWeight: '700',
        fontSize: '13px',
        boxShadow: '0 3px 10px rgba(16, 185, 129, 0.35)',
        transition: 'all 0.2s ease',
    },
    resultBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        margin: '22px 0 12px',
        paddingTop: '18px',
        borderTop: '1px solid #edf2f7',
    },
    resultTitle: {
        fontWeight: '800',
        fontSize: '14px',
        color: '#1e293b',
    },
    resultCount: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#64748b',
    },
    tableWrapper: {
        overflowX: 'auto',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '900px',
    },
    th: {
        background: '#4c5fd5',
        color: '#fff',
        padding: '11px 10px',
        textAlign: 'left',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
        whiteSpace: 'nowrap',
        position: 'sticky',
        top: 0,
        zIndex: 1,
    },
    thMatrix: {
        background: '#4c5fd5',
        color: '#fff',
        padding: '11px 10px',
        textAlign: 'center',
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
        whiteSpace: 'nowrap',
        maxWidth: '90px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        position: 'sticky',
        top: 0,
        zIndex: 1,
    },
    td: {
        padding: '9px 10px',
        borderBottom: '1px solid #edf2f7',
        fontSize: '12px',
        color: '#2d3748',
        whiteSpace: 'nowrap',
        transition: 'background-color 0.15s ease',
    },
    overdueTd: {
        background: '#fef2f2',
        color: '#b91c1c',
        fontWeight: '700',
    },
    stateMessage: {
        padding: '32px 14px',
        textAlign: 'center',
        color: '#64748b',
        fontWeight: '600',
    },
}

// className to combine with REPORT_STYLES.card so cards pick up the app's
// base card treatment (padding reset/border/white bg) the same way Grn's do.
export const REPORT_CARD_CLASS = 'form-wrp background-white'

export function reportRowStyle(idx) {
    return { background: idx % 2 === 0 ? '#fff' : '#f8fafc' }
}
