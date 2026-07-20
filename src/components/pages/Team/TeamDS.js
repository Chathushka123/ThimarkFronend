import React from 'react'
import { TextBox, Label, CheckBox, Grid, GridBody, GridHeader, ControlCenter, NewButton, SaveButton, Button } from '../../../BASE/Components'
import { THEME, S, cardHeaderStyle, StatTile } from '../_shared/HrUiKit'

export function generateTeamDisplay(componentList) {

    const rows = componentList["gridTeams"].data || []
    const activeCount = rows.filter(r => r.active === "1" || r.active === true || r.active === 1).length
    const totalCount = rows.length
    const inactiveCount = totalCount - activeCount
    const isEditing = componentList["inputId"].data.value !== ""

    return (
        <>
            <ControlCenter item={componentList["CONTROL_CENTER"]} >
                <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>

                <div className="page-header-wrp">
                    <div className="title-breadcrumb-wrp">
                        <h1>
                            <i className={THEME.team.icon} style={{ marginRight: '10px', color: THEME.team.accent }}></i>
                            {componentList["CONTROL_CENTER"].label.schema.value}
                        </h1>
                        <div style={{ fontSize: '12px', color: '#8892a6', marginTop: '2px' }}>
                            Manage production teams used for daily shift scheduling
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            <ControlCenter item={componentList["CONTROL_CENTER"]} >
                                <Button className="btn hr-pill-btn hr-pill-btn-light mr-2" item={componentList["buttonReloadList"]}><i className="fas fa-sync-alt"></i> Reload</Button>
                                <NewButton className="btn hr-pill-btn hr-pill-btn-blue mr-2" item={componentList["buttonNew"]}><i className="fas fa-plus"></i> New Team</NewButton>
                                <SaveButton className="btn hr-pill-btn hr-pill-btn-green mr-2" item={componentList["buttonSave"]}><i className="fas fa-save"></i> Save</SaveButton>
                                <Button className="btn hr-pill-btn hr-pill-btn-light" item={componentList["buttonUndo"]}><i className="fas fa-undo"></i> Undo</Button>
                            </ControlCenter>
                        </div>
                    </div>
                </div>

                <div className="container-fluid custom-container-padding">

                    <div className="d-flex flex-wrap" style={{ gap: '14px', marginBottom: '20px' }}>
                        <StatTile icon="fas fa-users" label="Total Teams" value={totalCount} bg="#eef2ff" color="#4361ee" />
                        <StatTile icon="fas fa-check-circle" label="Active" value={activeCount} bg="#f0fff4" color="#28a745" />
                        <StatTile icon="fas fa-pause-circle" label="Inactive" value={inactiveCount} bg="#f8f9fa" color="#6c757d" />
                    </div>

                    <div style={S.card}>
                        <div style={cardHeaderStyle('team')}>
                            <span><i className="fas fa-id-card mr-2"></i>{isEditing ? "Edit Team" : "New Team"}</span>
                        </div>
                        <div style={S.cardBody}>
                            <TextBox item={componentList["inputId"]} />
                            <TextBox item={componentList["inputUpdatedAt"]} />
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <Label item={componentList["inputTeamCode"].label} />
                                    <TextBox item={componentList["inputTeamCode"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-5">
                                    <Label item={componentList["inputTeamName"].label} />
                                    <TextBox item={componentList["inputTeamName"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-3 d-flex align-items-end pb-2">
                                    <div className="custom-control custom-switch">
                                        <CheckBox item={componentList["inputActive"]} className="custom-control-input" />
                                        <label className="custom-control-label" htmlFor="inputActive">Active</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row pb-4">
                        <div className="col-12">
                            <div style={S.card}>
                                <div style={cardHeaderStyle('team')}>
                                    <span><i className="fas fa-list mr-2"></i>All Teams</span>
                                    <span style={{ fontSize: '11px', fontWeight: '500', opacity: 0.85 }}>Click a row to edit &middot; use the trash icon to remove</span>
                                </div>
                                <div className='table-wrp background-white' style={{ border: 'none', borderRadius: '0 0 10px 10px' }}>
                                    <Grid item={componentList["gridTeams"]}
                                        customButton={<i className="fa fa-edit"></i>}
                                        deleteButton={<i className="fa fa-trash"></i>}
                                        className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="master-table-wrp">
                                                    <GridHeader typeName="GridHeader" columns={componentList["gridTeams"].columns} />
                                                    <GridBody typeName="GridBody" rows={componentList["gridTeams"].data} />
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                    {totalCount === 0 &&
                                        <div className="text-center py-4" style={{ color: '#adb5bd' }}>
                                            <i className="fas fa-users" style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }}></i>
                                            No teams yet &mdash; use "New Team" to create the first one.
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </ControlCenter>
        </>
    )
}
