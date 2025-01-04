import { useContext } from 'react';
import { WithdrawalsContext } from '../../context/WithdrawalsContext';

export const useWithdrawals = () => {
  return useContext(WithdrawalsContext);
};
