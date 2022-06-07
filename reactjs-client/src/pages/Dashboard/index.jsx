import { useState, useEffect, useCallback } from 'react';
import { TailSpin } from 'react-loader-spinner';

import { useNavigate } from 'react-router-dom';
import { GetUserCharges, GetUserInfo, GetUserTransactions } from '../../services/api';
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
  const navigate = useNavigate();

  const refreshAll = useCallback(async () => {
    const rUserInfo = await GetUserInfo();
    const rTransactions = await GetUserTransactions();
    const rCharges = await GetUserCharges();

    auth.setUserInfo(rUserInfo);
    setTransactions(rTransactions);
    setCharges(rCharges);
  }, []);

  useEffect(() => {
    if (auth.token) {
      refreshAll();
    } else {
      navigate('/signin');
    }
  }, [auth.token, refreshAll]);

  return auth.userInfo
    ? (
      <Container>
        {charges.length > 0 && <Charges charges={charges} refreshAll={refreshAll} />}
        {transactions.length > 0 && <Transactions transactions={transactions} refreshAll={refreshAll} />}
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
