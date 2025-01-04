import React, { useState } from 'react';
import { Modal, Button, Input, Tag, Checkbox, Spin } from 'antd';
import { IReturnSlip, ReturnStatus } from '../../interfaces/Order/IReturnSlip';
import { getColorStatusReturn } from '../../utils/getColorStatusReturn';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

interface ReturnRequestModalProps {
  visible: boolean;
  onClose: () => void;
  returnSlip: IReturnSlip;
  reason: string;
  setReason: (reason: string) => void;
  acceptReturn: () => void;
  dismissReturn: () => void;
  isSubmitting: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({
  visible,
  onClose,
  returnSlip,
  reason,
  setReason,
  acceptReturn,
  dismissReturn,
  isSubmitting,
  isLoading,
  setIsLoading,
}) => {
  const [currentStatus, setCurrentStatus] = useState<ReturnStatus>(
    returnSlip.status,
  );

  const handleSaveChanges = () => {
    setIsLoading(true);
    if (currentStatus === ReturnStatus.ACCEPTED && reason.trim()) {
      acceptReturn();
    } else if (currentStatus === ReturnStatus.DISMISSED && reason.trim()) {
      dismissReturn();
    }
  };

  return (
    <Modal
      visible={visible}
      title={`Return Request - ${returnSlip.returnId}`}
      footer={null}
      width={600}
      onCancel={!isLoading ? onClose : undefined}
      closable={!isLoading}
    >
      {' '}
      <Spin spinning={isLoading} tip="Updating return slip...">
        <hr />
        <div>
          <div>
            <div style={{ marginBottom: '16px', marginTop: '20px' }}>
              <h3>
                Info Order{' '}
                <Link
                  to={`/manager-shop/list-order/${returnSlip.orderId}`}
                  title="View order details"
                >
                  <InfoCircleOutlined style={{ marginLeft: '10px' }} />
                </Link>
              </h3>
            </div>
            <div
              style={{
                marginBottom: '16px',
                display: 'flex',
              }}
            >
              <strong style={{ width: '150px' }}>Order ID:</strong>
              <span>{returnSlip.orderId}</span>
            </div>
            <div style={{ marginBottom: '16px', display: 'flex' }}>
              <strong style={{ width: '150px' }}>Created At:</strong>
              <span>
                {new Date(returnSlip.createdAtOrder || '').toLocaleString()}
              </span>
            </div>
            <div style={{ marginBottom: '16px', display: 'flex' }}>
              <strong style={{ width: '150px' }}>Customer:</strong>
              <span>{returnSlip.customerName || 'User'}</span>
            </div>
            <div style={{ marginBottom: '16px', display: 'flex' }}>
              <strong style={{ width: '150px' }}>Customer Number:</strong>
              <span>{returnSlip.customerNumber}</span>
            </div>
            <div style={{ marginBottom: '16px', display: 'flex' }}>
              <strong style={{ width: '150px' }}>Shipping Address:</strong>
              <span>{returnSlip.shippingAddress}</span>
            </div>
            <div style={{ marginBottom: '16px', display: 'flex' }}>
              <strong style={{ width: '150px' }}>Total Amount:</strong>
              <span>
                {`$${(
                  (returnSlip?.shippingFee || 0) +
                  (returnSlip?.totalAmount || 0)
                ).toFixed(2)}`}
              </span>
            </div>

            <hr />
            <div style={{ marginBottom: '16px', marginTop: '20px' }}>
              <h3>Return Slip Details</h3>
            </div>

            <div style={{ marginBottom: '16px', display: 'flex' }}>
              <strong style={{ width: '150px' }}>Status request:</strong>
              <Tag color={getColorStatusReturn(returnSlip.status)}>
                {returnSlip.status}
              </Tag>
            </div>
            <div style={{ marginBottom: '16px', display: 'flex' }}>
              <strong style={{ width: '150px' }}>Request date:</strong>
              <span>{new Date(returnSlip.createdAt).toLocaleString()}</span>
            </div>
            <div style={{ marginBottom: '16px', display: 'flex' }}>
              <strong style={{ width: '150px' }}>Reason return:</strong>
              <span>{returnSlip.reason}</span>
            </div>

            <div style={{ marginBottom: '16px', display: 'flex' }}>
              <strong style={{ width: '150px' }}>Description details:</strong>
              <span>{returnSlip.description}</span>
            </div>

            {returnSlip.status !== ReturnStatus.PENDING ? (
              <div style={{ marginBottom: '16px', display: 'flex' }}>
                <strong style={{ width: '150px' }}>Reason of shop:</strong>
                <span>{returnSlip.result}</span>
              </div>
            ) : null}
          </div>

          <hr />
          {returnSlip.status === ReturnStatus.PENDING ? (
            <div style={{ marginTop: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3>Solve request return</h3>
              </div>

              <div
                style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}
              >
                <strong>Decision:</strong>
                <div>
                  <Checkbox
                    checked={currentStatus === ReturnStatus.ACCEPTED}
                    onChange={() => setCurrentStatus(ReturnStatus.ACCEPTED)}
                    disabled={currentStatus === ReturnStatus.ACCEPTED}
                    style={{
                      marginRight: '8px',
                      color:
                        currentStatus === ReturnStatus.ACCEPTED
                          ? 'green'
                          : 'black',
                    }}
                  >
                    <div
                      style={{
                        color:
                          currentStatus === ReturnStatus.ACCEPTED
                            ? 'green'
                            : 'black',
                      }}
                    >
                      Accept
                    </div>
                  </Checkbox>
                  <Checkbox
                    checked={currentStatus === ReturnStatus.DISMISSED}
                    onChange={() => setCurrentStatus(ReturnStatus.DISMISSED)}
                    disabled={currentStatus === ReturnStatus.DISMISSED}
                  >
                    <div
                      style={{
                        color:
                          currentStatus === ReturnStatus.DISMISSED
                            ? 'red'
                            : 'black',
                      }}
                    >
                      Dismiss
                    </div>
                  </Checkbox>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Reason for Decision:</strong>
                <Input.TextArea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a reason for your decision."
                  required
                  rows={4}
                  disabled={returnSlip.status !== ReturnStatus.PENDING}
                />
              </div>

              <div style={{ textAlign: 'right' }}>
                <Button
                  onClick={onClose}
                  style={{ marginRight: 8 }}
                  disabled={isSubmitting || isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  loading={isSubmitting || isLoading}
                  onClick={handleSaveChanges}
                  disabled={!reason.trim() || isSubmitting || isLoading}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <Button
                onClick={onClose}
                style={{ marginRight: 8 }}
                disabled={isSubmitting || isLoading}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Spin>
    </Modal>
  );
};

export default ReturnRequestModal;
