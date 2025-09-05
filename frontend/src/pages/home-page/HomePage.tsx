import React from 'react';
import { homePageContainer } from "./HomePageStyles.ts";
import {useDispatch, useSelector} from 'react-redux';
import type { RootState } from '../../store';
import Header from "./Header.tsx";
import {setAuth} from "../../store/auth/authSlice.ts";
import SectionOne from "./SectionOne.tsx";

const HomePage: React.FC = () => {

  const dispatch = useDispatch();
  const token = localStorage.getItem('access_token');
  const lsUser = localStorage.getItem('user');

  const { isAuth } = useSelector((state: RootState) => state.auth);
  if (token && lsUser && !isAuth) {
    dispatch(setAuth({ user: JSON.parse(lsUser), token: token }));
  }

  return (
    <div className={homePageContainer}>
      <Header />
      <div className="bg-gradient-to-br from-[#f1f6f9] to-white w-full" >
        <SectionOne />
      </div>
    </div>
  );
};

export default HomePage;
