/** @jsx h */ import { h } from "preact"; import { useState } from
"preact/hooks";

// ─── SOVEREIGN ACADEMY — 7-Group / 22-Topic Math Curriculum ─── const
MATH_GROUPS = [ { id: "the-core", title: "The Core", emoji: "🔢", topics: [
"Number Sense & Operations", "Fractions & Proportions", "Patterns & Rules", ],
}, { id: "space-and-measurement", title: "Space & Measurement", emoji: "📐",
topics: [ "Measurement & Scale", "Geometric Reasoning", "Trigonometry & Waves",
], }, { id: "change-and-relationships", title: "Change & Relationships", emoji:
"📈", topics: [ "Variables & Equations", "Functions & Graphs", "Systems &
Matrices", ], }, { id: "data-and-uncertainty", title: "Data & Uncertainty",
emoji: "🎲", topics: [ "Probability & Combinatorics", "Statistics & Data
Science", ], }, { id: "continuous-mathematics", title: "Continuous Mathematics",
emoji: "∞", topics: [ "Limits & Continuity", "Differential Calculus", "Integral
Calculus", "Multivariable & Vector Calculus", "Differential Equations", ], }, {
id: "discrete-mathematics", title: "Discrete Mathematics", emoji: "🔗", topics:
[ "Logic & Set Theory", "Number Theory & Cryptography", "Graph Theory", ], }, {
id: "formal-proofs", title: "Formal Proofs & Abstraction", emoji: "🧩", topics:
[ "Real & Complex Analysis", "Abstract Algebra", "Topology", ], }, ];

// ─── COMPONENTS ───

const GlobalNavigation = () => (

<header class="sidebar" style="flex-direction: row; width: 100%; height: 4rem; padding: 0 var(--spacing-6);">
    <div style="display: flex; align-items: center; gap: var(--spacing-4);">
      <span class="sidebar-title" style="margin: 0; font-size: 1.15rem; letter-spacing: 0.04em;">
        SOVEREIGN ACADEMY
      </span>
      <nav style="display: flex; gap: var(--spacing-4); margin-left: var(--spacing-6);">
        <a class="sidebar-link" href="/learn/math">Explore</a>
      </nav>
      <input
        type="text"
        placeholder="Search topics or subjects"
        style="background: rgba(255,255,255,0.08); border: none; border-radius: 6px; padding: var(--spacing-2) var(--spacing-4); color: var(--color-text-sidebar); width: 16rem;"
      />
    </div>

    <div style="display: flex; align-items: center; gap: var(--spacing-4);">
      <a class="sidebar-link" href="/donate">Donate</a>
      <a class="sidebar-link" href="/profile">Profile</a>
      <div style="width: 2rem; height: 2rem; border-radius: 50%; background: var(--color-primary); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.75rem; font-weight: 700;">
        SA
      </div>
    </div>

</header>
);

const UserStatusBar = () => (

<div style="background: var(--color-bg-card); border-bottom: 1px solid var(--color-border-dark); padding: var(--spacing-2) var(--spacing-6); display: flex; justify-content: flex-end; align-items: center; gap: var(--spacing-6);">
    {/* Streak Counter */}
    <div style="display: flex; align-items: center; gap: var(--spacing-2); cursor: pointer;">
      <span style="font-size: 1.25rem;">🔥</span>
      <span style="font-size: 0.875rem; font-weight: 700; color: var(--color-text-main);">14 Days</span>
      <span style="font-size: 0.75rem; color: var(--color-text-muted); margin-left: var(--spacing-1);">Keep it up!</span>
    </div>

    {/* Divider */}
    <div class="divider" style="width: 1px; height: 1.25rem; margin: 0;"></div>

    {/* Level / XP */}
    <div style="display: flex; align-items: center; gap: var(--spacing-3); cursor: pointer;">
      <span style="font-size: 0.875rem; font-weight: 700; color: var(--color-text-main);">Level 8</span>
      <div style="width: 12rem; height: 0.625rem; background: var(--color-border); border-radius: 9999px; overflow: hidden; border: 1px solid var(--color-border-dark);">
        <div style="background: #7c3aed; width: 65%; height: 100%; border-radius: 9999px;"></div>
      </div>
      <span style="font-size: 0.75rem; font-weight: 700; color: #7c3aed;">14,250 XP</span>
    </div>

</div>
);

const PageHeader = () => (

<div class="hero-wrapper" style="padding-top: var(--spacing-10); padding-bottom: 4rem;">
    <div class="page-container">
      <h1 class="hero-large-title">Math</h1>
      <p class="hero-large-subtitle" style="margin-top: var(--spacing-2); opacity: 0.8;">
        22 topics — from counting to topology
      </p>
    </div>
  </div>
);

const GroupCard = ({ group }) => (

<article class="dashboard-card" style="display: flex; gap: var(--spacing-5); padding: var(--spacing-6);">
    {/* Emoji Icon */}
    <div style="width: 5rem; height: 5rem; flex-shrink: 0; background: rgba(37,99,235,0.06); border: 1px solid rgba(37,99,235,0.12); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
      {group.emoji}
    </div>

    {/* Text */}
    <div style="flex: 1; min-width: 0;">
      <h2 class="dashboard-card-title" style="color: var(--color-primary); cursor: pointer; margin-bottom: var(--spacing-3);">
        <a href={`/learn/math/${group.id}`} style="color: inherit; text-decoration: none;">
          {group.title}
        </a>
      </h2>

      {/* Topics grid */}
      <ul style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-1) var(--spacing-6); list-style: none; padding: 0; margin: 0;">
        {group.topics.map((topic, idx) => (
          <li
            key={idx}
            style="font-size: 0.9375rem; color: var(--color-text-main); cursor: pointer; display: flex; align-items: flex-start; gap: var(--spacing-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
          >
            <span style="color: var(--color-text-muted);">•</span>
            <span>{topic}</span>
          </li>
        ))}
      </ul>
    </div>

</article>
);

export default function MathSubjectPage() { return (

<div class="app-container" style="flex-direction: column;">
<GlobalNavigation />
<UserStatusBar />
<PageHeader />

      {/* Main Content */}
      <main class="page-container" style="padding-top: var(--spacing-8); padding-bottom: var(--spacing-10); margin-top: -1.5rem;">
        <div class="grid-container" style="grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));">
          {MATH_GROUPS.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </main>
    </div>

); }
