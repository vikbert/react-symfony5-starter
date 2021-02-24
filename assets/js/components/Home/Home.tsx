import React, { FC } from 'react';
import { Typography, Space } from 'antd';
const { Text, Title } = Typography;

const Home: FC = () => {
  const [count, setCount] = React.useState(10);
  const handleClick = () => {
    setCount((prev) => ++prev);
  };

  return (
    <Space direction="vertical">
      <Title level={3}>React Symfony 5 Starter</Title>
      <h1>{ count }</h1>
      <button onClick={handleClick}>clickme</button>
    </Space>
  );
};
export default Home;
