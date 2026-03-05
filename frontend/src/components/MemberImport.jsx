import React, { useState, useEffect } from 'react';
import { Upload, Button, Space, Typography, Collapse, message } from 'antd';
import { UploadOutlined, ReloadOutlined } from '@ant-design/icons';
import { parseMemberExcel } from '../utils/excelParser';
import { saveMembers, getMemberStats } from '../utils/storage';

const { Text } = Typography;

function MemberImport({ onImportSuccess }) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalMembers: 0, lastUpdated: null });
  const [hasData, setHasData] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const fetchStats = () => {
    const data = getMemberStats();
    setStats(data);
    const hasMembers = data.totalMembers > 0;
    setHasData(hasMembers);
    // 有数据时自动折叠
    if (hasMembers) {
      setIsCollapsed(true);
    }
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

      // 导入成功后自动折叠
      setIsCollapsed(true);

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
    showUploadList: false,
    beforeUpload: handleUpload,
    disabled: loading,
    accept: '.xlsx,.xls',
  };

  const collapseItems = [
    {
      key: '1',
      label: hasData ? `会员名单已导入 (${stats.totalMembers}人) - 点击修改` : '导入会员名单',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <div>
            <Text type="secondary">上传包含"用户ID"和"用户昵称"的Excel文件</Text>
          </div>
          <Upload {...uploadProps}>
            <Button
              type="primary"
              size="large"
              icon={<UploadOutlined />}
              loading={loading}
            >
              点击上传会员名单
            </Button>
          </Upload>
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              支持 .xlsx 或 .xls 格式
            </Text>
          </div>
        </Space>
      ),
    },
  ];

  return (
    <Collapse
      items={collapseItems}
      activeKey={isCollapsed ? [] : ['1']}
      onChange={(keys) => setIsCollapsed(keys.length === 0)}
      bordered={false}
      style={{ background: 'transparent' }}
    />
  );
}

export default MemberImport;
