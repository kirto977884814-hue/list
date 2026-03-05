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
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">

            {/* 使用说明 */}
            <div style={{ background: '#fff', padding: '16px', borderRadius: '8px' }}>
              <Title level={4}>使用说明</Title>
              <ol style={{ paddingLeft: 20, margin: 0 }}>
                <li>首先导入会员名单Excel（包含"用户ID"和"用户昵称"两列）</li>
                <li>然后导入观看直播名单Excel（包含"用户ID"列）</li>
                <li>系统自动对比并展示未观看直播的会员名单</li>
              </ol>
            </div>

            <Divider />

            {/* 会员名单导入 */}
            <MemberImport />

            {/* 观看名单导入 */}
            <ViewRecordImport onImportSuccess={handleViewImportSuccess} />

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
