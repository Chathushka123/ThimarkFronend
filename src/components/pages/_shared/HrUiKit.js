import React, { useState } from 'react'

// Shared visual language for the HR Management screens (Team / Shift / Daily Shift).
// Layered as plain style objects + small presentational components on top of the
// existing BASE/Components.js framework, the same way PurchaseOrderDS.js and
// InventoryDS.js already do it — no changes to the framework itself.

export const THEME = {
    team: {
        gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b5bdb 100%)',
        accent: '#3b5bdb',
        tint: '#eef2ff',
        icon: 'fas fa-users',
    },
    shift: {
        gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b5bdb 100%)',
        accent: '#3b5bdb',
        tint: '#eef2ff',
        icon: 'fas fa-user-clock',
    },
    dailyShift: {
        gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b5bdb 100%)',
        accent: '#3b5bdb',
        tint: '#eef2ff',
        icon: 'fas fa-calendar-check',
    },
}

export const S = {
    card: {
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 14px rgba(0,0,0,0.08)',
        marginBottom: '20px',
        overflow: 'visible',
    },
    cardBody: { padding: '20px 20px 10px 20px' },
    label: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#0f014b',
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        marginBottom: '4px',
        display: 'block',
    },
    helperText: {
        fontSize: '11px',
        color: '#8892a6',
        marginTop: '4px',
        display: 'block',
    },
}

export function cardHeaderStyle(themeKey) {
    const t = THEME[themeKey] || THEME.team
    return {
        background: t.gradient,
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '10px 10px 0 0',
        fontSize: '14px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
}

export function StatusPill({ active, activeLabel = 'Active', inactiveLabel = 'Inactive' }) {
    const on = active === true || active === 1 || active === '1'
    return (
        <span style={{
            background: on ? '#e6f7ee' : '#fdecec',
            color: on ? '#1a7a4a' : '#c0392b',
            border: `1.5px solid ${on ? '#28a745' : '#dc3545'}`,
            padding: '2px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.4px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
        }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: on ? '#28a745' : '#dc3545' }} />
            {on ? activeLabel : inactiveLabel}
        </span>
    )
}

export function StatTile({ icon, label, value, bg, color }) {
    return (
        <div style={{
            flex: '1 1 140px',
            backgroundColor: bg,
            border: `1.5px solid ${color}`,
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
        }}>
            <div style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '15px', flexShrink: 0,
            }}>
                <i className={icon}></i>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <span style={{ fontSize: '22px', fontWeight: '900', color: '#212529', lineHeight: '1.1' }}>{value}</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
            </div>
        </div>
    )
}

// Native datetime-local input wired the same way BASE's DateField wires into
// config[...] items (item.data.value + state.modified), since DateField itself
// only supports date-only pickers and this app has no datetime-range widget.
export function DateTimeField({ item, className }) {
    const [, setTick] = useState(0)
    const state = item.schema.dataSourceController.state

    function handleChange(event) {
        item.data.value = event.target.value
        state.modified = true
        setTick(t => t + 1)
    }

    function setValue(value) {
        item.data.value = value
        setTick(t => t + 1)
    }

    item.setValue = setValue

    return (
        <input
            type="datetime-local"
            id={item.schema.name}
            name={item.schema.name}
            className={className}
            value={item.data.value || ''}
            onChange={handleChange}
        />
    )
}

// "yyyy-MM-dd HH:mm:ss" (Laravel) <-> "yyyy-MM-ddTHH:mm" (datetime-local input)
export function toDateTimeLocal(value) {
    if (!value) return ''
    return String(value).replace(' ', 'T').substring(0, 16)
}

export function fromDateTimeLocal(value) {
    if (!value) return null
    return String(value).replace('T', ' ') + (value.length === 16 ? ':00' : '')
}
