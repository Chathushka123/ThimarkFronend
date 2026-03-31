import React from 'react'
import { TextBox, DropDown, Label, TextArea, Button, ControlCenter, IntegerField, NumberField, PopUpPage, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton } from '../../../BASE/Components'

export function generateGrnDisplay(componentList, grnTransactions = []) {

    return (
        <>
            <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>
            
            {/* Delete Transaction Confirmation Popup */}
            <PopUpPage item={componentList["deleteTransactionPopUp"]} headerText="Confirm Delete" className="">
                <div className="p-4">
                    <TextBox item={componentList["inputDeleteTransactionId"]} />
                    <div className="text-center mb-3">
                        <i className="fas fa-exclamation-triangle" style={{fontSize: '48px', color: '#dc3545'}}></i>
                    </div>
                    <h5 className="text-center mb-3" style={{color: '#3a4a6b'}}>Delete Transaction</h5>
                    <p className="text-center mb-4" style={{color: '#7b8eb5'}}>
                        Are you sure you want to delete this transaction? This action cannot be undone.
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                        <Button className="btn btn-danger mr-2" item={componentList["buttonDeleteTransactionYes"]}>
                            <i className="fas fa-trash mr-1"></i> Yes, Delete
                        </Button>
                        <Button className="btn btn-secondary" item={componentList["buttonDeleteTransactionNo"]}>
                            <i className="fas fa-times mr-1"></i> Cancel
                        </Button>
                    </div>
                </div>
            </PopUpPage>

            {/* Complete GRN Confirmation Popup */}
            <PopUpPage item={componentList["completeGrnPopUp"]} headerText="Confirm Completion" className="">
                <div className="p-4">
                    <div className="text-center mb-3">
                        <i className="fas fa-check-circle" style={{fontSize: '48px', color: '#28a745'}}></i>
                    </div>
                    <h5 className="text-center mb-3" style={{color: '#3a4a6b'}}>Complete GRN</h5>
                    <p className="text-center mb-4" style={{color: '#7b8eb5'}}>
                        Are you sure you want to complete this GRN? <br/>
                        You won't be able to add or delete transactions after this.
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                        <Button className="btn btn-success mr-2" item={componentList["buttonCompleteGrnYes"]}>
                            <i className="fas fa-check mr-1"></i> Yes, Complete
                        </Button>
                        <Button className="btn btn-secondary" item={componentList["buttonCompleteGrnNo"]}>
                            <i className="fas fa-times mr-1"></i> Cancel
                        </Button>
                    </div>
                </div>
            </PopUpPage>

        <ControlCenter item={componentList["CONTROL_CENTER"]} >
            {/* Header Section */}
            <div className="page-header-wrp">
                <div className="title-breadcrumb-wrp">
                    <h1 className="">{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                </div>
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <ControlCenter item={componentList["CONTROL_CENTER"]} >
                            <AdvanceSearch item={componentList["CONTROL_CENTER"]} className="advance-search" >
                                <AdvanceSearchGrid typeName="AdvanceSearchGrid" />
                                <AdvanceSearchButton typeName="AdvanceSearchButton" text="OK" />
                            </AdvanceSearch>
                            <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonAdvanceSearch"]}>
                                <i className="fas fa-search fa-lg"></i>
                            </Button>
                        </ControlCenter>
                    </div>
                </div>
            </div>

            <div className="container-fluid custom-container-padding">
                
                {/* GRN Header Section */}
                <div className="form-wrp mb-4 p-4" style={{
                    borderRadius: '16px', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    background: 'linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%)',
                    border: '2px solid #d0d9ff'
                }}>
                    <div className="d-flex align-items-center mb-4">
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '16px'
                        }}>
                            <i className="fas fa-file-invoice" style={{fontSize: '24px', color: 'white'}}></i>
                        </div>
                        <div>
                            <h5 className="mb-1" style={{
                                color: '#4c5fd5', 
                                fontWeight: '800',
                                fontSize: '20px',
                                letterSpacing: '-0.5px'
                            }}>
                                GRN Information
                            </h5>
                            <p className="mb-0" style={{
                                color: '#6b7bd8',
                                fontSize: '13px',
                                fontWeight: '500'
                            }}>
                                Goods Receipt Note Details
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-12">
                            <div className="form-group">
                                <label style={{
                                    color: '#4c5fd5',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    marginBottom: '8px',
                                    display: 'block'
                                }}>
                                    <i className="fas fa-hashtag mr-2"></i>
                                    {componentList["inputGrnID"].label.schema.value}
                                </label>
                                <TextBox 
                                    item={componentList["inputGrnID"]} 
                                    className="form-control" 
                                    style={{
                                        fontSize: '12px',
                                        padding: '2px 5px',
                                        borderRadius: '5px',
                                        border: '2px solid #d0d9ff',
                                        backgroundColor: '#ffffff',
                                        fontWeight: '600',
                                        color: '#1e293b'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="form-group">
                                <label style={{
                                    color: '#4c5fd5',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    marginBottom: '8px',
                                    display: 'block'
                                }}>
                                    <i className="fas fa-toggle-on mr-2"></i>
                                    {componentList["inputStatus"].label.schema.value}
                                </label>
                                <TextBox 
                                    item={componentList["inputStatus"]} 
                                    className="form-control"
                                    style={{
                                        fontSize: '12px',
                                        padding: '2px 5px',
                                        borderRadius: '5px',
                                        border: '2px solid #d0d9ff',
                                        backgroundColor: '#ffffff',
                                        fontWeight: '600',
                                        color: '#1e293b'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="form-group">
                                <label style={{
                                    color: '#4c5fd5',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    marginBottom: '8px',
                                    display: 'block'
                                }}>
                                    <i className="fas fa-file-alt mr-2"></i>
                                    {componentList["inputRmpoNo"].label.schema.value}
                                </label>
                                <TextBox 
                                    item={componentList["inputRmpoNo"]} 
                                    className="form-control" 
                                    disabled={componentList["inputGrnID"].data.value !== ""}
                                    style={{
                                        fontSize: '12px',
                                        padding: '2px 5px',
                                        borderRadius: '5px',
                                        border: '2px solid #d0d9ff',
                                        backgroundColor: '#ffffff',
                                        fontWeight: '600',
                                        color: '#1e293b'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="form-group">
                                <label style={{
                                    color: '#4c5fd5',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    marginBottom: '8px',
                                    display: 'block'
                                }}>
                                    <i className="fas fa-warehouse mr-2"></i>
                                    {componentList["inputWarehouse"].label.schema.value}
                                </label>
                                <DropDown 
                                    item={componentList["inputWarehouse"]} 
                                    className="form-control"
                                    disabled={componentList["inputGrnID"].data.value !== ""}
                                    style={{
                                        fontSize: '12px',
                                        padding: '2px 5px',
                                        borderRadius: '5px',
                                        border: '2px solid #d0d9ff',
                                        backgroundColor: '#ffffff',
                                        fontWeight: '600',
                                        color: '#1e293b'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-group">
                                <label style={{
                                    color: '#4c5fd5',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    marginBottom: '8px',
                                    display: 'block'
                                }}>
                                    <i className="fas fa-comment mr-2"></i>
                                    {componentList["inputRemarks"].label.schema.value}
                                </label>
                                <TextArea 
                                    item={componentList["inputRemarks"]} 
                                    className="form-control"
                                    disabled={componentList["inputGrnID"].data.value !== ""}
                                    style={{
                                        fontSize: '12px',
                                        padding: '10px 14px',
                                        borderRadius: '10px',
                                        border: '2px solid #d0d9ff',
                                        backgroundColor: '#ffffff',
                                        fontWeight: '500',
                                        minHeight: '100px',
                                        color: '#1e293b'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="row mt-3">
                        <div className="col-12 d-flex justify-content-end flex-wrap">
                            <Button 
                                item={componentList["buttonNewGrn"]}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    background: '#ffffff',
                                    color: '#4c5fd5',
                                    border: '2px solid #d0d9ff',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    marginRight: '10px',
                                    marginBottom: '10px',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <i className="fas fa-plus mr-2"></i> New GRN
                            </Button>
                            {componentList["buttonCreateGrn"].schema.visible && (
                                <Button 
                                    item={componentList["buttonCreateGrn"]}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: '#ffffff',
                                        border: 'none',
                                        fontWeight: '700',
                                        fontSize: '14px',
                                        marginRight: '10px',
                                        marginBottom: '10px',
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <i className="fas fa-save mr-2"></i> Create GRN
                                </Button>
                            )}
                            {componentList["buttonCompleteGrn"].schema.visible && 
                             componentList["inputStatus"].data.value === "open" && (
                                <Button 
                                    item={componentList["buttonCompleteGrn"]}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: 'white',
                                        border: 'none',
                                        fontWeight: '700',
                                        fontSize: '14px',
                                        marginBottom: '10px',
                                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <i className="fas fa-check-double mr-2"></i> Complete GRN
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Transaction Entry Section - Only visible when GRN is created and open */}
                {componentList["inputGrnID"].data.value !== "" && 
                 componentList["inputStatus"].data.value === "open" &&
                 componentList["buttonAddTransaction"].schema.visible && (
                    <div className="form-wrp background-white mb-4 p-4" style={{
                        borderRadius: '16px', 
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        border: '2px solid #e2e8f0'
                    }}>
                        <div className="d-flex align-items-center mb-4">
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
                                <i className="fas fa-plus-circle" style={{color: 'white', fontSize: '20px'}}></i>
                            </div>
                            <div>
                                <h5 className="mb-0" style={{
                                    color: '#1e293b', 
                                    fontWeight: '800',
                                    fontSize: '18px',
                                    letterSpacing: '-0.3px'
                                }}>
                                    Add Transaction
                                </h5>
                                <small style={{color: '#64748b', fontSize: '12px', fontWeight: '600'}}>Scan or enter transaction details</small>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 col-12">
                                <div className="form-group">
                                    <label style={{
                                        color: '#4a5568',
                                        fontWeight: '700',
                                        fontSize: '12px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        marginBottom: '8px',
                                        display: 'block'
                                    }}>
                                        <i className="fas fa-barcode mr-2" style={{color: '#3b82f6'}}></i>
                                        {componentList["inputLocationId"].label.schema.value}
                                    </label>
                                    <TextBox 
                                        item={componentList["inputLocationId"]} 
                                        className="form-control" 
                                        placeholder="Scan or Enter Location ID"
                                        style={{
                                            fontSize: '15px',
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            border: '2px solid #e2e8f0',
                                            fontWeight: '600',
                                            color: '#1e293b'
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 col-12">
                                <div className="form-group">
                                    <label style={{
                                        color: '#4a5568',
                                        fontWeight: '700',
                                        fontSize: '12px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        marginBottom: '8px',
                                        display: 'block'
                                    }}>
                                        <i className="fas fa-cube mr-2" style={{color: '#3b82f6'}}></i>
                                        {componentList["inputStockItemId"].label.schema.value}
                                    </label>
                                    <TextBox 
                                        item={componentList["inputStockItemId"]} 
                                        className="form-control"
                                        placeholder="Scan or Enter Stock Item ID"
                                        style={{
                                            fontSize: '15px',
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            border: '2px solid #e2e8f0',
                                            fontWeight: '600',
                                            color: '#1e293b'
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 col-12">
                                <div className="form-group">
                                    <label style={{
                                        color: '#4a5568',
                                        fontWeight: '700',
                                        fontSize: '12px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        marginBottom: '8px',
                                        display: 'block'
                                    }}>
                                        <i className="fas fa-hashtag mr-2" style={{color: '#3b82f6'}}></i>
                                        {componentList["inputQuantity"].label.schema.value}
                                    </label>
                                    <IntegerField 
                                        item={componentList["inputQuantity"]} 
                                        className="form-control"
                                        placeholder="Enter Quantity"
                                        style={{
                                            fontSize: '15px',
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            border: '2px solid #e2e8f0',
                                            fontWeight: '700',
                                            color: '#1e293b'
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 col-12">
                                <div className="form-group">
                                    <label style={{
                                        color: '#4a5568',
                                        fontWeight: '700',
                                        fontSize: '12px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        marginBottom: '8px',
                                        display: 'block'
                                    }}>
                                        <i className="fas fa-dollar-sign mr-2" style={{color: '#3b82f6'}}></i>
                                        {componentList["inputPrice"].label.schema.value}
                                    </label>
                                    <NumberField 
                                        item={componentList["inputPrice"]} 
                                        className="form-control"
                                        placeholder="Enter Price"
                                        style={{
                                            fontSize: '15px',
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            border: '2px solid #e2e8f0',
                                            fontWeight: '700',
                                            color: '#1e293b'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-end">
                                <Button 
                                    item={componentList["buttonAddTransaction"]}
                                    style={{
                                        padding: '14px 28px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        border: 'none',
                                        fontWeight: '700',
                                        fontSize: '14px',
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                        transition: 'all 0.3s ease',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    <i className="fas fa-plus-circle mr-2"></i> Add Transaction
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transactions Display Section - Card View */}
                {componentList["inputGrnID"].data.value !== "" && grnTransactions.length > 0 && (
                    <div className="form-wrp background-white p-4" style={{
                        borderRadius: '16px', 
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        border: '2px solid #e2e8f0'
                    }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="mb-0" style={{
                                color: '#1e293b', 
                                fontWeight: '800',
                                fontSize: '20px',
                                letterSpacing: '-0.5px'
                            }}>
                                <i className="fas fa-boxes mr-2" style={{color: '#3b82f6'}}></i>Transactions
                            </h5>
                            <span style={{
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                padding: '6px 14px',
                                borderRadius: '20px',
                                fontSize: '13px',
                                fontWeight: '700'
                            }}>
                                {grnTransactions.length} Items
                            </span>
                        </div>
                        <div className="row">
                            {grnTransactions.map((transaction, index) => (
                                <div key={transaction.id || index} className="col-md-6 col-lg-4 col-12 mb-4">
                                    <div className="card" style={{
                                        border: 'none',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        overflow: 'hidden',
                                        background: 'white',
                                        transform: 'translateY(0)',
                                        cursor: 'default'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                                    }}>
                                        {/* Card Top Accent */}
                                        <div style={{
                                            height: '4px',
                                            background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
                                        }}></div>
                                        <div className="card-body p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
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
                                                            Transaction
                                                        </div>
                                                    </div>
                                                </div>
                                                {componentList["inputStatus"].data.value === "open" && (
                                                    <button 
                                                        className="btn btn-sm"
                                                        onClick={() => {
                                                            if (window.handleDeleteTransaction) {
                                                                window.handleDeleteTransaction(transaction.id);
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
                                            <div className="transaction-details">
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
                                                        <i className="fas fa-map-marker-alt mr-1"></i>Location
                                                    </small>
                                                    <div style={{
                                                        color: '#2d3748',
                                                        fontWeight: '700',
                                                        fontSize: '15px',
                                                        marginTop: '4px'
                                                    }}>
                                                        {transaction.rack && transaction.location 
                                                            ? `${transaction.rack} - ${transaction.location}`
                                                            : transaction.location || 'N/A'}
                                                    </div>
                                                </div>
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
                                                        <i className="fas fa-cube mr-1"></i>Stock Item
                                                    </small>
                                                    <div style={{
                                                        color: '#2d3748',
                                                        fontWeight: '700',
                                                        fontSize: '11px',
                                                        marginTop: '4px'
                                                    }}>
                                                        {transaction.stock_item_name || 'N/A'}
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-6">
                                                        <div style={{
                                                            backgroundColor: '#f0f9f4',
                                                            padding: '12px',
                                                            borderRadius: '10px',
                                                            textAlign: 'center',
                                                            border: '2px solid #bbf7d0'
                                                        }}>
                                                            <small style={{
                                                                color: '#15803d',
                                                                fontWeight: '600',
                                                                fontSize: '10px',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px',
                                                                display: 'block'
                                                            }}>
                                                                Quantity
                                                            </small>
                                                            <div style={{
                                                                color: '#15803d',
                                                                fontWeight: '800',
                                                                fontSize: '22px',
                                                                marginTop: '2px'
                                                            }}>
                                                                {transaction.qty || 0}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div style={{
                                                            backgroundColor: '#e0f2fe',
                                                            padding: '12px',
                                                            borderRadius: '10px',
                                                            textAlign: 'center',
                                                            border: '2px solid #bae6fd'
                                                        }}>
                                                            <small style={{
                                                                color: '#075985',
                                                                fontWeight: '600',
                                                                fontSize: '10px',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px',
                                                                display: 'block'
                                                            }}>
                                                                Available
                                                            </small>
                                                            <div style={{
                                                                color: '#075985',
                                                                fontWeight: '800',
                                                                fontSize: '22px',
                                                                marginTop: '2px'
                                                            }}>
                                                                {transaction.available_qty || 0}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-0" style={{
                                                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                                    padding: '14px',
                                                    borderRadius: '12px',
                                                    border: '2px solid #f59e0b',
                                                    textAlign: 'center'
                                                }}>
                                                    <small style={{
                                                        color: '#92400e',
                                                        fontWeight: '700',
                                                        fontSize: '11px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px',
                                                        display: 'block'
                                                    }}>
                                                        <i className="fas fa-dollar-sign mr-1"></i>Price
                                                    </small>
                                                    <div style={{
                                                        color: '#78350f',
                                                        fontWeight: '800',
                                                        fontSize: '24px',
                                                        marginTop: '2px'
                                                    }}>
                                                        ${transaction.grn_price ? parseFloat(transaction.grn_price).toFixed(2) : '0.00'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {componentList["inputGrnID"].data.value !== "" && grnTransactions.length === 0 && (
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
                            No Transactions Yet
                        </h5>
                        <p style={{
                            color: '#64748b',
                            fontSize: '14px',
                            maxWidth: '400px',
                            margin: '0 auto'
                        }}>
                            Start adding transactions by scanning location and stock items above
                        </p>
                    </div>
                )}

            </div>
        </ControlCenter>
        </>
    )
}
