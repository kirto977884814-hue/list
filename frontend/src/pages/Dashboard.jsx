import React, { useState } from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import MemberImport from '../components/MemberImport';
import ViewRecordImport from '../components/ViewRecordImport';
import ResultDisplay from '../components/ResultDisplay';

const { Header, Content } = Layout;
const { Title } = Typography;

function Dashboard() {
  const [compareResult, setCompareResult] = useState(null);

  const handleViewImportSuccess = (result) => {
    setCompareResult(result);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={3} style={{ margin: '16px 0' }}>
          直播观看对比系统
        </Title>
      </Header>

      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">

            {/* 会员名单导入 - 可折叠 */}
            <div style={{ background: '#fff', padding: '16px', borderRadius: '8px' }}>
              <MemberImport />
            </div>

            <Divider />

            {/* 观看名单导入 - 简洁按钮 */}
            <div style={{ background: '#fff', padding: '16px', borderRadius: '8px' }}>
              <ViewRecordImport onImportSuccess={handleViewImportSuccess} />
            </div>

            <Divider />

            {/* 结果展示 */}
            {compareResult && <ResultDisplay result={compareResult} />}

          </Space>
        </div>
      </Content>
    </Layout>
  );
}

export default Dashboard;
