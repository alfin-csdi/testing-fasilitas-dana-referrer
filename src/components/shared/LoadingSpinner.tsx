import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Spin indicator={antIcon} />
    </div>
  );
};

export default LoadingSpinner;