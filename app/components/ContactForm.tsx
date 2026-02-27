"use client";

import { CSSProperties, FormEvent, useMemo, useState } from "react";

type FormState = {
  name: string;
  organizationType: string;
  email: string;
  inquiryType: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  organizationType: "",
  email: "",
  inquiryType: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>("");

  const canSubmit = useMemo(() => {
    return (
      form.name.trim() &&
      form.organizationType.trim() &&
      form.email.includes("@") &&
      form.inquiryType.trim() &&
      form.message.trim().length >= 10
    );
  }, [form]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setError("入力内容をご確認ください。本文は10文字以上でご入力ください。");
      setSubmitted(false);
      return;
    }

    setError("");
    setSubmitted(true);
    setForm(initialState);
  };

  return (
    <div className="card" style={{ maxWidth: 860 }}>
      <form onSubmit={handleSubmit}>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <label>
            お名前
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
              style={inputStyle}
            />
          </label>
          <label>
            組織区分
            <select
              value={form.organizationType}
              onChange={(event) => setForm({ ...form, organizationType: event.target.value })}
              required
              style={inputStyle}
            >
              <option value="">選択してください</option>
              <option value="自治体">自治体</option>
              <option value="介護施設">介護施設</option>
              <option value="医療機関">医療機関</option>
              <option value="地域企業">地域企業</option>
              <option value="その他">その他</option>
            </select>
          </label>
          <label>
            メールアドレス
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
              style={inputStyle}
            />
          </label>
          <label>
            お問い合わせ種別
            <select
              value={form.inquiryType}
              onChange={(event) => setForm({ ...form, inquiryType: event.target.value })}
              required
              style={inputStyle}
            >
              <option value="">選択してください</option>
              <option value="実証実験のご相談">実証実験のご相談</option>
              <option value="連携のご相談">連携のご相談</option>
              <option value="資料請求">資料請求</option>
              <option value="その他">その他</option>
            </select>
          </label>
        </div>

        <label style={{ display: "block", marginTop: 14 }}>
          お問い合わせ内容
          <textarea
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            required
            rows={6}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </label>

        <button type="submit" className="btn btn-primary" style={{ marginTop: 14 }}>
          送信する
        </button>
      </form>

      {error && (
        <p style={{ marginTop: 12, color: "#9a1c1c", fontWeight: 700 }}>
          {error}
        </p>
      )}

      {submitted && (
        <p style={{ marginTop: 12, color: "#0f4c81", fontWeight: 700 }}>
          送信を受け付けました。担当より2営業日以内を目安にご連絡します。
        </p>
      )}
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  border: "1px solid var(--line)",
  borderRadius: 8,
  marginTop: 6,
  padding: "10px 12px",
  fontSize: 14,
  fontFamily: "inherit",
  background: "#fff",
};
