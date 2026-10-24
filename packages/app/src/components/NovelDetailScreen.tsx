import React from 'react';
import { TweaksState } from './TweaksPanel';
import { Search, Heart, Share2, Bookmark, Eye, ThumbsUp, BookOpen, Sparkles, ExternalLink } from 'lucide-react';

interface NovelDetailScreenProps {
  tweaks: TweaksState;
  onOpenShareModal: () => void;
}

export const NovelDetailScreen: React.FC<NovelDetailScreenProps> = ({
  tweaks,
  onOpenShareModal
}) => {
  // Tone Themes
  const toneBg =
    tweaks.tone === '따뜻한'
      ? 'bg-[#faf6f1]'
      : tweaks.tone === '차가운'
      ? 'bg-[#f4f7fb]'
      : tweaks.tone === '녹차'
      ? 'bg-[#f4f7f4]'
      : 'bg-white';

  const toneAccent =
    tweaks.tone === '따뜻한'
      ? 'from-amber-600 to-orange-700'
      : tweaks.tone === '차가운'
      ? 'from-blue-600 to-indigo-700'
      : tweaks.tone === '녹차'
      ? 'from-emerald-700 to-teal-800'
      : 'from-orange-600 to-red-700';

  const primaryBtn =
    tweaks.tone === '녹차'
      ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
      : tweaks.tone === '차가운'
      ? 'bg-blue-600 hover:bg-blue-700 text-white'
      : tweaks.tone === '따뜻한'
      ? 'bg-amber-600 hover:bg-amber-700 text-white'
      : 'bg-[#ff5533] hover:bg-[#e04524] text-white';

  const authorName =
    tweaks.penName === '필명 바꾼 뒤 90일' ? '은하람 (구: 서하늘)' : '은하람';

  return (
    <div className={`w-[840px] ${toneBg} text-slate-800 font-sans shadow-xl rounded-lg overflow-hidden border border-slate-200 text-xs transition-colors duration-200 select-text`}>
      {/* 1. Global Navigation Bar */}
      <nav className="h-12 border-b border-slate-200 px-6 flex items-center justify-between bg-white/80 backdrop-blur">
        <div className="flex items-center gap-6">
          <div className="font-serif font-black text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
            <span className="text-base text-orange-600">✍️</span>
            <span>My Novel Note</span>
          </div>

          <div className="relative w-72">
            <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="제목, 작가, 태그로 찾기"
              className="w-full bg-slate-100/80 rounded-full pl-8 pr-3 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-600 font-medium">
          <button className="hover:text-slate-900">탐색</button>
          <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-full text-orange-700 font-semibold border border-orange-200/60">
            <span>내 토큰</span>
            <span className="font-bold">4,540</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px]">
            H
          </div>
        </div>
      </nav>

      {/* 2. Novel Header Hero Section */}
      <div className="p-8 pb-6 border-b border-slate-100 flex gap-8">
        {/* Book Cover */}
        <div className="shrink-0">
          <div className={`w-44 h-64 rounded-xl bg-gradient-to-b ${toneAccent} text-white p-5 flex flex-col justify-end shadow-lg shadow-orange-900/10 relative overflow-hidden`}>
            <div className="absolute top-3 right-3 text-[10px] bg-black/30 backdrop-blur px-2 py-0.5 rounded-full font-mono">
              완결
            </div>
            <div className="text-lg font-serif font-black leading-snug drop-shadow-sm">
              달빛 아래<br />검객
            </div>
            <div className="text-[10px] text-white/80 mt-1 font-light">은하람 著</div>
          </div>
        </div>

        {/* Book Details */}
        <div className="flex-1 space-y-3">
          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">무협</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">15세 이용가</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">요일 연재 · 매주 화~금 20시</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              작가 응원
            </span>

            {/* Dynamic Tweaks Badges */}
            {tweaks.contest === '공개 연재형 출품' && (
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300 flex items-center gap-1">
                <Sparkles size={11} /> 2026 공모전 출품작
              </span>
            )}

            {tweaks.book === '출판 정보 있음' && (
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-semibold border border-indigo-200">
                📚 종이책 출간 ({tweaks.publisher !== '없음' ? tweaks.publisher : '출판사 협의'})
              </span>
            )}
          </div>

          {/* Title & Author */}
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 font-serif">
                달빛 아래 검객
              </h1>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <button className="text-slate-800 font-bold">한국어</button>
                <span>|</span>
                <button className="hover:text-slate-700">English 로 보기</button>
              </div>
            </div>
            <div className="text-slate-600 font-semibold text-xs mt-0.5">{authorName}</div>
          </div>

          {/* Tags */}
          <div className="flex gap-1.5 text-[11px] text-blue-600 font-medium">
            <span>#무협</span>
            <span>#사제</span>
            <span>#복수</span>
            <span>#성장</span>
            <span>#검집의 비밀</span>
          </div>

          {/* Synopsis */}
          <p className="text-slate-600 leading-relaxed text-[11px] line-clamp-3">
            사부가 사라진 밤, 청운문의 막내 서윤에게 남은 것은 빈 검집 하나였다. 검집은 본래 셋. 나머지 둘을 찾아 떠난 길에서 서윤은 사부가 숨긴 이름과 마주한다. 비 오는 계단과 흑풍채의 산채, 월국의 월도를 지나며 서윤은 사부가 왜 검을 두고 떠났는지, 그리고 세 번째 검집이 지금 누구의 손에 있는지 하나씩 알게 된다. 그 끝에서 서윤을 기다리는 것은 사부의 원수일까, 아니면 사부가 끝까지 지키려 했던...
            <button className="text-slate-400 font-semibold hover:underline ml-1">더보기</button>
          </p>

          {/* Author notice banner */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-md p-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>작가 소식 · 비 오는 날에만 쓰는 이유 · 3일 전</span>
            <ExternalLink size={12} className="text-slate-400" />
          </div>

          {/* Stats & Actions */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
              <span>관심 4,020</span>
              <span>좋아요 3.1만</span>
              <span>24회</span>
            </div>

            <div className="flex items-center gap-2">
              <button className={`px-4 py-2 rounded-lg font-bold shadow-md shadow-orange-500/10 transition active:scale-95 ${primaryBtn}`}>
                이어 보기 · 3화
              </button>
              <button className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 transition">
                첫 화 보기
              </button>
              <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600" title="관심 작품">
                <Heart size={14} />
              </button>
              <button
                onClick={onOpenShareModal}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                title="공유하기 (스크린샷 연동)"
              >
                <Share2 size={14} />
              </button>
              <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600" title="책갈피">
                <Bookmark size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Single Volume Banner (단행본 박스) */}
      <div className="mx-8 my-5 p-4 bg-orange-50/70 border border-orange-200 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-13 rounded bg-orange-600 text-white font-serif font-black flex items-center justify-center text-[10px] shadow">
            단행본
          </div>
          <div>
            <div className="font-bold text-slate-900 text-xs">단행본 1권 · 떠나는 사람</div>
            <div className="text-[11px] text-slate-500">1~12화를 한 권으로 · 900토큰 <span className="text-orange-600 font-semibold">(정가 대비 10% 할인)</span></div>
          </div>
        </div>
        <button className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs">
          단행본 보기
        </button>
      </div>

      {/* 4. Episode Table List */}
      <div className="px-8 pb-8 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
          <div className="flex items-center gap-2">
            <span>회차 <span className="text-orange-600 font-bold">24</span></span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] text-slate-400 font-normal">게시된 회차만 보여요 · 처음 3화 무료</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-medium text-slate-700">
              {tweaks.bulk !== '기본' ? tweaks.bulk : '여러 회차 구매'}
            </button>
            <button className="text-[11px] text-slate-500 hover:text-slate-800">첫 화부터</button>
            <span className="text-slate-300">·</span>
            <button className="text-[11px] text-slate-800 font-bold">최신부터</button>
          </div>
        </div>

        {/* Episode List Rows */}
        <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white">
          {[
            { ep: '1화', title: '청운문의 밤', date: '07.09', status: '읽음' },
            { ep: '2화', title: '비 오는 계단', date: '07.10', status: '읽음' },
            { ep: '3화', title: '흑풍채', date: '07.14', status: '구매함' },
            { ep: '4화', title: '두 개의 이름', date: '07.17', status: '구매함' },
            { ep: '5화', title: '사형의 밤', date: '07.21', status: '구매함' }
          ].map((item, idx) => (
            <div key={idx} className="p-3 px-4 flex items-center justify-between hover:bg-slate-50/80 transition cursor-pointer">
              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-900 w-8">{item.ep}</span>
                <span className="text-slate-700 font-medium">{item.title}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                <span>{item.date}</span>
                <span className={item.status === '읽음' ? 'text-slate-400' : 'text-orange-600 font-semibold'}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
