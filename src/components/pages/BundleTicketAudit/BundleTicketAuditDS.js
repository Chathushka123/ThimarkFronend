import React from 'react';
import { ControlCenter } from '../../../BASE/Components';

// Same bright palette as ProductionWIPScanningDS — this page is the
// "undo desk" for that one, so it should read as the same product, not a
// bolted-on admin tool.
const C = {
    border: '#dee2e6',
    ink: '#212529',
    muted: '#6c757d',
    faint: '#c2c7cf',
    subtleBg: '#f8f9fa',
    accent: '#4361ee',
    accentBg: '#eef2ff',
    accentBorder: '#4361ee',
    danger: '#dc3545',
    dangerBg: '#fff5f5',
    dangerBorder: '#dc3545',
    success: '#28a745',
    successBg: '#f0fff4',
    successBorder: '#28a745',
    amber: '#fd7e14',
    amberBg: '#fff8f0',
    amberBorder: '#fd7e14',
    purple: '#6f42c1',
    purpleBg: '#f5f0ff',
    purpleBorder: '#6f42c1',
    info: '#0dcaf0',
    infoBg: '#eafcfe',
    infoBorder: '#0dcaf0'
};

const card = {
    background: '#fff',
    border: `1.5px solid ${C.border}`,
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
};

const summaryCardStyle = (bg, color) => ({
    flex: '1 1 140px',
    backgroundColor: bg,
    border: `1.5px solid ${color}`,
    borderRadius: '10px',
    padding: '14px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
});

function formatWhen(value) {
    if (!value) return '';
    const d = new Date(value.replace(' ', 'T'));
    if (isNaN(d.getTime())) return value;
    return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function DirectionBadge({ direction }) {
    if (!direction) return null;
    const isIn = direction === 'IN';
    return (
        <span
            className="ml-2"
            style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.4px',
                padding: '2px 9px',
                borderRadius: '10px',
                border: `1.5px solid ${isIn ? C.accentBorder : C.purpleBorder}`,
                color: isIn ? C.accent : C.purple,
                background: isIn ? C.accentBg : C.purpleBg
            }}
        >
            {direction}
        </span>
    );
}

const EVENT_TONE = {
    SECONDARY: { color: C.success, bg: C.successBg, border: C.successBorder, label: 'SCAN' },
    REJECT: { color: C.danger, bg: C.dangerBg, border: C.dangerBorder, label: 'REJECT' },
    REWORK: { color: C.amber, bg: C.amberBg, border: C.amberBorder, label: 'REWORK' },
    REWORK_RETURN: { color: C.success, bg: C.successBg, border: C.successBorder, label: 'REWORK RETURN' }
};

function TypeQtyBadge({ type, qty }) {
    const tone = EVENT_TONE[type] || EVENT_TONE.SECONDARY;
    return (
        <span
            style={{
                fontSize: '12px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '8px',
                border: `1.5px solid ${tone.border}`,
                color: tone.color,
                background: tone.bg,
                minWidth: '92px',
                display: 'inline-block',
                textAlign: 'center',
                boxShadow: `0 1px 4px ${tone.color}22`
            }}
        >
            {tone.label} {qty}
        </span>
    );
}

function CountChip({ count, color = C.accent }) {
    return (
        <span
            style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#fff',
                background: color,
                borderRadius: '10px',
                padding: '2px 9px',
                marginLeft: '8px'
            }}
        >
            {count}
        </span>
    );
}

