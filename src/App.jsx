import React from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import BootScreen from './screens/BootScreen.jsx';
import AllListsScreen from './screens/AllListsScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import NotFoundScreen from './screens/NotFoundScreen.jsx';
import ListScreen from './screens/ListScreen.jsx';
import AboutScreen from './screens/AboutScreen.jsx';

// どの画面を出すかだけを決める
function Router() {
  const { booting, allListsPage, currentListId, listLoading, listNotFound } = useApp();

  if (booting) return <BootScreen />;
  if (allListsPage) return <AllListsScreen />;
  if (!currentListId) return <HomeScreen />;
  if (!listLoading && listNotFound) return <NotFoundScreen />;
  return <ListScreen />;
}

export default function App() {
  // 「開発者の想い」はログイン処理が要らないので、AppProvider の外で出す
  const isAbout = new URLSearchParams(window.location.search).get('about') === '1';
  if (isAbout) return <AboutScreen />;

  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
