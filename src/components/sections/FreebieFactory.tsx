"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { freebies } from "@/content/site";
import Oodle from "../ui/Oodle";
import { MaskLines, Reveal } from "../ui/Reveal";

type Item = (typeof freebies.items)[number];
const FRIENDLY_ERROR = "Something went wrong — please try again.";

/** Bento placement for the 5 cards (desktop 3-col grid). */
const LAYOUT = [
  "lg:col-span-1 lg:row-span-2", // tall
  "lg:col-span-2", // wide
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-3", // full-width bottom
];

const downloadUrl = (item: Item) => `/api/freebies/download/${item.slug}`;

/** fetch with a timeout; never throws — resolves to null on network failure / timeout. */
async function safeFetch(url: string, init: RequestInit = {}, ms = 10_000): Promise<Response | null> {
  const ctrl = new AbortController();
  const t = window.setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal, credentials: "same-origin", cache: "no-store" });
  } catch {
    return null;
  } finally {
    window.clearTimeout(t);
  }
}

function startDownload(item: Item) {
  const a = document.createElement("a");
  a.href = downloadUrl(item);
  a.download = `${item.title}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function DownloadIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path d="M10 3v10m0 0l-4-4m4 4l4-4M4 16h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FreebieCard({ item, i, onPick }: { item: Item; i: number; onPick: (item: Item) => void }) {
  const tall = i === 0;
  const wide = i === 1 || i === 4;
  return (
    <motion.button
      type="button"
      onClick={() => onPick(item)}
      aria-label={`Download ${item.title}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ type: "spring", duration: 0.8, bounce: 0.2, delay: i * 0.06 }}
      className={`group relative flex min-h-[250px] cursor-pointer flex-col gap-6 overflow-hidden rounded-[28px] border-[3px] border-ink p-6 text-left text-cream shadow-[0_8px_0_0_var(--color-ink)] transition-[transform,box-shadow] duration-300 ease-(--ease-out) active:translate-y-[4px] active:shadow-[0_4px_0_0_var(--color-ink)] sm:p-7 [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_12px_0_0_var(--color-ink)] ${
        tall ? "lg:min-h-[560px]" : ""
      } ${item.bg} ${LAYOUT[i]}`}
    >
      {/* brand pattern */}
      <Image
        src={item.pattern}
        alt=""
        aria-hidden
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover opacity-30 transition-transform duration-700 ease-(--ease-out) group-hover:scale-105"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />

      <div className="relative flex items-start justify-between gap-3">
        <span className={`rounded-full border-2 border-ink px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${item.chip}`}>{item.tag}</span>
        <span className="rounded-full border-2 border-cream/60 px-2.5 py-0.5 text-[11px] font-bold text-cream/90">PDF</span>
      </div>

      {/* Oodle */}
      <div
        className={`pointer-events-none absolute transition-transform duration-500 ease-(--ease-out) group-hover:-translate-y-2 group-hover:rotate-[-6deg] ${
          tall
            ? "max-lg:right-[5%] max-lg:top-1/2 max-lg:w-[30%] max-lg:-translate-y-1/2 lg:left-1/2 lg:top-[22%] lg:w-[52%] lg:-translate-x-1/2"
            : wide
              ? "right-[5%] top-1/2 w-[clamp(100px,16%,180px)] -translate-y-1/2"
              : "right-[5%] top-1/2 w-[32%] -translate-y-1/2"
        }`}
      >
        <Oodle world={item.world} shape={item.shape} className="sticker h-auto w-full" sizes="200px" />
      </div>

      <div className={`relative mt-auto ${tall ? "max-lg:max-w-[64%]" : wide ? "max-w-[64%] lg:max-w-[60%]" : "max-w-[64%]"}`}>
        <h3 className="font-display text-[clamp(1.5rem,2.2vw,2.2rem)] leading-[0.95] text-sun [text-shadow:0_2px_0_rgb(30_34_45/0.55)] [text-wrap:balance]">{item.title}</h3>
        <p className="mt-2 max-w-[34ch] text-[15px] font-medium leading-snug text-cream [text-shadow:0_1px_2px_rgb(0_0_0/0.45)]">{item.blurb}</p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full border-[2.5px] border-ink bg-cream py-1.5 pl-4 pr-1.5 text-[14px] font-bold text-ink">
          Free download
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-cream transition-transform duration-300 group-hover:translate-y-0.5">
            <DownloadIcon className="h-3.5 w-3.5" />
          </span>
        </span>
      </div>
    </motion.button>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  error,
  autoComplete,
  inputMode,
  inputRef,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete: string;
  inputMode?: "text" | "tel" | "email";
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-[13px] font-bold text-ink">{label}</span>
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`h-12 w-full rounded-[14px] border-[2.5px] bg-white/60 px-4 text-[16px] text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/40 focus:bg-white focus:shadow-[0_3px_0_0_var(--color-ink)] ${
          error ? "border-tomato" : "border-ink"
        }`}
      />
      {error && (
        <span id={`${id}-err`} className="mt-1 block text-[12.5px] font-semibold text-tomato">
          {error}
        </span>
      )}
    </label>
  );
}

