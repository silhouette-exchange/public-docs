import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const guidesSidebars: SidebarsConfig = {
  guidesSidebar: [
    { type: 'doc', id: 'index', label: 'Guides' },
    {
      type: 'category',
      label: 'For Developers',
      collapsed: false,
      items: ['for-developers/index'],
    },
    {
      type: 'category',
      label: 'For Institutions',
      collapsed: false,
      items: ['for-institutions/index'],
    },
    {
      type: 'category',
      label: 'For Traders',
      collapsed: false,
      items: ['for-traders/index'],
    },
    {
      type: 'category',
      label: 'Comparisons',
      collapsed: false,
      items: ['comparisons/index', 'comparisons/tee-vs-zk-vs-mpc'],
    },
  ],
};

export default guidesSidebars;
