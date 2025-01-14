import { ReportTable } from '../../../components/report-table';
import { ReportProvider } from '../../../context/ReportContext';

export const ReportPage = () => {
  return (
    <ReportProvider>
      <ReportTable />
    </ReportProvider>
  );
};
