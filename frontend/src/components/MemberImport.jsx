import React, { useState } from 'react';
import { Upload, message, Card, Statistic, Button, Space } from 'antd';
import { InboxOutlined, ReloadOutlined } from '@ant-design/icons';
import { memberAPI } from '../services/api';

const { Dragger } = Upload;

function MemberImport({ onImportSuccess }) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const data = await memberAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('获取统计信息失败:', error);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  const handleUpload = async (file) => {
    setLoading(true);

    try {
      const result = await memberAPI.importMembers(file);

      message.success(`${result.message}，共导入 ${result.count} 名会员`);

      // 刷新统计信息
      await fetchStats();

      // 通知父组件
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (error) {
      message.error('导入失败: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }

    return false; // 阻止自动上传
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx,.xls',
    beforeUpload: handleUpload,
    showUploadList: false,
    disabled: loading,
  };

  return (
    <Card
      title="会员名单导入"
      extra={
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchStats}
          size="small"
        >
          刷新
        </Button>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ textAlign: 'center' }}>
          {stats && (
            <Statistic
              title="当前会员总数"
              value={stats.totalMembers}
              suffix="人"
            />
          )}
        </div>

        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持 .xlsx 或 .xls 格式的Excel文件
            <br />
            文件需包含"用户ID"和"用户昵称"两列
          </p>
        </Dragger>
      </Space>
    </Card>
  );
}

export default MemberImport;
