import Link from "next/link";

export const metadata = { title: "업체 등록 — 피싱로그" };

const BIZ_TYPES = ["좌대낚시", "선상낚시", "갯바위 도선", "낚시용품점", "낚시 체험·강습", "낚시 펜션·민박"];
const FISH_OPTIONS = ["참돔", "감성돔", "벵에돔", "방어", "부시리", "볼락", "전갱이", "갈치", "넙치", "삼치", "돌돔", "농어"];
const REGIONS = ["서귀포", "제주시", "애월", "한림", "성산", "구좌", "모슬포", "우도"];
const FACILITIES = ["낚시대 대여", "생미끼 제공", "화장실", "취사 가능", "숙박", "샤워시설", "WiFi", "주차", "어린이 가능", "장애인 접근 가능"];

export default function BizRegisterPage() {
  return (
    <div className="max-w-2xl lg:max-w-3xl mx-auto px-4 py-8">
      <Link href="/biz" className="text-sm text-ocean-400 hover:text-ocean-300 mb-6 inline-block">← 사장님 전용 홈으로</Link>

      <div className="mb-8">
        <h1 className="text-2xl font-black text-ocean-50 mb-2">업체 등록</h1>
        <p className="text-slate-400 text-sm">기본 정보를 입력하면 피싱로그 팀이 1~2일 내 검토 후 승인합니다.</p>
      </div>

      {/* 진행 단계 표시 */}
      <div className="flex items-center gap-2 mb-8">
        {["업체 기본정보", "운영 정보", "시설 & 요금", "완료"].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${i === 0 ? "bg-hook text-ocean-950" : "bg-ocean-800 text-slate-500"}`}>
              {i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i === 0 ? "text-hook font-bold" : "text-slate-600"}`}>{label}</span>
            {i < 3 && <div className="flex-1 h-px bg-ocean-800" />}
          </div>
        ))}
      </div>

      <form className="space-y-6">
        {/* 업체 유형 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
          <h2 className="font-bold text-slate-200 mb-4 flex items-center gap-2"><span className="text-hook">01</span> 업체 유형</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BIZ_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-2 p-3 rounded-xl border border-ocean-700 hover:border-ocean-500 cursor-pointer transition-colors">
                <input type="radio" name="bizType" className="accent-hook" />
                <span className="text-sm text-slate-300">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 space-y-4">
          <h2 className="font-bold text-slate-200 flex items-center gap-2"><span className="text-hook">02</span> 기본 정보</h2>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">업체명 *</label>
            <input className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ocean-500" placeholder="예: 서귀포 황금좌대" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">지역 *</label>
              <select className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-4 text-sm text-slate-200 focus:outline-none focus:border-ocean-500">
                <option value="">지역 선택</option>
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">대표 연락처 *</label>
              <input className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ocean-500" placeholder="064-000-0000" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">상세 위치 *</label>
            <input className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ocean-500" placeholder="예: 서귀포시 법환동 법환포구 출발 / 앞바다 1.2km" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">업체 소개 *</label>
            <textarea className="w-full h-28 bg-ocean-800 border border-ocean-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ocean-500 resize-none" placeholder="업체 특징, 강점, 운영 방식 등을 자유롭게 적어주세요." />
          </div>
        </div>

        {/* 주요 어종 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
          <h2 className="font-bold text-slate-200 mb-4 flex items-center gap-2"><span className="text-hook">03</span> 주요 어종 (복수 선택)</h2>
          <div className="flex flex-wrap gap-2">
            {FISH_OPTIONS.map((fish) => (
              <label key={fish} className="flex items-center gap-1.5 bg-ocean-800 border border-ocean-700 hover:border-ocean-500 px-3 py-1.5 rounded-full cursor-pointer transition-colors">
                <input type="checkbox" className="accent-hook w-3 h-3" />
                <span className="text-xs text-slate-300">{fish}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 시설 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
          <h2 className="font-bold text-slate-200 mb-4 flex items-center gap-2"><span className="text-hook">04</span> 시설 & 서비스 (복수 선택)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FACILITIES.map((f) => (
              <label key={f} className="flex items-center gap-2 bg-ocean-800 border border-ocean-700 hover:border-ocean-500 px-3 py-2 rounded-xl cursor-pointer transition-colors">
                <input type="checkbox" className="accent-hook w-3 h-3" />
                <span className="text-xs text-slate-300">{f}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 요금 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 space-y-4">
          <h2 className="font-bold text-slate-200 flex items-center gap-2"><span className="text-hook">05</span> 요금 정보</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">1인 주간 요금 (원)</label>
              <input type="number" className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ocean-500" placeholder="55000" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">1인 야간 요금 (원, 선택)</label>
              <input type="number" className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ocean-500" placeholder="80000" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">수용 인원</label>
              <input type="number" className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ocean-500" placeholder="20" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">운영 시간</label>
              <input className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ocean-500" placeholder="04:00 출발 / 17:00 귀환" />
            </div>
          </div>
        </div>

        {/* 플랜 선택 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
          <h2 className="font-bold text-slate-200 mb-4 flex items-center gap-2"><span className="text-hook">06</span> 노출 플랜</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-ocean-700 hover:border-ocean-500 cursor-pointer transition-colors">
              <input type="radio" name="plan" defaultChecked className="accent-hook mt-0.5" />
              <div>
                <div className="font-bold text-slate-200 text-sm">무료 플랜</div>
                <div className="text-xs text-slate-400 mt-0.5">기본 검색 노출 · 영구 무료</div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-hook/50 hover:border-hook cursor-pointer transition-colors bg-hook/5">
              <input type="radio" name="plan" className="accent-hook mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-hook text-sm">프리미엄</span>
                  <span className="text-[10px] bg-hook text-ocean-950 px-1.5 py-0.5 rounded font-bold">추천</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">홈 메인 노출 · 월 39,000원</div>
              </div>
            </label>
          </div>
        </div>

        {/* 동의 */}
        <div className="space-y-2">
          {["피싱로그 업체 운영 정책에 동의합니다 (필수)", "마케팅 정보 수신에 동의합니다 (선택)"].map((text) => (
            <label key={text} className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
              <input type="checkbox" className="accent-hook w-4 h-4" />
              {text}
            </label>
          ))}
        </div>

        {/* 제출 */}
        <button type="submit" className="w-full py-4 bg-hook hover:bg-hook-light text-ocean-950 font-black text-lg rounded-2xl transition-colors shadow-lg shadow-hook/20">
          업체 등록 신청하기
        </button>
        <p className="text-center text-xs text-slate-500">등록 후 1~2일 내 biz@fishinglog.kr로 승인 안내 드립니다</p>
      </form>
    </div>
  );
}
