import Sidebar from "./SideBar.tsx";

import React from "react";
import { ArrowRightLeft, ChartPie, Shell, TriangleAlert, type LucideProps } from "lucide-react";
import {Outlet} from "react-router-dom";

type ComponentName = 'Transactions' | 'Analytics' | 'Anomalies' | 'Forecast';
// Визначаємо інтерфейс для елементів навігації
interface NavigationItem {
  component: ComponentName;
  name: string;
  icon: React.ComponentType<LucideProps>;
  path: string;
}

const navigation: NavigationItem[] = [
  {
    component: 'Transactions',
    name: 'Транзакції',
    icon: ArrowRightLeft,
    path: '/main/transactions',
  },
  {
    component: 'Analytics',
    name: 'Аналітика та звітність',
    icon: ChartPie,
    path: '/main/analytics',
  },
  {
    component: 'Forecast',
    name: 'АІ прогнозування',
    icon: Shell,
    path: '/main/forecast',
  },
  {
    component: 'Anomalies',
    name: 'Виявлення аномалій',
    icon: TriangleAlert,
    path: '/main/anomalies',
  }
];
const MainPage = () => {
  return (
    <>
      <div className='flex flex-row items-start'>
        <Sidebar navigation={navigation} />
        <div className="flex-1 p-8 ml-80">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainPage;
