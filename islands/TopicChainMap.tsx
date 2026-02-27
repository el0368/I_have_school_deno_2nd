import { useSignal } from "@preact/signals";

// ── Types ─────────────────────────────────────────────────────────────────
type MasteryStatus =
  | "mastered"
  | "proficient"
  | "familiar"
  | "attempted"
  | "not_started"
  | "locked";

interface LessonNode {
  id: string;
  title: string;
  status: MasteryStatus;
}

interface UnitRow {
  id: string;
  title: string;
  lessons: LessonNode[];
}

interface TopicGroup {
  id: string;
  label: string;
  emoji: string;
  color: string; // CSS variable suffix or hex
  units: UnitRow[];
}

// ── Sample data (will eventually come from PGlite + mdx-routes) ───────────
const CURRICULUM: TopicGroup[] = [
  {
    id: "1_quantity",
    label: "Quantity & Number Sense",
    emoji: "🔢",
    color: "#2563eb",
    units: [
      {
        id: "01_counting",
        title: "01 · Counting & Place Value",
        lessons: [
          { id: "l1", title: "Counting to 10", status: "mastered" },
          { id: "l2", title: "Counting to 20", status: "mastered" },
          { id: "l3", title: "Place value ones", status: "proficient" },
          { id: "l4", title: "Place value tens", status: "familiar" },
          { id: "l5", title: "Comparing numbers", status: "attempted" },
          { id: "l6", title: "Skip counting", status: "not_started" },
        ],
      },
      {
        id: "02_addition",
        title: "02 · Addition & Subtraction",
        lessons: [
          { id: "l7", title: "Add within 10", status: "not_started" },
          { id: "l8", title: "Subtract within 10", status: "locked" },
          { id: "l9", title: "Add within 20", status: "locked" },
          { id: "l10", title: "Subtract within 20", status: "locked" },
          { id: "l11", title: "Word problems", status: "locked" },
        ],
      },
      {
        id: "03_multiplication",
        title: "03 · Multiplication & Division",
        lessons: [
          { id: "l12", title: "Times tables 1-5", status: "locked" },
          { id: "l13", title: "Times tables 6-10", status: "locked" },
          { id: "l14", title: "Division basics", status: "locked" },
          { id: "l15", title: "Long multiplication", status: "locked" },
        ],
      },
      {
        id: "04_fractions",
        title: "04 · Fractions",
        lessons: [
          { id: "l16", title: "What is a fraction", status: "locked" },
          { id: "l17", title: "Equivalent fractions", status: "locked" },
          { id: "l18", title: "Adding fractions", status: "locked" },
          { id: "l19", title: "Subtracting fractions", status: "locked" },
        ],
      },
    ],
  },
  {
    id: "2_space",
    label: "Space & Shape",
    emoji: "📐",
    color: "#7c3aed",
    units: [
      {
        id: "01_shapes",
        title: "01 · Shapes & Spatial Sense",
        lessons: [
          { id: "s1", title: "2D shapes", status: "mastered" },
          { id: "s2", title: "3D shapes", status: "proficient" },
          { id: "s3", title: "Lines and angles", status: "locked" },
        ],
      },
      {
        id: "02_measurement",
        title: "02 · Measurement & Units",
        lessons: [
          { id: "s4", title: "Length and cm", status: "locked" },
          { id: "s5", title: "Mass and weight", status: "locked" },
          { id: "s6", title: "Volume", status: "locked" },
          { id: "s7", title: "Time", status: "locked" },
        ],
      },
    ],
  },
  {
    id: "3_change",
    label: "Change & Relationships",
    emoji: "📈",
    color: "#059669",
    units: [
      {
        id: "01_patterns",
        title: "01 · Patterns & Algebraic Thinking",
        lessons: [
          { id: "c1", title: "Number patterns", status: "locked" },
          { id: "c2", title: "Shape patterns", status: "locked" },
          { id: "c3", title: "Rules and sequences", status: "locked" },
        ],
      },
      {
        id: "02_equations",
        title: "02 · Expressions & Equations",
        lessons: [
          { id: "c4", title: "Variables", status: "locked" },
          { id: "c5", title: "Solving for x", status: "locked" },
          { id: "c6", title: "Inequalities", status: "locked" },
        ],
      },
    ],
  },
];

