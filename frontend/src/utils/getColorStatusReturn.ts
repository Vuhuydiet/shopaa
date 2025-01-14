import { ReturnStatus } from '../interfaces/Order/IReturnSlip';

export const getColorStatusReturn = (status: ReturnStatus): string => {
  const statusColors: Record<ReturnStatus, string> = {
    [ReturnStatus.PENDING]: 'orange',
    [ReturnStatus.ACCEPTED]: 'blue',
    [ReturnStatus.DISMISSED]: 'red',
  };

  return statusColors[status] || 'DefaultColor';
};
