"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "party-phone-verified";

export function usePhoneVerified() {
  const [verified, setVerified] = useState<string | null>(null);

  useEffect(() => {
    setVerified(localStorage.getItem(STORAGE_KEY));
  }, []);

  return verified;
}

interface PhoneVerifyProps {
  onVerified: () => void;
  onClose: () => void;
}

export default function PhoneVerify({ onVerified, onClose }: PhoneVerifyProps) {
  const [step, setStep] = useState<"phone" | "code" | "done">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatPhone = (v: string) => {
    const nums = v.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
  };

  const maskPhone = (p: string) => {
    const nums = p.replace(/\D/g, "");
    if (nums.length < 11) return p;
    return `${nums.slice(0, 3)}-****-${nums.slice(7)}`;
  };

  const handleSendCode = () => {
    const nums = phone.replace(/\D/g, "");
    if (nums.length < 10) {
      setError("올바른 휴대폰 번호를 입력해주세요");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("code");
    }, 800);
  };

  const handleVerifyCode = () => {
    if (code.length !== 4) {
      setError("4자리 인증번호를 입력해주세요");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const masked = maskPhone(phone);
      localStorage.setItem(STORAGE_KEY, masked);
      setStep("done");
      setTimeout(() => {
        onVerified();
      }, 800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-[60]" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-sm sm:mx-6 animate-[slideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {step === "phone" && (
          <>
            <div className="text-center mb-5">
              <div className="text-3xl mb-2">&#x1f6e1;&#xfe0f;</div>
              <h3 className="text-lg font-bold text-gray-900">안전한 만남을 위해</h3>
              <p className="text-sm text-gray-500 mt-1">휴대폰 본인인증이 필요합니다</p>
            </div>

            <div className="space-y-3 mb-4">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="010-0000-0000"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-center text-lg font-medium tracking-wider focus:border-orange-400 outline-none"
                autoFocus
              />
              {error && <p className="text-xs text-red-500 text-center">{error}</p>}
            </div>

            <button
              onClick={handleSendCode}
              disabled={loading || phone.replace(/\D/g, "").length < 10}
              className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold text-sm disabled:opacity-50 transition-all"
            >
              {loading ? "전송 중..." : "인증번호 받기"}
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-3">
              모의 인증: 아무 4자리 숫자를 입력하면 인증됩니다
            </p>
          </>
        )}

        {step === "code" && (
          <>
            <div className="text-center mb-5">
              <div className="text-3xl mb-2">&#x1f4e9;</div>
              <h3 className="text-lg font-bold text-gray-900">인증번호 입력</h3>
              <p className="text-sm text-gray-500 mt-1">{phone}으로 전송된 4자리 번호</p>
            </div>

            <div className="space-y-3 mb-4">
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="0000"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl font-bold tracking-[0.5em] focus:border-orange-400 outline-none"
                autoFocus
              />
              {error && <p className="text-xs text-red-500 text-center">{error}</p>}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setStep("phone"); setCode(""); setError(""); }}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium"
              >
                뒤로
              </button>
              <button
                onClick={handleVerifyCode}
                disabled={loading || code.length !== 4}
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm disabled:opacity-50 transition-all"
              >
                {loading ? "확인 중..." : "인증 확인"}
              </button>
            </div>
          </>
        )}

        {step === "done" && (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">&#x2705;</div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">인증 완료!</h3>
            <p className="text-sm text-gray-500">{maskPhone(phone)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
