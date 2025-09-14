import React from 'react';
import Transactions from './transactions/Transactions.tsx';
import Analytics from "./analytics/Analytics.tsx";
import Anomalies from "./anomalies/Anomalies.tsx";
import Forecast from "./forecast/Forecast.tsx";

type ComponentName = 'Transactions' | 'Analytics' | 'Anomalies' | 'Forecast';

interface CurrentPageProps {
  componentName: ComponentName;
}

const componentMap: Record<ComponentName, React.ComponentType> = {
  Transactions: Transactions,
  Analytics: Analytics,
  Anomalies: Anomalies,
  Forecast: Forecast,
};

const CurrentPage: React.FC<CurrentPageProps> = ({ componentName }) => {
  const ComponentToRender = componentMap[componentName];

  return <ComponentToRender />;
};

export default CurrentPage;
