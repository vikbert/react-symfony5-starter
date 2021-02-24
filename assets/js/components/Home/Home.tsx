import React,  { FC } from 'react';
import { Typography, Space } from 'antd';
const { Text, Title  } = Typography;

const Home: FC = () => {
    return (
        <Space direction="vertical">
            <Title level={3}>React Symfony 5 Starter</Title>
            <Text type="secondary">Symfony</Text>
            <Text type="secondary">React</Text>
            <Text type="secondary">Jest</Text>
            <Text type="secondary">Enzyme</Text>
            <Text type="secondary">Enzyme</Text>
            <Text type="secondary">Enzyme</Text>
        </Space>
    );
}
export default Home;

