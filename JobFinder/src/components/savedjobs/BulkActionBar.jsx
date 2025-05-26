import React from "react";
import PropTypes from "prop-types";

const BulkActionBar = ({
    selectedCount,
    onViewSelected,
    onBulkUnsave,
    onClearSelection,
    actionLoading,
}) => {
    return (
        <div
            className="position-fixed bottom-0 start-50 translate-middle-x mb-3"
            style={{ zIndex: 1050 }}
        >
            <div className="card shadow border-0">
                <div className="card-body p-3">
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-muted">
                            {selectedCount} job{selectedCount > 1 ? "s" : ""} selected
                        </span>
                        <div className="btn-group">
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={onViewSelected}
                            >
                                <i className="bi bi-eye me-1"></i>
                                View Selected
                            </button>
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={onBulkUnsave}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                    <i className="bi bi-trash"></i>
                                )}
                            </button>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={onClearSelection}
                            >
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

BulkActionBar.propTypes = {
    selectedCount: PropTypes.number.isRequired,
    onViewSelected: PropTypes.func.isRequired,
    onBulkUnsave: PropTypes.func.isRequired,
    onClearSelection: PropTypes.func.isRequired,
    actionLoading: PropTypes.bool,
};

export default BulkActionBar;