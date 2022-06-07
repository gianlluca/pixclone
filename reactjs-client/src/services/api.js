import axios from 'axios';

// In production change baseURL to your domain
const api = axios.create({ baseURL: 'http://localhost:5858' });

const GetUserInfo = async () => {
  try {
    const response = await api.get('user');
    const { data } = response.data;
    return data;
  } catch (error) {
    return null;
  }
};

const GetUserTransactions = async () => {
  try {
    const response = await api.get('transactions/all');
    const { data } = response.data;
    return data;
  } catch (error) {
    return null;
  }
};

const GetUserCharges = async () => {
  try {
    const response = await api.get('charges/all');
    const { data } = response.data;
    return data;
  } catch (error) {
    return null;
  }
};

const PayCharge = async (chargeId) => {
  try {
    await api.post('charges/pay', { id: chargeId });
    return null;
  } catch (error) {
    return null;
  }
};

export {
  api, GetUserInfo, GetUserTransactions, GetUserCharges, PayCharge,
};
