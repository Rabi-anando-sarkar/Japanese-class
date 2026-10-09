export const STAGES = [
  { id: "preparation", label: "Preparation", short: "Before classes" },
  { id: "N5", label: "N5", short: "Beginner" },
  { id: "N4", label: "N4", short: "Elementary" },
  { id: "N3", label: "N3", short: "Intermediate" },
  { id: "N2", label: "N2", short: "Upper intermediate" },
  { id: "N1", label: "N1", short: "Advanced" },
];

export const PREPARATION_TOPICS = [
  { id: "pronunciation", title: "Pronunciation and vowel sounds", objective: "Recognise the five steady vowel sounds (a, i, u, e, o), practise clear mora timing, and notice that Japanese vowels are generally short and even.", activity: "Listen to a short beginner audio clip and repeat one line slowly, keeping each mora distinct.", resources: ["irodori", "nhk"] },
  { id: "hiragana", title: "Hiragana", objective: "Read and write the basic hiragana chart, then recognise combinations such as きゃ (kya), しゅ (shu), and ちょ (cho).", activity: "Read a short line of kana aloud, then write it from memory and check the small ゃ, ゅ, or ょ.", resources: ["marugoto", "anki"] },
  { id: "katakana", title: "Katakana and loanwords", objective: "Read the basic katakana chart and identify familiar loanwords such as コーヒー (coffee) and テレビ (television).", activity: "Collect katakana words you encounter and compare their sounds with the original borrowed word.", resources: ["marugoto", "jisho"] },
  { id: "sound-patterns", title: "Long vowels and double consonants", objective: "Hear and mark long vowels, the small っ (sokuon), and the difference a longer sound can make to meaning and rhythm.", activity: "Repeat word pairs slowly, giving the small っ a brief pause and holding long vowels for an extra beat.", resources: ["irodori", "nhk"] },
  { id: "greetings", title: "Greetings and self-introductions", objective: "Use common greetings and a short, polite self-introduction; understand when a greeting is suitable.", activity: "Prepare a three-line introduction with your name, where you are from, and one simple interest.", resources: ["irodori", "marugoto"] },
  { id: "structure", title: "How Japanese sentences are built", objective: "Notice the usual topic–comment pattern, predicate at the end, and how particles show the role of words.", activity: "Take a simple English idea and identify the topic and predicate before looking at a Japanese example.", resources: ["tae-kim"] },
  { id: "first-words", title: "First vocabulary and classroom language", objective: "Build a personal set of numbers, everyday nouns, useful classroom expressions, and phrases for asking for repetition or clarification.", activity: "Make a short list of expressions you would actually use in class; practise recalling them without looking.", resources: ["irodori", "anki"] },
];

export const PREPARATION_CHECKLIST = [
  { id: "sounds", label: "I can hear and pronounce the basic vowel sounds and keep a steady rhythm." },
  { id: "hiragana", label: "I can read and write hiragana, including common small-kana combinations." },
  { id: "katakana", label: "I can recognise the basic katakana chart and familiar loanwords." },
  { id: "patterns", label: "I can notice long vowels and the small っ in simple words." },
  { id: "introduction", label: "I can give a brief, polite self-introduction and use basic greetings." },
  { id: "structure", label: "I recognise the predicate-at-the-end pattern and the role of particles." },
  { id: "classroom", label: "I know useful classroom expressions and have a way to review new words." },
];

