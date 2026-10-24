import { VDomArtboard, VNode } from '../types/vdom';

// 1. Screen 1: AI Asset Home Root Node
const screen1Root: VNode = {
  id: 'node-s1-root',
  type: 'frame',
  name: 'Home Frame Container',
  style: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    backgroundColor: '#090d16',
    color: '#ffffff',
    padding: 20
  },
  children: [
    // Top Section Container
    {
      id: 'node-s1-top',
      type: 'box',
      name: 'Top Header & Cards',
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      },
      children: [
        // Header Row
        {
          id: 'node-s1-header',
          type: 'box',
          name: 'Profile Header Bar',
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          },
          children: [
            {
              id: 'node-s1-title-box',
              type: 'box',
              name: 'Title Group',
              style: { display: 'flex', flexDirection: 'column' },
              children: [
                {
                  id: 'node-s1-greeting',
                  type: 'text',
                  name: 'Greeting Subtext',
                  content: '반가워요, 서윤님',
                  style: { fontSize: 11, color: '#94a3b8' }
                },
                {
                  id: 'node-s1-heading',
                  type: 'text',
                  name: 'Main App Heading',
                  content: '스마트 포트폴리오',
                  style: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' }
                }
              ]
            },
            {
              id: 'node-s1-avatar',
              type: 'box',
              name: 'User Avatar Badge',
              content: 'SY',
              style: {
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#6366f1',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: 12
              }
            }
          ]
        },

        // Hero Balance Card (Gradient)
        {
          id: 'node-s1-hero',
          type: 'card',
          name: 'Hero Balance Card',
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: 20,
            borderRadius: 24,
            backgroundGradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
            boxShadow: '0 20px 25px -5px rgba(79, 70, 229, 0.3)'
          },
          children: [
            {
              id: 'node-s1-badge-row',
              type: 'box',
              name: 'Badge Header Row',
              style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
              children: [
                {
                  id: 'node-s1-balance-label',
                  type: 'text',
                  name: 'Balance Label',
                  content: '총 평가 자산',
                  style: { fontSize: 11, color: '#e0e7ff' }
                },
                {
                  id: 'node-s1-ai-badge',
                  type: 'badge',
                  name: 'AI Rebalance Badge',
                  content: '✨ AI 자동 운용 중',
                  condition: {
                    enabled: true,
                    matchType: 'and',
                    rules: [
                      {
                        id: 'rule-theme-multi',
                        tweakId: 'theme',
                        operator: 'in',
                        values: ['dark', 'cyber']
                      },
                      {
                        id: 'rule-badge-toggle',
                        tweakId: 'showAiBadge',
                        operator: 'in',
                        values: [true]
                      }
                    ]
                  },
                  style: {
                    fontSize: 10,
                    fontWeight: 'bold',
                    padding: '3px 8px',
                    borderRadius: 12,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }
                }
              ]
            },
            {
              id: 'node-s1-balance-val',
              type: 'text',
              name: 'Total Balance Text',
              content: '₩ 34,820,000',
              style: { fontSize: 28, fontWeight: '900', color: '#ffffff' }
            },
            {
              id: 'node-s1-profit',
              type: 'text',
              name: 'Profit Indicator Text',
              content: '▲ +18.4% 이번 달 수익 (+₩5,420,000)',
              style: { fontSize: 11, fontWeight: 'bold', color: '#6ee7b7' }
            }
          ]
        },

        // Featured Market Image Banner
        {
          id: 'node-s1-promo-img',
          type: 'image',
          name: '투자 마켓 분석 배너',
          content: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
          props: { alt: 'AI Market Analysis' },
          style: {
            width: '100%',
            height: 85,
            borderRadius: 16,
            objectFit: 'cover',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }
        },

        // Allocation Card with Scroll Container
        {
          id: 'node-s1-alloc-card',
          type: 'card',
          name: 'Asset Allocation Card',
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: 14,
            borderRadius: 20,
            backgroundColor: '#111827',
            borderWidth: 1,
            borderColor: '#1f2937'
          },
          children: [
            {
              id: 'node-s1-scroll-list',
              type: 'scroll-container',
              name: '보유 자산 스크롤 목록',
              style: {
                maxHeight: 120,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                paddingRight: 4
              },
              children: [
                {
                  id: 'node-s1-asset-1',
                  type: 'box',
                  name: 'S&P 500 Item Row',
                  style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' },
                  children: [
                    {
                      id: 'node-s1-asset1-title',
                      type: 'text',
                      name: 'Asset Name',
                      content: '미국 대형 기술주 ETF (52%)',
                      style: { fontSize: 12, fontWeight: 'bold', color: '#f3f4f6' }
                    },
                    {
                      id: 'node-s1-asset1-val',
                      type: 'text',
                      name: 'Asset Value',
                      content: '₩ 18,100,000',
                      style: { fontSize: 12, fontWeight: 'bold', color: '#60a5fa' }
                    }
                  ]
                },
                {
                  id: 'node-s1-divider',
                  type: 'divider',
                  name: 'Separator Line',
                  style: { height: 1, backgroundColor: '#1f2937' }
                },
                {
                  id: 'node-s1-asset-2',
                  type: 'box',
                  name: 'Bitcoin Item Row',
                  style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' },
                  children: [
                    {
                      id: 'node-s1-asset2-title',
                      type: 'text',
                      name: 'Asset Name',
                      content: '비트코인 디지털 자산 (28%)',
                      style: { fontSize: 12, fontWeight: 'bold', color: '#f3f4f6' }
                    },
                    {
                      id: 'node-s1-asset2-val',
                      type: 'text',
                      name: 'Asset Value',
                      content: '₩ 9,750,000',
                      style: { fontSize: 12, fontWeight: 'bold', color: '#f59e0b' }
                    }
                  ]
                },
                {
                  id: 'node-s1-divider-2',
                  type: 'divider',
                  name: 'Separator Line 2',
                  style: { height: 1, backgroundColor: '#1f2937' }
                },
                {
                  id: 'node-s1-asset-3',
                  type: 'box',
                  name: 'Ethereum Item Row',
                  style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' },
                  children: [
                    {
                      id: 'node-s1-asset3-title',
                      type: 'text',
                      name: 'Asset Name',
                      content: '이더리움 스테이킹 자산 (12%)',
                      style: { fontSize: 12, fontWeight: 'bold', color: '#f3f4f6' }
                    },
                    {
                      id: 'node-s1-asset3-val',
                      type: 'text',
                      name: 'Asset Value',
                      content: '₩ 4,180,000',
                      style: { fontSize: 12, fontWeight: 'bold', color: '#a855f7' }
                    }
                  ]
                },
                {
                  id: 'node-s1-divider-3',
                  type: 'divider',
                  name: 'Separator Line 3',
                  style: { height: 1, backgroundColor: '#1f2937' }
                },
                {
                  id: 'node-s1-asset-4',
                  type: 'box',
                  name: 'Cash Item Row',
                  style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' },
                  children: [
                    {
                      id: 'node-s1-asset4-title',
                      type: 'text',
                      name: 'Asset Name',
                      content: '원화 현금성 예치금 (8%)',
                      style: { fontSize: 12, fontWeight: 'bold', color: '#f3f4f6' }
                    },
                    {
                      id: 'node-s1-asset4-val',
                      type: 'text',
                      name: 'Asset Value',
                      content: '₩ 2,790,000',
                      style: { fontSize: 12, fontWeight: 'bold', color: '#10b981' }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },

    // Bottom Action Button
    {
      id: 'node-s1-btn',
      type: 'button',
      name: 'Order CTA Button',
      content: '+ 즉시 매수 주문하기',
      events: [
        {
          id: 'evt-s1-order-nav',
          trigger: 'click',
          action: {
            type: 'navigate',
            targetArtboardId: 'artboard-2'
          },
          description: '클릭 시 간편 주문 모달 화면으로 이동'
        },
        {
          id: 'evt-s1-theme-cycle',
          trigger: 'contextmenu',
          action: {
            type: 'change_tweak',
            tweakId: 'theme',
            operation: 'cycle'
          },
          description: '우클릭 시 컬러 모드 테마 순환 (dark -> light -> cyber)'
        }
      ],
      style: {
        width: '100%',
        padding: 16,
        borderRadius: 18,
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)'
      }
    }
  ]
};

// 2. Screen 2: Quick Order Modal Root Node
const screen2Root: VNode = {
  id: 'node-s2-root',
  type: 'frame',
  name: 'Order Modal Container',
  style: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
    backgroundColor: '#090d16',
    padding: 16
  },
  children: [
    {
      id: 'node-s2-sheet',
      type: 'card',
      name: 'Bottom Order Sheet',
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 24,
        borderRadius: 28,
        backgroundColor: '#111827',
        borderWidth: 1,
        borderColor: '#1f2937'
      },
      children: [
        {
          id: 'node-s2-handle',
          type: 'box',
          name: 'Handle Indicator',
          style: {
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#374151',
            margin: '0 auto 8px auto'
          }
        },
        {
          id: 'node-s2-title-row',
          type: 'box',
          name: 'Sheet Title Row',
          style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
          children: [
            {
              id: 'node-s2-title',
              type: 'text',
              name: 'Order Target Title',
              content: '비트코인 (BTC) 매수',
              style: { fontSize: 18, fontWeight: '900', color: '#ffffff' }
            },
            {
              id: 'node-s2-badge',
              type: 'badge',
              name: 'Order Type Badge',
              content: '시장가 주문',
              style: {
                fontSize: 11,
                fontWeight: 'bold',
                padding: '4px 10px',
                borderRadius: 12,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8'
              }
            }
          ]
        },
        {
          id: 'node-s2-display-box',
          type: 'box',
          name: 'Amount Display Box',
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 16,
            borderRadius: 18,
            backgroundColor: '#030712',
            borderWidth: 1,
            borderColor: '#1f2937'
          },
          children: [
            {
              id: 'node-s2-display-label',
              type: 'text',
              name: 'Amount Label',
              content: '주문 금액',
              style: { fontSize: 11, color: '#6b7280' }
            },
            {
              id: 'node-s2-display-val',
              type: 'text',
              name: 'Amount Value',
              content: '₩ 1,000,000',
              style: { fontSize: 26, fontWeight: '900', color: '#818cf8', margin: '4px 0' }
            },
            {
              id: 'node-s2-btc-sub',
              type: 'text',
              name: 'BTC Equivalent',
              content: '≈ 0.007225 BTC',
              style: { fontSize: 10, color: '#9ca3af' }
            }
          ]
        },
        {
          id: 'node-s2-submit-btn',
          type: 'button',
          name: 'Biometric Confirm Button',
          content: '지문 인식으로 즉시 체결',
          style: {
            width: '100%',
            padding: 16,
            borderRadius: 18,
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 'bold',
            textAlign: 'center'
          }
        }
      ]
    }
  ]
};