// ── Status Config ──────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  MasteryStatus,
  { bg: string; border: string; label: string; icon: string }
> = {
  mastered: {
    bg: "#7c3aed",
    border: "#5b21b6",
    label: "Mastered",
    icon: "👑",
  },
  proficient: {
    bg: "#a78bfa",
    border: "#7c3aed",
    label: "Proficient",
    icon: "⬛",
  },
  familiar: {
    bg: "#f97316",
    border: "#ea580c",
    label: "Familiar",
    icon: "🟠",
  },
  attempted: {
    bg: "#e5e7eb",
    border: "#d1d5db",
    label: "Attempted",
    icon: "⬜",
  },
  not_started: {
    bg: "#f9fafb",
    border: "#e5e7eb",
    label: "Not Started",
    icon: "○",
  },
  locked: {
    bg: "#f3f4f6",
    border: "#e5e7eb",
    label: "Locked",
    icon: "🔒",
  },
};

// ── Lesson Square ──────────────────────────────────────────────────────────
function LessonSquare(
  { lesson, groupColor, onStart }: {
    lesson: LessonNode;
    groupColor: string;
    onStart: (id: string) => void;
  },
) {
  const cfg = STATUS_CONFIG[lesson.status];
  const isClickable = lesson.status !== "locked";

  const style = {
    width: "2.25rem",
    height: "2.25rem",
    borderRadius: "0.375rem",
    border: `2px solid ${cfg.border}`,
    backgroundColor: lesson.status === "mastered" ? groupColor : cfg.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    cursor: isClickable ? "pointer" : "not-allowed",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    flexShrink: 0,
    position: "relative" as const,
    opacity: lesson.status === "locked" ? 0.5 : 1,
  };

  return (
    <div
      title={`${lesson.title} — ${cfg.label}`}
      style={style}
      onClick={() => isClickable && onStart(lesson.id)}
      onMouseEnter={(e) => {
        if (isClickable) {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 4px 6px -1px rgba(0,0,0,0.15)";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "none";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {lesson.status === "mastered"
        ? "👑"
        : lesson.status === "locked"
        ? "🔒"
        : ""}
    </div>
  );
}

// ── Unit Row ───────────────────────────────────────────────────────────────
function UnitRow(
  { unit, groupColor, isNext, onStart }: {
    unit: UnitRow;
    groupColor: string;
    isNext: boolean;
    onStart: (id: string) => void;
  },
) {
  const mastered = unit.lessons.filter((l) => l.status === "mastered").length;
  const total = unit.lessons.length;
  const pct = Math.round((mastered / total) * 100);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.625rem 1rem",
        borderRadius: "0.5rem",
        backgroundColor: isNext ? "#eff6ff" : "transparent",
        border: isNext ? "1px solid #bfdbfe" : "1px solid transparent",
        marginBottom: "0.25rem",
      }}
    >
      {/* Next indicator */}
      {isNext && (
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            color: "#2563eb",
            background: "#dbeafe",
            borderRadius: "9999px",
            padding: "0.1rem 0.5rem",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          UP NEXT
        </span>
      )}

      {/* Unit label */}
      <span
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#374151",
          minWidth: "14rem",
          flexShrink: 0,
        }}
      >
        {unit.title}
      </span>

      {/* Lesson squares */}
      <div
        style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", flex: 1 }}
      >
        {unit.lessons.map((lesson) => (
          <LessonSquare
            key={lesson.id}
            lesson={lesson}
            groupColor={groupColor}
            onStart={onStart}
          />
        ))}
      </div>

      {/* Progress percentage */}
      <span
        style={{
          fontSize: "0.75rem",
          color: "#6b7280",
          minWidth: "3rem",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {pct}%
      </span>
    </div>
  );
}

