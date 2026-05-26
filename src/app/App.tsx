import { useState } from "react";
import { ChevronLeft, Plus, Trash2, Check, CreditCard } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────── */
type Screen = "dashboard" | "add" | "detail";
type Cycle = "monthly" | "yearly";
type Category = "Entertainment" | "Productivity" | "Health" | "Finance" | "Other";

interface Sub {
  id: string;
  name: string;
  cost: number;
  cycle: Cycle;
  nextDate: string;
  category: Category;
  color: string;
  icon: string;
}

/* ─── Seed data ──────────────────────────────────────────────── */
const SEED: Sub[] = [
  { id: "1", name: "Netflix", cost: 15.99, cycle: "monthly", nextDate: "Jun 10", category: "Entertainment", color: "#E50914", icon: "N" },
  { id: "2", name: "Spotify", cost: 9.99, cycle: "monthly", nextDate: "Jun 15", category: "Entertainment", color: "#1DB954", icon: "S" },
  { id: "3", name: "iCloud+", cost: 2.99, cycle: "monthly", nextDate: "Jun 22", category: "Other", color: "#0A84FF", icon: "☁" },
  { id: "4", name: "ChatGPT Plus", cost: 20.00, cycle: "monthly", nextDate: "Jun 25", category: "Productivity", color: "#10A37F", icon: "G" },
];

/* ─── Design tokens (dark app theme) ────────────────────────── */
const T = {
  bg: "#07101F",
  card: "#0F1C30",
  card2: "#162337",
  accent: "#6366F1",
  accent2: "#8B5CF6",
  accentGrad: "linear-gradient(135deg,#6366F1,#8B5CF6)",
  text: "#F0F4FF",
  text2: "#5E7494",
  text3: "#9DB3CB",
  border: "rgba(255,255,255,0.07)",
  danger: "#EF4444",
  dangerBg: "rgba(239,68,68,0.1)",
  dangerBorder: "rgba(239,68,68,0.25)",
  success: "#22C55E",
  r: "16px",
  r2: "22px",
} as const;

/* ─── Helpers ────────────────────────────────────────────────── */
const CATS: Category[] = ["Entertainment", "Productivity", "Health", "Finance", "Other"];
const CAT_COLORS: Record<Category, string> = {
  Entertainment: "#E50914",
  Productivity:  "#10A37F",
  Health:        "#22C55E",
  Finance:       "#F59E0B",
  Other:         "#6366F1",
};

function monthly(s: Sub) {
  return s.cycle === "yearly" ? s.cost / 12 : s.cost;
}

/* ─── Sub-components ─────────────────────────────────────────── */

