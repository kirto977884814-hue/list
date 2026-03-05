import React, { useState } from 'react';
import { Upload, message, Card } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { viewRecordAPI } from '../services/api';

const { Dragger } = Upload;

function ViewRecordImport({ onImportSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    setLoading(true);

    try {
      const result = await viewRecordAPI.importViewRecord(file);

      message.success(
        `${result.message}，总会员: ${result.stats.totalMembers}，已观看: ${result.stats.viewedCount}，未观看: ${result.stats.missedCount}`
      );

      // 通知父组件，传递recordId
      if (onImportSuccess) {
        onImportSuccess(result.recordId);
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
    <Card title="观看名单导入">
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">
          支持 .xlsx 或 .xls 格式的Excel文件
          <br />
          文件需包含"用户ID"列
        </p>
      </Dragger>
    </Card>
  );
}

export default ViewRecordImport;