// 3. Screen 3: Order Success Root Node
const screen3Root: VNode = {
  id: 'node-s3-root',
  type: 'frame',
  name: 'Success Frame Container',
  style: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    backgroundColor: '#090d16',
    color: '#ffffff',
    padding: 24
  },
  children: [
    {
      id: 'node-s3-center',
      type: 'box',
      name: 'Center Content Group',
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 48,
        gap: 16
      },
      children: [
        {
          id: 'node-s3-icon',
          type: 'circle',
          name: 'Success Check Icon',
          content: '✓',
          style: {
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            borderWidth: 2,
            borderColor: 'rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            fontWeight: 'bold'
          }
        },
        {
          id: 'node-s3-title',
          type: 'text',
          name: 'Success Heading',
          content: '주문이 체결되었습니다!',
          style: { fontSize: 22, fontWeight: '900', color: '#ffffff' }
        },
        {
          id: 'node-s3-desc',
          type: 'text',
          name: 'Success Subtitle',
          content: '블록체인 네트워크 승인 완료 (0.4초)',
          style: { fontSize: 11, color: '#9ca3af' }
        },
        {
          id: 'node-s3-receipt',
          type: 'card',
          name: 'Receipt Details Card',
          style: {
            width: '100%',
            padding: 18,
            borderRadius: 20,
            backgroundColor: '#111827',
            borderWidth: 1,
            borderColor: '#1f2937',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginTop: 12
          },
          children: [
            {
              id: 'node-s3-r1',
              type: 'box',
              name: 'Row 1',
              style: { display: 'flex', justifyContent: 'space-between' },
              children: [
                { id: 'node-s3-r1-k', type: 'text', name: 'Key', content: '체결 시각', style: { fontSize: 11, color: '#6b7280' } },
                { id: 'node-s3-r1-v', type: 'text', name: 'Val', content: '2026.10.25 00:55', style: { fontSize: 11, color: '#ffffff', fontWeight: 'bold' } }
              ]
            },
            {
              id: 'node-s3-r2',
              type: 'box',
              name: 'Row 2',
              style: { display: 'flex', justifyContent: 'space-between' },
              children: [
                { id: 'node-s3-r2-k', type: 'text', name: 'Key', content: '총 결제 금액', style: { fontSize: 11, color: '#6b7280' } },
                { id: 'node-s3-r2-v', type: 'text', name: 'Val', content: '₩ 1,000,000', style: { fontSize: 13, color: '#818cf8', fontWeight: '900' } }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'node-s3-btn',
      type: 'button',
      name: 'Back to Portfolio Button',
      content: '포트폴리오로 돌아가기',
      style: {
        width: '100%',
        padding: 16,
        borderRadius: 18,
        backgroundColor: '#1f2937',
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center'
      }
    }
  ]
};

export const INITIAL_VDOM_ARTBOARDS: VDomArtboard[] = [
  {
    id: 'artboard-1',
    title: '1. AI 자산 관리 홈 (Home)',
    viewport: 'mobile',
    x: 0,
    y: 0,
    width: 390,
    height: 844,
    rootNode: screen1Root,
    tweaksSchema: [
      { id: 'theme', label: '컬러 모드', control: 'buttons', options: ['dark', 'light', 'cyber'], defaultValue: 'dark' },
      { id: 'showAiBadge', label: 'AI 추천 뱃지', control: 'boolean', defaultValue: true }
    ],
    tweakValues: { theme: 'dark', showAiBadge: true }
  },
  {
    id: 'artboard-2',
    title: '2. 간편 주문 모달 (Order)',
    viewport: 'mobile',
    x: 440,
    y: 0,
    width: 390,
    height: 844,
    rootNode: screen2Root,
    tweaksSchema: [
      { id: 'orderType', label: '주문 방식', control: 'buttons', options: ['시장가', '지정가'], defaultValue: '시장가' }
    ],
    tweakValues: { orderType: '시장가' }
  },
  {
    id: 'artboard-3',
    title: '3. 체결 완료 & 영수증 (Success)',
    viewport: 'mobile',
    x: 880,
    y: 0,
    width: 390,
    height: 844,
    rootNode: screen3Root,
    tweaksSchema: [
      { id: 'showShareCard', label: 'SNS 카드 표시', control: 'boolean', defaultValue: true }
    ],
    tweakValues: { showShareCard: true }
  }
];
