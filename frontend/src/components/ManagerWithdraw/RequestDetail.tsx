import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Form, Spin, Checkbox } from 'antd';
import { getWithdrawById } from '../../service/withdrawService';
import { formatDateString } from '../../utils/formatDateString';

const { TextArea } = Input;

interface DetailRequestModalProps {
  requestId: number | null;
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateStatus: (id: number, status: string, note: string) => void;
}

const DetailRequestModal: React.FC<DetailRequestModalProps> = ({
  requestId,
  isModalVisible,
  setIsModalVisible,
  onUpdateStatus,
}) => {
  const [requestDetails, setRequestDetails] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (requestId !== null) {
        try {
          const data = await getWithdrawById(requestId);
          setRequestDetails(data);
        } catch (error) {
          console.error('Error fetching request details:', error);
        }
      }
    };

    if (isModalVisible) {
      fetchRequestDetails();
    }
  }, [requestId, isModalVisible]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  };

  const handleSubmit = () => {
    if (requestId !== null && status && note) {
      onUpdateStatus(requestId, status, note);
      setIsModalVisible(false);
    } else {
      alert('Please select a status and provide a note.');
    }
  };

  return (
    <Modal
      title=""
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      <div style={{ padding: '20px 30px' }}>
        <h2 style={{ textAlign: 'center', marginTop: 20 }}>Detail request</h2>

        {requestDetails ? (
          <div
            style={{
              marginTop: 20,
              marginBottom: 20,
              display: 'grid',
              gridTemplateColumns: '150px 1fr',
              rowGap: 10,
              columnGap: 10,
            }}
          >
            <p>
              <strong>Request ID:</strong>
            </p>
            <p>{requestDetails.requestId}</p>

            <p>
              <strong>Shop ID:</strong>
            </p>
            <p>{requestDetails.shopId}</p>

            <p>
              <strong>Amount:</strong>
            </p>
            <p>{requestDetails.amount} USD</p>

            <p>
              <strong>Created at:</strong>
            </p>
            <p>{formatDateString(requestDetails.createdAt)}</p>

            <p>
              <strong>Status:</strong>
            </p>
            <p
              style={{
                color:
                  requestDetails.status === 'ACCEPTED'
                    ? 'green'
                    : requestDetails.status === 'DISMISSED'
                      ? 'red'
                      : requestDetails.status === 'PENDING' ||
                          !requestDetails.status
                        ? 'orange'
                        : 'black',
                fontWeight: 'bold',
              }}
            >
              {requestDetails.status || 'PENDING'}
            </p>
            {requestDetails.status && (
              <>
                <p>
                  <strong>Updated at:</strong>
                </p>
                <p>{formatDateString(requestDetails.updatedAt)}</p>
                <p>
                  <strong>Note:</strong>
                </p>
                <p>{requestDetails.note || 'N/A'}</p>
              </>
            )}
          </div>
        ) : (
          <Spin tip="Loading ..." />
        )}
        {requestDetails && !requestDetails.status ? (
          <>
            {' '}
            <hr />
            <Form layout="vertical" style={{ marginTop: 30 }}>
              <h2 style={{ textAlign: 'center' }}>Request review</h2>
              <Form.Item label="Status" required>
                <Checkbox.Group
                  value={[status]}
                  onChange={(checkedValues) => {
                    if (checkedValues.length > 1) {
                      checkedValues = [checkedValues[checkedValues.length - 1]];
                    }
                    setStatus(checkedValues[0] || '');
                  }}
                >
                  <Checkbox
                    value="Accepted"
                    style={{ color: 'green', fontWeight: 'bold' }}
                  >
                    Accepted
                  </Checkbox>
                  <Checkbox
                    value="Dismissed"
                    style={{ color: 'red', fontWeight: 'bold' }}
                  >
                    Dismissed
                  </Checkbox>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item label="Note" required>
                <TextArea
                  rows={4}
                  placeholder="Enter note here ..."
                  value={note}
                  onChange={handleNoteChange}
                />
              </Form.Item>
              <Form.Item style={{ display: 'flex', justifyContent: 'end' }}>
                <Button
                  onClick={() => setIsModalVisible(false)}
                  type="default"
                  style={{ marginRight: 20 }}
                >
                  Close
                </Button>
                <Button type="primary" onClick={handleSubmit}>
                  Update status
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <Button
              onClick={() => setIsModalVisible(false)}
              type="default"
              style={{ marginRight: 20 }}
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DetailRequestModal;
