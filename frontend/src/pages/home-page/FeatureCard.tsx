import React, { type FC } from 'react';
import type {LucideProps} from "lucide-react";
interface FeatureCardProps {
  icon: React.ComponentType;
  title: string;
  description: string;
  color: string;
}
const FeatureCard: FC<FeatureCardProps> = ({icon, title, description, color}) => {
  const renderIcon = () => {
    const IconComponent = icon as React.ComponentType<LucideProps>;
    return <IconComponent className="w-8 h-8" />;
  };

  const iconClass = `${color} absolute -top-4 left-8 w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-lg"`;

  return (
    <>
      <div className="mx-auto relative w-[360px] h-[240px] bg-gradient-to-br from-[#f1f6f9] to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-body-text">
        <div className={iconClass}>
          { renderIcon() }
        </div>
        <div className="mt-6 text-xl font-bold text-header-text mb-4">{title}</div>
        <div className="text-body-text mb-6 leading-relaxed">{description}</div>
      </div>
    </>
  )
}

export default FeatureCard;
