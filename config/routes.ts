export default [
  { name: '首页', icon: 'HomeOutlined', path: '/welcome', component: './Welcome' },
  { name: '训推平台', icon: 'ApiOutlined', path: '/training', component: './training' },
  { name: '高质量数据平台', icon: 'DatabaseOutlined', path: '/high-quality-data', component: './high-quality-data' },
  { name: '知识管理平台', icon: 'BookOutlined', path: '/knowledgeSystem', component: './knowledgeSystem' },
  { name: '智能体平台', icon: 'AndroidOutlined', path: '/agent', component: './agent' },
  { name: 'OpenClaw平台', icon: 'CloudOutlined', path: '/openClaw',  component: './openClaw' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'CrownOutlined',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
