import React, { useState } from 'react';
import Layout from './components/Layout';
import NavTabs from './components/NavTabs';
import SponsorDozenWireframes from './components/SponsorDozenWireframes';

type Tab = 'recipient' | 'sponsor' | 'dashboard';

export default function App() {
  const [tab, setTab] = useState<Tab>('recipient');

  return (
    <Layout>
      <NavTabs current={tab} onChange={setTab} />
      <SponsorDozenWireframes active={tab} />
    </Layout>
  );
}
