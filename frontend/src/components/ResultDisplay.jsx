import React from 'react';
import { Card, Statistic, Row, Col, Alert } from 'antd';
import { UserOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

function ResultDisplay({ result }) {
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
        <Col span={12}>
          <Statistic
            title="总会员数"
            value={result.totalMembers}
            suffix="人"
            prefix={<UserOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={12}>
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

      {/* 未观看会员列表 */}
      {result.missedMembers && result.missedMembers.length > 0 && (
        <Card
          title="未观看会员名单"
          size="small"
          style={{ marginTop: 16 }}
        >
          {result.missedMembers.map(member => (
            <div key={member.userId} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontWeight: 'bold', marginRight: '16px' }}>{member.userId}</span>
              <span>{member.nickname}</span>
            </div>
          ))}
        </Card>
      )}
    </Card>
  );
}

export default ResultDisplay;
