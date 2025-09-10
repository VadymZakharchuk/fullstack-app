import React from 'react';
import { homePageContainer } from "./HomePageStyles.ts";
import Header from "./Header.tsx";
import SectionOne from "./SectionOne.tsx";
import SectionTwo from "./SectionTwo.tsx";
import SectionThree from "./SectionThree.tsx";

const HomePage: React.FC = () => {
  return (
    <div className={homePageContainer}>
      <Header />
      <div className="bg-gradient-to-br from-[#f1f6f9] to-white w-full md:px-[64px]" >
        <SectionOne />
        <SectionTwo />
        <SectionThree />
      </div>
    </div>
  );
};

export default HomePage;