export const LEVELS = {
  N5: {
    name: "Beginner",
    summary: "Build a reliable foundation for everyday beginner Japanese: read kana, form simple sentences, and follow slow, familiar conversations.",
    resources: ["irodori", "marugoto", "tae-kim", "anki", "jisho", "jlpt"],
    abilities: ["Read hiragana and katakana and recognise a developing set of basic kanji.", "Understand familiar phrases and short, clear conversations about daily life.", "Read simple sentences and short passages when vocabulary and context are familiar."],
    sections: [
      { id: "grammar", title: "Grammar", items: ["Particles: は, が, を, に, で, へ, の, も, と", "Nouns, い-adjectives, な-adjectives, and basic sentence order", "Present and past; affirmative and negative forms", "Polite verb forms, verb groups, and the て-form", "Demonstratives, questions, numbers, dates, time, and common counters", "あります and います for existence and location", "Basic requests, permissions, and invitations"] },
      { id: "vocabulary", title: "Vocabulary", items: ["Personal information, family, school, and work", "Food, shopping, transport, places, and common objects", "Daily routines, time expressions, weather, and simple descriptions"] },
      { id: "kanji", title: "Kanji", items: ["Learn a beginner set of high-frequency kanji for numbers, time, people, places, and everyday concepts.", "Practise recognition in words and short sentences; readings depend on context."] },
      { id: "listening", title: "Listening", items: ["Follow slow, clearly spoken exchanges about familiar situations.", "Listen for names, times, locations, prices, and the main request or response."] },
      { id: "reading", title: "Reading", items: ["Read short sentences, notices, labels, and simple connected passages.", "Use particles, verb endings, and context to identify who did what and when."] },
      { id: "practice", title: "Speaking and writing practice", items: ["Introduce yourself, describe a routine, and ask or answer simple questions.", "Write short messages and original sentences using patterns you have studied."] },
    ],
    activities: ["Describe your day in five simple sentences.", "Listen to a short beginner dialogue twice: first for the situation, then for specific details.", "Write original examples for one particle and one verb form, then check them with a trusted reference."],
  },
  N4: {
    name: "Elementary",
    summary: "Extend beginner structures into connected everyday communication, with more flexible verb forms and short paragraphs.",
    resources: ["irodori", "marugoto", "tae-kim", "anki", "jisho", "jlpt"],
    abilities: ["Understand conversations and passages on familiar topics with more detail.", "Connect sentences and describe events, plans, experience, and reasons.", "Read short paragraphs and routine descriptions with a broader grammar and vocabulary base."],
    sections: [
      { id: "grammar", title: "Grammar", items: ["Plain forms and casual speech; when they differ from polite style", "Verb conjugations and connecting clauses with て and related forms", "Reasons, intentions, conditions, and comparisons", "Ability, experience, obligation, and prohibition", "Giving and receiving: あげる, くれる, and もらう", "Quoted thoughts and speech; longer noun-modifying clauses", "Introductory passive and causative forms"] },
      { id: "vocabulary", title: "Vocabulary", items: ["Home, health, travel, plans, hobbies, and community life", "Words for feelings, opinions, frequency, and everyday processes", "Common verb and adjective pairings in connected descriptions"] },
      { id: "kanji", title: "Kanji", items: ["Expand recognition of common kanji used in daily routines, movement, nature, and communication.", "Study kanji through compounds and sentences rather than isolated meanings alone."] },
      { id: "listening", title: "Listening", items: ["Follow routine exchanges and short explanations at a measured natural pace.", "Track changes in topic, reason, intention, and sequence of events."] },
      { id: "reading", title: "Reading", items: ["Read short paragraphs, messages, instructions, and routine descriptions.", "Use plain forms and noun-modifying clauses to follow who thinks or does what."] },
      { id: "practice", title: "Speaking and writing practice", items: ["Retell a past experience, explain a plan, and give a simple reason or comparison.", "Write a short connected paragraph, switching register deliberately."] },
    ],
    activities: ["Retell a recent outing using past forms and two connecting expressions.", "Compare two options with an original sentence and explain your preference.", "Read a short paragraph, underline plain forms, and summarise it in a few sentences."],
  },
  N3: {
    name: "Intermediate",
    summary: "Develop flexible comprehension across familiar and less predictable material, and express explanations and opinions with nuance.",
    resources: ["marugoto", "irodori", "nhk", "jisho", "anki", "jlpt", "jpf"],
    abilities: ["Understand the main points of everyday conversations at near-natural speed.", "Follow longer passages and distinguish explanation, inference, intention, and uncertainty.", "Summarise information and express a reasoned opinion using an appropriate register."],
    sections: [
      { id: "grammar", title: "Grammar", items: ["Complex sentence structures and conditional forms", "Logical connections, contrast, sequence, and cause", "Inference, probability, intention, and uncertainty", "Expressions for opinions, explanations, and degrees of emphasis", "Passive, causative, and causative-passive constructions", "Formal and informal register; shifts in tone and relationship"] },
      { id: "vocabulary", title: "Vocabulary", items: ["Work, society, education, media, environment, and daily issues", "Nuanced verbs, adverbs, connectors, and common collocations", "Words that distinguish a writer’s attitude, likelihood, or intention"] },
      { id: "kanji", title: "Kanji", items: ["Build breadth in common intermediate kanji and compounds across everyday and social topics.", "Review readings in context and note differences between visually similar compounds."] },
      { id: "listening", title: "Listening", items: ["Practise natural-speed conversations and short explanations on familiar subjects.", "Identify speaker stance, implied reasons, and how a conversation develops."] },
      { id: "reading", title: "Reading", items: ["Read longer passages and connect details across several sentences.", "Summarise articles and separate a central claim from supporting examples."] },
      { id: "practice", title: "Speaking and writing practice", items: ["Explain an opinion with reasons, examples, and a clear conclusion.", "Summarise a short article aloud or in writing while preserving its main point."] },
    ],
    activities: ["Listen once for the topic and again for the speaker’s reasoning; write a one-sentence summary.", "Compare two similar grammar patterns using original example sentences.", "Read a short article and record its claim, evidence, and your response."],
  },
  N2: {
    name: "Upper intermediate",
    summary: "Strengthen comprehension of detailed, structured language across work, media, and public topics, including written and formal styles.",
    resources: ["nhk", "jisho", "anki", "jlpt", "jpf"],
    abilities: ["Follow arguments and explanations in a range of familiar and public contexts.", "Understand longer audio and identify the relationships between points.", "Read articles and structured explanations while tracking qualification and emphasis."],
    sections: [
      { id: "grammar", title: "Grammar", items: ["Advanced conjunctions and logical relationships across longer discourse", "Formal and written grammar patterns", "Nuanced cause, contrast, concession, assumption, and emphasis", "Similar grammar patterns: compare meaning, register, and typical context", "Honorific and humble language in context", "Long sentence structure, embedded clauses, and reference across a passage"] },
      { id: "vocabulary", title: "Vocabulary", items: ["Work, society, current affairs, culture, and abstract themes", "Precise verbs, adverbs, formal expressions, and common compounds", "Vocabulary for claims, evidence, concessions, and qualified conclusions"] },
      { id: "kanji", title: "Kanji", items: ["Broaden recognition of upper-intermediate kanji and compounds in articles and public information.", "Track readings and meaning shifts across compound words and contexts."] },
      { id: "listening", title: "Listening", items: ["Follow longer audio, interviews, announcements, and explanations.", "Map a speaker’s claim, supporting points, contrast, and conclusion."] },
      { id: "reading", title: "Reading", items: ["Read newspaper-style articles, explanations, and longer arguments.", "Notice qualification, contrast, implied relationships, and shifts in register."] },
      { id: "practice", title: "Speaking and writing practice", items: ["Give a structured explanation with a claim, evidence, and qualified conclusion.", "Practise formal requests and summaries; keep speaking and writing as broader proficiency goals."] },
    ],
    activities: ["Read an opinion piece and outline its claim, evidence, counterpoint, and conclusion.", "Listen to a news segment and write down the connection between each main point.", "Choose two similar grammar expressions and create contrasting examples with usage notes."],
  },
  N1: {
    name: "Advanced",
    summary: "Refine precise comprehension of complex, abstract, and context-rich Japanese across editorial, academic, and natural spoken material.",
    resources: ["nhk", "jisho", "jpf", "jlpt"],
    abilities: ["Understand detailed arguments and implied meaning in a range of contexts.", "Follow natural-speed lectures, interviews, and news while tracking the discourse.", "Interpret author intent, stance, and conclusions in dense or abstract writing."],
    sections: [
      { id: "grammar", title: "Grammar", items: ["Advanced formal and written expressions across complex sentences", "Subtle distinctions between similar patterns and their discourse effects", "Layered clauses, abstract arguments, and compressed written structures", "Register, implication, stance, and transitions across a text", "Context-dependent expressions and pragmatic constraints"] },
      { id: "vocabulary", title: "Vocabulary", items: ["Idioms, nuanced vocabulary, collocations, and context-dependent meanings", "Abstract, editorial, academic, and public-affairs language", "Terms that signal qualification, implication, contrast, and author stance"] },
      { id: "kanji", title: "Kanji", items: ["Read a broad range of advanced kanji compounds in authentic contexts.", "Use surrounding syntax and discourse to resolve less familiar readings and meanings."] },
      { id: "listening", title: "Listening", items: ["Follow lectures, interviews, news, and discussion at natural speed.", "Identify implied positions, changes in stance, and relationships between arguments."] },
      { id: "reading", title: "Reading", items: ["Read editorials, essays, reports, and abstract arguments with close attention to structure.", "Infer author intent and distinguish evidence, assumptions, implication, and conclusion."] },
      { id: "practice", title: "Speaking and writing practice", items: ["Present a nuanced interpretation and support it with evidence from a text.", "Write a clear synthesis of competing views; treat this as broader proficiency practice."] },
    ],
    activities: ["Read an editorial and annotate claim, assumption, evidence, concession, and conclusion.", "Listen to a lecture excerpt and reconstruct its outline from memory.", "Compare two near-synonymous expressions in authentic examples and explain their register or implication."],
  },
};

