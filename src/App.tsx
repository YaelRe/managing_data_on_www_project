import React from 'react';
import './App.css';
import { Header } from './components/AppHeader/Header';
import { MainPageLayout } from './components/Pages/MainPageLayout';

function App() {
  const [loggedIn, setLoggedIn] = React.useState<Boolean>(false); 
  const [page, setPage] = React.useState<number>(0);
  const [adminName, setAdminName] = React.useState<string>('');
  const [adminsPassword, setAdminsPassword] = React.useState<string>('');

  const changePage = (newPage: number) => {
    setPage(newPage);
  };
  return (
    <div className="root">
      <Header changePage={changePage} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
      <MainPageLayout loggedIn={loggedIn} setLoggedIn={setLoggedIn} adminName={adminName} setAdminName={setAdminName}
                      adminsPassword={adminsPassword} setAdminsPassword={setAdminsPassword}
                      page={page}/>
    </div>
  );
}

export default App;