// Collapsible section header shared by every tree level — only the accent
// color/icon/indent differ, so one component keeps all five levels visually
// consistent instead of five hand-styled blocks.
function TreeHeader({ level, icon, accentColor, accentBg, label, sub, count, expanded, onToggle }) {
    return (
        <div
            onClick={onToggle}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                userSelect: 'none',
                padding: '10px 12px',
                marginLeft: `${level * 18}px`,
                marginBottom: '6px',
                background: accentBg,
                border: `1.5px solid ${accentColor}`,
                borderRadius: '9px'
            }}
        >
            <span style={{ color: accentColor, fontSize: '11px', width: '12px', display: 'inline-block' }}>
                {expanded ? '▼' : '▶'}
            </span>
            <span style={{ fontSize: '15px' }}>{icon}</span>
            <span style={{ fontWeight: 800, color: C.ink, fontSize: '14px' }}>{label}</span>
            {sub && <span style={{ color: C.muted, fontSize: '12px' }}>{sub}</span>}
            <CountChip count={count} color={accentColor} />
        </div>
    );
}

// Flat backend rows (one per bundle ticket) -> nested
// mainModel -> model -> batch -> workOrder -> bundle -> [tickets] tree,
// with running counts at every level so headers can show "N bundles" /
// "N events" without the user having to expand anything first.
function buildTree(groups) {
    const mainModels = new Map();

    groups.forEach((g) => {
        const mmKey = `mm-${g.main_model_id ?? 'none'}`;
        if (!mainModels.has(mmKey)) {
            mainModels.set(mmKey, { key: mmKey, id: g.main_model_id, name: g.main_model_name, models: new Map(), eventCount: 0, bundleIds: new Set() });
        }
        const mm = mainModels.get(mmKey);

        const mKey = `${mmKey}-m-${g.model_id ?? 'none'}`;
        if (!mm.models.has(mKey)) {
            mm.models.set(mKey, { key: mKey, id: g.model_id, name: g.model_name, batches: new Map(), eventCount: 0, bundleIds: new Set() });
        }
        const model = mm.models.get(mKey);

        const bKey = `${mKey}-b-${g.batch_id ?? 'none'}`;
        if (!model.batches.has(bKey)) {
            model.batches.set(bKey, { key: bKey, id: g.batch_id, no: g.batch_no, workOrders: new Map(), eventCount: 0, bundleIds: new Set() });
        }
        const batch = model.batches.get(bKey);

        const woKey = `${bKey}-wo-${g.work_order_id ?? 'none'}`;
        if (!batch.workOrders.has(woKey)) {
            batch.workOrders.set(woKey, { key: woKey, id: g.work_order_id, bundles: new Map(), eventCount: 0, bundleIds: new Set() });
        }
        const wo = batch.workOrders.get(woKey);

        const bdKey = `${woKey}-bd-${g.bundle_id ?? 'none'}`;
        if (!wo.bundles.has(bdKey)) {
            wo.bundles.set(bdKey, { key: bdKey, id: g.bundle_id, qty: g.bundle_qty, size: g.bundle_size, tickets: [], eventCount: 0 });
        }
        const bundle = wo.bundles.get(bdKey);

        bundle.tickets.push(g);
        const n = (g.events || []).length;

        bundle.eventCount += n;
        wo.eventCount += n; wo.bundleIds.add(bdKey);
        batch.eventCount += n; batch.bundleIds.add(bdKey);
        model.eventCount += n; model.bundleIds.add(bdKey);
        mm.eventCount += n; mm.bundleIds.add(bdKey);
    });

    return Array.from(mainModels.values());
}

