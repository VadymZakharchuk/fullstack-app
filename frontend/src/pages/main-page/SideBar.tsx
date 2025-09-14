import {
  LogOut,
  type LucideProps,
  Settings,
} from "lucide-react";
import React from "react";
import { logout } from "../../store/auth/authSlice.ts";
import { useDispatch } from "react-redux";

type ComponentName = 'Transactions' | 'Analytics' | 'Anomalies' | 'Forecast';

interface NavigationItem {
  component: ComponentName;
  name: string;
  icon: React.ComponentType<LucideProps>;
}

interface SidebarProps {
  navigation: NavigationItem[];
  onNavigate: (component: ComponentName) => void;
}
const Sidebar: React.ComponentType<SidebarProps> = ({ navigation, onNavigate }: SidebarProps) => {
  const dispatch = useDispatch();

  const logOut = async () => {
    dispatch(logout());
  }

  const navsFooter = [
    {
      href: '/settings',
      name: 'Налаштування',
      icon: Settings,
    },
    {
      href: logOut,
      name: 'Вихід',
      icon: LogOut,
    }
  ]
  const renderIcon = (icon: React.ComponentType<LucideProps>) => {
    const IconComponent = icon as React.ComponentType<LucideProps>;
    return <IconComponent className="w-8 h-8" />;
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full h-full border-r bg-white space-y-8 sm:w-80">
        <div className="flex flex-col h-full">
          <a href="/" className='h-20 flex items-center px-8 shadow-xl'>
            <img
              src='/img/B_Logo.png'
              width={280}
              height={45}
              alt="Balancio logo"
            />
          </a>
          <div className="mt-4 flex-1 flex flex-col h-full overflow-auto">
            <ul className="px-4 text-sm font-medium flex-1">
              {
                navigation.map((item, idx) => (
                  <li key={idx}>
                    <span
                      onClick={() => onNavigate(item.component)}
                      className="flex items-center gap-x-2 text-gray-600 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 duration-150 cursor-pointer"
                    >
                      <div className="text-body-text">{renderIcon(item.icon)}</div>
                      {item.name}
                    </span>
                  </li>
                ))
              }
            </ul>
            <div>
              <ul className="px-4 pb-4 text-sm font-medium">
                {
                  navsFooter.map((item, idx) => (
                    <li key={idx}>
                      {item.name === 'Вихід'
                        ? (
                        <span onClick={logOut} className="flex items-center gap-x-2 text-gray-600 p-2 rounded-lg  hover:bg-gray-50 active:bg-gray-100 duration-150 cursor-pointer">
                            <div className="text-body-text">{renderIcon(item.icon)}</div>
                          {item.name}
                          </span>
                        )
                       : (
                        <a href={item.href as string} className="flex items-center gap-x-2 text-gray-600 p-2 rounded-lg  hover:bg-gray-50 active:bg-gray-100 duration-150">
                          <div className="text-body-text">{renderIcon(item.icon)}</div>
                          {item.name}
                        </a>
                        )}
                    </li>
                  ))
                }
              </ul>
            </div>
          </div >
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
