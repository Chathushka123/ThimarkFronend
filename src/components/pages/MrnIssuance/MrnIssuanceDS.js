import React from 'react';
import { 
    TextBox, Button, ControlCenter, PopUpPage 
} from '../../../BASE/Components';

export function generateMrnIssuanceDisplay(componentList, mrnDetails, issuanceStatus) {

    return (
        <>
            <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>

            {/* Complete Issuance Confirmation Popup */}
            <PopUpPage item={componentList["completePopUp"]} headerText="Confirm Complete Issuance" className="">
                <div className="p-4">
                    <div className="text-center mb-3">
                        <i className="fas fa-check-circle" style={{fontSize: '48px', color: '#28a745'}}></i>
                    </div>
                    <h5 className="text-center mb-3" style={{color: '#3a4a6b'}}>Complete MRN Issuance</h5>
                    <p className="text-center mb-4" style={{color: '#7b8eb5'}}>
                        Are you sure you want to complete this MRN issuance? <br/>
                        You won't be able to delete transactions after completion.
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                        <Button className="btn btn-success mr-2" item={componentList["buttonCompleteYes"]}>
                            <i className="fas fa-check mr-1"></i> Yes, Complete
                        </Button>
                        <Button className="btn btn-secondary" item={componentList["buttonCompleteNo"]}>
                            <i className="fas fa-times mr-1"></i> Cancel
                        </Button>
                    </div>
                </div>
            </PopUpPage>

            {/* Delete Transaction Confirmation Popup */}
            <PopUpPage item={componentList["deleteTransactionPopUp"]} headerText="Confirm Delete" className="">
                <div className="p-4">
                    <div className="text-center mb-3">
                        <i className="fas fa-exclamation-triangle" style={{fontSize: '48px', color: '#dc3545'}}></i>
                    </div>
                    <h5 className="text-center mb-3" style={{color: '#3a4a6b'}}>Delete Transaction</h5>
                    <p className="text-center mb-4" style={{color: '#7b8eb5'}}>
                        Are you sure you want to delete this transaction?
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                        <Button className="btn btn-danger mr-2" item={componentList["buttonDeleteYes"]}>
                            <i className="fas fa-trash mr-1"></i> Yes, Delete
                        </Button>
                        <Button className="btn btn-secondary" item={componentList["buttonDeleteNo"]}>
                            <i className="fas fa-times mr-1"></i> Cancel
                        </Button>
                    </div>
                </div>
            </PopUpPage>

            <ControlCenter item={componentList["CONTROL_CENTER"]}>
                {/* Header Section */}
                <div className="page-header-wrp">
                    <div className="title-breadcrumb-wrp">
                        <h1 className="">{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                    </div>
                </div>

                <div className="container-fluid custom-container-padding">
                    {/* MRN Scan Section */}
                    <div className="form-wrp mb-4 p-4" style={{
                        borderRadius: '16px', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none'
                    }}>
                        <div className="row align-items-center mb-3">
                            <div className="col-auto">
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '14px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fas fa-barcode" style={{fontSize: '24px', color: 'white'}}></i>
                                </div>
                            </div>
                            <div className="col">
                                <h5 className="mb-1" style={{
                                    color: 'white', 
                                    fontWeight: '800',
                                    fontSize: '20px',
                                    letterSpacing: '-0.5px'
                                }}>
                                    Scan MRN
                                </h5>
                                <p className="mb-0" style={{
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: '13px',
                                    fontWeight: '500'
                                }}>
                                    Enter or scan MRN ID to begin
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="form-group mb-2">
                                    <TextBox 
                                        item={componentList["inputMrnScan"]} 
                                        className="form-control form-control-lg" 
                                        placeholder="Scan or type MRN ID and press Enter"
                                        style={{
                                            fontSize: '18px',
                                            padding: '16px 20px',
                                            borderRadius: '12px',
                                            border: '3px solid rgba(255, 255, 255, 0.3)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            fontWeight: '700',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                            transition: 'all 0.3s ease',
                                            color: '#1e293b'
                                        }}
                                    />
                                </div>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    padding: '10px 16px',
                                    borderRadius: '10px',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <small style={{
                                        color: 'white',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>
                                        <i className="fas fa-keyboard mr-2"></i>
                                        Press <kbd style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            fontWeight: '700'
                                        }}>Enter</kbd> to load MRN details
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MRN Details Section - Only show when MRN is loaded */}
                    {componentList["inputMrnID"].data.value !== "" && (
                        <div className="form-wrp background-white mb-4 p-4" style={{
                            borderRadius: '16px', 
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            border: '2px solid #e2e8f0'
                        }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex align-items-center">
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '16px'
                                    }}>
                                        <i className="fas fa-file-alt" style={{color: 'white', fontSize: '20px'}}></i>
                                    </div>
                                    <div>
                                        <h5 className="mb-0" style={{
                                            color: '#1e293b', 
                                            fontWeight: '800',
                                            fontSize: '18px',
                                            letterSpacing: '-0.3px'
                                        }}>
                                            MRN Details
                                        </h5>
                                        <small style={{color: '#64748b', fontSize: '12px', fontWeight: '600'}}>Material Receipt Note Information</small>
                                    </div>
                                </div>
                                {componentList["buttonCompleteIssuance"].schema.visible && (
                                    <Button 
                                        item={componentList["buttonCompleteIssuance"]}
                                        style={{
                                            padding: '12px 24px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: 'white',
                                            border: 'none',
                                            fontWeight: '700',
                                            fontSize: '14px',
                                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                                            transition: 'all 0.3s ease',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        <i className="fas fa-check-double mr-2"></i> Complete Issuance
                                    </Button>
                                )}
                            </div>
                            
                            <div className="row">
                                <div className="col-md-3 col-6 mb-3">
                                    <div style={{
                                        backgroundColor: '#f8fafc',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: '2px solid #e2e8f0'
                                    }}>
                                        <small style={{
                                            color: '#64748b',
                                            fontWeight: '700',
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            display: 'block',
                                            marginBottom: '8px'
                                        }}>
                                            <i className="fas fa-hashtag mr-1"></i>{componentList["inputMrnID"].label.schema.value}
                                        </small>
                                        <div style={{
                                            color: '#1e293b',
                                            fontWeight: '800',
                                            fontSize: '16px'
                                        }}>
                                            {componentList["inputMrnID"].data.value}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6 mb-3">
                                    <div style={{
                                        backgroundColor: '#f0fdf4',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: '2px solid #bbf7d0'
                                    }}>
                                        <small style={{
                                            color: '#15803d',
                                            fontWeight: '700',
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            display: 'block',
                                            marginBottom: '8px'
                                        }}>
                                            <i className="fas fa-toggle-on mr-1"></i>{componentList["inputStatus"].label.schema.value}
                                        </small>
                                        <span style={{
                                            backgroundColor: '#22c55e',
                                            color: 'white',
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            textTransform: 'uppercase'
                                        }}>
                                            {componentList["inputStatus"].data.value}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6 mb-3">
                                    <div style={{
                                        backgroundColor: '#fef3c7',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: '2px solid #fde68a'
                                    }}>
                                        <small style={{
                                            color: '#92400e',
                                            fontWeight: '700',
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            display: 'block',
                                            marginBottom: '8px'
                                        }}>
                                            <i className="fas fa-layer-group mr-1"></i>{componentList["inputBatchNo"].label.schema.value}
                                        </small>
                                        <div style={{
                                            color: '#78350f',
                                            fontWeight: '800',
                                            fontSize: '16px'
                                        }}>
                                            {componentList["inputBatchNo"].data.value}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6 mb-3">
                                    <div style={{
                                        backgroundColor: '#e0e7ff',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: '2px solid #c7d2fe'
                                    }}>
                                        <small style={{
                                            color: '#3730a3',
                                            fontWeight: '700',
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            display: 'block',
                                            marginBottom: '8px'
                                        }}>
                                            <i className="fas fa-warehouse mr-1"></i>{componentList["inputWarehouse"].label.schema.value}
                                        </small>
                                        <div style={{
                                            color: '#312e81',
                                            fontWeight: '800',
                                            fontSize: '16px'
                                        }}>
                                            {componentList["inputWarehouse"].data.value}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MRN Details Cards - Material Items */}
                    {componentList["inputMrnID"].data.value !== "" && mrnDetails.length > 0 && (
                        <div className="form-wrp background-white p-3" style={{borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)'}}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0" style={{
                                    color: '#2c3e50', 
                                    fontWeight: '700',
                                    fontSize: '20px',
                                    letterSpacing: '-0.5px'
                                }}>
                                    <i className="fas fa-boxes mr-2" style={{color: '#638ad6'}}></i>Material Items
                                </h5>
                                <span style={{
                                    backgroundColor: '#638ad6',
                                    color: 'white',
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    fontWeight: '600'
                                }}>
                                    {mrnDetails.length} Items
                                </span>
                            </div>
                            <div className="row">
                                {mrnDetails.map((detail, index) => (
                                    <div key={detail.mrn_detail_id || index} className="col-md-6 col-lg-4 col-12 mb-4">
                                        <div className="card" style={{
                                            border: 'none',
                                            borderRadius: '16px',
                                            boxShadow: detail.is_issued 
                                                ? '0 4px 20px rgba(40, 167, 69, 0.15)' 
                                                : '0 4px 20px rgba(0,0,0,0.08)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            overflow: 'hidden',
                                            background: detail.is_issued 
                                                ? 'linear-gradient(135deg, #ffffff 0%, #f0f9f4 100%)'
                                                : 'white',
                                            transform: 'translateY(0)',
                                            cursor: 'default'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = detail.is_issued
                                                ? '0 8px 30px rgba(40, 167, 69, 0.2)'
                                                : '0 8px 30px rgba(0,0,0,0.12)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = detail.is_issued
                                                ? '0 4px 20px rgba(40, 167, 69, 0.15)'
                                                : '0 4px 20px rgba(0,0,0,0.08)';
                                        }}>
                                            {/* Card Top Accent */}
                                            <div style={{
                                                height: '4px',
                                                background: detail.is_issued 
                                                    ? 'linear-gradient(90deg, #28a745 0%, #20c997 100%)'
                                                    : 'linear-gradient(90deg, #638ad6 0%, #4a90e2 100%)'
                                            }}></div>
                                            
                                            <div className="card-body p-4">
                                                {/* Header with delete button */}
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <div className="d-flex align-items-center">
                                                        <div style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '10px',
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            color: 'white',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: '700',
                                                            fontSize: '14px',
                                                            marginRight: '12px'
                                                        }}>
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <div style={{
                                                                fontSize: '11px',
                                                                color: '#95a5a6',
                                                                fontWeight: '600',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px'
                                                            }}>
                                                                Item
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {issuanceStatus !== "completed" && detail.is_issued && (
                                                        <button 
                                                            className="btn btn-sm"
                                                            onClick={() => {
                                                                if (window.handleDeleteIssuance) {
                                                                    window.handleDeleteIssuance(detail.mrn_detail_id);
                                                                }
                                                            }}
                                                            style={{
                                                                padding: '6px 12px',
                                                                fontSize: '12px',
                                                                borderRadius: '8px',
                                                                backgroundColor: '#fff5f5',
                                                                color: '#e53e3e',
                                                                border: '1px solid #feb2b2',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#e53e3e';
                                                                e.currentTarget.style.color = 'white';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#fff5f5';
                                                                e.currentTarget.style.color = '#e53e3e';
                                                            }}
                                                        >
                                                            <i className="fas fa-trash mr-1"></i> Delete
                                                        </button>
                                                    )}
                                                </div>
                                                
                                                {/* Material Info with modern badge */}
                                                <div className="mb-3" style={{
                                                    backgroundColor: '#f8fafc',
                                                    padding: '12px',
                                                    borderRadius: '10px',
                                                    border: '1px solid #e2e8f0'
                                                }}>
                                                    <small style={{
                                                        color: '#718096', 
                                                        fontWeight: '600',
                                                        fontSize: '11px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        <i className="fas fa-cube mr-1"></i>Material
                                                    </small>
                                                    <div style={{
                                                        color: '#2d3748', 
                                                        fontWeight: '700', 
                                                        fontSize: '15px',
                                                        marginTop: '4px'
                                                    }}>
                                                        {detail.material_name || 'N/A'}
                                                    </div>
                                                </div>
                                                
                                                {/* Status Row with badges */}
                                                <div className="row mb-3">
                                                    <div className="col-6">
                                                        <div style={{
                                                            backgroundColor: '#e6f7ff',
                                                            padding: '10px',
                                                            borderRadius: '10px',
                                                            textAlign: 'center'
                                                        }}>
                                                            <small style={{
                                                                color: '#1890ff', 
                                                                fontWeight: '600',
                                                                fontSize: '10px',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px',
                                                                display: 'block'
                                                            }}>
                                                                MRN Qty
                                                            </small>
                                                            <div style={{
                                                                color: '#0050b3', 
                                                                fontWeight: '800',
                                                                fontSize: '20px',
                                                                marginTop: '2px'
                                                            }}>
                                                                {detail.mrn_qty || 0}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div style={{
                                                            backgroundColor: detail.is_issued ? '#f0f9f4' : '#fff5f5',
                                                            padding: '10px',
                                                            borderRadius: '10px',
                                                            textAlign: 'center'
                                                        }}>
                                                            <small style={{
                                                                color: detail.is_issued ? '#28a745' : '#e53e3e', 
                                                                fontWeight: '600',
                                                                fontSize: '10px',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px',
                                                                display: 'block'
                                                            }}>
                                                                Status
                                                            </small>
                                                            <div style={{
                                                                marginTop: '4px'
                                                            }}>
                                                                {detail.is_issued ? (
                                                                    <span style={{
                                                                        backgroundColor: '#28a745',
                                                                        color: 'white',
                                                                        padding: '4px 12px',
                                                                        borderRadius: '12px',
                                                                        fontSize: '11px',
                                                                        fontWeight: '700'
                                                                    }}>
                                                                        <i className="fas fa-check-circle mr-1"></i>Issued
                                                                    </span>
                                                                ) : (
                                                                    <span style={{
                                                                        backgroundColor: '#ffc107',
                                                                        color: '#664d03',
                                                                        padding: '4px 12px',
                                                                        borderRadius: '12px',
                                                                        fontSize: '11px',
                                                                        fontWeight: '700'
                                                                    }}>
                                                                        <i className="fas fa-clock mr-1"></i>Pending
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{
                                                    height: '1px',
                                                    background: 'linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%)',
                                                    margin: '16px 0'
                                                }}></div>

                                                {/* Location Scan Section */}
                                                <div className="mb-3">
                                                    <label style={{
                                                        color: '#4a5568', 
                                                        fontWeight: '700',
                                                        fontSize: '12px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px',
                                                        marginBottom: '8px',
                                                        display: 'block'
                                                    }}>
                                                        <i className="fas fa-barcode mr-2" style={{color: '#638ad6'}}></i>
                                                        Location ID
                                                    </label>
                                                    <input 
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Scan or enter location"
                                                        value={detail.location_id || ''}
                                                        onChange={(e) => {
                                                            if (window.handleLocationScan) {
                                                                window.handleLocationScan(detail.mrn_detail_id, e.target.value);
                                                            }
                                                        }}
                                                        disabled={issuanceStatus === "completed" || detail.is_issued}
                                                        style={{
                                                            fontSize: '14px',
                                                            padding: '12px 16px',
                                                            borderRadius: '10px',
                                                            border: '2px solid #e2e8f0',
                                                            backgroundColor: '#ffffff',
                                                            transition: 'all 0.2s ease',
                                                            fontWeight: '600',
                                                            color: '#1e293b'
                                                        }}
                                                        onFocus={(e) => {
                                                            e.currentTarget.style.borderColor = '#638ad6';
                                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 138, 214, 0.1)';
                                                        }}
                                                        onBlur={(e) => {
                                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                    />
                                                </div>

                                                {/* Available Balance - Show only when location is scanned */}
                                                {detail.location_id && detail.available_balance !== undefined && (
                                                    <div className="mb-3" style={{
                                                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                                        padding: '14px',
                                                        borderRadius: '12px',
                                                        border: '2px solid #f59e0b',
                                                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                                                    }}>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <small style={{
                                                                    color: '#92400e', 
                                                                    fontWeight: '700',
                                                                    fontSize: '11px',
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.5px',
                                                                    display: 'block'
                                                                }}>
                                                                    <i className="fas fa-layer-group mr-1"></i>Available Balance
                                                                </small>
                                                                <div style={{
                                                                    color: '#78350f', 
                                                                    fontWeight: '800',
                                                                    fontSize: '24px',
                                                                    marginTop: '2px'
                                                                }}>
                                                                    {detail.available_balance || 0}
                                                                </div>
                                                            </div>
                                                            <div style={{
                                                                width: '48px',
                                                                height: '48px',
                                                                borderRadius: '12px',
                                                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}>
                                                                <i className="fas fa-box-open" style={{fontSize: '20px', color: '#d97706'}}></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Issue Quantity */}
                                                {detail.location_id && (
                                                    <div className="mb-3">
                                                        <label style={{
                                                            color: '#4a5568', 
                                                            fontWeight: '700',
                                                            fontSize: '12px',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.5px',
                                                            marginBottom: '8px',
                                                            display: 'block'
                                                        }}>
                                                            <i className="fas fa-hashtag mr-2" style={{color: '#638ad6'}}></i>
                                                            Issue Quantity
                                                        </label>
                                                        <input 
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Enter quantity to issue"
                                                            value={detail.issue_qty || ''}
                                                            onChange={(e) => {
                                                                if (window.handleIssueQtyChange) {
                                                                    window.handleIssueQtyChange(detail.mrn_detail_id, e.target.value);
                                                                }
                                                            }}
                                                            disabled={issuanceStatus === "completed" || detail.is_issued}
                                                            style={{
                                                                fontSize: '16px',
                                                                padding: '12px 16px',
                                                                borderRadius: '10px',
                                                                border: '2px solid #e2e8f0',
                                                                backgroundColor: '#ffffff',
                                                                transition: 'all 0.2s ease',
                                                                fontWeight: '700',
                                                                color: '#1e293b'
                                                            }}
                                                            onFocus={(e) => {
                                                                e.currentTarget.style.borderColor = '#638ad6';
                                                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 138, 214, 0.1)';
                                                            }}
                                                            onBlur={(e) => {
                                                                e.currentTarget.style.borderColor = '#e2e8f0';
                                                                e.currentTarget.style.boxShadow = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                )}

                                                {/* Issue Button */}
                                                {detail.location_id && detail.issue_qty && !detail.is_issued && issuanceStatus !== "completed" && (
                                                    <div className="mt-3">
                                                        <button 
                                                            className="btn btn-block"
                                                            onClick={() => {
                                                                if (window.handleIssueTransaction) {
                                                                    window.handleIssueTransaction(detail.mrn_detail_id);
                                                                }
                                                            }}
                                                            style={{
                                                                fontSize: '14px',
                                                                fontWeight: '700',
                                                                padding: '14px',
                                                                borderRadius: '12px',
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                color: 'white',
                                                                border: 'none',
                                                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                                                transition: 'all 0.3s ease',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.transform = 'translateY(0)';
                                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                                                            }}
                                                        >
                                                            <i className="fas fa-paper-plane mr-2"></i> Issue Material
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Issued Info */}
                                                {detail.is_issued && (
                                                    <div className="mt-3" style={{
                                                        background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                                                        borderRadius: '12px',
                                                        padding: '14px',
                                                        border: '2px solid #28a745',
                                                        boxShadow: '0 4px 12px rgba(40, 167, 69, 0.2)'
                                                    }}>
                                                        <div className="d-flex align-items-start">
                                                            <div style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '8px',
                                                                backgroundColor: '#28a745',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                marginRight: '12px',
                                                                flexShrink: 0
                                                            }}>
                                                                <i className="fas fa-check" style={{color: 'white', fontSize: '14px'}}></i>
                                                            </div>
                                                            <div style={{flex: 1}}>
                                                                <div style={{
                                                                    color: '#155724',
                                                                    fontWeight: '700',
                                                                    fontSize: '13px',
                                                                    marginBottom: '4px'
                                                                }}>
                                                                    Successfully Issued
                                                                </div>
                                                                <div style={{
                                                                    color: '#1e7e34',
                                                                    fontSize: '12px',
                                                                    fontWeight: '600'
                                                                }}>
                                                                    <i className="fas fa-cube mr-1"></i>
                                                                    {detail.issue_qty} units from location {detail.location_id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {componentList["inputMrnID"].data.value !== "" && mrnDetails.length === 0 && (
                        <div className="form-wrp background-white p-5 text-center" style={{
                            borderRadius: '16px', 
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                        }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                margin: '0 auto 24px',
                                background: 'linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <i className="fas fa-inbox" style={{fontSize: '48px', color: '#6366f1'}}></i>
                            </div>
                            <h5 style={{
                                color: '#1e293b',
                                fontWeight: '700',
                                marginBottom: '12px',
                                fontSize: '20px'
                            }}>
                                No Materials Found
                            </h5>
                            <p style={{
                                color: '#64748b',
                                fontSize: '14px',
                                maxWidth: '400px',
                                margin: '0 auto'
                            }}>
                                This MRN doesn't contain any material items. Please check the MRN ID and try again.
                            </p>
                        </div>
                    )}
                </div>
            </ControlCenter>
        </>
    );
}
