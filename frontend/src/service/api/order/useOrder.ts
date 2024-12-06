import { ORDER_API_ENDPOINTS } from './../../../config/API_config';
import { IOrder } from './../../../interfaces/IOrder';
import { useQuery } from 'react-query';
import axios from 'axios';
import { IQueryOrder } from '../../../interfaces/IQueryOrder';

export const useOrder = (params: IQueryOrder, token: string)=> {
    return useQuery({
        queryKey: ['order', params];

    })
}

async function getOrders(params: IQueryOrder = {limit: 10}, token: string){
    try{
        const response = await axios.get(ORDER_API_ENDPOINTS.ORDER, {
            params: params,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
        })
        console.log(response);
    } catch (error) {
        console.error('Error fetching products:', error);
      }
}