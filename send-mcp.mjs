import { WebSocket } from 'ws';

const ws = new WebSocket('ws://localhost:49494');

const fintechArtboards = [
  {
    id: 'step-1-home',
    title: '1. AI 자산 관리 홈 (Home)',
    viewport: 'mobile',
    width: 390,
    height: 844,
    tweaksSchema: [
      {
        id: 'theme',
        label: '컬러 모드',
        control: 'buttons',
        options: ['dark', 'light', 'cyber'],
        defaultValue: 'dark'
      },
      {
        id: 'showAiBadge',
        label: 'AI 추천 뱃지 표시',
        control: 'boolean',
        defaultValue: true
      },
      {
        id: 'currency',
        label: '기준 통화',
        control: 'select',
        options: ['KRW (원화)', 'USD (달러)'],
        defaultValue: 'KRW (원화)'
      }
    ],
    tweakValues: {
      theme: 'dark',
      showAiBadge: true,
      currency: 'KRW (원화)'
    },
    code: `export default function AssetHome(props) {
  const { theme, showAiBadge, currency } = props;
  const isDark = theme === 'dark';
  const isCyber = theme === 'cyber';

  const bg = isCyber ? 'bg-[#0a071b] text-cyan-200' : isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900';
  const cardBg = isCyber ? 'bg-[#150f38] border-cyan-500/30' : isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const subText = isCyber ? 'text-cyan-400/70' : isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={\`p-5 h-full flex flex-col justify-between font-sans select-none transition-colors duration-200 \${bg}\`}>
      <div className="space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className={\`text-xs \${subText}\`}>반가워요, 서윤님</div>
            <div className="text-lg font-black tracking-tight mt-0.5">스마트 포트폴리오</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
            SY
          </div>
        </div>

        {/* Hero Balance Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-indigo-100">
            <span>총 평가 자산</span>
            {showAiBadge && (
              <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-[10px] font-bold">
                ✨ AI 자동 리밸런싱 중
              </span>
            )}
          </div>
          <div className="text-3xl font-black tracking-tight">
            {currency.startsWith('KRW') ? '₩ 34,820,000' : '$ 26,480.00'}
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 pt-1">
            <span>▲ +18.4%</span>
            <span className="text-white/70 font-normal">이번 달 수익 (+₩5,420,000)</span>
          </div>
        </div>

        {/* Quick Asset Allocation */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold px-1">
            <span>보유 자산 비중</span>
            <span className="text-indigo-400 text-[11px] cursor-pointer">상세보기</span>
          </div>

          <div className={\`p-4 rounded-2xl border space-y-3 \${cardBg}\`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  S&P
                </div>
                <div>
                  <div className="font-bold text-xs">미국 대형 기술주 ETF</div>
                  <div className={\`text-[10px] \${subText}\`}>52% 비중 · 고수익 추구</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xs">₩ 18,100,000</div>
                <div className="text-[10px] text-emerald-400 font-semibold">+22.4%</div>
              </div>
            </div>

            <div className="h-px bg-slate-500/10" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  BTC
                </div>
                <div>
                  <div className="font-bold text-xs">비트코인 디지털 자산</div>
                  <div className={\`text-[10px] \${subText}\`}>28% 비중 · 인플레이션 헷지</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xs">₩ 9,750,000</div>
                <div className="text-[10px] text-emerald-400 font-semibold">+14.1%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action */}
      <button className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-sm shadow-xl shadow-indigo-600/30 transition active:scale-98">
        + 즉시 매수 주문하기
      </button>
    </div>
  );
}`
  },
  {
    id: 'step-2-order',
    title: '2. 간편 주문 모달 (Quick Order)',
    viewport: 'mobile',
    width: 390,
    height: 844,
    tweaksSchema: [
      {
        id: 'orderType',
        label: '주문 방식',
        control: 'buttons',
        options: ['시장가', '지정가'],
        defaultValue: '시장가'
      },
      {
        id: 'autoSplit',
        label: '분할 매수 활성화',
        control: 'boolean',
        defaultValue: false
      }
    ],
    tweakValues: {
      orderType: '시장가',
      autoSplit: false
    },
    code: `export default function QuickOrder(props) {
  const { orderType, autoSplit } = props;

  return (
    <div className="h-full bg-slate-950/80 p-4 flex flex-col justify-end font-sans select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl space-y-5 animate-in slide-in-from-bottom duration-200">
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto" />
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black tracking-tight">비트코인 (BTC) 매수</h2>
            <p className="text-xs text-slate-400">현재가 ₩ 138,400,000</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            {orderType} 주문
          </span>
        </div>

        {/* Amount Input Display */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 text-center">
          <div className="text-xs text-slate-500">주문 금액 입력</div>
          <div className="text-3xl font-black text-indigo-400 tracking-tight">₩ 1,000,000</div>
          <div className="text-[11px] text-slate-400 font-mono">≈ 0.007225 BTC</div>
        </div>

        {/* Quick Amount Pills */}
        <div className="grid grid-cols-4 gap-2">
          {['+10만', '+50만', '+100만', '전액'].map((pill) => (
            <button key={pill} className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition">
              {pill}
            </button>
          ))}
        </div>

        {/* Order Details */}
        <div className="p-3 bg-slate-950/60 rounded-xl space-y-1.5 text-xs text-slate-400 border border-slate-800/80">
          <div className="flex justify-between">
            <span>체결 수수료 (0.04%)</span>
            <span className="text-emerald-400 font-bold">₩ 400 (할인 적용)</span>
          </div>
          {autoSplit && (
            <div className="flex justify-between text-indigo-400">
              <span>스마트 분할</span>
              <span>3회 균등 분할 실행</span>
            </div>
          )}
        </div>

        <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-white text-sm shadow-xl shadow-indigo-600/30 transition active:scale-98">
          지문 인식으로 즉시 체결
        </button>
      </div>
    </div>
  );
}`
  },
  {
    id: 'step-3-success',
    title: '3. 체결 완료 & 인증 카드 (Success)',
    viewport: 'mobile',
    width: 390,
    height: 844,
    tweaksSchema: [
      {
        id: 'showShareCard',
        label: 'SNS 공유 카드 표시',
        control: 'boolean',
        defaultValue: true
      }
    ],
    tweakValues: {
      showShareCard: true
    },
    code: `export default function OrderSuccess(props) {
  const { showShareCard } = props;

  return (
    <div className="h-full bg-slate-950 text-white p-6 flex flex-col justify-between font-sans select-none text-center">
      <div className="pt-12 space-y-4">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 rounded-full flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
          ✓
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight">주문이 체결되었습니다!</h2>
          <p className="text-xs text-slate-400 mt-1">블록체인 네트워크 승인 완료 (0.4초)</p>
        </div>

        {/* Receipt Card */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 text-xs text-left shadow-xl mt-6">
          <div className="flex justify-between pb-2 border-b border-slate-800 text-slate-400">
            <span>체결 시각</span>
            <span className="text-white font-mono">2026.10.25 00:43:12</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">체결 수량</span>
            <span className="text-white font-bold font-mono">0.0072254 BTC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">총 결제 금액</span>
            <span className="text-indigo-400 font-black text-sm">₩ 1,000,000</span>
          </div>
        </div>

        {showShareCard && (
          <div className="p-4 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-indigo-500/30 rounded-2xl flex items-center justify-between text-xs">
            <div className="text-left">
              <div className="font-bold text-indigo-300">🎉 수익 인증 카드 생성됨</div>
              <div className="text-[11px] text-slate-400">인스타그램/카카오톡 공유 가능</div>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs">
              공유
            </button>
          </div>
        )}
      </div>

      <button className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition active:scale-98">
        포트폴리오로 돌아가기
      </button>
    </div>
  );
}`
  }
];

ws.on('open', () => {
  console.log('[Script] Connected to MCP Bridge. Sending 3-step Fintech Storyboard...');
  ws.send(JSON.stringify({
    type: 'SET_ARTBOARDS',
    payload: fintechArtboards
  }));
  setTimeout(() => {
    console.log('[Script] Successfully sent SET_ARTBOARDS!');
    ws.close();
    process.exit(0);
  }, 1000);
});

ws.on('error', (err) => {
  console.error('[Script] Connection failed:', err);
  process.exit(1);
});
