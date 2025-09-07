import React, { type FC } from 'react';
import type {LucideProps} from "lucide-react";
export interface ButtonProps {
  size?: 'small' | 'medium' | 'large';
  icon?: string | React.ComponentType | React.ReactNode;
  iconPosition?: 'left' | 'right',
  children?: string,
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'success';
  classes?: string;
  isDisabled?: boolean;
  onClick?: () => void;
}
export const Button: FC<ButtonProps> = (
  {
    size = 'medium',
    icon = '',
    iconPosition = 'left',
    children = '',
    variant = 'primary',
    classes = '',
    isDisabled = false,
    onClick = () => {},
  }) => {

  const btn = 'flex flex-row items-center justify between'

  const sizes = {
    small: 'px-3 py-1.5 text-sm shadow-md',
    medium: 'px-4 py-2 text-base shadow-md',
    large: 'px-5 py-3 text-base shadow-lg'
  }
  const vars = {
    primary: 'text-white bg-primary',
    secondary: 'text-white bg-body-text',
    danger: 'text-white bg-back-orange',
    success: 'text-white bg-back-green',
    outline: 'text-header-text border border-body-text bg-transparent'
  }

  const btnClassName = isDisabled
    ? `${btn} disabled`
    : `${btn} ${vars[variant]} ${sizes[size]} ${classes}`

  const renderIcon = () => {
    if (typeof icon === 'string') {
      return <img src={icon} alt="Icon" className="w-4 h-4 mr-2" />;
    } else if (React.isValidElement(icon)) {
      return <span className="mr-2">{icon}</span>;
    } else if (icon) {
      const IconComponent = icon as React.ComponentType<LucideProps>;
      return <IconComponent className="mr-2" />;
    }
    return null;
  };

  return (
    <button className={btnClassName}
            disabled={isDisabled}
            onClick={onClick}
    >
      {iconPosition === 'left' && renderIcon()}
      { children }
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
}