// ── Topic Group Section ────────────────────────────────────────────────────
function TopicGroupSection(
  { group, nextUnitId, onStart }: {
    group: TopicGroup;
    nextUnitId: string | null;
    onStart: (lessonId: string) => void;
  },
) {
  const totalLessons = group.units.flatMap((u) => u.lessons).length;
  const mastered =
    group.units.flatMap((u) => u.lessons).filter((l) => l.status === "mastered")
      .length;
  const pct = Math.round((mastered / totalLessons) * 100);

  return (
    <section style={{ marginBottom: "2rem" }}>
      {/* Group Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "0.75rem",
          paddingBottom: "0.5rem",
          borderBottom: `2px solid ${group.color}`,
        }}
      >
        <span style={{ fontSize: "1.25rem" }}>{group.emoji}</span>
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "#111827",
            flex: 1,
          }}
        >
          {group.label}
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "8rem",
              height: "6px",
              background: "#e5e7eb",
              borderRadius: "9999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: group.color,
                borderRadius: "9999px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
            {pct}% mastered
          </span>
        </div>
      </div>

      {/* Unit Rows */}
      {group.units.map((unit) => (
        <UnitRow
          key={unit.id}
          unit={unit}
          groupColor={group.color}
          isNext={unit.id === nextUnitId}
          onStart={onStart}
        />
      ))}
    </section>
  );
}

// ── Legend ─────────────────────────────────────────────────────────────────
function Legend() {
  const items: [MasteryStatus, string][] = [
    ["mastered", "Mastered"],
    ["proficient", "Proficient"],
    ["familiar", "Familiar"],
    ["attempted", "Attempted"],
    ["not_started", "Not Started"],
    ["locked", "Locked"],
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
        alignItems: "center",
        marginBottom: "1.5rem",
        padding: "0.75rem 1rem",
        background: "#f9fafb",
        borderRadius: "0.5rem",
        border: "1px solid #e5e7eb",
      }}
    >
      {items.map(([status, label]) => {
        const cfg = STATUS_CONFIG[status];
        return (
          <span
            key={status}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <span
              style={{
                width: "1.1rem",
                height: "1.1rem",
                borderRadius: "0.25rem",
                background: status === "mastered" ? "#7c3aed" : cfg.bg,
                border: `2px solid ${cfg.border}`,
                display: "inline-block",
                fontSize: "0.6rem",
                textAlign: "center",
                lineHeight: "1.1rem",
              }}
            >
              {status === "mastered" ? "👑" : status === "locked" ? "🔒" : ""}
            </span>
            <span style={{ fontSize: "0.75rem", color: "#374151" }}>
              {label}
            </span>
          </span>
        );
      })}
    </div>
  );
}

// ── Main Island ────────────────────────────────────────────────────────────
export default function TopicChainMap() {
  const activeLessonId = useSignal<string | null>(null);

  // Determine the "next" unit per group (first unit with non-mastered status)
  function getNextUnitId(group: TopicGroup): string | null {
    for (const unit of group.units) {
      const allMastered = unit.lessons.every((l) => l.status === "mastered");
      if (!allMastered) return unit.id;
    }
    return null;
  }

  function handleStart(lessonId: string) {
    // In the future this will navigate to /practice/[lessonId]
    activeLessonId.value = lessonId;
    alert(
      `🚀 Starting Challenge-First exercise for lesson: ${lessonId}\n\n(PracticeIsland coming next!)`,
    );
  }

  // Overall course mastery
  const allLessons = CURRICULUM.flatMap((g) =>
    g.units.flatMap((u) => u.lessons)
  );
  const totalMastered = allLessons.filter((l) => l.status === "mastered")
    .length;
  const overallPct = Math.round((totalMastered / allLessons.length) * 100);

  return (
    <div>
      {/* Course mastery header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <div>
          <div
            style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: 2 }}
          >
            Course mastery
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: "12rem",
                height: "8px",
                background: "#e5e7eb",
                borderRadius: "9999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${overallPct}%`,
                  height: "100%",
                  background: "#2563eb",
                  borderRadius: "9999px",
                }}
              />
            </div>
            <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>
              {overallPct}%
            </span>
          </div>
        </div>
      </div>

      <Legend />

      {CURRICULUM.map((group) => (
        <TopicGroupSection
          key={group.id}
          group={group}
          nextUnitId={getNextUnitId(group)}
          onStart={handleStart}
        />
      ))}
    </div>
  );
}
