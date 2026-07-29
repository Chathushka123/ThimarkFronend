import { useEffect, useState } from 'react';
import { generateBundleTicketAuditDisplay } from './BundleTicketAuditDS';
import config from './BundleTicketAuditCS';
import API from '../../../api/API';

function __dateStr(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
}

// Turns any API failure into one meaningful, admin-facing line — same
// approach as ProductionWIPScanningES's describeError, since the delete
// endpoint's 422 NOT_LATEST_EVENT message is exactly what the admin needs
// to see verbatim.
function describeError(error, fallback) {
    if (!error.response) {
        return 'Can’t reach the server — check your connection and try again.';
    }
    const payload = error.response.data || {};
    return payload.message || fallback;
}

const BundleTicketAudit = () => {
    const [rendered, setRendered] = useState(true);
    const [readOnly, setReadOnly] = useState(false);
    const [fromDate, setFromDate] = useState(__dateStr(1));
    const [toDate, setToDate] = useState(__dateStr(0));
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [deletingKey, setDeletingKey] = useState(null);

    function reRender() {
        setRendered(!rendered);
    }

    config["CONTROL_CENTER"].renderFunction = reRender;

    useEffect(() => {
        __checkIsAuthorized();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fires on mount (with yesterday->today defaults) and again on every
    // date-range change.
    useEffect(() => {
        loadHierarchy(fromDate, toDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromDate, toDate]);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "bundleTicketAudit" };
        API.post(`permissions/isAuthorized`, apiRequest).then(response => {
            setReadOnly(response.data === "r");
        }).catch(() => {
            setReadOnly(true);
        });
    }

    async function loadHierarchy(from, to) {
        setLoading(true);
        try {
            const response = await API.get(`bundleTicketAudit/hierarchy?from=${from}&to=${to}`);
            setGroups((response.data && response.data.data) || []);
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage("Error", describeError(error, "Failed to load scan history"));
            setGroups([]);
        } finally {
            setLoading(false);
        }
    }

    function handleFromDateChange(date) {
        setFromDate(date);
    }

    function handleToDateChange(date) {
        setToDate(date);
    }

    function handleReload() {
        loadHierarchy(fromDate, toDate);
    }

    function toggleNode(key) {
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    }

    // A ticket's events are already sorted newest-first by the backend, so
    // the very first non-deleted-this-session entry is always "the latest"
    // right after a delete — no need to re-derive ordering here, just ask
    // the server again once the delete completes.
    async function handleDeleteEvent(evt) {
        if (readOnly || deletingKey) {
            return;
        }

        const confirmed = window.confirm(
            `Delete this ${evt.type.replace('_', ' ')} entry (qty ${evt.qty})? This cannot be undone from here.`
        );
        if (!confirmed) {
            return;
        }

        const key = `${evt.type}-${evt.id}`;
        setDeletingKey(key);
        try {
            const typePath = evt.type.toLowerCase();
            await API.delete(`bundleTicketAudit/scanEvents/${typePath}/${evt.id}`);
            config["CONTROL_CENTER"].promptBaseMessage("Scan event deleted", "");
            await loadHierarchy(fromDate, toDate);
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptWarningMessage(
                describeError(error, "Failed to delete scan event"),
                ""
            );
        } finally {
            setDeletingKey(null);
        }
    }

    // Bulk equivalent of handleDeleteEvent: wipes every active scan event
    // on one ticket in a single call. The server enforces the same
    // frontier-ticket rule either way — this just saves clicking "Delete"
    // once per event when the whole ticket needs clearing.
    async function handleDeleteTicket(ticket) {
        if (readOnly || deletingKey) {
            return;
        }

        const eventCount = (ticket.events || []).length;
        const confirmed = window.confirm(
            `Delete all ${eventCount} scan event${eventCount === 1 ? '' : 's'} on this ticket (${ticket.operation_description || ticket.operation_code})? This cannot be undone from here.`
        );
        if (!confirmed) {
            return;
        }

        const key = `TICKET-${ticket.bundle_ticket_id}`;
        setDeletingKey(key);
        try {
            await API.delete(`bundleTicketAudit/ticketEvents/${ticket.bundle_ticket_id}`);
            config["CONTROL_CENTER"].promptBaseMessage("Ticket scan events deleted", "");
            await loadHierarchy(fromDate, toDate);
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptWarningMessage(
                describeError(error, "Failed to delete ticket scan events"),
                ""
            );
        } finally {
            setDeletingKey(null);
        }
    }

    return generateBundleTicketAuditDisplay(config, {
        readOnly,
        fromDate,
        toDate,
        onFromDateChange: handleFromDateChange,
        onToDateChange: handleToDateChange,
        onReload: handleReload,
        loading,
        groups,
        expanded,
        onToggleNode: toggleNode,
        deletingKey,
        onDeleteEvent: handleDeleteEvent,
        onDeleteTicket: handleDeleteTicket,
    });
};

export default BundleTicketAudit;