function EventRow({ evt, readOnly, deletingKey, onDeleteEvent }) {
    const key = `${evt.type}-${evt.id}`;
    const busy = deletingKey === key;
    const blocked = !evt.is_latest;

    return (
        <div
            className="d-flex justify-content-between align-items-start py-2 px-2 mb-2"
            style={{ background: C.subtleBg, borderRadius: '8px' }}
        >
            <div>
                <TypeQtyBadge type={evt.type} qty={evt.qty} />
                {evt.type === 'REWORK_RETURN' && evt.reject_qty > 0 && (
                    <span className="ml-2" style={{ fontSize: '12px', color: C.danger, fontWeight: 600 }}>
                        + {evt.reject_qty} rejected
                    </span>
                )}
                <div style={{ fontSize: '12px', color: C.muted, marginTop: '4px' }}>
                    {evt.team_name && <>{evt.team_name} &middot; </>}
                    {evt.created_by && <>{evt.created_by} &middot; </>}
                    {formatWhen(evt.created_at)}
                </div>
                {(evt.reason || evt.remarks) && (
                    <div style={{ fontSize: '12px', fontStyle: 'italic', color: C.muted, marginTop: '2px' }}>
                        {evt.reason}{evt.reason && evt.remarks ? ' — ' : ''}{evt.remarks}
                    </div>
                )}
            </div>

            {!readOnly && (
                <button
                    type="button"
                    title={blocked ? 'Delete newer scans on this bundle first' : 'Delete this scan event'}
                    disabled={blocked || busy}
                    onClick={() => onDeleteEvent(evt)}
                    style={{
                        flexShrink: 0,
                        marginLeft: '10px',
                        background: blocked ? '#fff' : C.danger,
                        color: blocked ? C.faint : '#fff',
                        border: `1.5px solid ${blocked ? C.border : C.dangerBorder}`,
                        borderRadius: '7px',
                        padding: '5px 10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: blocked || busy ? 'not-allowed' : 'pointer'
                    }}
                >
                    {busy ? '…' : '🗑 Delete'}
                </button>
            )}
        </div>
    );
}

