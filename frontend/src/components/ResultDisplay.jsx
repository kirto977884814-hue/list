import React, { useEffect } from 'react';
import { Card, Table, Statistic, Row, Col, Alert } from 'antd';
import { UserOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

function ResultDisplay({ result }) {
  useEffect(() => {
    if (result) {
      console.log('对比结果:', result);
    }
  }, [result]);

  if (!result) {
    return (
      <Card title="对比结果">
        <Alert message="暂无数据，请先导入观看名单" type="info" />
      </Card>
    );
  }

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: '50%',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      width: '50%',
    },
  ];

  return (
    <Card
      title="对比结果"
      extra={
        <span style={{ fontSize: '14px', color: '#999' }}>
          生成时间: {new Date().toLocaleString('zh-CN')}
        </span>
      }
    >
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Statistic
            title="总会员数"
            value={result.totalMembers}
            suffix="人"
            prefix={<UserOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="已观看"
            value={result.viewedCount}
            suffix="人"
            prefix={<EyeOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="未观看"
            value={result.missedCount}
            suffix="人"
            prefix={<EyeInvisibleOutlined />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Col>
      </Row>

      <Alert
        message={`共有 ${result.missedCount} 名会员未观看直播`}
        type={result.missedCount > 0 ? 'warning' : 'success'}
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Table
        columns={columns}
        dataSource={result.missedMembers}
        rowKey="userId"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{ y: 400 }}
      />
    </Card>
  );
}

export default ResultDisplay;