function RegisterModal({ item, onClose }: { item: Item; onClose: () => void }) {
  const f = freebies.form;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const openedAt = useRef(0);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    openedAt.current = Date.now();
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [onClose]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Please tell us your name.";
    if (!/^\+?[\d\s-]{10,15}$/.test(phone.trim())) next.phone = "Please enter a valid contact number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Please enter a valid email.";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length) return;

    setSending(true);
    const res = await safeFetch("/api/freebies/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, freebie: item.slug, website, openedAt: openedAt.current }),
    });
    const data: { ok?: boolean; error?: string; errors?: Record<string, string> } = res ? await res.json().catch(() => ({})) : {};
    setSending(false);

    if (res?.ok && data.ok) {
      setSent(true);
      startDownload(item);
      window.setTimeout(onClose, 1800);
      return;
    }
    if (res?.status === 400 && data.errors) {
      const { freebie: _f, ...fields } = data.errors;
      void _f;
      setErrors(fields);
      if (!Object.keys(fields).length) setFormError(data.error ?? FRIENDLY_ERROR);
      return;
    }
    setFormError(res?.status === 429 && data.error ? data.error : FRIENDLY_ERROR);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default bg-ink/55 backdrop-blur-[2px]" />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="freebie-form-title"
        className="relative w-full max-w-[460px] rounded-[30px] border-[3px] border-ink bg-cream p-6 pt-14 text-ink shadow-[0_10px_0_0_var(--color-ink)] sm:p-8 sm:pt-16"
        initial={{ y: 40, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 20, scale: 0.98, opacity: 0, transition: { duration: 0.15 } }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
      >
        {/* Oodle peeking over the top */}
        <div className="pointer-events-none absolute -top-16 left-1/2 w-[110px] -translate-x-1/2">
          <Oodle world={item.world} shape={item.shape} className="sticker h-auto w-full" sizes="120px" />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-cream transition-transform duration-[120ms] active:scale-95"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>

        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="py-6 text-center">
              <p className="font-display text-[clamp(1.6rem,4vw,2rem)] leading-tight">{f.done}</p>
              <p className="mt-2 text-[15px] text-ink/70">{item.title}</p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -8, transition: { duration: 0.12 } }}>
              <h3 id="freebie-form-title" className="text-center font-display text-[clamp(1.5rem,4vw,2rem)] leading-[1.02]">
                {f.title}
              </h3>
              <p className="mt-2 text-center text-[14.5px] leading-snug text-ink/70">{f.sub}</p>
              <p className="mx-auto mt-3 w-fit rounded-full border-2 border-ink bg-sun px-3 py-1 text-[12.5px] font-bold">
                {item.title}
              </p>

              <div className="mt-6 space-y-4">
                <Field id="fr-name" label={f.name} type="text" value={name} onChange={setName} error={errors.name} autoComplete="name" inputRef={firstRef} />
                <Field id="fr-phone" label={f.phone} type="tel" value={phone} onChange={setPhone} error={errors.phone} autoComplete="tel" inputMode="tel" />
                <Field id="fr-email" label={f.email} type="email" value={email} onChange={setEmail} error={errors.email} autoComplete="email" inputMode="email" />
              </div>

              {/* honeypot — hidden from people, tempting to bots */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                aria-hidden
                className="absolute left-[-9999px] h-px w-px opacity-0"
              />

              <AnimatePresence>
                {formError && (
                  <motion.p
                    role="alert"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-5 rounded-[14px] border-2 border-tomato bg-tomato/10 px-4 py-2.5 text-center text-[13.5px] font-semibold text-ink"
                  >
                    {formError}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={sending}
                aria-busy={sending}
                className="mt-6 flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full border-[2.5px] border-ink bg-sun text-[15px] font-bold shadow-[0_5px_0_0_var(--color-ink)] transition-[transform,box-shadow,opacity] duration-[120ms] active:translate-y-[5px] active:shadow-none disabled:cursor-wait disabled:opacity-70"
              >
                {sending ? "Sending…" : f.submit}
                {!sending && <DownloadIcon className="h-4 w-4" />}
              </button>
              <p className="mt-3 text-center text-[12px] text-ink/55">{f.note}</p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/**
 * Freebie Factory — five printables in a bento grid on the brand patterns.
 * First download asks for name / contact / email; after that, downloads go straight through.
 */
export default function FreebieFactory() {
  const [picked, setPicked] = useState<Item | null>(null);
  const [notice, setNotice] = useState("");
  const [before] = freebies.headline.split(freebies.highlight);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(t);
  }, [notice]);

  // Already registered (valid signed cookie)? download straight away. Otherwise ask first.
  const pick = async (item: Item) => {
    const res = await safeFetch(downloadUrl(item), { method: "HEAD" }, 6000);
    if (res?.ok) startDownload(item);
    else if (res?.status === 401) setPicked(item);
    else setNotice(res?.status === 429 ? "Too many tries — please wait a minute." : "Couldn't start the download — please try again.");
  };

  return (
    <section id="freebies" aria-labelledby="freebies-title" className="relative overflow-x-clip bg-cream py-[clamp(72px,12vh,150px)] text-ink">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <h2
            id="freebies-title"
            aria-label={freebies.headline}
            className="font-display text-[clamp(1.8rem,min(4vw,6.4svh),4rem)] leading-[0.95] [text-wrap:balance]"
          >
            <MaskLines
              lines={[
                <span key="h" aria-hidden>
                  {before}
                  <span className="text-tomato">{freebies.highlight}</span>
                </span>,
              ]}
            />
          </h2>
          <Reveal delay={0.05} className="mt-[clamp(16px,3svh,28px)] max-w-[640px]">
            <p className="text-[clamp(1rem,1.6vw,1.3rem)] leading-[1.6] text-ink/75">{freebies.lead}</p>
          </Reveal>
        </div>

        <div className="mt-[clamp(36px,6vh,64px)] grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {freebies.items.map((item, i) => (
            <FreebieCard key={item.title} item={item} i={i} onPick={pick} />
          ))}
        </div>
      </div>

      <AnimatePresence>{picked && <RegisterModal item={picked} onClose={() => setPicked(null)} />}</AnimatePresence>

      <AnimatePresence>
        {notice && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
            className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full border-[2.5px] border-ink bg-cream px-5 py-2.5 text-[14px] font-semibold text-ink shadow-[0_4px_0_0_var(--color-ink)]"
          >
            {notice}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
