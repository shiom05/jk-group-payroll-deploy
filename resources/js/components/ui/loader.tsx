import React from 'react';
import { Flex, Spin } from 'antd';

const Loader: React.FC = () => (
  <Flex
    align="center"
    justify="center"
    style={{
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      backdropFilter: 'blur(5px)', // This blurs the background
      WebkitBackdropFilter: 'blur(5px)', // Safari support
      backgroundColor: 'rgba(255, 255, 255, 0.3)', // Light overlay to enhance blur
      zIndex: 9999,
    }}
  >
    <Spin size="large" />
  </Flex>
);

export default Loader;
