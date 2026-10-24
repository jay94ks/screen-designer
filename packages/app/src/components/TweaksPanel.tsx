import React from 'react';

export interface TweaksState {
  state: '정상' | '로딩' | '에러' | '비어있음';
  contest: '없음' | '공개 연재형 출품';
  book: '없음' | '출판 정보 있음';
  penName: '지금 필명' | '필명 바꾼 뒤 90일';
  publisher: string;
  bulk: string;
  tone: '중립' | '따뜻한' | '차가운' | '녹차';
}

interface TweaksPanelProps {
  values: TweaksState;
  onChange: (key: keyof TweaksState, value: any) => void;
}

export const TweaksPanel: React.FC<TweaksPanelProps> = ({ values, onChange }) => {
  return (
    <div className="p-4 space-y-5 text-xs text-slate-700 select-none">
      {/* 1. State (상태) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          state
        </label>
        <select
          value={values.state}
          onChange={(e) => onChange('state', e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-md py-1.5 px-2.5 text-xs text-slate-800 shadow-2xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="정상">정상</option>
          <option value="로딩">로딩 중</option>
          <option value="에러">네트워크 에러</option>
          <option value="비어있음">데이터 없음 (빈 상태)</option>
        </select>
      </div>

      {/* 2. 공모전 출품 (contest) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          공모전 출품 <span className="text-slate-400 font-normal lowercase">(contest)</span>
        </label>
        <div className="grid grid-cols-2 p-0.5 bg-slate-100 rounded-md border border-slate-200/80">
          {(['없음', '공개 연재형 출품'] as const).map((option) => (
            <button
              key={option}
              onClick={() => onChange('contest', option)}
              className={`py-1.5 px-2 rounded text-center transition font-medium ${
                values.contest === option
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 출판 정보 (book) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          출판 정보 <span className="text-slate-400 font-normal lowercase">(book)</span>
        </label>
        <div className="grid grid-cols-2 p-0.5 bg-slate-100 rounded-md border border-slate-200/80">
          {(['없음', '출판 정보 있음'] as const).map((option) => (
            <button
              key={option}
              onClick={() => onChange('book', option)}
              className={`py-1.5 px-2 rounded text-center transition font-medium ${
                values.book === option
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* 4. 필명 (penName) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          필명 <span className="text-slate-400 font-normal lowercase">(penName)</span>
        </label>
        <div className="grid grid-cols-2 p-0.5 bg-slate-100 rounded-md border border-slate-200/80">
          {(['지금 필명', '필명 바꾼 뒤 90일'] as const).map((option) => (
            <button
              key={option}
              onClick={() => onChange('penName', option)}
              className={`py-1.5 px-2 rounded text-center transition font-medium ${
                values.penName === option
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* 5. 출판사 (publisher) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          출판사 <span className="text-slate-400 font-normal lowercase">(publisher)</span>
        </label>
        <select
          value={values.publisher}
          onChange={(e) => onChange('publisher', e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-md py-1.5 px-2.5 text-xs text-slate-800 shadow-2xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="없음">없음</option>
          <option value="문학동네">문학동네</option>
          <option value="민음사">민음사</option>
          <option value="창비">창비</option>
          <option value="황금가지">황금가지</option>
        </select>
      </div>

      {/* 6. 여러 회차 구매 (bulk) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          여러 회차 구매 <span className="text-slate-400 font-normal lowercase">(bulk)</span>
        </label>
        <select
          value={values.bulk}
          onChange={(e) => onChange('bulk', e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-md py-1.5 px-2.5 text-xs text-slate-800 shadow-2xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="기본">기본</option>
          <option value="10회 일괄 할인 (10%)">10회 일괄 할인 (10%)</option>
          <option value="전체 소장 대여">전체 소장 대여</option>
        </select>
      </div>

      {/* 7. 화면 톤 (tone) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          화면 톤 <span className="text-slate-400 font-normal lowercase">(tone)</span>
        </label>
        <div className="grid grid-cols-4 p-0.5 bg-slate-100 rounded-md border border-slate-200/80">
          {(['중립', '따뜻한', '차가운', '녹차'] as const).map((option) => (
            <button
              key={option}
              onClick={() => onChange('tone', option)}
              className={`py-1.5 px-1 rounded text-center text-[11px] transition font-medium ${
                values.tone === option
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
