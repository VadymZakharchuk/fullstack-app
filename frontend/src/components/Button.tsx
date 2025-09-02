import type { FC } from 'react';
export interface ButtonProps {
  size?: 'small' | 'medium' | 'large';
  icon?: string,
  iconPosition?: 'left' | 'right',
  children?: string,
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'gradient';
  classes?: string;
  isDisabled?: boolean;
  onClick?: () => void;
}
export const Button: FC<ButtonProps> = (
  {
    size = 'medium',
    icon = "",
    iconPosition = 'left',
    children = '',
    variant = 'primary',
    classes = '',
    isDisabled = false,
    onClick = () => {},
  }) => {

  const btnClassName = isDisabled
    ? `button disabled`
    : `button ${variant} ${size} ${classes}`

  const iconElement = icon.length > 0 ? (
    <img src={icon} className="button-icon" alt="icon" />
  ) : null;

  return (
    <button className={btnClassName}
            disabled={isDisabled}
            onClick={onClick}
    >
      {iconPosition === 'left' && iconElement}
      { children }
      {iconPosition === 'right' && iconElement}
    </button>
  );
}
