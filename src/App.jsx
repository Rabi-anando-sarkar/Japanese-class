import { useEffect, useMemo, useState } from "react";
import {
  LEVELS, NOTE_KINDS, PREPARATION_CHECKLIST, PREPARATION_TOPICS,
  READINESS_CHECKLIST, RESOURCE_CATEGORIES, RESOURCES, STAGES, STUDY_STEPS,
} from "./data.js";

const STORAGE_KEY = "nihongo-study-journal-v1";
const ROUTES = ["home", "preparation", "N5", "N4", "N3", "N2", "N1", "resources", "method", "notes", "settings"];
const DEFAULT_DATA = () => ({
  version: 1,
  currentStage: "preparation",
  dailyObjective: 20,
  theme: "paper",
  completed: Object.fromEntries(STAGES.map((stage) => [stage.id, []])),
  notes: [],
  savedTopics: [],
});

function safeText(value, max = 10000) {
  return typeof value === "string" ? value.slice(0, max) : "";
}

function safeTime(value) {
  const time = Number(value);
  return Number.isFinite(time) && time > 0 ? time : Date.now();
}
function normalizeData(value) {
  const base = DEFAULT_DATA();
  if (!value || typeof value !== "object" || Array.isArray(value)) return base;
  const stageIds = new Set(STAGES.map((stage) => stage.id));
  const completed = {};
  for (const stage of STAGES) {
    const list = value.completed && Array.isArray(value.completed[stage.id]) ? value.completed[stage.id] : [];
    completed[stage.id] = [...new Set(list.filter((id) => typeof id === "string"))];
  }
  const notes = Array.isArray(value.notes)
    ? value.notes.filter((note) => note && typeof note === "object" && typeof note.id === "string").map((note) => ({
        id: safeText(note.id, 100), title: safeText(note.title, 180), body: safeText(note.body, 10000),
        stage: stageIds.has(note.stage) ? note.stage : "preparation",
        kind: NOTE_KINDS.some((kind) => kind.id === note.kind) ? note.kind : "note",
        createdAt: safeTime(note.createdAt), updatedAt: safeTime(note.updatedAt || note.createdAt),
      }))
    : [];
  const savedTopics = Array.isArray(value.savedTopics)
    ? value.savedTopics.filter((topic) => topic && typeof topic.id === "string").map((topic) => ({
        id: safeText(topic.id, 100), title: safeText(topic.title, 180),
        stage: stageIds.has(topic.stage) ? topic.stage : "preparation", createdAt: safeTime(topic.createdAt),
      }))
    : [];
  return {
    version: 1,
    currentStage: stageIds.has(value.currentStage) ? value.currentStage : base.currentStage,
    dailyObjective: Number.isFinite(Number(value.dailyObjective)) ? Math.min(240, Math.max(5, Math.round(Number(value.dailyObjective)))) : base.dailyObjective,
    theme: value.theme === "ink" ? "ink" : "paper", completed, notes, savedTopics,
  };
}

function loadData() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeData(JSON.parse(raw)) : DEFAULT_DATA();
  } catch {
    return DEFAULT_DATA();
  }
}

