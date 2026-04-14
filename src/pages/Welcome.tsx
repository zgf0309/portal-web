import {
  ApiOutlined,
  ArrowDownOutlined,
  BookOutlined,
  CloudOutlined,
  DatabaseOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { Card, Grid, Space, Tag, Typography, theme } from 'antd';
import type { CSSProperties, ReactNode } from 'react';

type PlatformItem = {
  title: string;
  path: string;
  subtitle: string;
  description: string;
  icon: ReactNode;
  accentColor: string;
  accentSoft: string;
  tags: string[];
};

const PLATFORM_ITEMS: PlatformItem[] = [
  {
    title: '智能体平台',
    path: '/agent',
    subtitle: 'Agent Platform',
    description: '面向最终用户的交互入口，提供自主规划、任务执行与多模态交互能力。',
    icon: <RobotOutlined />,
    accentColor: '#52c41a',
    accentSoft: '#f6ffed',
    tags: ['自主决策', '多轮对话', '插件调用'],
  },
  {
    title: '知识管理平台',
    path: '/knowledgeSystem',
    subtitle: 'Knowledge Platform',
    description: 'RAG 核心引擎，负责非结构化数据的清洗、向量化存储、知识图谱构建及检索增强。',
    icon: <BookOutlined />,
    accentColor: '#4096ff',
    accentSoft: '#f0f7ff',
    tags: ['向量数据库', '知识图谱', '语义检索'],
  },
  {
    title: 'OpenClaw 平台',
    path: '/openClaw',
    subtitle: 'Data Collection Platform',
    description: '数据采集与处理工具箱，提供自动化爬虫、数据清洗流水线及隐私脱敏服务。',
    icon: <CloudOutlined />,
    accentColor: '#36cfc9',
    accentSoft: '#f0fffe',
    tags: ['自动化采集', 'ETL 流水线', '数据清洗'],
  },
  {
    title: '高质量数据平台',
    path: '/high-quality-data',
    subtitle: 'Dataset Platform',
    description: '平台的燃料库，管理预训练语料、SFT 指令集采及 RLHF 奖励数据，确保数据质量与合规。',
    icon: <DatabaseOutlined />,
    accentColor: '#faad14',
    accentSoft: '#fffaf0',
    tags: ['数据标注', '版本管理', '质量评估'],
  },
  {
    title: '训推平台',
    path: '/training',
    subtitle: 'Training & Inference Platform',
    description: '算力调度与模型工厂，支持分布式训练、微调、量化及高并发推理服务。',
    icon: <ApiOutlined />,
    accentColor: '#9254de',
    accentSoft: '#faf5ff',
    tags: ['GPU 集群', '模型仓库', '弹性伸缩'],
  },
];

const PlatformCard = ({ item, compact }: { item: PlatformItem; compact: boolean }) => {
  const { token } = theme.useToken();

  const tagStyle: CSSProperties = {
    marginInlineEnd: 0,
    border: 'none',
    borderRadius: 8,
    paddingInline: 10,
    paddingBlock: 4,
    fontSize: 12,
    lineHeight: '18px',
    color: item.accentColor,
    background: item.accentSoft,
  };

  return (
    <Card
      bordered
      style={{
        borderRadius: 12,
        borderInlineStart: `4px solid ${item.accentColor}`,
        boxShadow: '0 10px 28px rgba(15, 23, 42, 0.04)',
      }}
      styles={{
        body: {
          padding: compact ? 20 : 24,
        },
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: compact ? 'column' : 'row',
          justifyContent: 'space-between',
          gap: 20,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <Space size={10} align="start">
            <div
              style={{
                color: item.accentColor,
                fontSize: 18,
                lineHeight: 1,
                paddingTop: 2,
              }}
            >
              {item.icon}
            </div>
            <div>
              <Space size={8} wrap>
                <Typography.Text
                  style={{ fontSize: 15, fontWeight: 700 }}
                >
                  <Link
                    to={item.path}
                    style={{
                      color: item.accentColor,
                    }}
                  >
                    {item.title}
                  </Link>
                </Typography.Text>
                <Typography.Text
                  style={{
                    fontSize: 12,
                    color: token.colorTextTertiary,
                  }}
                >
                  {item.subtitle}
                </Typography.Text>
              </Space>
              <Typography.Paragraph
                style={{
                  marginTop: 10,
                  marginBottom: 0,
                  color: token.colorTextSecondary,
                  fontSize: 14,
                  lineHeight: '24px',
                }}
              >
                {item.description}
              </Typography.Paragraph>
            </div>
          </Space>
        </div>
        <Space size={[10, 10]} wrap style={{ maxWidth: compact ? '100%' : 280, justifyContent: 'flex-end' }}>
          {item.tags.map((tag) => (
            <Tag key={tag} style={tagStyle}>
              {tag}
            </Tag>
          ))}
        </Space>
      </div>
    </Card>
  );
};

const Welcome = () => {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const compact = !screens.lg;

  return (
    <PageContainer title={false}>
      <Card
        bordered={false}
        style={{
          borderRadius: 16,
          background: 'linear-gradient(180deg, #ffffff 0%, #fcfdff 100%)',
          boxShadow: '0 14px 38px rgba(15, 23, 42, 0.06)',
        }}
        styles={{
          body: {
            padding: compact ? 20 : 34,
          },
        }}
      >
        <div
          style={{
            maxWidth: 980,
            margin: '0 auto',
          }}
        >
          <Typography.Title
            level={2}
            style={{
              marginTop: 8,
              marginBottom: compact ? 28 : 34,
              textAlign: 'center',
              fontSize: compact ? 28 : 40,
              fontWeight: 700,
              color: token.colorTextHeading,
            }}
          >
            AI中台全景架构图
          </Typography.Title>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {PLATFORM_ITEMS.map((item, index) => (
              <div key={item.title}>
                <PlatformCard item={item} compact={compact} />
                {index < PLATFORM_ITEMS.length - 1 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: token.colorBorderSecondary,
                      fontSize: 18,
                      paddingBlock: 8,
                    }}
                  >
                    <ArrowDownOutlined />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
