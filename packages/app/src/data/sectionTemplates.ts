import { VNode } from '../types/vdom';

export interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  category: 'hero' | 'metric' | 'nav' | 'form' | 'pricing' | 'mobile';
  badge?: string;
  createNode: () => VNode;
}

export const SECTION_TEMPLATES: SectionTemplate[] = [
  // 1. Hero Headline Section
  {
    id: 'tpl-hero-section',
    name: '모던 히어로 섹션 (Hero Section)',
    description: '타이틀, 배지, 서브텍스트 및 액션 CTA 버튼 그룹',
    category: 'hero',
    badge: '인기',
    createNode: (): VNode => {
      const ts = Date.now();
      return {
        id: `node-hero-${ts}`,
        type: 'section',
        name: '히어로 섹션',
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: 32,
          gap: 16,
          backgroundColor: '#0f172a',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#1e293b',
          color: '#ffffff',
          width: '100%'
        },
        children: [
          {
            id: `node-hero-badge-${ts}`,
            type: 'badge',
            name: '신규 기능 알림 배지',
            content: '✨ 차세대 AI 핀테크 플랫폼 v2.0 공개',
            style: {
              fontSize: 11,
              fontWeight: 600,
              color: '#38bdf8',
              backgroundColor: '#0369a1',
              padding: 6,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: '#0284c7'
            }
          },
          {
            id: `node-hero-title-${ts}`,
            type: 'heading',
            name: '메인 헤드라인',
            content: '금융의 새로운 기준,\n하나의 앱으로 모두 연결',
            style: {
              fontSize: 26,
              fontWeight: 'bold',
              lineHeight: 1.3,
              color: '#ffffff',
              textAlign: 'center'
            }
          },
          {
            id: `node-hero-sub-${ts}`,
            type: 'text',
            name: '보조 설명 문구',
            content: '실시간 자산 포트폴리오 분석부터 맞춤형 투자 인사이트까지 한눈에 확인하세요.',
            style: {
              fontSize: 13,
              color: '#94a3b8',
              lineHeight: 1.5,
              maxWidth: 420
            }
          },
          {
            id: `node-hero-actions-${ts}`,
            type: 'box',
            name: 'CTA 버튼 그룹',
            style: {
              display: 'flex',
              flexDirection: 'row',
              gap: 12,
              marginTop: 8
            },
            children: [
              {
                id: `node-hero-cta1-${ts}`,
                type: 'button',
                name: '시작하기 CTA 버튼',
                content: '무료로 시작하기',
                style: {
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  padding: 12,
                  borderRadius: 12,
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
                }
              },
              {
                id: `node-hero-cta2-${ts}`,
                type: 'button',
                name: '데모 보기 버튼',
                content: '라이브 데모 보기',
                style: {
                  backgroundColor: '#1e293b',
                  color: '#cbd5e1',
                  fontWeight: 600,
                  padding: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#334155'
                }
              }
            ]
          }
        ]
      };
    }
  },

  // 2. Metric KPI Cards Row
  {
    id: 'tpl-metric-cards',
    name: '통계 지표 카드 행 (Metric Cards Row)',
    description: '3열 핵심 KPI 지표 및 상승/하락 트렌드 배지',
    category: 'metric',
    badge: '필수',
    createNode: (): VNode => {
      const ts = Date.now();
      return {
        id: `node-metrics-${ts}`,
        type: 'box',
        name: 'KPI 지표 요약 행',
        style: {
          display: 'flex',
          flexDirection: 'row',
          gap: 12,
          width: '100%'
        },
        children: [
          {
            id: `node-mcard1-${ts}`,
            type: 'card',
            name: '총 자산 지표 카드',
            style: {
              flex: 1,
              backgroundColor: '#1e293b',
              padding: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#334155'
            },
            children: [
              {
                id: `node-m1-lbl-${ts}`,
                type: 'text',
                name: '라벨',
                content: '총 관리 자산',
                style: { fontSize: 11, color: '#94a3b8' }
              },
              {
                id: `node-m1-val-${ts}`,
                type: 'text',
                name: '금액 수치',
                content: '$ 1,280,450',
                style: { fontSize: 20, fontWeight: 'bold', color: '#38bdf8', marginTop: 4 }
              },
              {
                id: `node-m1-badge-${ts}`,
                type: 'badge',
                name: '상승률 배지',
                content: '+18.4% 이번 달',
                style: { fontSize: 10, color: '#10b981', backgroundColor: '#064e3b', padding: 3, borderRadius: 6, marginTop: 8 }
              }
            ]
          },
          {
            id: `node-mcard2-${ts}`,
            type: 'card',
            name: '활성 유저 지표 카드',
            style: {
              flex: 1,
              backgroundColor: '#1e293b',
              padding: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#334155'
            },
            children: [
              {
                id: `node-m2-lbl-${ts}`,
                type: 'text',
                name: '라벨',
                content: '월간 활성 유저',
                style: { fontSize: 11, color: '#94a3b8' }
              },
              {
                id: `node-m2-val-${ts}`,
                type: 'text',
                name: '유저 수',
                content: '342,800명',
                style: { fontSize: 20, fontWeight: 'bold', color: '#10b981', marginTop: 4 }
              },
              {
                id: `node-m2-badge-${ts}`,
                type: 'badge',
                name: '성장 배지',
                content: '+8.2% 증가',
                style: { fontSize: 10, color: '#10b981', backgroundColor: '#064e3b', padding: 3, borderRadius: 6, marginTop: 8 }
              }
            ]
          },
          {
            id: `node-mcard3-${ts}`,
            type: 'card',
            name: '가동률 지표 카드',
            style: {
              flex: 1,
              backgroundColor: '#1e293b',
              padding: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#334155'
            },
            children: [
              {
                id: `node-m3-lbl-${ts}`,
                type: 'text',
                name: '라벨',
                content: '서비스 가동률',
                style: { fontSize: 11, color: '#94a3b8' }
              },
              {
                id: `node-m3-val-${ts}`,
                type: 'text',
                name: '수치',
                content: '99.99%',
                style: { fontSize: 20, fontWeight: 'bold', color: '#fbbf24', marginTop: 4 }
              },
              {
                id: `node-m3-badge-${ts}`,
                type: 'badge',
                name: '상태 배지',
                content: '● 정상 운영',
                style: { fontSize: 10, color: '#10b981', backgroundColor: '#064e3b', padding: 3, borderRadius: 6, marginTop: 8 }
              }
            ]
          }
        ]
      };
    }
  },

  // 3. App Navbar / Header
  {
    id: 'tpl-navbar-header',
    name: '앱 상단 네비게이션 (Navbar / Header)',
    description: '로고, 4개 메뉴 링크, 검색 입력창 및 사용자 프로필 버튼',
    category: 'nav',
    createNode: (): VNode => {
      const ts = Date.now();
      return {
        id: `node-navbar-${ts}`,
        type: 'header',
        name: '상단 네비게이션 헤더',
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
          backgroundColor: '#090d16',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#1e293b',
          width: '100%'
        },
        children: [
          {
            id: `node-nav-logo-${ts}`,
            type: 'box',
            name: '로고 그룹',
            style: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 },
            children: [
              {
                id: `node-nav-symbol-${ts}`,
                type: 'circle',
                name: '브랜드 심볼',
                style: { width: 28, height: 28, backgroundColor: '#4f46e5', borderRadius: 999 }
              },
              {
                id: `node-nav-brand-${ts}`,
                type: 'text',
                name: '브랜드 명',
                content: 'APEX Fin',
                style: { fontSize: 15, fontWeight: 'bold', color: '#ffffff' }
              }
            ]
          },
          {
            id: `node-nav-links-${ts}`,
            type: 'nav',
            name: '네비 링크 목록',
            style: { display: 'flex', flexDirection: 'row', gap: 16 },
            children: [
              { id: `node-nl-1-${ts}`, type: 'text', name: '링크 1', content: '대시보드', style: { fontSize: 12, fontWeight: 600, color: '#38bdf8' } },
              { id: `node-nl-2-${ts}`, type: 'text', name: '링크 2', content: '자산 관리', style: { fontSize: 12, color: '#94a3b8' } },
              { id: `node-nl-3-${ts}`, type: 'text', name: '링크 3', content: '시장 통계', style: { fontSize: 12, color: '#94a3b8' } },
              { id: `node-nl-4-${ts}`, type: 'text', name: '링크 4', content: '고객지원', style: { fontSize: 12, color: '#94a3b8' } }
            ]
          },
          {
            id: `node-nav-cta-${ts}`,
            type: 'button',
            name: '로그인 버튼',
            content: '로그인 / 가입',
            style: {
              fontSize: 12,
              fontWeight: 600,
              backgroundColor: '#1e293b',
              color: '#ffffff',
              padding: 8,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#334155'
            }
          }
        ]
      };
    }
  },

  // 4. Auth Login Form Card
  {
    id: 'tpl-auth-form',
    name: '로그인 & 가입 폼 카드 (Auth Form)',
    description: '이메일, 비밀번호, 자동로그인 체크박스 및 그라데이션 로그인 버튼',
    category: 'form',
    badge: '추천',
    createNode: (): VNode => {
      const ts = Date.now();
      return {
        id: `node-auth-${ts}`,
        type: 'card',
        name: '로그인 폼 컨테이너',
        style: {
          display: 'flex',
          flexDirection: 'column',
          padding: 24,
          backgroundColor: '#0f172a',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#1e293b',
          gap: 16,
          width: '100%',
          maxWidth: 380
        },
        children: [
          {
            id: `node-auth-title-${ts}`,
            type: 'heading',
            name: '폼 제목',
            content: '계정 로그인',
            style: { fontSize: 20, fontWeight: 'bold', color: '#ffffff' }
          },
          {
            id: `node-auth-desc-${ts}`,
            type: 'text',
            name: '안내 텍스트',
            content: '등록된 이메일 계정으로 안전하게 접속하세요.',
            style: { fontSize: 12, color: '#94a3b8' }
          },
          {
            id: `node-auth-inputs-${ts}`,
            type: 'box',
            name: '입력 필드 그룹',
            style: { display: 'flex', flexDirection: 'column', gap: 10 },
            children: [
              {
                id: `node-input-email-${ts}`,
                type: 'input',
                name: '이메일 입력창',
                content: 'user@example.com',
                props: { type: 'email', placeholder: '이메일을 입력하세요' },
                style: { backgroundColor: '#1e293b', color: '#ffffff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#334155' }
              },
              {
                id: `node-input-pw-${ts}`,
                type: 'input',
                name: '비밀번호 입력창',
                content: '••••••••••••',
                props: { type: 'password', placeholder: '비밀번호' },
                style: { backgroundColor: '#1e293b', color: '#ffffff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#334155' }
              }
            ]
          },
          {
            id: `node-auth-btn-${ts}`,
            type: 'button',
            name: '로그인 실행 버튼',
            content: '로그인 및 계속하기',
            style: {
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              fontWeight: 'bold',
              padding: 14,
              borderRadius: 12,
              textAlign: 'center',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
            }
          }
        ]
      };
    }
  },

  // 5. Pricing Tier Card
  {
    id: 'tpl-pricing-tier',
    name: '가격 책정 티어 카드 (Pricing Tier Card)',
    description: '월간 요금제, 인기 배지, 5개 기능 체크리스트 및 결제 버튼',
    category: 'pricing',
    createNode: (): VNode => {
      const ts = Date.now();
      return {
        id: `node-pricing-${ts}`,
        type: 'card',
        name: 'Pro 요금제 카드',
        style: {
          display: 'flex',
          flexDirection: 'column',
          padding: 24,
          backgroundColor: '#131b2e',
          borderRadius: 20,
          borderWidth: 1.5,
          borderColor: '#6366f1',
          gap: 16,
          width: '100%',
          boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.2)'
        },
        children: [
          {
            id: `node-pbadge-${ts}`,
            type: 'badge',
            name: '인기 플랜 배지',
            content: '★ 가장 인기 있는 플랜',
            style: { fontSize: 10, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#4f46e5', padding: 4, borderRadius: 6 }
          },
          {
            id: `node-pname-${ts}`,
            type: 'heading',
            name: '플랜 명',
            content: 'Pro Unlimited',
            style: { fontSize: 20, fontWeight: 'bold', color: '#ffffff' }
          },
          {
            id: `node-pprice-${ts}`,
            type: 'text',
            name: '가격 표시',
            content: '₩ 29,000 / 월',
            style: { fontSize: 24, fontWeight: 'bold', color: '#38bdf8' }
          },
          {
            id: `node-pfeatures-${ts}`,
            type: 'box',
            name: '기능 체크리스트',
            style: { display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 },
            children: [
              { id: `node-pf1-${ts}`, type: 'text', name: '기능 1', content: '✓ 실시간 무제한 시장 데이터', style: { fontSize: 12, color: '#cbd5e1' } },
              { id: `node-pf2-${ts}`, type: 'text', name: '기능 2', content: '✓ AI 스마트 주문 추천 알고리즘', style: { fontSize: 12, color: '#cbd5e1' } },
              { id: `node-pf3-${ts}`, type: 'text', name: '기능 3', content: '✓ 전용 클라우드 동기화 및 백업', style: { fontSize: 12, color: '#cbd5e1' } },
              { id: `node-pf4-${ts}`, type: 'text', name: '기능 4', content: '✓ 24시간 우선 고객 기술 지원', style: { fontSize: 12, color: '#cbd5e1' } }
            ]
          },
          {
            id: `node-pbtn-${ts}`,
            type: 'button',
            name: '구독 신청 버튼',
            content: 'Pro 시작하기 (14일 무료)',
            style: {
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              fontWeight: 'bold',
              padding: 12,
              borderRadius: 12,
              textAlign: 'center'
            }
          }
        ]
      };
    }
  },

  // 6. Mobile Bottom Tab Bar
  {
    id: 'tpl-bottom-tabs',
    name: '모바일 하단 탭 바 (Mobile Bottom Tab Bar)',
    description: '모바일 앱용 5개 탭 네비게이션 (홈, 지갑, 마켓, 알림, 프로필)',
    category: 'mobile',
    badge: '모바일',
    createNode: (): VNode => {
      const ts = Date.now();
      return {
        id: `node-tabbar-${ts}`,
        type: 'box',
        name: '하단 탭 바 컨테이너',
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: 12,
          backgroundColor: '#090d16',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#1e293b',
          width: '100%'
        },
        children: [
          {
            id: `node-tab-home-${ts}`,
            type: 'box',
            name: '홈 탭',
            style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
            children: [
              { id: `node-th-i-${ts}`, type: 'circle', name: '아이콘', style: { width: 14, height: 14, backgroundColor: '#6366f1' } },
              { id: `node-th-l-${ts}`, type: 'text', name: '라벨', content: '홈', style: { fontSize: 10, fontWeight: 'bold', color: '#6366f1' } }
            ]
          },
          {
            id: `node-tab-wallet-${ts}`,
            type: 'box',
            name: '지갑 탭',
            style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
            children: [
              { id: `node-tw-i-${ts}`, type: 'circle', name: '아이콘', style: { width: 14, height: 14, backgroundColor: '#64748b' } },
              { id: `node-tw-l-${ts}`, type: 'text', name: '라벨', content: '자산', style: { fontSize: 10, color: '#64748b' } }
            ]
          },
          {
            id: `node-tab-market-${ts}`,
            type: 'box',
            name: '마켓 탭',
            style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
            children: [
              { id: `node-tm-i-${ts}`, type: 'circle', name: '아이콘', style: { width: 14, height: 14, backgroundColor: '#64748b' } },
              { id: `node-tm-l-${ts}`, type: 'text', name: '라벨', content: '투자', style: { fontSize: 10, color: '#64748b' } }
            ]
          },
          {
            id: `node-tab-alerts-${ts}`,
            type: 'box',
            name: '알림 탭',
            style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
            children: [
              { id: `node-ta-i-${ts}`, type: 'circle', name: '아이콘', style: { width: 14, height: 14, backgroundColor: '#64748b' } },
              { id: `node-ta-l-${ts}`, type: 'text', name: '라벨', content: '알림', style: { fontSize: 10, color: '#64748b' } }
            ]
          },
          {
            id: `node-tab-my-${ts}`,
            type: 'box',
            name: '마이 탭',
            style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
            children: [
              { id: `node-ty-i-${ts}`, type: 'circle', name: '아이콘', style: { width: 14, height: 14, backgroundColor: '#64748b' } },
              { id: `node-ty-l-${ts}`, type: 'text', name: '라벨', content: 'MY', style: { fontSize: 10, color: '#64748b' } }
            ]
          }
        ]
      };
    }
  }
];
