import { useState, useEffect, useCallback } from 'react';
import { TailSpin } from 'react-loader-spinner';

import { useNavigate } from 'react-router-dom';
import { GetUserCharges, GetUserInfo, GetUserTransactions } from '../../services/api';
import { Charges } from '../../components/Charges';
import { Transactions } from '../../components/Transactions';
import { useAuth } from '../../hooks/useAuth';
import {
  Center, Container, NewOpButton, TabButton, TabHeader, TabSelector,
} from './styles';
import { NewOpModal } from '../../components/NewOpModal';

export function DashboardPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isNewOpModalOpen, setIsNewOpModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [charges, setCharges] = useState([]);

  function handleOpenNewOpModal() {
    setIsNewOpModalOpen(true);
  }

  function handleCloseNewOpModal() {
    setIsNewOpModalOpen(false);
  }

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
        <TabHeader>
          <TabSelector>
            <TabButton isSelected={currentTab === 0} onClick={() => setCurrentTab(0)}>Transferências</TabButton>
            <TabButton isSelected={currentTab === 1} onClick={() => setCurrentTab(1)}>Cobranças</TabButton>
          </TabSelector>
          <NewOpButton onClick={handleOpenNewOpModal}>Nova Operação</NewOpButton>
        </TabHeader>
        {
          currentTab === 0
            ? <Transactions transactions={transactions} refreshAll={refreshAll} />
            : <Charges charges={charges} refreshAll={refreshAll} />
        }
        <NewOpModal
          isOpen={isNewOpModalOpen}
          onRequestClose={handleCloseNewOpModal}
          balance={auth.userInfo.balance}
          refreshAll={refreshAll}
        />
      </Container>
    )
    : (
      <Center>
        <TailSpin color="#222288" height={64} width={64} />
      </Center>
    );
}
