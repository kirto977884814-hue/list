import React, { useState } from 'react';
import { Upload, Button, Space, Typography, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { parseViewRecordExcel } from '../utils/excelParser';
import { getMembers, compareMembers } from '../utils/storage';

const { Text } = Typography;

function ViewRecordImport({ onImportSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    setLoading(true);

    try {
      // 获取会员名单
      const members = getMembers();

      if (members.length === 0) {
        message.error('请先导入会员名单');
        return false;
      }

      // 解析观看名单Excel
      const viewedUserIds = await parseViewRecordExcel(file);

      if (viewedUserIds.length === 0) {
        message.error('Excel中没有找到有效的观看数据');
        return false;
      }

      // 对比数据
      const result = compareMembers(members, viewedUserIds);

      message.success(`观看名单导入成功，未观看: ${result.missedCount}人`);

      // 通知父组件，传递对比结果
      if (onImportSuccess) {
        onImportSuccess(result);
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

  return (
    <div style={{ textAlign: 'center', padding: '24px 0' }}>
      <Space direction="vertical" size="large">
        <div>
          <Text type="secondary">导入观看直播名单</Text>
        </div>
        <Upload {...uploadProps}>
          <Button
            type="primary"
            size="large"
            icon={<UploadOutlined />}
            loading={loading}
          >
            点击上传观看名单
          </Button>
        </Upload>
        <div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            支持 .xlsx 或 .xls 格式
          </Text>
        </div>
      </Space>
    </div>
  );
}

export default ViewRecordImport;