function checkStorage() {
  try {
    const key = STORAGE_KEY + "-check";
    window.localStorage.setItem(key, "ok");
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function makeId() {
  return globalThis.crypto && typeof globalThis.crypto.randomUUID === "function"
    ? globalThis.crypto.randomUUID()
    : String(Date.now()) + "-" + Math.random().toString(36).slice(2);
}

function stageName(id) {
  return STAGES.find((stage) => stage.id === id)?.label ?? "Preparation";
}

function getChecklist(stageId) {
  return stageId === "preparation" ? PREPARATION_CHECKLIST : READINESS_CHECKLIST;
}

function getStats(stageId, completed) {
  const list = getChecklist(stageId);
  const checked = (completed[stageId] || []).filter((id) => list.some((item) => item.id === id)).length;
  return { checked, total: list.length, percent: list.length ? Math.round((checked / list.length) * 100) : 0 };
}

function getOverallStats(completed) {
  const stats = STAGES.map((stage) => getStats(stage.id, completed));
  const total = stats.reduce((sum, item) => sum + item.total, 0);
  const checked = stats.reduce((sum, item) => sum + item.checked, 0);
  return { total, checked, percent: total ? Math.round((checked / total) * 100) : 0 };
}

function routeFromHash() {
  const value = window.location.hash.replace(/^#\/?/, "");
  return ROUTES.includes(value) ? value : "home";
}

function App() {
  const [data, setData] = useState(loadData);
  const [storageAvailable, setStorageAvailable] = useState(checkStorage);
  const [route, setRoute] = useState(routeFromHash);
  const currentStage = STAGES.find((stage) => stage.id === data.currentStage) || STAGES[0];

  useEffect(() => {
    const onHashChange = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (!storageAvailable) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Keep the current session usable when storage is full or unavailable.
      setStorageAvailable(false);
    }
  }, [data, storageAvailable]);

  function patchData(patch) {
    setData((previous) => ({ ...previous, ...patch }));
  }

  function toggleChecklist(stageId, itemId) {
    setData((previous) => {
      const existing = previous.completed[stageId] || [];
      const next = existing.includes(itemId) ? existing.filter((id) => id !== itemId) : [...existing, itemId];
      return { ...previous, completed: { ...previous.completed, [stageId]: next } };
    });
  }

  function resetChecklist(stageId) {
    setData((previous) => ({ ...previous, completed: { ...previous.completed, [stageId]: [] } }));
  }

  function saveNote(note) {
    setData((previous) => {
      const exists = previous.notes.some((item) => item.id === note.id);
      const notes = exists
        ? previous.notes.map((item) => item.id === note.id ? { ...item, ...note, updatedAt: Date.now() } : item)
        : [...previous.notes, { ...note, id: makeId(), createdAt: Date.now(), updatedAt: Date.now() }];
      return { ...previous, notes };
    });
  }

  function deleteNote(id) {
    setData((previous) => ({ ...previous, notes: previous.notes.filter((note) => note.id !== id) }));
  }

  function addSavedTopic(title, stage) {
    setData((previous) => ({ ...previous, savedTopics: [...previous.savedTopics, { id: makeId(), title: title.trim(), stage, createdAt: Date.now() }] }));
  }

  function deleteSavedTopic(id) {
    setData((previous) => ({ ...previous, savedTopics: previous.savedTopics.filter((topic) => topic.id !== id) }));
  }

  return (
    <div className={"app-shell theme-" + data.theme}>
      <Header route={route} />
      <main className="page-wrap">
        {!storageAvailable && <div className="storage-warning" role="status">Browser storage is unavailable. Changes will remain only for this open session.</div>}
        {route === "home" && <Dashboard data={data} stage={currentStage} onStageChange={(id) => patchData({ currentStage: id })} onObjectiveChange={(value) => patchData({ dailyObjective: value })} />}
        {route === "preparation" && <PreparationPage completed={data.completed} onToggle={toggleChecklist} onReset={resetChecklist} />}
        {LEVELS[route] && <LevelPage levelId={route} completed={data.completed} onToggle={toggleChecklist} onReset={resetChecklist} />}
        {route === "resources" && <ResourcesPage />}
        {route === "method" && <MethodPage />}
        {route === "notes" && <NotesPage notes={data.notes} savedTopics={data.savedTopics} onSave={saveNote} onDelete={deleteNote} onAddTopic={addSavedTopic} onDeleteTopic={deleteSavedTopic} />}
        {route === "settings" && <SettingsPage data={data} onChange={patchData} onReset={() => setData(DEFAULT_DATA())} />}
      </main>
      <Footer />
    </div>
  );
}

function Header({ route }) {
  const links = [
    ["home", "Journal"], ["preparation", "Preparation"], ["N5", "N5"], ["N4", "N4"], ["N3", "N3"], ["N2", "N2"], ["N1", "N1"],
    ["resources", "Resources"], ["method", "Study method"], ["notes", "Notes"], ["settings", "Settings"],
  ];
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#home" aria-label="Japanese Study Journal home">
          <span className="brand-stamp" aria-hidden="true">J</span>
          <span className="brand-copy"><strong>Japanese Study Journal</strong><small>A personal learning record</small></span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          {links.map(([id, label]) => <a key={id} href={"#" + id} className={route === id ? "nav-link active" : "nav-link"} aria-current={route === id ? "page" : undefined}>{label}</a>)}
        </nav>
      </div>
    </header>
  );
}

function PageIntro({ eyebrow, title, children, side }) {
  return (
    <section className="page-intro">
      <div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{children && <p className="intro-copy">{children}</p>}</div>
      {side && <div className="intro-side">{side}</div>}
    </section>
  );
}

function ProgressBar({ percent, label }) {
  return (
    <div className="progress-wrap">
      <div className="progress-track" role="progressbar" aria-label={label} aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"><span style={{ width: percent + "%" }} /></div>
      <span className="progress-percent">{percent}%</span>
    </div>
  );
}

function StageLink({ stage, stats }) {
  return (
    <a className="stage-link" href={"#" + stage.id}>
      <span className="stage-link-top"><strong>{stage.label}</strong><span>{stage.short}</span></span>
      <ProgressBar percent={stats.percent} label={stage.label + " completion"} />
      <span className="stage-link-foot">{stats.checked} of {stats.total} checklist items complete <span aria-hidden="true">↗</span></span>
    </a>
  );
}

function Dashboard({ data, stage, onStageChange, onObjectiveChange }) {
  const overall = getOverallStats(data.completed);
  const stageStats = getStats(stage.id, data.completed);
  const completedItems = getChecklist(stage.id).filter((item) => (data.completed[stage.id] || []).includes(item.id));
  const [objectiveDraft, setObjectiveDraft] = useState(String(data.dailyObjective));
  useEffect(() => setObjectiveDraft(String(data.dailyObjective)), [data.dailyObjective]);

  function saveObjective(event) {
    event.preventDefault();
    const value = Math.min(240, Math.max(5, Math.round(Number(objectiveDraft) || 20)));
    onObjectiveChange(value);
    setObjectiveDraft(String(value));
  }

  return (
    <div className="page-content">
      <PageIntro eyebrow="Your learning journal · 01" title="A quiet place to study Japanese.">A personal roadmap from first sounds to advanced reading, with your notes and progress kept in one place.</PageIntro>
      <section className="home-overview">
        <div className="feature-panel">
          <div className="section-kicker"><span className="section-number">01</span><span>Where you are</span></div>
          <p className="stage-overline">CURRENT LEARNING STAGE</p>
          <h2>{stage.label}<span className="stage-subtitle"> / {stage.short}</span></h2>
          <p className="muted-copy">{stage.id === "preparation" ? "Getting ready for formal classes, at your own pace." : "Keep building steadily, one useful skill at a time."}</p>
          <div className="current-progress"><ProgressBar percent={stageStats.percent} label={stage.label + " completion"} /><span>{stageStats.checked} of {stageStats.total} checklist items</span></div>
          <div className="completed-summary" aria-live="polite"><p>Completed checkpoints · {stage.label}</p>{completedItems.length ? <ul>{completedItems.map((item) => <li key={item.id}>{item.label}</li>)}</ul> : <span>No checklist items marked complete yet.</span>}</div>
          <div className="button-row">
            <a className="button button-primary" href={"#" + stage.id}>Continue learning <span aria-hidden="true">↗</span></a>
            <label className="select-inline">Change stage<select value={data.currentStage} onChange={(event) => onStageChange(event.target.value)}>{STAGES.map((item) => <option value={item.id} key={item.id}>{item.label} — {item.short}</option>)}</select></label>
          </div>
        </div>
        <div className="overall-panel">
          <div className="section-kicker"><span className="section-number">02</span><span>Across the roadmap</span></div>
          <div className="overall-number">{overall.percent}<span>%</span></div>
          <p className="muted-copy">calculated from checked items across all six stages</p>
          <ProgressBar percent={overall.percent} label="Overall roadmap completion" />
          <p className="small-note">{overall.checked} of {overall.total} learning checkpoints marked complete</p>
          <div className="rule" />
          <form className="objective-form" onSubmit={saveObjective}>
            <label htmlFor="daily-objective">A small daily objective</label>
            <p className="small-note">Set a study intention that feels manageable.</p>
            <div className="input-action"><input id="daily-objective" type="number" min="5" max="240" step="5" value={objectiveDraft} onChange={(event) => setObjectiveDraft(event.target.value)} /><span>minutes</span><button className="button button-quiet" type="submit">Save</button></div>
          </form>
        </div>
      </section>
      <section className="content-section">
        <div className="section-heading"><div><p className="eyebrow">A considered progression</p><h2>The JLPT levels</h2></div><p>Use these roadmaps as a study syllabus. They describe broader learning goals and are not a promise of exam coverage or results.</p></div>
        <div className="level-grid">{STAGES.filter((item) => item.id !== "preparation").map((item) => <StageLink key={item.id} stage={item} stats={getStats(item.id, data.completed)} />)}</div>
      </section>
      <section className="dashboard-lower">
        <div className="content-section compact-section">
          <div className="section-heading"><div><p className="eyebrow">Keep close at hand</p><h2>Study resources</h2></div><a className="text-link" href="#resources">View library <span aria-hidden="true">↗</span></a></div>
          <div className="quick-resources">{["irodori", "tae-kim", "anki"].map((id) => <ResourceRow key={id} resource={RESOURCES.find((item) => item.id === id)} compact />)}</div>
        </div>
        <div className="quote-panel">
          <div className="section-kicker"><span className="section-number">03</span><span>Return to the process</span></div>
          <h2>A study loop you can repeat.</h2><p>Understand, retrieve, make your own examples, listen, then return later. Keep it simple enough to use again tomorrow.</p>
          <a className="text-link" href="#method">Open the study method <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </div>
  );
}

function CompletionChecklist({ stageId, completed, onToggle, onReset }) {
  const items = stageId === "preparation" ? PREPARATION_CHECKLIST : READINESS_CHECKLIST;
  const stats = getStats(stageId, completed);
  const [confirmReset, setConfirmReset] = useState(false);
  return (
    <section className="checklist-panel" aria-labelledby={stageId + "-checklist-title"}>
      <div className="section-heading checklist-heading">
        <div><p className="eyebrow">Your own readiness check</p><h2 id={stageId + "-checklist-title"}>Completion checklist</h2></div>
        <div className="checklist-score"><strong>{stats.percent}%</strong><span>{stats.checked} / {stats.total} complete</span></div>
      </div>
      <ProgressBar percent={stats.percent} label={stageName(stageId) + " checklist completion"} />
      <div className="checklist-items">{items.map((item) => {
        const checked = (completed[stageId] || []).includes(item.id);
        const inputId = stageId + "-" + item.id;
        return <div className={checked ? "check-row checked" : "check-row"} key={item.id}><input id={inputId} type="checkbox" checked={checked} onChange={() => onToggle(stageId, item.id)} /><label htmlFor={inputId}>{item.label}</label></div>;
      })}</div>
      <div className="checklist-bottom">
        <p>Mark an item when it feels true for you. Nothing is checked automatically.</p>
        {!confirmReset ? <button className="text-button" type="button" onClick={() => setConfirmReset(true)}>Reset this checklist</button> : (
          <div className="confirm-inline" role="alert"><span>Clear all {stageName(stageId)} checks?</span><button className="text-button" type="button" onClick={() => { onReset(stageId); setConfirmReset(false); }}>Reset checklist</button><button className="text-button muted-button" type="button" onClick={() => setConfirmReset(false)}>Keep it</button></div>
        )}
      </div>
    </section>
  );
}

function PreparationPage({ completed, onToggle, onReset }) {
  return (
    <div className="page-content">
      <PageIntro eyebrow="Before formal classes · 02" title="Preparation, at your pace.">A flexible starting point for building comfort with sounds, scripts, and the shape of a Japanese sentence. There is no fixed calendar.</PageIntro>
      <div className="roadmap-meta"><div><span className="meta-label">FOCUS</span><strong>Build familiarity</strong></div><div><span className="meta-label">NEXT STEP</span><a href="#N5" className="text-link">N5 beginner roadmap ↗</a></div></div>
      <section className="content-section">
        <div className="section-heading"><div><p className="eyebrow">A gentle first syllabus</p><h2>Topics to explore</h2></div><p>Use the objective to guide a session, then choose the practice that fits your time and curiosity.</p></div>
        <div className="topic-list">{PREPARATION_TOPICS.map((topic, index) => <article className="topic-row" key={topic.id}>
          <div className="topic-index">{String(index + 1).padStart(2, "0")}</div>
          <div className="topic-body">
            <h3>{topic.title}</h3><p>{topic.objective}</p>
            <div className="topic-activity"><span>TRY</span>{topic.activity}</div>
            <div className="topic-resources">Related: {topic.resources.map((id, resourceIndex) => {
              const resource = RESOURCES.find((item) => item.id === id);
              return <span key={id}>{resourceIndex > 0 ? " · " : ""}<a href={resource.url} target="_blank" rel="noreferrer">{resource.name}</a></span>;
            })}</div>
          </div>
        </article>)}</div>
      </section>
      <div className="checkpoint-layout">
        <div className="checkpoint-copy"><p className="eyebrow">Checkpoint</p><h2>Ready to begin N5?</h2><p>Use the checklist as a personal reflection, not an entry requirement. It is fine to revisit any topic while moving forward.</p><a className="button button-primary" href="#N5">Explore the N5 roadmap <span aria-hidden="true">↗</span></a></div>
        <CompletionChecklist stageId="preparation" completed={completed} onToggle={onToggle} onReset={onReset} />
      </div>
    </div>
  );
}

function LevelPage({ levelId, completed, onToggle, onReset }) {
  const level = LEVELS[levelId];
  const stage = STAGES.find((item) => item.id === levelId);
  return (
    <div className="page-content">
      <PageIntro eyebrow={"JLPT roadmap · " + levelId} title={levelId + " / " + level.name}>{level.summary}</PageIntro>
      <div className="roadmap-meta"><div><span className="meta-label">LEARNING STAGE</span><strong>{stage.short}</strong></div><div><span className="meta-label">PERSONAL CHECKPOINTS</span><span>{getStats(levelId, completed).checked} of {READINESS_CHECKLIST.length} marked complete</span></div></div>
      <section className="ability-panel"><div><p className="eyebrow">01 · Target abilities</p><h2>What you are working toward</h2></div><ul className="ability-list">{level.abilities.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section className="content-section syllabus-section">
        <div className="section-heading"><div><p className="eyebrow">02 · Structured syllabus</p><h2>Areas of study</h2></div><p>Use this as a learning guide. The JLPT exam format and content are defined by its official materials.</p></div>
        <div className="syllabus-grid">{level.sections.map((section, index) => <article className="syllabus-card" key={section.id}>
          <p className="syllabus-number">{String(index + 1).padStart(2, "0")}</p><h3>{section.title}</h3><ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>)}</div>
      </section>
      <section className="practice-panel"><div><p className="eyebrow">03 · Practical exercises</p><h2>Put the study into use</h2></div><ul className="practice-list">{level.activities.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section className="content-section level-resource-section">
        <div className="section-heading"><div><p className="eyebrow">04 · Suggested references</p><h2>Useful resources for this stage</h2></div><a className="text-link" href="#resources">Browse the full library ↗</a></div>
        <div className="level-resource-grid">{level.resources.map((id) => <ResourceRow key={id} resource={RESOURCES.find((resource) => resource.id === id)} compact />)}</div>
      </section>
      <div className="exam-note"><span className="note-mark" aria-hidden="true">!</span><p><strong>Exam and broader proficiency.</strong> The JLPT does not directly assess speaking or writing. Keep those as separate goals for using Japanese beyond the exam.</p></div>
      <CompletionChecklist stageId={levelId} completed={completed} onToggle={onToggle} onReset={onReset} />
    </div>
  );
}

function ResourceRow({ resource, compact = false }) {
  if (!resource) return null;
  return <article className={compact ? "resource-row compact" : "resource-row"}>
    <div><h3><a href={resource.url} target="_blank" rel="noreferrer">{resource.name} <span aria-hidden="true">↗</span></a></h3><p>{resource.description}</p></div>
    <div className="resource-tags">{resource.categories.map((category) => <span key={category}>{category}</span>)}</div>
  </article>;
}

function ResourcesPage() {
  const [category, setCategory] = useState("all");
  const resources = useMemo(() => category === "all" ? RESOURCES : RESOURCES.filter((resource) => resource.categories.includes(category)), [category]);
  return (
    <div className="page-content">
      <PageIntro eyebrow="Reference shelf · 03" title="Resources worth returning to.">A small library of established learning materials, dictionaries, media, and official exam samples.</PageIntro>
      <div className="filter-bar" role="group" aria-label="Filter resources by purpose">
        <button type="button" className={category === "all" ? "filter-chip selected" : "filter-chip"} aria-pressed={category === "all"} onClick={() => setCategory("all")}>All resources</button>
        {RESOURCE_CATEGORIES.map((item) => <button type="button" key={item} className={category === item ? "filter-chip selected" : "filter-chip"} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <section className="resource-library" aria-live="polite"><p className="result-count">{resources.length} {resources.length === 1 ? "resource" : "resources"} {category !== "all" ? "for " + category : "in the library"}</p>{resources.map((resource) => <ResourceRow key={resource.id} resource={resource} />)}</section>
      <p className="small-note resource-footnote">Links open the provider’s website in a new tab. Availability and site content are managed by each provider.</p>
    </div>
  );
}

function MethodPage() {
  return (
    <div className="page-content">
      <PageIntro eyebrow="A reusable routine · 04" title="A study method that travels with you.">Keep one repeatable loop for grammar, words, kanji, and listening. Adjust the material to your current stage.</PageIntro>
      <section className="method-layout">
        <div className="method-main"><p className="eyebrow">The six-step loop</p><div className="method-steps">{STUDY_STEPS.map((step, index) => <article className="method-step" key={step.title}>
          <span className="method-number">{String(index + 1).padStart(2, "0")}</span><div><h2>{step.title}</h2><p>{step.detail}</p></div>
        </article>)}</div></div>
        <aside className="notebook-panel"><p className="eyebrow">Notebook notes</p><h2>Leave a useful trail.</h2>
          <div className="notebook-tip"><strong>Grammar</strong><p>Write the form, a concise meaning, one example, and a note about when it is used.</p></div>
          <div className="notebook-tip"><strong>Vocabulary</strong><p>Keep the word with its reading, meaning, and a short phrase or sentence that gives it context.</p></div>
          <div className="notebook-tip"><strong>Mistakes</strong><p>Record what you wrote or heard, the correction, and why it changed. Revisit the pattern later.</p></div>
          <a className="text-link" href="#notes">Open your notes <span aria-hidden="true">↗</span></a>
        </aside>
      </section>
      <div className="method-reminder"><span>Remember</span><p>Retrieval and return matter more than making a perfect set of notes. Keep each session small enough to repeat.</p></div>
    </div>
  );
}

function NotesPage({ notes, savedTopics, onSave, onDelete, onAddTopic, onDeleteTopic }) {
  const [editing, setEditing] = useState(null);
  const [filterStage, setFilterStage] = useState("all");
  const [noteDraft, setNoteDraft] = useState({ title: "", body: "", stage: "preparation", kind: "note" });
  const [topicDraft, setTopicDraft] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const filteredNotes = useMemo(() => notes.filter((note) => filterStage === "all" || note.stage === filterStage).slice().sort((a, b) => b.updatedAt - a.updatedAt), [notes, filterStage]);

  function beginEdit(note) {
    setEditing(note.id);
    setNoteDraft({ title: note.title, body: note.body, stage: note.stage, kind: note.kind });
    document.getElementById("note-title")?.focus();
  }

  function cancelEdit() {
    setEditing(null);
    setNoteDraft({ title: "", body: "", stage: "preparation", kind: "note" });
  }

  function submitNote(event) {
    event.preventDefault();
    if (!noteDraft.title.trim() || !noteDraft.body.trim()) return;
    onSave({ ...noteDraft, title: noteDraft.title.trim(), body: noteDraft.body.trim(), ...(editing ? { id: editing } : {}) });
    cancelEdit();
  }

  function submitTopic(event) {
    event.preventDefault();
    if (!topicDraft.trim()) return;
    onAddTopic(topicDraft, noteDraft.stage);
    setTopicDraft("");
  }

  return (
    <div className="page-content">
      <PageIntro eyebrow="Your notebook · 05" title="Keep what you learn.">Save questions, corrections, observations, and topics to revisit. Notes are stored in this browser profile.</PageIntro>
      <div className="notes-layout">
        <section className="note-editor-panel">
          <div className="section-heading editor-heading"><div><p className="eyebrow">{editing ? "Edit an entry" : "Make a new entry"}</p><h2>{editing ? "Update your note" : "Add to your notebook"}</h2></div></div>
          <form className="note-form" onSubmit={submitNote}>
            <label htmlFor="note-title">Title</label>
            <input id="note-title" type="text" maxLength="180" value={noteDraft.title} onChange={(event) => setNoteDraft({ ...noteDraft, title: event.target.value })} placeholder="A pattern, question, or useful correction" required />
            <div className="form-pair">
              <div><label htmlFor="note-kind">Entry type</label><select id="note-kind" value={noteDraft.kind} onChange={(event) => setNoteDraft({ ...noteDraft, kind: event.target.value })}>{NOTE_KINDS.map((kind) => <option key={kind.id} value={kind.id}>{kind.label}</option>)}</select></div>
              <div><label htmlFor="note-stage">Learning stage</label><select id="note-stage" value={noteDraft.stage} onChange={(event) => setNoteDraft({ ...noteDraft, stage: event.target.value })}>{STAGES.map((stage) => <option key={stage.id} value={stage.id}>{stage.label} — {stage.short}</option>)}</select></div>
            </div>
            <label htmlFor="note-body">Note</label>
            <textarea id="note-body" rows="7" maxLength="10000" value={noteDraft.body} onChange={(event) => setNoteDraft({ ...noteDraft, body: event.target.value })} placeholder="Write your explanation, example, or correction here…" required />
            <div className="form-actions"><button className="button button-primary" type="submit">{editing ? "Save changes" : "Save note"}</button>{editing && <button className="button button-outline" type="button" onClick={cancelEdit}>Cancel</button>}</div>
          </form>
          <div className="topic-save">
            <p className="eyebrow">Keep for later</p><h3>Save a topic to revisit</h3>
            <form className="topic-save-form" onSubmit={submitTopic}>
              <label className="sr-only" htmlFor="saved-topic">Topic to revisit</label>
              <input id="saved-topic" type="text" maxLength="180" value={topicDraft} onChange={(event) => setTopicDraft(event.target.value)} placeholder="For example: review て-form uses" />
              <button type="submit" className="button button-quiet">Add</button>
            </form>
            <p className="small-note">Saved topics use the learning stage selected above.</p>
          </div>
        </section>
        <section className="notes-list-panel">
          <div className="section-heading notes-list-heading"><div><p className="eyebrow">Your entries</p><h2>Notebook <span className="count-badge">{notes.length}</span></h2></div>
            <label className="filter-select">Filter<select aria-label="Filter notes by learning stage" value={filterStage} onChange={(event) => setFilterStage(event.target.value)}><option value="all">All stages</option>{STAGES.map((stage) => <option value={stage.id} key={stage.id}>{stage.label}</option>)}</select></label>
          </div>
          {filteredNotes.length === 0 ? <div className="empty-state"><span className="empty-mark" aria-hidden="true">—</span><h3>{notes.length === 0 ? "Your notebook is open." : "No entries for this stage yet."}</h3><p>{notes.length === 0 ? "Your notes will appear here after you save your first one." : "Choose another stage to see more entries."}</p></div> : filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} confirmDelete={deleteId === note.id} onEdit={() => beginEdit(note)} onAskDelete={() => setDeleteId(note.id)} onDelete={() => { onDelete(note.id); setDeleteId(null); }} onCancelDelete={() => setDeleteId(null)} />
          ))}
          <div className="saved-topics"><div className="section-heading"><div><p className="eyebrow">Revision queue</p><h2>Topics to revisit <span className="count-badge">{savedTopics.length}</span></h2></div></div>
            {savedTopics.length === 0 ? <p className="small-note">Nothing saved for later yet.</p> : savedTopics.map((topic) => (
              <div className="saved-topic" key={topic.id}><span><strong>{topic.title}</strong><small>{stageName(topic.stage)}</small></span><button type="button" className="text-button" aria-label={"Remove " + topic.title} onClick={() => onDeleteTopic(topic.id)}>Remove</button></div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function NoteCard({ note, confirmDelete, onEdit, onAskDelete, onDelete, onCancelDelete }) {
  const kind = NOTE_KINDS.find((item) => item.id === note.kind)?.label || "Study note";
  return (
    <article className="note-card">
      <div className="note-card-meta"><span className="note-kind">{kind}</span><span>{stageName(note.stage)}</span><time dateTime={new Date(note.updatedAt).toISOString()}>{new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(new Date(note.updatedAt))}</time></div>
      <h3>{note.title}</h3><p className="note-card-body">{note.body}</p>
      {!confirmDelete ? <div className="note-actions"><button className="text-button" type="button" onClick={onEdit}>Edit</button><button className="text-button danger-text" type="button" onClick={onAskDelete}>Delete</button></div> : (
        <div className="confirm-inline note-confirm" role="alert"><span>Delete this entry?</span><button className="text-button danger-text" type="button" onClick={onDelete}>Delete note</button><button className="text-button muted-button" type="button" onClick={onCancelDelete}>Keep it</button></div>
      )}
    </article>
  );
}

function SettingsPage({ data, onChange, onReset }) {
  const [objectiveDraft, setObjectiveDraft] = useState(String(data.dailyObjective));
  const [confirmReset, setConfirmReset] = useState(false);
  useEffect(() => setObjectiveDraft(String(data.dailyObjective)), [data.dailyObjective]);
  function saveObjective(event) {
    event.preventDefault();
    onChange({ dailyObjective: Math.min(240, Math.max(5, Math.round(Number(objectiveDraft) || 20))) });
  }
  return (
    <div className="page-content">
      <PageIntro eyebrow="Preferences · 06" title="Make the journal yours.">A few practical choices for how your study space works.</PageIntro>
      <section className="settings-list">
        <div className="setting-row"><div><h2>Current learning stage</h2><p>Used to guide the dashboard’s continue-learning link.</p></div>
          <label className="setting-control" htmlFor="current-stage">Stage<select id="current-stage" value={data.currentStage} onChange={(event) => onChange({ currentStage: event.target.value })}>{STAGES.map((stage) => <option key={stage.id} value={stage.id}>{stage.label} — {stage.short}</option>)}</select></label>
        </div>
        <div className="setting-row"><div><h2>Daily learning objective</h2><p>A personal time intention; it does not create a streak or activity record.</p></div>
          <form className="setting-control objective-setting" onSubmit={saveObjective}><label htmlFor="settings-objective">Minutes per day</label><div className="input-action"><input id="settings-objective" type="number" min="5" max="240" step="5" value={objectiveDraft} onChange={(event) => setObjectiveDraft(event.target.value)} /><button className="button button-quiet" type="submit">Save</button></div></form>
        </div>
        <div className="setting-row"><div><h2>Theme</h2><p>Choose a warm paper tone or a darker ink reading surface.</p></div>
          <div className="theme-options" role="group" aria-label="Theme preference">
            <button type="button" className={data.theme === "paper" ? "theme-choice selected" : "theme-choice"} aria-pressed={data.theme === "paper"} onClick={() => onChange({ theme: "paper" })}><span className="theme-swatch paper-swatch" />Paper</button>
            <button type="button" className={data.theme === "ink" ? "theme-choice selected" : "theme-choice"} aria-pressed={data.theme === "ink"} onClick={() => onChange({ theme: "ink" })}><span className="theme-swatch ink-swatch" />Ink</button>
          </div>
        </div>
        <div className="setting-row reset-setting"><div><h2>Clear local study data</h2><p>This removes saved checklists, notes, topics, and preferences from this browser profile. Clearing browser storage or site data can also remove this information.</p></div>
          {!confirmReset ? <button type="button" className="button button-danger" onClick={() => setConfirmReset(true)}>Reset all data</button> : (
            <div className="reset-confirm" role="alert"><p>Clear all locally saved study data?</p><button type="button" className="button button-danger" onClick={() => { onReset(); setConfirmReset(false); }}>Yes, clear data</button><button type="button" className="button button-outline" onClick={() => setConfirmReset(false)}>Cancel</button></div>
          )}
        </div>
      </section>
      <p className="storage-note"><strong>About your data.</strong> This journal saves locally in your browser. It has no account or backend, and local storage is not a permanent backup. Export or record important notes elsewhere if you need a separate copy.</p>
    </div>
  );
}

function Footer() {
  return <footer className="site-footer"><span>Japanese Study Journal</span><span>Progress at your pace · saved in this browser</span></footer>;
}

export default App;
