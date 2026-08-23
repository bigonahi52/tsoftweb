import Peer from "peerjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { fa, useRevealAll } from "../lib";
import { Icon } from "./Icons";

/* ───────── ابزارها ───────── */

function nowTime(): string {
  try {
    return new Intl.DateTimeFormat("fa-IR-u-nu-fa", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tehran" }).format(new Date());
  } catch {
    return "";
  }
}

function genPass(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let p = "";
  for (let i = 0; i < 6; i++) p += chars[Math.floor(Math.random() * chars.length)];
  return p;
}

type ChatMsg = { from: "me" | "them"; text: string; time: string };
type IncomingFile = { fid: string; name: string; size: number; received: number; parts: Blob[]; url?: string };
type Progress = { name: string; pct: number } | null;

const CHUNK = 64 * 1024;

function saveBlob(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** ارسال فایل تکه‌تکه با گزارش پیشرفت */
async function streamFile(conn: any, f: File, onPct: (pct: number) => void): Promise<boolean> {
  if (!conn?.open) return false;
  const fid = Math.random().toString(36).slice(2, 10);
  conn.send({ type: "file-meta", fid, name: f.name, size: f.size });
  let off = 0;
  while (off < f.size) {
    const buf = await f.slice(off, off + CHUNK).arrayBuffer();
    try {
      conn.send({ type: "file-chunk", fid, buf });
    } catch {
      return false;
    }
    off += buf.byteLength;
    onPct((off / f.size) * 100);
    await new Promise((r) => setTimeout(r, 15));
  }
  conn.send({ type: "file-done", fid });
  return true;
}

/** پردازش پیام‌های فایل دریافتی */
function onFileMsg(d: any, ref: { current: IncomingFile[] }, set: (v: IncomingFile[]) => void, log: (m: string) => void) {
  if (d?.type === "file-meta") {
    ref.current = [...ref.current, { fid: d.fid, name: d.name, size: d.size, received: 0, parts: [] }];
    set(ref.current);
    log("دریافت فایل شروع شد: " + d.name);
  } else if (d?.type === "file-chunk") {
    const f = ref.current.find((x) => x.fid === d.fid);
    if (f) {
      f.parts.push(new Blob([d.buf]));
      f.received += d.buf?.byteLength ?? 0;
      set([...ref.current]);
    }
  } else if (d?.type === "file-done") {
    const f = ref.current.find((x) => x.fid === d.fid);
    if (f) {
      f.url = URL.createObjectURL(new Blob(f.parts));
      set([...ref.current]);
      log("فایل دریافت شد: " + f.name);
    }
  }
}

/* ───────── اجزای کوچک ───────── */

function CopyField({ label, value, accent }: { label: string; value: string; accent: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-ink-100 bg-paper px-5 py-4">
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-mist-500">{label}</p>
        <p className="mt-0.5 font-latin text-3xl font-bold tracking-[0.25em]" dir="ltr" style={{ color: accent }}>{value}</p>
      </div>
      <button
        onClick={() => {
          try { navigator.clipboard.writeText(value); } catch { /* ignore */ }
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }}
        className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-300 ${copied ? "bg-teal-500 text-ink-950" : "bg-ink-950 text-white hover:bg-teal-600"}`}
      >
        <Icon name={copied ? "check" : "update"} className="h-4 w-4" />
        {copied ? "کپی شد" : "کپی"}
      </button>
    </div>
  );
}

function LogList({ items, empty }: { items: string[]; empty: string }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-ink-950 p-4">
      <p className="mb-2 font-latin text-[10px] tracking-[0.25em] text-mist-300">SESSION LOG</p>
      {items.length === 0 ? (
        <p className="text-xs leading-6 text-mist-300/70">{empty}</p>
      ) : (
        <ul className="max-h-40 space-y-1.5 overflow-y-auto">
          {items.slice(-6).map((l, i, arr) => (
            <li key={i} className={`text-[11px] leading-5 ${i === arr.length - 1 ? "ticker-in text-teal-400" : "text-mist-300/70"}`}>• {l}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ChatBox({ messages, onSend, disabled }: { messages: ChatMsg[]; onSend: (t: string) => void; disabled: boolean }) {
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white">
      <p className="border-b border-ink-100 px-4 py-3 font-display text-base text-ink-900">گفت‌وگوی متنی</p>
      <div className="h-44 space-y-2.5 overflow-y-auto bg-paper px-4 py-3">
        {messages.length === 0 && <p className="pt-6 text-center text-xs text-mist-500">هنوز پیامی رد و بدل نشده است.</p>}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-6 ${m.from === "me" ? "rounded-tr-sm bg-teal-600 text-white" : "rounded-tl-sm bg-ink-800 text-ink-100"}`}>
              {m.text}
              <span className={`mt-0.5 block text-[9px] ${m.from === "me" ? "text-teal-400/70" : "text-mist-300/60"}`}>{m.time}</span>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const t = text.trim();
          if (!t || disabled) return;
          setText("");
          onSend(t);
        }}
        className="flex items-center gap-2 border-t border-ink-100 bg-white p-3"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="پیام‌تان را بنویسید…"
          disabled={disabled}
          className="min-w-0 flex-1 rounded-xl border border-ink-100 bg-paper px-3.5 py-2.5 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50"
        />
        <button type="submit" disabled={disabled || !text.trim()} aria-label="ارسال پیام" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-ink-950 transition-colors hover:bg-teal-400 disabled:opacity-40">
          <Icon name="send" className="h-4 w-4 -scale-x-100" />
        </button>
      </form>
    </div>
  );
}

