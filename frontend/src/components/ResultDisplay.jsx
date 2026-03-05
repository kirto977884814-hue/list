import React, { useState, useEffect } from 'react';
import { Card, Table, Statistic, Row, Col, Spin, Alert } from 'antd';
import { UserOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { viewRecordAPI } from '../services/api';

function ResultDisplay({ recordId }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (recordId) {
      fetchData();
    }
  }, [recordId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await viewRecordAPI.getMissedMembers(recordId);
      setData(result);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card title="对比结果">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" tip="正在加载..." />
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card title="对比结果">
        <Alert message="暂无数据" type="info" />
      </Card>
    );
  }

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id',
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
      title={`对比结果 - ${data.record.recordName}`}
      extra={
        <span style={{ fontSize: '14px', color: '#999' }}>
          导入时间: {new Date(data.record.importTime).toLocaleString('zh-CN')}
        </span>
      }
    >
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Statistic
            title="总会员数"
            value={data.record.totalMembers}
            suffix="人"
            prefix={<UserOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="已观看"
            value={data.record.viewedCount}
            suffix="人"
            prefix={<EyeOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="未观看"
            value={data.record.missedCount}
            suffix="人"
            prefix={<EyeInvisibleOutlined />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Col>
      </Row>

      <Alert
        message={`共有 ${data.record.missedCount} 名会员未观看直播`}
        type={data.record.missedCount > 0 ? 'warning' : 'success'}
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Table
        columns={columns}
        dataSource={data.missedMembers}
        rowKey="user_id"
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