function TicketCard({ ticket, level, expanded, onToggle, readOnly, deletingKey, onDeleteEvent, onDeleteTicket }) {
    const events = ticket.events || [];
    // A ticket can only be the bundle's frontier if one of its own events is
    // the bundle-wide "latest" — reuses the per-event is_latest flag the
    // backend already sends, no extra API field needed.
    const isFrontier = events.some(e => e.is_latest);
    const ticketBusy = deletingKey === `TICKET-${ticket.bundle_ticket_id}`;

    return (
        <div style={{ marginLeft: `${level * 18}px`, marginBottom: '8px' }}>
            <div
                onClick={onToggle}
                className="d-flex align-items-center"
                style={{
                    cursor: 'pointer',
                    userSelect: 'none',
                    gap: '8px',
                    padding: '8px 12px',
                    background: '#fff',
                    border: `1.5px solid ${C.border}`,
                    borderRadius: '8px'
                }}
            >
                <span style={{ color: C.muted, fontSize: '11px', width: '12px', display: 'inline-block' }}>
                    {expanded ? '▼' : '▶'}
                </span>
                <strong style={{ color: C.ink, fontSize: '13px' }}>
                    {ticket.operation_description || ticket.operation_code || 'Unknown operation'}
                </strong>
                <DirectionBadge direction={ticket.direction} />
                <span style={{ fontSize: '12px', color: C.muted }}>Ticket qty {ticket.ticket_qty}</span>
                <CountChip count={events.length} color={C.accent} />

                {!readOnly && (
                    <button
                        type="button"
                        title={isFrontier ? 'Delete every scan event on this ticket' : 'Clear newer tickets on this bundle first'}
                        disabled={!isFrontier || ticketBusy}
                        onClick={(e) => { e.stopPropagation(); onDeleteTicket(ticket); }}
                        style={{
                            marginLeft: 'auto',
                            background: isFrontier ? C.danger : '#fff',
                            color: isFrontier ? '#fff' : C.faint,
                            border: `1.5px solid ${isFrontier ? C.dangerBorder : C.border}`,
                            borderRadius: '7px',
                            padding: '4px 10px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: !isFrontier || ticketBusy ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {ticketBusy ? '…' : '🗑 Delete All'}
                    </button>
                )}
            </div>

            {expanded && (
                <div style={{ marginLeft: '18px', marginTop: '6px' }}>
                    {events.map((evt) => (
                        <EventRow
                            key={`${evt.type}-${evt.id}`}
                            evt={evt}
                            readOnly={readOnly}
                            deletingKey={deletingKey}
                            onDeleteEvent={onDeleteEvent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function generateBundleTicketAuditDisplay(componentList, options = {}) {
    const {
        readOnly = false,
        fromDate = '',
        toDate = '',
        onFromDateChange = () => { },
        onToDateChange = () => { },
        onReload = () => { },
        loading = false,
        groups = [],
        expanded = {},
        onToggleNode = () => { },
        deletingKey = null,
        onDeleteEvent = () => { },
        onDeleteTicket = () => { },
    } = options;

    const tree = buildTree(groups);
    const totalBundles = new Set(groups.map(g => g.bundle_id)).size;
    const totalTickets = groups.length;
    const totalEvents = groups.reduce((sum, g) => sum + (g.events || []).length, 0);

    return (
        <ControlCenter item={componentList["CONTROL_CENTER"]}>
            <div className="loading" id="spinner" style={{ display: loading ? '' : 'none' }}>Loading&#8230;</div>

            <div className="page-header-wrp">
                <div className="title-breadcrumb-wrp">
                    <h1>{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                </div>
            </div>

            <div className="container-fluid custom-container-padding">

                {/* Date range + reload */}
                <div className="p-3 mb-3" style={{ ...card, borderTop: `3px solid ${C.accent}` }}>
                    <div className="d-flex flex-wrap align-items-end" style={{ gap: '14px' }}>
                        <div>
                            <label className="mb-1 d-block" style={{ fontSize: '11px', fontWeight: 700, color: C.muted }}>FROM</label>
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                value={fromDate}
                                max={toDate || undefined}
                                onChange={(e) => onFromDateChange(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="mb-1 d-block" style={{ fontSize: '11px', fontWeight: 700, color: C.muted }}>TO</label>
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                value={toDate}
                                min={fromDate || undefined}
                                onChange={(e) => onToDateChange(e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={onReload}
                            style={{
                                background: C.accent,
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                fontSize: '13px',
                                fontWeight: 700,
                                boxShadow: `0 2px 8px ${C.accent}44`
                            }}
                        >
                            ⟳ Reload
                        </button>

                        <div className="ml-auto" style={{ fontSize: '12px', color: C.muted, fontStyle: 'italic', maxWidth: '360px' }}>
                            Only the newest scan on a bundle can be deleted. To remove an older one, delete everything newer on that bundle first, from the end backward.
                        </div>
                    </div>
                </div>

                {/* Summary bar */}
                {!loading && groups.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                        <div style={summaryCardStyle(C.accentBg, C.accent)}>
                            <span style={{ fontSize: '26px', fontWeight: 900, color: C.accent, lineHeight: 1 }}>{tree.length}</span>
                            <span style={{ fontSize: '11px', color: C.muted, fontWeight: 600 }}>MAIN MODELS</span>
                        </div>
                        <div style={summaryCardStyle(C.purpleBg, C.purple)}>
                            <span style={{ fontSize: '26px', fontWeight: 900, color: C.purple, lineHeight: 1 }}>{totalBundles}</span>
                            <span style={{ fontSize: '11px', color: C.muted, fontWeight: 600 }}>BUNDLES</span>
                        </div>
                        <div style={summaryCardStyle(C.infoBg, C.info)}>
                            <span style={{ fontSize: '26px', fontWeight: 900, color: C.info, lineHeight: 1 }}>{totalTickets}</span>
                            <span style={{ fontSize: '11px', color: C.muted, fontWeight: 600 }}>TICKETS</span>
                        </div>
                        <div style={summaryCardStyle(C.amberBg, C.amber)}>
                            <span style={{ fontSize: '26px', fontWeight: 900, color: C.amber, lineHeight: 1 }}>{totalEvents}</span>
                            <span style={{ fontSize: '11px', color: C.muted, fontWeight: 600 }}>SCAN EVENTS</span>
                        </div>
                    </div>
                )}

                {readOnly && (
                    <div
                        className="p-2 mb-3"
                        style={{ background: C.amberBg, border: `1.5px solid ${C.amberBorder}`, borderRadius: '8px', fontSize: '12px', color: C.ink, fontWeight: 600 }}
                    >
                        View only — you don't have permission to delete scan events on this screen.
                    </div>
                )}

                {!loading && groups.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '12px', border: `1.5px dashed ${C.border}`, color: C.faint }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧾</div>
                        <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px', color: C.muted }}>No scans in this date range</div>
                        <div style={{ fontSize: '13px' }}>Try widening the From / To dates above.</div>
                    </div>
                )}

                {!loading && tree.map((mm) => (
                    <div key={mm.key}>
                        <TreeHeader
                            level={0}
                            icon="🏷️"
                            accentColor={C.accent}
                            accentBg={C.accentBg}
                            label={mm.name}
                            sub={`${mm.bundleIds.size} bundle${mm.bundleIds.size === 1 ? '' : 's'}`}
                            count={mm.eventCount}
                            expanded={!!expanded[mm.key]}
                            onToggle={() => onToggleNode(mm.key)}
                        />
                        {expanded[mm.key] && Array.from(mm.models.values()).map((model) => (
                            <div key={model.key}>
                                <TreeHeader
                                    level={1}
                                    icon="🧩"
                                    accentColor={C.purple}
                                    accentBg={C.purpleBg}
                                    label={model.name}
                                    sub={`${model.bundleIds.size} bundle${model.bundleIds.size === 1 ? '' : 's'}`}
                                    count={model.eventCount}
                                    expanded={!!expanded[model.key]}
                                    onToggle={() => onToggleNode(model.key)}
                                />
                                {expanded[model.key] && Array.from(model.batches.values()).map((batch) => (
                                    <div key={batch.key}>
                                        <TreeHeader
                                            level={2}
                                            icon="📦"
                                            accentColor={C.amber}
                                            accentBg={C.amberBg}
                                            label={`Batch ${batch.no}`}
                                            sub={`${batch.bundleIds.size} bundle${batch.bundleIds.size === 1 ? '' : 's'}`}
                                            count={batch.eventCount}
                                            expanded={!!expanded[batch.key]}
                                            onToggle={() => onToggleNode(batch.key)}
                                        />
                                        {expanded[batch.key] && Array.from(batch.workOrders.values()).map((wo) => (
                                            <div key={wo.key}>
                                                <TreeHeader
                                                    level={3}
                                                    icon="📄"
                                                    accentColor={C.info}
                                                    accentBg={C.infoBg}
                                                    label={`Work Order #${wo.id}`}
                                                    sub={`${wo.bundleIds.size} bundle${wo.bundleIds.size === 1 ? '' : 's'}`}
                                                    count={wo.eventCount}
                                                    expanded={!!expanded[wo.key]}
                                                    onToggle={() => onToggleNode(wo.key)}
                                                />
                                                {expanded[wo.key] && Array.from(wo.bundles.values()).map((bundle) => (
                                                    <div key={bundle.key}>
                                                        <TreeHeader
                                                            level={4}
                                                            icon="🧵"
                                                            accentColor={C.ink}
                                                            accentBg={C.subtleBg}
                                                            label={`Bundle #${bundle.id}`}
                                                            sub={`qty ${bundle.qty}${bundle.size ? ` · ${bundle.size}` : ''}`}
                                                            count={bundle.eventCount}
                                                            expanded={!!expanded[bundle.key]}
                                                            onToggle={() => onToggleNode(bundle.key)}
                                                        />
                                                        {expanded[bundle.key] && bundle.tickets.map((ticket) => {
                                                            const ticketKey = `${bundle.key}-t-${ticket.bundle_ticket_id}`;
                                                            return (
                                                                <TicketCard
                                                                    key={ticketKey}
                                                                    ticket={ticket}
                                                                    level={5}
                                                                    expanded={!!expanded[ticketKey]}
                                                                    onToggle={() => onToggleNode(ticketKey)}
                                                                    readOnly={readOnly}
                                                                    deletingKey={deletingKey}
                                                                    onDeleteEvent={onDeleteEvent}
                                                                    onDeleteTicket={onDeleteTicket}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </ControlCenter>
    );
}