function FilePanel({ files, progress, busy, disabled, onPick }: { files: IncomingFile[]; progress: Progress; busy: boolean; disabled: boolean; onPick: (f: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
      <p className="border-b border-ink-100 px-4 py-3 font-display text-base text-ink-900">انتقال فایل</p>
      <div className="space-y-3 p-4">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
            e.target.value = "";
          }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={disabled || busy}
          className="btn-shine flex w-full items-center justify-center gap-2.5 rounded-xl bg-ink-950 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-teal-600 disabled:opacity-40"
        >
          <Icon name="file" className="h-4 w-4" />
          {busy ? "در حال ارسال…" : "ارسال فایل به طرف مقابل"}
        </button>

        {progress && (
          <div className="ticker-in rounded-xl bg-paper p-3">
            <p className="flex justify-between text-[11px] font-bold text-ink-900">
              <span className="truncate">{progress.name}</span>
              <span className="font-latin" dir="ltr">{Math.round(progress.pct)}%</span>
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-teal-500 transition-all duration-200" style={{ width: `${progress.pct}%` }} />
            </div>
          </div>
        )}

        {files.length > 0 && (
          <ul className="space-y-2">
            {files.map((f) => {
              const pct = f.size ? Math.min(100, (f.received / f.size) * 100) : 0;
              return (
                <li key={f.fid} className="ticker-in rounded-xl border border-ink-100 bg-paper p-3">
                  <p className="flex items-center justify-between gap-2 text-[11px] font-bold text-ink-900">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <Icon name="download" className="h-3.5 w-3.5 shrink-0 text-teal-600" />
                      <span className="truncate">{f.name}</span>
                    </span>
                    {f.url ? (
                      <button onClick={() => saveBlob(f.url!, f.name)} className="shrink-0 rounded-lg bg-teal-500 px-2.5 py-1 text-[10px] font-bold text-ink-950 transition-colors hover:bg-teal-400">ذخیره</button>
                    ) : (
                      <span className="shrink-0 font-latin text-mist-500" dir="ltr">{Math.round(pct)}%</span>
                    )}
                  </p>
                  {!f.url && (
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
                      <div className="h-full rounded-full bg-gold-500 transition-all duration-200" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {files.length === 0 && !progress && <p className="text-center text-[11px] leading-6 text-mist-500">فایل‌های دریافتی اینجا نمایش داده می‌شوند.</p>}
      </div>
    </div>
  );
}

/* ───────── نشست مشتری ───────── */
function CustomerSession({ onBack }: { onBack: () => void }) {
  const [sessId, setSessId] = useState("");
  const [sessPass, setSessPass] = useState("");
  const [status, setStatus] = useState<"idle" | "ready" | "sharing" | "connected">("idle");
  const [log, setLog] = useState<string[]>([]);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [files, setFiles] = useState<IncomingFile[]>([]);
  const [progress, setProgress] = useState<Progress>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const peer = useRef<any>(null);
  const conn = useRef<any>(null);
  const stream = useRef<MediaStream | null>(null);
  const passRef = useRef("");
  const supportPeer = useRef<string | null>(null);
  const filesRef = useRef<IncomingFile[]>([]);
  const localVideo = useRef<HTMLVideoElement>(null);

  const pushLog = (m: string) => setLog((l) => [...l, `${nowTime()} — ${m}`]);

  const startCall = useCallback((supportPeerId: string) => {
    if (!peer.current || !stream.current || !supportPeerId) return;
    const call = peer.current.call(supportPeerId, stream.current);
    call?.on("close", () => setStatus((s) => (s === "connected" ? "sharing" : s)));
  }, []);

  const end = useCallback(() => {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    try { conn.current?.close(); } catch { /* ignore */ }
    try { peer.current?.destroy(); } catch { /* ignore */ }
    peer.current = null;
    conn.current = null;
    supportPeer.current = null;
    passRef.current = "";
    setCursor(null);
    setStatus("idle"); setSessId(""); setSessPass(""); setLog([]); setChat([]); setFiles([]); setProgress(null);
    if (localVideo.current) localVideo.current.srcObject = null;
  }, []);

  useEffect(() => () => end(), [end]);

  const createSession = () => {
    const id = String(Math.floor(100000 + Math.random() * 900000));
    const pass = genPass();
    setSessId(id);
    setSessPass(pass);
    passRef.current = pass;
    const p = new Peer("tsoft-" + id);
    peer.current = p;
    p.on("open", () => pushLog("کد جلسه ساخته شد — کد و رمز را تلفنی به پشتیبانی بدهید"));
    p.on("connection", (c: any) => {
      conn.current = c;
      c.on("data", (d: any) => {
        if (d?.type === "auth") {
          if (d.password === passRef.current) {
            supportPeer.current = d.supportPeerId || null;
            if (stream.current) {
              c.send({ type: "auth-ok" });
              startCall(d.supportPeerId);
              setStatus("connected");
              pushLog("پشتیبانی متصل شد — صفحه در حال اشتراک است");
            } else {
              c.send({ type: "auth-ok-wait" });
              pushLog("پشتیبانی متصل شد — منتظر شروع اشتراک صفحه…");
            }
          } else {
            c.send({ type: "auth-fail" });
            pushLog("تلاش ورود با رمز اشتباه رد شد");
          }
        } else if (d?.type === "chat") {
          setChat((m) => [...m, { from: "them", text: d.text, time: nowTime() }]);
        } else if (d?.type === "file-meta" || d?.type === "file-chunk" || d?.type === "file-done") {
          onFileMsg(d, filesRef, setFiles, pushLog);
        } else if (d?.type === "cursor") {
          setCursor({ x: d.x, y: d.y });
        }
      });
      c.on("close", () => {
        setStatus((s) => (s === "connected" ? "sharing" : s));
        setCursor(null);
        pushLog("اتصال پشتیبانی قطع شد");
      });
    });
    p.on("error", (e: any) => {
      pushLog("خطا در اتصال: " + (e?.type || "نامشخص"));
      setStatus("idle");
    });
    setStatus("ready");
  };

  const startShare = async () => {
    try {
      const md: any = (navigator as any).mediaDevices;
      const s: MediaStream = await md.getDisplayMedia({ video: true, audio: false });
      stream.current = s;
      if (localVideo.current) localVideo.current.srcObject = s;
      setStatus("sharing");
      pushLog("اشتراک صفحه شروع شد — منتظر اتصال پشتیبانی");
      s.getVideoTracks()[0]?.addEventListener("ended", end);
      if (supportPeer.current && conn.current?.open) {
        conn.current.send({ type: "auth-ok" });
        startCall(supportPeer.current);
        setStatus("connected");
        pushLog("پشتیبانی متصل شد — صفحه در حال اشتراک است");
      }
    } catch {
      pushLog("اشتراک صفحه لغو شد یا اجازه داده نشد");
    }
  };

  const sendChat = (t: string) => {
    if (!conn.current?.open) return;
    conn.current.send({ type: "chat", text: t });
    setChat((m) => [...m, { from: "me", text: t, time: nowTime() }]);
  };

  const sendFile = (f: File) => {
    if (!conn.current?.open) return;
    setProgress({ name: f.name, pct: 0 });
    streamFile(conn.current, f, (pct) => setProgress({ name: f.name, pct })).then((ok) => {
      setProgress(null);
      pushLog(ok ? "فایل ارسال شد: " + f.name : "ارسال فایل ناموفق بود");
    });
  };

  const statusLabel =
    status === "idle" ? "جلسه‌ای ساخته نشده"
    : status === "ready" ? "منتظر شروع اشتراک صفحه"
    : status === "sharing" ? "در حال اشتراک — منتظر پشتیبانی"
    : "پشتیبانی متصل است";

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-600"><Icon name="users" className="h-7 w-7" /></span>
            <div>
              <p className="font-latin text-[10px] tracking-[0.3em] text-teal-600">CUSTOMER SESSION</p>
              <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">نشست مشتری</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${status === "connected" ? "bg-teal-500/15 text-teal-600" : "bg-gold-500/15 text-gold-600"}`}>
              <span className={`pulse-dot h-2 w-2 rounded-full ${status === "connected" ? "bg-teal-500" : "bg-gold-500"}`} />
              {statusLabel}
            </span>
            <button onClick={onBack} className="rounded-xl border border-ink-100 bg-white px-4 py-2.5 text-xs font-bold text-mist-500 transition-colors hover:border-teal-500 hover:text-teal-600">بازگشت</button>
            {status !== "idle" && (
              <button onClick={end} className="rounded-xl bg-[#e5695e] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#d0554b]">پایان نشست</button>
            )}
          </div>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            {status === "idle" ? (
              <div className="reveal rounded-3xl border border-ink-100 bg-white p-8 text-center sm:p-12">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-950 text-teal-400"><Icon name="monitor" className="h-8 w-8" /></span>
                <h3 className="mt-5 font-display text-2xl text-ink-900">صفحه‌ی شما، با اجازه‌ی شما</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-8 text-mist-500">
                  با ساخت نشست، یک <b className="text-ink-900">کد جلسه</b> و <b className="text-ink-900">رمز</b> دریافت می‌کنید.
                  آن‌ها را تلفنی به پشتیبانی بدهید و سپس خودتان دکمه‌ی اشتراک صفحه را بزنید.
                  پشتیبانی فقط چیزی را می‌بیند که شما به اشتراک بگذارید و هر لحظه می‌توانید قطع کنید.
                </p>
                <button onClick={createSession} className="btn-shine mx-auto mt-7 flex items-center gap-2.5 rounded-xl bg-teal-500 px-8 py-4 text-base font-bold text-ink-950 transition-all hover:scale-[1.02] hover:bg-teal-400">
                  <Icon name="key" className="h-5 w-5" />
                  ساخت کد جلسه و رمز
                </button>
              </div>
            ) : (
              <>
                <div className="reveal grid gap-4 sm:grid-cols-2">
                  <CopyField label="کد جلسه (۶ رقم)" value={sessId} accent="#0f948b" />
                  <CopyField label="رمز جلسه" value={sessPass} accent="#c98f2b" />
                </div>

                {status === "ready" && (
                  <button onClick={startShare} className="btn-shine reveal flex w-full items-center justify-center gap-2.5 rounded-2xl bg-ink-950 px-6 py-5 text-base font-bold text-white transition-all hover:scale-[1.01] hover:bg-teal-600">
                    <Icon name="monitor" className="h-5 w-5 text-teal-400" />
                    شروع اشتراک صفحه‌ی من
                  </button>
                )}

                {(status === "sharing" || status === "connected") && (
                  <div className="reveal overflow-hidden rounded-3xl border border-ink-100 bg-ink-950">
                    <div className="flex items-center justify-between border-b border-ink-700/70 px-4 py-3">
                      <p className="flex items-center gap-2 text-xs font-bold text-white">
                        <span className={`pulse-dot h-2 w-2 rounded-full ${status === "connected" ? "bg-teal-500" : "bg-gold-500"}`} />
                        {status === "connected" ? "پشتیبانی در حال دیدن صفحه‌ی شماست" : "صفحه در حال اشتراک — منتظر پشتیبانی"}
                      </p>
                      <span className="font-latin text-[10px] tracking-[0.2em] text-mist-300" dir="ltr">LIVE PREVIEW</span>
                    </div>
                    <div className="relative">
                      <video ref={localVideo} autoPlay muted playsInline className="aspect-video w-full bg-black object-contain" />
                      {cursor && (
                        <span className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${cursor.x * 100}%`, top: `${cursor.y * 100}%` }}>
                          <span className="block h-5 w-5 rounded-full border-[3px] border-gold-400 bg-gold-400/30" />
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-y-5">
            <LogList items={log} empty="رویدادهای نشست اینجا نمایش داده می‌شود." />
            <ChatBox messages={chat} onSend={sendChat} disabled={status !== "connected"} />
            <FilePanel files={files} progress={progress} busy={!!progress} disabled={status !== "connected"} onPick={sendFile} />
            <div className="rounded-2xl border border-gold-500/40 bg-gold-100/40 p-5 text-xs leading-7 text-ink-800">
              <p className="flex items-center gap-2 font-bold"><Icon name="shield" className="h-4 w-4 text-gold-600" /> امنیت نشست</p>
              <p className="mt-1.5 text-mist-500">رمز فقط روی دستگاه شما بررسی می‌شود و هیچ‌جا ذخیره نمی‌شود. با پایان نشست، کد و رمز باطل می‌شوند.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── کنسول پشتیبانی ───────── */
function SupportSession({ onBack }: { onBack: () => void }) {
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [status, setStatus] = useState<"idle" | "connecting" | "wait" | "live">("idle");
  const [log, setLog] = useState<string[]>([]);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [files, setFiles] = useState<IncomingFile[]>([]);
  const [progress, setProgress] = useState<Progress>(null);
  const [err, setErr] = useState("");

  const peer = useRef<any>(null);
  const conn = useRef<any>(null);
  const filesRef = useRef<IncomingFile[]>([]);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const viewerBox = useRef<HTMLDivElement>(null);

  const pushLog = (m: string) => setLog((l) => [...l, `${nowTime()} — ${m}`]);

  const end = useCallback(() => {
    try { conn.current?.close(); } catch { /* ignore */ }
    try { peer.current?.destroy(); } catch { /* ignore */ }
    peer.current = null;
    conn.current = null;
    setStatus("idle"); setId(""); setPass(""); setLog([]); setChat([]); setFiles([]); setProgress(null); setErr("");
    if (remoteVideo.current) remoteVideo.current.srcObject = null;
  }, []);

  useEffect(() => () => end(), [end]);

  const connect = () => {
    setErr("");
    const cleanId = id.replace(/\D/g, "").replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
    if (cleanId.length !== 6) { setErr("کد جلسه باید ۶ رقم باشد"); return; }
    if (!pass.trim()) { setErr("رمز جلسه را وارد کنید"); return; }
    setStatus("connecting");
    pushLog("در حال اتصال به نشست مشتری…");
    const p = new Peer();
    peer.current = p;
    p.on("open", () => {
      const c = p.connect("tsoft-" + cleanId, { reliable: true });
      conn.current = c;
      c.on("open", () => {
        c.send({ type: "auth", password: pass.trim(), supportPeerId: p.id });
        pushLog("درخواست ورود ارسال شد…");
      });
      c.on("data", (d: any) => {
        if (d?.type === "auth-ok") { setStatus("wait"); pushLog("ورود موفق — منتظر دریافت تصویر مشتری…"); }
        else if (d?.type === "auth-ok-wait") { setStatus("wait"); pushLog("ورود موفق — مشتری هنوز اشتراک صفحه را شروع نکرده…"); }
        else if (d?.type === "auth-fail") { setErr("رمز اشتباه است"); setStatus("idle"); pushLog("رمز اشتباه بود — ورود رد شد"); }
        else if (d?.type === "chat") { setChat((m) => [...m, { from: "them", text: d.text, time: nowTime() }]); }
        else if (d?.type === "file-meta" || d?.type === "file-chunk" || d?.type === "file-done") { onFileMsg(d, filesRef, setFiles, pushLog); }
      });
      c.on("close", () => { setStatus("idle"); pushLog("اتصال بسته شد"); });
    });
    p.on("call", (call: any) => {
      call.answer();
      call.on("stream", (s: MediaStream) => {
        if (remoteVideo.current) remoteVideo.current.srcObject = s;
        setStatus("live");
        pushLog("تصویر صفحه‌ی مشتری دریافت شد");
      });
    });
    p.on("error", (e: any) => {
      const t = e?.type;
      if (t === "peer-unavailable") { setErr("کد جلسه پیدا نشد — با مشتری چک کنید"); setStatus("idle"); }
      else { setErr("خطا در اتصال: " + (t || "نامشخص")); setStatus("idle"); }
      pushLog("خطا: " + (t || "نامشخص"));
    });
  };

  const sendChat = (t: string) => {
    if (!conn.current?.open) return;
    conn.current.send({ type: "chat", text: t });
    setChat((m) => [...m, { from: "me", text: t, time: nowTime() }]);
  };

  const sendFile = (f: File) => {
    if (!conn.current?.open) return;
    setProgress({ name: f.name, pct: 0 });
    streamFile(conn.current, f, (pct) => setProgress({ name: f.name, pct })).then((ok) => {
      setProgress(null);
      pushLog(ok ? "فایل ارسال شد: " + f.name : "ارسال فایل ناموفق بود");
    });
  };

  /** اشاره‌ی زنده: حرکت موس روی تصویر مشتری برای راهنمایی */
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (status !== "live" || !conn.current?.open || !viewerBox.current) return;
    const r = viewerBox.current.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    try { conn.current.send({ type: "cursor", x, y }); } catch { /* ignore */ }
  };

  const statusLabel =
    status === "idle" ? "منتظر ورود کد"
    : status === "connecting" ? "در حال اتصال…"
    : status === "wait" ? "متصل — منتظر تصویر"
    : "در حال مشاهده‌ی صفحه مشتری";

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-600"><Icon name="headset" className="h-7 w-7" /></span>
            <div>
              <p className="font-latin text-[10px] tracking-[0.3em] text-gold-600">SUPPORT CONSOLE</p>
              <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">کنسول پشتیبانی</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${status === "live" ? "bg-teal-500/15 text-teal-600" : "bg-gold-500/15 text-gold-600"}`}>
              <span className={`pulse-dot h-2 w-2 rounded-full ${status === "live" ? "bg-teal-500" : "bg-gold-500"}`} />
              {statusLabel}
            </span>
            <button onClick={onBack} className="rounded-xl border border-ink-100 bg-white px-4 py-2.5 text-xs font-bold text-mist-500 transition-colors hover:border-teal-500 hover:text-teal-600">بازگشت</button>
            {status !== "idle" && (
              <button onClick={end} className="rounded-xl bg-[#e5695e] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#d0554b]">قطع اتصال</button>
            )}
          </div>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div>
            {status === "idle" || status === "connecting" ? (
              <div className="reveal rounded-3xl border border-ink-100 bg-white p-8">
                <h3 className="font-display text-2xl text-ink-900">ورود به نشست مشتری</h3>
                <p className="mt-2 text-sm leading-7 text-mist-500">کد جلسه و رمزی را که مشتری تلفنی به شما داده است وارد کنید.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-ink-900">کد جلسه (۶ رقم)</span>
                    <input value={id} onChange={(e) => setId(e.target.value)} placeholder="مثلاً 482913" inputMode="numeric" className="w-full rounded-xl border border-ink-100 bg-paper px-4 py-3.5 text-center font-latin text-2xl font-bold tracking-[0.3em] text-ink-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15" dir="ltr" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-ink-900">رمز جلسه</span>
                    <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="رمز ۶ کاراکتری" className="w-full rounded-xl border border-ink-100 bg-paper px-4 py-3.5 text-center font-latin text-2xl font-bold tracking-[0.3em] text-ink-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15" dir="ltr" />
                  </label>
                </div>
                {err && <p className="ticker-in mt-4 rounded-xl bg-[#e5695e]/10 px-4 py-3 text-xs font-bold text-[#c0443a]">{err}</p>}
                <button onClick={connect} disabled={status === "connecting"} className="btn-shine mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-ink-950 px-6 py-4 text-base font-bold text-white transition-all hover:scale-[1.01] hover:bg-teal-600 disabled:opacity-60">
                  <Icon name="monitor" className="h-5 w-5 text-teal-400" />
                  {status === "connecting" ? "در حال اتصال…" : "اتصال و مشاهده‌ی صفحه"}
                </button>
              </div>
            ) : (
              <div className="reveal overflow-hidden rounded-3xl border border-ink-100 bg-ink-950">
                <div className="flex items-center justify-between border-b border-ink-700/70 px-4 py-3">
                  <p className="flex items-center gap-2 text-xs font-bold text-white">
                    <span className={`pulse-dot h-2 w-2 rounded-full ${status === "live" ? "bg-teal-500" : "bg-gold-500"}`} />
                    {status === "live" ? "صفحه‌ی زنده‌ی مشتری — موس را روی تصویر حرکت دهید تا اشاره کنید" : "متصل — منتظر شروع اشتراک مشتری"}
                  </p>
                  <button
                    onClick={() => (viewerBox.current as any)?.requestFullscreen?.()}
                    className="flex items-center gap-2 rounded-lg border border-ink-600 px-3 py-1.5 text-[11px] font-bold text-mist-300 transition-colors hover:border-gold-500 hover:text-gold-400"
                  >
                    <Icon name="monitor" className="h-3.5 w-3.5" />
                    تمام‌صفحه
                  </button>
                </div>
                <div ref={viewerBox} onPointerMove={onPointerMove} className="relative aspect-video cursor-crosshair bg-black">
                  <video ref={remoteVideo} autoPlay playsInline className="h-full w-full object-contain" />
                  {status !== "live" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                      <span className="seal-pulse flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-gold-500/70 text-gold-400"><Icon name="clock" className="h-6 w-6" /></span>
                      <p className="max-w-xs text-xs leading-6 text-mist-300">منتظر بمانید تا مشتری دکمه‌ی «اشتراک صفحه» را بزند…</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <LogList items={log} empty="رویدادهای اتصال اینجا نمایش داده می‌شود." />
            <ChatBox messages={chat} onSend={sendChat} disabled={status !== "live" && status !== "wait"} />
            <FilePanel files={files} progress={progress} busy={!!progress} disabled={status !== "live" && status !== "wait"} onPick={sendFile} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── صفحه ───────── */
export default function RemoteSupportPage() {
  const ref = useRevealAll<HTMLDivElement>();
  const [role, setRole] = useState<null | "customer" | "support">(null);

  return (
    <div ref={ref} className="bg-paper">
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-16 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute -left-32 top-0 h-[380px] w-[380px] rounded-full bg-teal-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-[300px] w-[300px] rounded-full bg-gold-500/10 blur-[110px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="reveal font-latin text-xs tracking-[0.35em] text-teal-400">TSOFT REMOTE CARE</p>
          <h1 className="mt-4">
            <span className="line-mask"><span className="font-display text-6xl leading-none text-white sm:text-7xl">پشتیبانی از راه دور،</span></span>
            <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
              <span className="font-display text-6xl leading-none text-gold-400 sm:text-7xl">با اجازه‌ی شما</span>
            </span>
          </h1>
          <p className="reveal mt-5 max-w-2xl leading-9 text-mist-300">
            بدون نصب هیچ برنامه‌ی خارجی. مشتری کد جلسه و رمز می‌گیرد، صفحه‌اش را با اجازه‌ی خودش به اشتراک می‌گذارد
            و پشتیبانی همان‌جا مشکل را می‌بیند، چت می‌کند و فایل می‌فرستد — مستقیم از مرورگر.
          </p>
          <div className="reveal mt-8 flex flex-wrap gap-3">
            {[
              { icon: "shield", t: "رمز جلسه برای هر نشست" },
              { icon: "users", t: "فقط با اجازه‌ی مشتری" },
              { icon: "chat", t: "چت و انتقال فایل دوطرفه" },
              { icon: "close", t: "قطع در هر لحظه" },
            ].map((b) => (
              <span key={b.t} className="flex items-center gap-2 rounded-full border border-ink-700/70 bg-ink-900/60 px-4 py-2 text-xs font-bold text-mist-300">
                <Icon name={b.icon} className="h-4 w-4 text-teal-400" />
                {b.t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {!role && (
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid gap-6 md:grid-cols-2">
              <button onClick={() => setRole("customer")} className="reveal card-lift group relative overflow-hidden rounded-3xl border-2 border-teal-500/50 bg-white p-9 text-right">
                <span className="absolute -left-8 -top-10 select-none font-latin text-[120px] font-bold leading-none text-teal-500/10">01</span>
                <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-600 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110"><Icon name="users" className="h-8 w-8" /></span>
                <h3 className="relative mt-6 font-display text-3xl text-ink-900">من مشتری هستم</h3>
                <p className="relative mt-3 text-sm leading-8 text-mist-500">کد جلسه و رمز می‌گیرم و صفحه‌ام را با اجازه‌ی خودم به اشتراک می‌گذارم تا پشتیبانی مشکل را ببیند و راهنمایی‌ام کند.</p>
                <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-bold text-teal-600">شروع نشست مشتری <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:-translate-x-1" /></span>
              </button>
              <button onClick={() => setRole("support")} className="reveal card-lift group relative overflow-hidden rounded-3xl border-2 border-gold-500/50 bg-white p-9 text-right" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
                <span className="absolute -left-8 -top-10 select-none font-latin text-[120px] font-bold leading-none text-gold-500/10">02</span>
                <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-600 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110"><Icon name="headset" className="h-8 w-8" /></span>
                <h3 className="relative mt-6 font-display text-3xl text-ink-900">من پشتیبانی هستم</h3>
                <p className="relative mt-3 text-sm leading-8 text-mist-500">کد جلسه و رمز مشتری را وارد می‌کنم؛ صفحه‌اش را زنده می‌بینم، چت می‌کنم، فایل می‌فرستم و با موس اشاره می‌کنم.</p>
                <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-bold text-gold-600">ورود به کنسول پشتیبانی <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:-translate-x-1" /></span>
              </button>
            </div>
          </div>
        </section>
      )}

      {role === "customer" && <CustomerSession onBack={() => setRole(null)} />}
      {role === "support" && <SupportSession onBack={() => setRole(null)} />}

      <section className="border-t border-ink-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="reveal font-display text-4xl text-ink-900">چطور کار می‌کند؟</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { n: fa(1), icon: "key", t: "مشتری کد می‌گیرد", d: "مشتری در سایت «نشست مشتری» را باز می‌کند، کد جلسه و رمز می‌سازد و تلفنی به شما می‌دهد." },
              { n: fa(2), icon: "monitor", t: "اشتراک صفحه", d: "مشتری دکمه‌ی اشتراک صفحه را می‌زند و مرورگر از او اجازه می‌گیرد. شما با کد و رمز متصل می‌شوید." },
              { n: fa(3), icon: "chat", t: "رفع مشکل", d: "صفحه را زنده می‌بینید، با چت راهنمایی می‌کنید، فایل می‌فرستید و با اشاره‌ی موس نشان می‌دهید." },
            ].map((s, i) => (
              <div key={s.n} className="reveal relative" style={{ "--rv-delay": `${i * 100}ms` } as React.CSSProperties}>
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-950 text-teal-400"><Icon name={s.icon} className="h-6 w-6" /></span>
                  <span className="font-display text-3xl text-gold-500">{s.n}</span>
                </div>
                <h3 className="mt-4 font-display text-xl text-ink-900">{s.t}</h3>
                <p className="mt-2 text-sm leading-7 text-mist-500">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
          <div className="reveal rounded-3xl border border-ink-100 bg-white p-8">
            <p className="flex items-center gap-3 font-display text-2xl text-ink-900"><Icon name="shield" className="h-6 w-6 text-teal-600" /> امنیت و حریم خصوصی</p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-mist-500">
              {[
                "رمز جلسه فقط روی دستگاه مشتری بررسی می‌شود و جایی ذخیره نمی‌شود.",
                "اتصال تصویری مستقیم بین دو مرورگر است و تصویر از سرور ما عبور نمی‌کند.",
                "مشتری هر لحظه با «پایان نشست» یا بستن اشتراک صفحه، جلسه را قطع می‌کند.",
                "با پایان نشست، کد و رمز باطل می‌شوند و قابل استفاده‌ی دوباره نیستند.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5"><Icon name="check" className="mt-1.5 h-4 w-4 shrink-0 text-teal-600" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="reveal rounded-3xl border border-ink-100 bg-white p-8" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
            <p className="flex items-center gap-3 font-display text-2xl text-ink-900"><Icon name="wrench" className="h-6 w-6 text-gold-600" /> امکانات این ابزار</p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-mist-500">
              {[
                "مشاهده‌ی زنده‌ی صفحه‌ی مشتری از مرورگر — بدون نصب برنامه",
                "گفت‌وگوی متنی دوطرفه در طول نشست",
                "ارسال و دریافت فایل بین پشتیبانی و مشتری با نوار پیشرفت",
                "اشاره‌ی زنده با نشانگر موس روی صفحه‌ی مشتری",
                "نیازمند مرورگر کروم، اج یا فایرفاکس به‌روز در هر دو طرف",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5"><Icon name="check" className="mt-1.5 h-4 w-4 shrink-0 text-gold-600" />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
