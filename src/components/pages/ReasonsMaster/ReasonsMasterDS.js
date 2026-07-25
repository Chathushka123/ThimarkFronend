import React from 'react';
import { ControlCenter } from '../../../BASE/Components';

export function generateReasonsMasterDisplay(componentList, state, handlers) {
    const { loading, reasons, code, description, type, saving } = state;
    const { onCodeChange, onDescriptionChange, onTypeChange, onSave, onToggleActive } = handlers;

    return (
        <ControlCenter item={componentList["CONTROL_CENTER"]}>
            <div className="page-header-wrp">
                <div className="title-breadcrumb-wrp">
                    <h1>{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                </div>
            </div>

            <div className="container-fluid custom-container-padding">
                <div className="form-wrp background-white mb-3 p-3">
                    <label className="mb-2" style={{ fontWeight: 600 }}>Add a Reason</label>
                    <div className="form-row">
                        <div className="form-group col-12 col-md-3 mb-2">
                            <label className="mb-1" style={{ fontSize: '12px', fontWeight: 600 }}>Code</label>
                            <input
                                type="text"
                                className="form-control"
                                value={code}
                                onChange={(e) => onCodeChange(e.target.value)}
                                disabled={saving}
                                placeholder="e.g. STITCH_DEFECT"
                            />
                        </div>
                        <div className="form-group col-12 col-md-5 mb-2">
                            <label className="mb-1" style={{ fontSize: '12px', fontWeight: 600 }}>Description</label>
                            <input
                                type="text"
                                className="form-control"
                                value={description}
                                onChange={(e) => onDescriptionChange(e.target.value)}
                                disabled={saving}
                                placeholder="e.g. Stitch defect"
                            />
                        </div>
                        <div className="form-group col-12 col-md-2 mb-2">
                            <label className="mb-1" style={{ fontSize: '12px', fontWeight: 600 }}>Type</label>
                            <select className="form-control" value={type} onChange={(e) => onTypeChange(e.target.value)} disabled={saving}>
                                <option value="REJECT">Reject</option>
                                <option value="REWORK">Rework</option>
                            </select>
                        </div>
                        <div className="form-group col-12 col-md-2 mb-2 d-flex align-items-end">
                            <button
                                type="button"
                                className="btn common-btn common-btn-lg btn-block"
                                onClick={onSave}
                                disabled={saving || !code.trim() || !description.trim()}
                            >
                                {saving ? <><i className="fas fa-spinner fa-spin mr-1"></i>Saving&#8230;</> : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="form-wrp background-white p-3">
                    {loading && (
                        <div className="text-center py-3">
                            <i className="fas fa-spinner fa-spin mr-2"></i>Loading&#8230;
                        </div>
                    )}

                    {!loading && reasons.length === 0 && (
                        <p className="text-muted mb-0">No reasons defined yet.</p>
                    )}

                    {!loading && reasons.length > 0 && (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Description</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {reasons.map(r => (
                                    <tr key={r.id}>
                                        <td>{r.code}</td>
                                        <td>{r.description}</td>
                                        <td>
                                            <span className={`badge ${r.type === 'REJECT' ? 'badge-danger' : 'badge-warning'}`}>
                                                {r.type}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${r.active ? 'badge-success' : 'badge-secondary'}`}>
                                                {r.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-link p-0"
                                                style={{ fontSize: '13px' }}
                                                onClick={() => onToggleActive(r)}
                                            >
                                                {r.active ? 'Deactivate' : 'Reactivate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </ControlCenter>
    );
}