export const READINESS_CHECKLIST = [
  { id: "writing-systems", label: "Writing systems and kanji: I can read the scripts and kanji expected for my current study material." },
  { id: "grammar", label: "Grammar: I can recognise patterns in context and choose between similar forms." },
  { id: "vocabulary", label: "Vocabulary: I can understand the level’s common words and review weak areas." },
  { id: "listening", label: "Listening: I can follow the level’s practice audio and identify key details." },
  { id: "reading", label: "Reading: I can read representative passages and explain how I reached an answer." },
  { id: "speaking-writing", label: "Speaking and writing: I practise expressing ideas at this level as broader proficiency goals." },
  { id: "exam-readiness", label: "Exam readiness: I have reviewed official sample questions and understand my remaining gaps." },
];

export const RESOURCES = [
  { id: "irodori", name: "Irodori: Japanese for Life in Japan", url: "https://www.irodori.jpf.go.jp/en/", categories: ["grammar", "vocabulary", "listening", "reading", "conversation"], description: "Japan Foundation learning materials for practical communication in everyday life in Japan." },
  { id: "tae-kim", name: "Tae Kim’s Guide to Japanese", url: "https://guidetojapanese.org/learn/", categories: ["grammar", "reading"], description: "A structured online guide to Japanese grammar, with explanations and examples." },
  { id: "marugoto", name: "Marugoto", url: "https://marugoto.jpf.go.jp/en/", categories: ["grammar", "vocabulary", "listening", "reading", "conversation"], description: "Japan Foundation Japanese language and culture course materials for different levels." },
  { id: "anki", name: "Anki", url: "https://apps.ankiweb.net/", categories: ["vocabulary", "kanji"], description: "A flashcard program that supports spaced review; make or choose cards that suit your study plan." },
  { id: "jisho", name: "Jisho", url: "https://jisho.org/", categories: ["vocabulary", "kanji"], description: "An online Japanese–English dictionary for looking up words and kanji." },
  { id: "nhk", name: "NHK WORLD-JAPAN", url: "https://www3.nhk.or.jp/nhkworld/", categories: ["listening", "reading"], description: "NHK’s international service with Japanese news and other media for listening and reading practice." },
  { id: "jlpt", name: "Official JLPT sample questions", url: "https://www.jlpt.jp/e/samples/forlearners.html", categories: ["exam preparation", "reading", "listening"], description: "Sample questions published by the official JLPT site to help learners become familiar with question formats." },
  { id: "jpf", name: "Japan Foundation resources", url: "https://www.jpf.go.jp/e/project/japanese/education/resource/", categories: ["grammar", "vocabulary", "kanji", "listening", "reading", "conversation"], description: "A Japan Foundation collection of Japanese-language education resources and learning links." },
];

export const RESOURCE_CATEGORIES = ["grammar", "vocabulary", "kanji", "listening", "reading", "conversation", "exam preparation"];

export const STUDY_STEPS = [
  { title: "Understand the concept", detail: "Read or listen to one clear explanation. Note the form, meaning, and situation where it is used." },
  { title: "Study example sentences", detail: "Look at a few examples. Identify the target pattern and what the surrounding context contributes." },
  { title: "Recall the rule without looking", detail: "Close the reference and explain the pattern in your own words before checking what you missed." },
  { title: "Create original sentences", detail: "Write or say examples about your own life. Check that the form fits the intended meaning." },
  { title: "Listen and repeat aloud", detail: "Use a trusted recording when available. Listen for rhythm and phrasing, then repeat the sentence." },
  { title: "Review the concept later", detail: "Return after an interval, retrieve it from memory, and add a correction if it is still unclear." },
];

export const NOTE_KINDS = [
  { id: "note", label: "Study note" },
  { id: "question", label: "Grammar question" },
  { id: "mistake", label: "Mistake and correction" },
  { id: "revisit", label: "Topic to revisit" },
];
