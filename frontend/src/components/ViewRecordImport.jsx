import React, { useState } from 'react';
import { Upload, message, Card } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { parseViewRecordExcel } from '../utils/excelParser';
import { getMembers, compareMembers } from '../utils/storage';

const { Dragger } = Upload;

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

      message.success(
        `观看名单导入成功，总会员: ${result.totalMembers}，已观看: ${result.viewedCount}，未观看: ${result.missedCount}`
      );

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
