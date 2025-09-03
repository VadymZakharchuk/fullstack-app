import React, {useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { homePageContainer } from "./HomePageStyles.ts";
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem('access_token');
  console.log(token);
  const { isAuth, user } = useSelector((state: RootState) => state.auth);
  console.log(user, isAuth);

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    }
  }, [isAuth, navigate]);

  return (
    <div className={homePageContainer}>
      <h1 className="text-3xl font-bold mb-4">Ласкаво просимо!</h1>

      {isAuth ? (
        <p className="text-lg">Ви успішно авторизувалися як: {user?.email}</p>
      ) : (
        <p className="text-lg">Будь ласка, увійдіть у систему.</p>
      )}
    </div>
  );
};

export default HomePage;
