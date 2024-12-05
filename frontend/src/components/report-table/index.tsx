import { Descriptions, Modal, Spin, Table } from 'antd';
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
        footer={[]}
        width={1100}
      >
        <Descriptions title="User Info" bordered items={reportDetail} />
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
