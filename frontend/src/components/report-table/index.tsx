import { Button, Descriptions, Modal, Spin, Table } from 'antd';
import { ReportContext } from '../../context/ReportContext';
import { useContext } from 'react';

export const ReportTable = () => {
  const {
    reports,
    isLoading,
    isOpenModal,
    columnReport,
    toggleModal,
    reportDetail,
  } = useContext(ReportContext);

  return (
    <>
      <Modal
        open={isOpenModal}
        title={'Report Detail'}
        onOk={() => {}}
        onCancel={toggleModal}
        footer={[
          <Button
            key="dismiss"
            type="primary"
            loading={false}
            onClick={() => {}}
          >
            Dismiss
          </Button>,
          <Button
            key="accept"
            type="primary"
            loading={false}
            onClick={() => {}}
          >
            Accept
          </Button>,
        ]}
        width={1100}
      >
        <Descriptions bordered items={reportDetail} />
      </Modal>
      {isLoading ? (
        <Spin
          style={{
            margin: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      ) : (
        <Table
          columns={columnReport}
          dataSource={reports}
          loading={isLoading}
        />
      )}
    </>
  );
};
