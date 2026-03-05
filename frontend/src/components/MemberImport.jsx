import React, { useState, useEffect } from 'react';
import { Upload, message, Card, Statistic, Button, Space } from 'antd';
import { InboxOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { parseMemberExcel } from '../utils/excelParser';
import { saveMembers, getMemberStats } from '../utils/storage';

const { Dragger } = Upload;

function MemberImport({ onImportSuccess }) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalMembers: 0, lastUpdated: null });

  const fetchStats = () => {
    const data = getMemberStats();
    setStats(data);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpload = async (file) => {
    setLoading(true);

    try {
      const members = await parseMemberExcel(file);

      if (members.length === 0) {
        message.error('Excel中没有找到有效的会员数据');
        return false;
      }

      // 保存到本地存储
      const saved = saveMembers(members);

      if (!saved) {
        message.error('保存数据失败，请检查浏览器存储空间');
        return false;
      }

      message.success(`会员名单导入成功，共导入 ${members.length} 名会员`);

      // 刷新统计信息
      fetchStats();

      // 通知父组件
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (error) {
      message.error('导入失败: ' + error.message);
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
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchStats}
            size="small"
          >
            刷新
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ textAlign: 'center' }}>
          <Statistic
            title="当前会员总数"
            value={stats.totalMembers}
            suffix="人"
          />
          {stats.lastUpdated && (
            <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
              最后更新: {new Date(stats.lastUpdated).toLocaleString('zh-CN')}
            </div>
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
