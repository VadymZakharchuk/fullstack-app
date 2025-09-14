import Sidebar from "./SideBar.tsx";

import React, { useState } from "react";
import { ArrowRightLeft, ChartPie, Shell, TriangleAlert, type LucideProps } from "lucide-react";
import CurrentPage from './CurrentPage.tsx';

type ComponentName = 'Transactions' | 'Analytics' | 'Anomalies' | 'Forecast';
// Визначаємо інтерфейс для елементів навігації
interface NavigationItem {
  component: ComponentName;
  name: string;
  icon: React.ComponentType<LucideProps>;
}

const navigation: NavigationItem[] = [
  {
    component: 'Transactions',
    name: 'Транзакції',
    icon: ArrowRightLeft,
  },
  {
    component: 'Analytics',
    name: 'Аналітика та звітність',
    icon: ChartPie,
  },
  {
    component: 'Forecast',
    name: 'АІ прогнозування',
    icon: Shell,
  },
  {
    component: 'Anomalies',
    name: 'Виявлення аномалій',
    icon: TriangleAlert,
  }
];

const MainPage = () => {
  const [currentPage, setCurrentPage] = useState<ComponentName>(navigation[0].component);

  const handleNavigation = (componentName: ComponentName) => {
    setCurrentPage(componentName);
  };

  return (
    <>
      <div className='flex flex-row items-start'>
        <Sidebar navigation={navigation} onNavigate={handleNavigation} />
        <div className="flex-1 p-8 ml-80">
          <CurrentPage componentName={currentPage} />
        </div>
      </div>
    </>
  );
};

export default MainPage;