function ServiceBadge({ color, icon, size = 42 }: { color: string; icon: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.3,
      background: color + "1F",
      border: `1.5px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.4, fontWeight: 700, color,
      flexShrink: 0, userSelect: "none",
    }}>
      {icon}
    </div>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{
      padding: "13px 18px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      borderBottom: last ? "none" : `1px solid ${T.border}`,
    }}>
      <span style={{ fontSize: 13, color: T.text3 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{value}</span>
    </div>
  );
}

function Pill({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 13, fontWeight: 600,
      cursor: "pointer", border: "none", transition: "all 0.2s",
      background: active ? T.accent : "transparent",
      color: active ? "#fff" : T.text2,
    }}>
      {children}
    </button>
  );
}

function CategoryTag({ cat, active, onClick }: { cat: Category; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600,
      cursor: "pointer", transition: "all 0.2s",
      border: `1px solid ${active ? T.accent + "66" : T.border}`,
      background: active ? T.accent + "1F" : T.card,
      color: active ? "#A5B4FC" : T.text2,
    }}>
      {cat}
    </button>
  );
}

/* ─── Dashboard Screen ───────────────────────────────────────── */
function Dashboard({ subs, onNav, onSelect }: {
  subs: Sub[];
  onNav: (s: Screen) => void;
  onSelect: (s: Sub) => void;
}) {
  const total = subs.reduce((a, s) => a + monthly(s), 0);
  const next = [...subs].sort((a, b) => a.nextDate.localeCompare(b.nextDate))[0];

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%", background: T.bg, color: T.text, fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Scrollable body */}
      <div style={{ overflowY: "auto", flex: 1, paddingBottom: 80 }}>

        {/* Top bar */}
        <div style={{ padding: "16px 20px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, color: T.text2, textTransform: "uppercase", letterSpacing: "0.12em" }}>May 2026</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.text, marginTop: 1, letterSpacing: "-0.02em" }}>Spendora</div>
          </div>
          <div style={{ width: 33, height: 33, borderRadius: 17, background: T.accentGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>SN</div>
        </div>

        {/* Hero total */}
        <div style={{ padding: "10px 20px 18px" }}>
          <div style={{ fontSize: 10, color: T.text2, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Monthly Spend</div>
          <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em", background: "linear-gradient(135deg,#fff 30%,#a5b4fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            ${total.toFixed(2)}
          </div>
          <div style={{ fontSize: 11, color: T.text2, marginTop: 7 }}>
            {subs.length} active subscription{subs.length !== 1 ? "s" : ""} · Updated today
          </div>
        </div>

        {/* Next charge spotlight */}
        {next && (
          <div
            style={{ margin: "0 16px 14px", borderRadius: T.r2, padding: "14px 16px", background: "linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.10))", border: "1px solid rgba(99,102,241,0.28)", cursor: "pointer" }}
            onClick={() => { onSelect(next); onNav("detail"); }}
          >
            <div style={{ fontSize: 9, color: "#A5B4FC", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>Next Charge</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <ServiceBadge color={next.color} icon={next.icon} size={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{next.name}</div>
                <div style={{ fontSize: 11, color: "#A5B4FC", marginTop: 2 }}>Due {next.nextDate}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: T.text }}>${next.cost.toFixed(2)}</div>
                <div style={{ fontSize: 10, color: "#A5B4FC", marginTop: 1 }}>/{next.cycle === "yearly" ? "yr" : "mo"}</div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription list */}
        <div style={{ padding: "0 16px" }}>
          <div style={{ fontSize: 10, color: T.text2, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>All Subscriptions</div>

          {subs.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "44px 0 20px", gap: 12, textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 18, background: T.card, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>📭</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: T.text }}>No subscriptions yet</div>
              <div style={{ fontSize: 12, color: T.text2 }}>Tap + to add your first one</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {subs.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { onSelect(s); onNav("detail"); }}
                  style={{ width: "100%", textAlign: "left", background: T.card, border: `1px solid ${T.border}`, borderRadius: T.r2, padding: "13px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "background 0.15s" }}
                >
                  <ServiceBadge color={s.color} icon={s.icon} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: T.text2, marginTop: 2 }}>{s.category}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>
                      ${monthly(s).toFixed(2)}
                      <span style={{ fontSize: 10, fontWeight: 400, color: T.text2 }}>/mo</span>
                    </div>
                    <div style={{ fontSize: 10, color: T.text2, marginTop: 2 }}>Next: {s.nextDate}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <div style={{ position: "absolute", bottom: 24, right: 20, zIndex: 20 }}>
        <button
          onClick={() => onNav("add")}
          style={{ width: 52, height: 52, borderRadius: 26, background: T.accentGrad, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 28px rgba(99,102,241,0.45)" }}
        >
          <Plus color="#fff" size={22} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

/* ─── Add Screen ─────────────────────────────────────────────── */
function AddSubscription({ onNav, onSave }: {
  onNav: (s: Screen) => void;
  onSave: (s: Sub) => void;
}) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const [category, setCategory] = useState<Category>("Entertainment");
  const [done, setDone] = useState(false);

  const isValid = name.trim().length > 0 && parseFloat(cost) > 0;

  function save() {
    if (!isValid) return;
    setDone(true);
    setTimeout(() => {
      onSave({
        id: Date.now().toString(),
        name: name.trim(),
        cost: parseFloat(cost),
        cycle,
        nextDate: "Jul 1",
        category,
        color: CAT_COLORS[category],
        icon: name.trim()[0].toUpperCase(),
      });
      onNav("dashboard");
    }, 550);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: T.card, border: `1px solid ${T.border}`,
    borderRadius: T.r, padding: "13px 16px", fontSize: 14, color: T.text,
    outline: "none", boxSizing: "border-box", fontFamily: "Inter, system-ui, sans-serif",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg, color: T.text, fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <button onClick={() => onNav("dashboard")} style={{ width: 32, height: 32, borderRadius: 10, background: T.card, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft color={T.text3} size={18} />
        </button>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>Add Subscription</div>
      </div>

      {/* Form */}
      <div style={{ overflowY: "auto", flex: 1, padding: "20px 18px 32px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Name */}
        <div>
          <div style={{ fontSize: 10, color: T.text2, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Service Name</div>
          <input
            className="dark-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Netflix"
            style={inputStyle}
          />
        </div>

        {/* Cost */}
        <div>
          <div style={{ fontSize: 10, color: T.text2, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Cost</div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: T.text3, fontSize: 15, fontWeight: 600, pointerEvents: "none" }}>$</span>
            <input
              className="dark-input"
              type="number"
              step="0.01"
              min="0"
              value={cost}
              onChange={e => setCost(e.target.value)}
              placeholder="0.00"
              style={{ ...inputStyle, paddingLeft: 30 }}
            />
          </div>
        </div>

        {/* Billing cycle */}
        <div>
          <div style={{ fontSize: 10, color: T.text2, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Billing Cycle</div>
          <div style={{ display: "flex", background: T.card, borderRadius: T.r, padding: 4, border: `1px solid ${T.border}`, gap: 4 }}>
            <Pill active={cycle === "monthly"} onClick={() => setCycle("monthly")}>Monthly</Pill>
            <Pill active={cycle === "yearly"} onClick={() => setCycle("yearly")}>Yearly</Pill>
          </div>
        </div>

        {/* Category */}
        <div>
          <div style={{ fontSize: 10, color: T.text2, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Category</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CATS.map(c => (
              <CategoryTag key={c} cat={c} active={category === c} onClick={() => setCategory(c)} />
            ))}
          </div>
        </div>

        {/* Next billing date (static for prototype) */}
        <div>
          <div style={{ fontSize: 10, color: T.text2, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Next Billing Date</div>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.r, padding: "13px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: T.text }}>July 1, 2026</span>
            <span style={{ fontSize: 16 }}>📅</span>
          </div>
        </div>

        {/* Preview card */}
        {isValid && (
          <div style={{ background: T.card, borderRadius: T.r2, padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, border: `1px solid ${T.border}` }}>
            <ServiceBadge color={CAT_COLORS[category]} icon={name[0]?.toUpperCase() ?? "?"} size={38} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{name}</div>
              <div style={{ fontSize: 11, color: T.text2, marginTop: 2 }}>{category} · {cycle}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: T.text }}>
              ${cycle === "yearly" ? (parseFloat(cost) / 12).toFixed(2) : parseFloat(cost).toFixed(2)}
              <span style={{ fontSize: 10, fontWeight: 400, color: T.text2 }}>/mo</span>
            </div>
          </div>
        )}

        {/* Save button */}
        <button
          onClick={save}
          disabled={!isValid}
          style={{
            width: "100%", padding: "15px", borderRadius: T.r, border: "none",
            cursor: isValid ? "pointer" : "not-allowed",
            fontSize: 15, fontWeight: 700, color: "#fff",
            background: isValid ? T.accentGrad : T.card2,
            opacity: isValid ? 1 : 0.5,
            transition: "all 0.25s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: isValid ? "0 8px 24px rgba(99,102,241,0.35)" : "none",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {done ? <Check size={18} strokeWidth={2.5} /> : <CreditCard size={17} strokeWidth={2} />}
          {done ? "Saved!" : "Save Subscription"}
        </button>
      </div>
    </div>
  );
}

/* ─── Detail Screen ──────────────────────────────────────────── */
function Detail({ sub, onNav, onDelete }: {
  sub: Sub;
  onNav: (s: Screen) => void;
  onDelete: (id: string) => void;
}) {
  const mo = monthly(sub);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg, color: T.text, fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <button onClick={() => onNav("dashboard")} style={{ width: 32, height: 32, borderRadius: 10, background: T.card, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft color={T.text3} size={18} />
        </button>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>Detail</div>
      </div>

      <div style={{ overflowY: "auto", flex: 1 }}>

        {/* Hero card */}
        <div style={{ margin: "16px 16px 14px", borderRadius: T.r2, padding: "22px 18px", background: `linear-gradient(135deg,${sub.color}1A,${sub.color}0A)`, border: `1px solid ${sub.color}2F` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <ServiceBadge color={sub.color} icon={sub.icon} size={52} />
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: "-0.03em" }}>{sub.name}</div>
              <div style={{ fontSize: 12, color: T.text3, marginTop: 3 }}>{sub.category}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            <div>
              <div style={{ fontSize: 9, color: T.text2, textTransform: "uppercase", letterSpacing: "0.12em" }}>Monthly</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: "-0.03em", marginTop: 3 }}>${mo.toFixed(2)}</div>
            </div>
            {sub.cycle === "yearly" && (
              <div>
                <div style={{ fontSize: 9, color: T.text2, textTransform: "uppercase", letterSpacing: "0.12em" }}>Yearly</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: "-0.03em", marginTop: 3 }}>${sub.cost.toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Info rows */}
        <div style={{ margin: "0 16px 12px", background: T.card, borderRadius: T.r2, border: `1px solid ${T.border}`, overflow: "hidden" }}>
          <Row label="Billing Cycle" value={sub.cycle.charAt(0).toUpperCase() + sub.cycle.slice(1)} />
          <Row label="Next Billing" value={`${sub.nextDate}, 2026`} />
          <Row label="Category" value={sub.category} />
          <Row label="Monthly Cost" value={`$${mo.toFixed(2)}`} last />
        </div>

        {/* Next charge badge */}
        <div style={{ margin: "0 16px 16px", background: "rgba(99,102,241,0.10)", borderRadius: T.r, padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(99,102,241,0.2)" }}>
          <span style={{ fontSize: 12, color: "#A5B4FC", fontWeight: 500 }}>Next charge</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#A5B4FC" }}>{sub.nextDate}, 2026</span>
        </div>

        {/* Delete */}
        <div style={{ margin: "0 16px 32px" }}>
          <button
            onClick={() => { onDelete(sub.id); onNav("dashboard"); }}
            style={{ width: "100%", padding: "14px", borderRadius: T.r, border: `1px solid ${T.dangerBorder}`, background: T.dangerBg, cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#F87171", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "Inter, system-ui, sans-serif" }}
          >
            <Trash2 size={15} color="#F87171" strokeWidth={2.5} />
            Delete Subscription
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Phone Frame (iPhone 17 Pro) ───────────────────────────── */
function PhoneFrame({ children, label, index, active, onClick }: {
  children: React.ReactNode;
  label: string;
  index: number;
  active: boolean;
  onClick: () => void;
}) {
  /* iPhone 17 Pro: 6.3" display, ~393×852 logical px, titanium frame */
  const W = 272, H = 590;
  const FRAME = 10; /* bezel thickness */
  const titanium = active ? "#8A8FA8" : "#4A5068";
  const titaniumShine = active ? "#A0A6BE" : "#5A607C";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.2em", fontFamily: "Inter, system-ui, sans-serif" }}>
        Screen {index} — {label}
      </div>

      {/* Outer titanium shell */}
      <div style={{ position: "relative" }}>

        {/* Action Button — left side, upper */}
        <div style={{
          position: "absolute", left: -5, top: 108,
          width: 4, height: 28, borderRadius: "2px 0 0 2px",
          background: `linear-gradient(180deg, ${titaniumShine}, ${titanium})`,
          boxShadow: active ? "-1px 0 4px rgba(0,0,0,0.5)" : "none",
        }} />

        {/* Volume Up — left side */}
        <div style={{
          position: "absolute", left: -5, top: 152,
          width: 4, height: 36, borderRadius: "2px 0 0 2px",
          background: `linear-gradient(180deg, ${titaniumShine}, ${titanium})`,
        }} />

        {/* Volume Down — left side */}
        <div style={{
          position: "absolute", left: -5, top: 198,
          width: 4, height: 36, borderRadius: "2px 0 0 2px",
          background: `linear-gradient(180deg, ${titaniumShine}, ${titanium})`,
        }} />

        {/* Side button (power) — right side */}
        <div style={{
          position: "absolute", right: -5, top: 148,
          width: 4, height: 54, borderRadius: "0 2px 2px 0",
          background: `linear-gradient(180deg, ${titaniumShine}, ${titanium})`,
        }} />

        {/* Camera Control — right side, below side button */}
        <div style={{
          position: "absolute", right: -5, top: 226,
          width: 4, height: 40, borderRadius: "0 2px 2px 0",
          background: `linear-gradient(180deg, ${titaniumShine}, ${titanium})`,
          boxShadow: active ? "1px 0 4px rgba(0,0,0,0.4)" : "none",
        }} />

        {/* Phone body */}
        <div
          onClick={onClick}
          style={{
            position: "relative",
            width: W, height: H,
            borderRadius: 44,
            background: `linear-gradient(160deg, ${titaniumShine} 0%, ${titanium} 40%, #2A2E42 100%)`,
            padding: FRAME,
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: active
              ? `0 0 0 1px rgba(138,143,168,0.4), 0 28px 72px rgba(99,102,241,0.28), 0 8px 24px rgba(0,0,0,0.5)`
              : "0 8px 32px rgba(0,0,0,0.45)",
            opacity: active ? 1 : 0.72,
            transform: active ? "scale(1.01)" : "scale(1)",
          }}
        >
          {/* Inner screen glass */}
          <div style={{
            width: "100%", height: "100%",
            borderRadius: 36,
            overflow: "hidden",
            background: "#07101F",
            position: "relative",
          }}>

            {/* Dynamic Island — pill-shaped cutout */}
            <div style={{
              position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
              width: 88, height: 28, background: "#000",
              borderRadius: 20, zIndex: 20,
              boxShadow: "0 0 0 2px #000, inset 0 0 8px rgba(0,0,0,0.8)",
            }} />

            {/* Status bar */}
            <div style={{
              height: 52, background: "#07101F",
              display: "flex", alignItems: "flex-end",
              justifyContent: "space-between",
              padding: "0 22px 8px",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#C8D0E4", fontFamily: "Inter, system-ui, sans-serif", letterSpacing: "-0.02em" }}>9:41</span>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {/* Cellular signal */}
                <div style={{ display: "flex", gap: 1.5, alignItems: "flex-end", height: 10 }}>
                  {[3, 5, 7.5, 10].map((h, i) => (
                    <div key={i} style={{ width: 3, height: h, background: i < 3 ? "#C8D0E4" : "rgba(200,208,228,0.25)", borderRadius: 1.5 }} />
                  ))}
                </div>
                {/* WiFi */}
                <div style={{ display: "flex", flexDirection: "column", gap: 1.5, alignItems: "center" }}>
                  {[9, 6, 3].map((w, i) => (
                    <div key={i} style={{ width: w, height: 1.5, background: i === 0 ? "#C8D0E4" : "rgba(200,208,228,0.45)", borderRadius: 1 }} />
                  ))}
                </div>
                {/* Battery */}
                <div style={{ width: 18, height: 9, border: "1.5px solid rgba(200,208,228,0.45)", borderRadius: 3, position: "relative", display: "flex", alignItems: "center", padding: "1.5px" }}>
                  <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 2.5, height: 5, background: "rgba(200,208,228,0.35)", borderRadius: 1 }} />
                  <div style={{ width: "75%", height: "100%", background: "#30D158", borderRadius: 1.5 }} />
                </div>
              </div>
            </div>

            {/* Screen content */}
            <div style={{ height: `calc(100% - 52px)`, overflow: "hidden", position: "relative" }}>
              {children}
            </div>

            {/* Home indicator */}
            <div style={{
              position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
              width: 80, height: 4, background: "rgba(255,255,255,0.22)",
              borderRadius: 2.5,
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── App root ───────────────────────────────────────────────── */
export default function App() {
  const [subs, setSubs] = useState<Sub[]>(SEED);
  const [active, setActive] = useState<Screen>("dashboard");
  const [selected, setSelected] = useState<Sub>(SEED[0]);

  function handleNav(s: Screen) { setActive(s); }
  function handleSelect(s: Sub) { setSelected(s); }
  function handleSave(s: Sub) { setSubs(prev => [...prev, s]); }
  function handleDelete(id: string) { setSubs(prev => prev.filter(s => s.id !== id)); }

  const screens: { id: Screen; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "add", label: "Add" },
    { id: "detail", label: "Detail" },
  ];

  return (
    <>
      {/* Placeholder style for dark inputs */}
      <style>{`
        .dark-input::placeholder { color: #374B64; }
        .dark-input { caret-color: #6366F1; }
        .dark-input:focus { border-color: rgba(99,102,241,0.5) !important; }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#EEF2F8", fontFamily: "Inter, system-ui, sans-serif", display: "flex", flexDirection: "column" }}>

        {/* Page header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "18px 40px" }}>
          <div style={{ maxWidth: 1040, margin: "0 auto" }}>
            <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 4 }}>Hi-Fi Prototype</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#0A1628", letterSpacing: "-0.03em" }}>Spendora — Subscription Tracker</div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>3 screens · iPhone 17 Pro · May 2026 · Dark theme · Fully interactive — click phones or tap cards to navigate</div>
          </div>
        </div>

        {/* ── Desktop: 3 phones side by side ── */}
        <div className="hidden lg:flex" style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 28, padding: "52px 40px", flexWrap: "wrap" }}>

          <PhoneFrame label="Dashboard" index={1} active={active === "dashboard"} onClick={() => setActive("dashboard")}>
            <Dashboard subs={subs} onNav={handleNav} onSelect={handleSelect} />
          </PhoneFrame>

          <div style={{ color: "#CBD5E1", fontSize: 22, fontWeight: 300, userSelect: "none" }}>→</div>

          <PhoneFrame label="Add Subscription" index={2} active={active === "add"} onClick={() => setActive("add")}>
            <AddSubscription onNav={handleNav} onSave={handleSave} />
          </PhoneFrame>

          <div style={{ color: "#CBD5E1", fontSize: 22, fontWeight: 300, userSelect: "none" }}>→</div>

          <PhoneFrame label="Detail View" index={3} active={active === "detail"} onClick={() => setActive("detail")}>
            <Detail sub={selected} onNav={handleNav} onDelete={handleDelete} />
          </PhoneFrame>
        </div>

        {/* ── Mobile: tabs + single phone ── */}
        <div className="lg:hidden" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "28px 20px" }}>
          <div style={{ display: "flex", gap: 6, background: "#fff", borderRadius: 14, padding: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            {screens.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                style={{ padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s", background: active === s.id ? "#6366F1" : "transparent", color: active === s.id ? "#fff" : "#64748B" }}
              >
                {i + 1}. {s.label}
              </button>
            ))}
          </div>

          <PhoneFrame
            label={screens.find(s => s.id === active)?.label ?? ""}
            index={screens.findIndex(s => s.id === active) + 1}
            active
            onClick={() => {}}
          >
            {active === "dashboard" && <Dashboard subs={subs} onNav={handleNav} onSelect={handleSelect} />}
            {active === "add" && <AddSubscription onNav={handleNav} onSave={handleSave} />}
            {active === "detail" && <Detail sub={selected} onNav={handleNav} onDelete={handleDelete} />}
          </PhoneFrame>
        </div>

        {/* Legend bar */}
        <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0", padding: "12px 40px" }}>
          <div style={{ maxWidth: 1040, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
            <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.14em" }}>
              Tap subscription cards → Detail · Tap + → Add · Back arrows → Dashboard
            </div>
            <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.14em" }}>
              Dark Navy · Indigo · Inter · Spendora v1
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
