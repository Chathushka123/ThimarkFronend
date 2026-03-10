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
                <div className="form-wrp background-white mb-3 p-3" style={{borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
                    <h5 className="mb-3" style={{color: '#3a4a6b', fontWeight: '600'}}>GRN Information</h5>
                    <div className="row">
                        <div className="col-md-6 col-12">
                            <div className="form-group">
                                <Label item={componentList["inputGrnID"].label} />
                                <TextBox item={componentList["inputGrnID"]} className="form-control form-control-sm" />
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="form-group">
                                <Label item={componentList["inputStatus"].label} />
                                <TextBox item={componentList["inputStatus"]} className="form-control form-control-sm" />
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="form-group">
                                <Label item={componentList["inputRmpoNo"].label} />
                                <TextBox 
                                    item={componentList["inputRmpoNo"]} 
                                    className="form-control form-control-sm" 
                                    disabled={componentList["inputGrnID"].data.value !== ""}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="form-group">
                                <Label item={componentList["inputWarehouse"].label} />
                                <DropDown 
                                    item={componentList["inputWarehouse"]} 
                                    className="form-control form-control-sm"
                                    disabled={componentList["inputGrnID"].data.value !== ""}
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-group">
                                <Label item={componentList["inputRemarks"].label} />
                                <TextArea 
                                    item={componentList["inputRemarks"]} 
                                    className="form-control form-control-sm"
                                    disabled={componentList["inputGrnID"].data.value !== ""}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="row mt-2">
                        <div className="col-12 d-flex justify-content-end flex-wrap">
                            <Button 
                                className="btn common-btn common-btn-lg btn-sm mr-2 mb-2" 
                                item={componentList["buttonNewGrn"]}
                            >
                                <i className="fas fa-plus mr-1"></i> New GRN
                            </Button>
                            {componentList["buttonCreateGrn"].schema.visible && (
                                <Button 
                                    className="btn common-btn common-btn-lg btn-sm mr-2 mb-2" 
                                    item={componentList["buttonCreateGrn"]}
                                >
                                    <i className="fas fa-save mr-1"></i> Create GRN
                                </Button>
                            )}
                            {componentList["buttonCompleteGrn"].schema.visible && 
                             componentList["inputStatus"].data.value === "open" && (
                                <Button 
                                    className="btn btn-success common-btn-lg btn-sm mb-2" 
                                    item={componentList["buttonCompleteGrn"]}
                                >
                                    <i className="fas fa-check mr-1"></i> Complete GRN
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Transaction Entry Section - Only visible when GRN is created and open */}
                {componentList["inputGrnID"].data.value !== "" && 
                 componentList["inputStatus"].data.value === "open" &&
                 componentList["buttonAddTransaction"].schema.visible && (
                    <div className="form-wrp background-white mb-3 p-3" style={{borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
                        <h5 className="mb-3" style={{color: '#3a4a6b', fontWeight: '600'}}>Add Transaction</h5>
                        <div className="row">
                            <div className="col-md-4 col-12">
                                <div className="form-group">
                                    <Label item={componentList["inputLocationId"].label} />
                                    <TextBox 
                                        item={componentList["inputLocationId"]} 
                                        className="form-control form-control-sm" 
                                        placeholder="Scan or Enter Location ID"
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 col-12">
                                <div className="form-group">
                                    <Label item={componentList["inputStockItemId"].label} />
                                    <TextBox 
                                        item={componentList["inputStockItemId"]} 
                                        className="form-control form-control-sm"
                                        placeholder="Scan or Enter Stock Item ID"
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 col-12">
                                <div className="form-group">
                                    <Label item={componentList["inputQuantity"].label} />
                                    <IntegerField 
                                        item={componentList["inputQuantity"]} 
                                        className="form-control form-control-sm"
                                        placeholder="Enter Quantity"
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 col-12">
                                <div className="form-group">
                                    <Label item={componentList["inputPrice"].label} />
                                    <NumberField 
                                        item={componentList["inputPrice"]} 
                                        className="form-control form-control-sm"
                                        placeholder="Enter Price"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-end">
                                <Button 
                                    className="btn common-btn common-btn-lg btn-sm" 
                                    item={componentList["buttonAddTransaction"]}
                                >
                                    <i className="fas fa-plus mr-1"></i> Add Transaction
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transactions Display Section - Card View */}
                {componentList["inputGrnID"].data.value !== "" && grnTransactions.length > 0 && (
                    <div className="form-wrp background-white p-3" style={{borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
                        <h5 className="mb-3" style={{color: '#3a4a6b', fontWeight: '600'}}>
                            Transactions ({grnTransactions.length})
                        </h5>
                        <div className="row">
                            {grnTransactions.map((transaction, index) => (
                                <div key={transaction.id || index} className="col-md-6 col-lg-4 col-12 mb-3">
                                    <div className="card" style={{
                                        border: '1px solid #e0e6ed',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                                        transition: 'all 0.2s ease',
                                        ':hover': {
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                        }
                                    }}>
                                        <div className="card-body p-3">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h6 className="mb-0" style={{color: '#3a4a6b', fontWeight: '600'}}>
                                                    Transaction #{index + 1}
                                                </h6>
                                                {componentList["inputStatus"].data.value === "open" && (
                                                    <button 
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => {
                                                            if (window.handleDeleteTransaction) {
                                                                window.handleDeleteTransaction(transaction.id);
                                                            }
                                                        }}
                                                        style={{
                                                            padding: '2px 8px',
                                                            fontSize: '12px'
                                                        }}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="transaction-details">
                                                <div className="mb-2">
                                                    <small style={{color: '#7b8eb5', fontWeight: '500'}}>Location</small>
                                                    <div style={{color: '#3a4a6b', fontWeight: '500'}}>
                                                        {transaction.rack && transaction.location 
                                                            ? `${transaction.rack} - ${transaction.location}`
                                                            : transaction.location || 'N/A'}
                                                    </div>
                                                </div>
                                                <div className="mb-2">
                                                    <small style={{color: '#7b8eb5', fontWeight: '500'}}>Stock Item</small>
                                                    <div style={{color: '#3a4a6b', fontWeight: '500'}}>
                                                        {transaction.stock_item_name || 'N/A'}
                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col-6">
                                                        <small style={{color: '#7b8eb5', fontWeight: '500'}}>Quantity</small>
                                                        <div style={{
                                                            color: '#28a745', 
                                                            fontWeight: '600',
                                                            fontSize: '16px'
                                                        }}>
                                                            {transaction.qty || 0}
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <small style={{color: '#7b8eb5', fontWeight: '500'}}>Available</small>
                                                        <div style={{
                                                            color: '#17a2b8', 
                                                            fontWeight: '600',
                                                            fontSize: '16px'
                                                        }}>
                                                            {transaction.available_qty || 0}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-0">
                                                    <small style={{color: '#7b8eb5', fontWeight: '500'}}>Price</small>
                                                    <div style={{
                                                        color: '#ffc107', 
                                                        fontWeight: '600',
                                                        fontSize: '16px'
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
                    <div className="form-wrp background-white p-4 text-center" style={{
                        borderRadius: '8px', 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <i className="fas fa-inbox" style={{fontSize: '48px', color: '#c5cdd8', marginBottom: '16px'}}></i>
                        <h6 style={{color: '#7b8eb5'}}>No transactions yet</h6>
                        <p style={{color: '#c5cdd8', fontSize: '14px'}}>
                            Start adding transactions by scanning location and stock items above
                        </p>
                    </div>
                )}

            </div>
        </ControlCenter>
        </>
    )
}
