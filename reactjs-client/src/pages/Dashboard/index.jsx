import { useState, useEffect } from 'react';
import { TailSpin } from 'react-loader-spinner';

import { api } from '../../services/api';
import { Charges } from '../../components/Charges';
import { Transactions } from '../../components/Transactions';
import { NewTransaction } from '../../components/NewTransaction';
import { NewCharge } from '../../components/NewCharge';
import { useAuth } from '../../hooks/useAuth';
import { Center, Container } from './styles';

export function DashboardPage() {
  const auth = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [charges, setCharges] = useState([]);

  const refreshUserInfo = async () => {
    try {
      const response = await api.get('user');
      const { data } = response.data;
      return data;
    } catch (error) {
      // Signout if receives a unauthorized code
      if (error.response.status === 401) {
        auth.signOut();
      }
      return {};
    }
  };

  const refreshTransactions = async () => {
    try {
      const response = await api.get('transactions/all');
      const { data } = response.data;
      return data;
    } catch (error) {
      // Signout if receives a unauthorized code
      if (error.response.status === 401) {
        auth.signOut();
      }
      return {};
    }
  };

  const refreshCharges = async () => {
    try {
      const response = await api.get('charges/all');
      const { data } = response.data;
      return data;
    } catch (error) {
      // Signout if receives a unauthorized code
      if (error.response.status === 401) {
        auth.signOut();
      }
      return {};
    }
  };

  const refreshAll = async () => {
    const rUserInfo = await refreshUserInfo();
    const rTransactions = await refreshTransactions();
    const rCharges = await refreshCharges();

    auth.setUserInfo(rUserInfo);
    setTransactions(rTransactions);
    setCharges(rCharges);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return auth.userInfo != null
    ? (
      <Container>
        {charges.length > 0 && <Charges props={{ charges, refreshAll }} />}
        {transactions.length > 0 && <Transactions props={{ transactions, refreshAll }} />}
        <NewTransaction balance={auth.userInfo.balance} refreshAll={refreshAll} />
        <br />
        <NewCharge refreshAll={refreshAll} />
      </Container>
    )
    : (
      <Center>
        <TailSpin color="#222288" height={64} width={64} />
      </Center>
    );
}
