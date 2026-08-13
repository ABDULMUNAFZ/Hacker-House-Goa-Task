import React from 'react';

export interface ScrambledTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const ScrambledText: React.FC<ScrambledTextProps> = ({
  className = '',
  style = {},
  children
}) => {
  return (
    <span className={className} style={style}>
      {children}
    </span>
  );
};

export default ScrambledText;
