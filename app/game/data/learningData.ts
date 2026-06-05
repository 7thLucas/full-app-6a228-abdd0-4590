// ───────────────────────────────────────────────────────────────────────────
// Hangul Roads — learning data.
// Chapters, lessons, vocabulary, grammar, questions, and the spaced-repetition
// schedule. This is the single source of truth for everything the player learns.
// All Korean content is correct and original (no copied curricula).
// ───────────────────────────────────────────────────────────────────────────

export type MasteryLevel = "New" | "Practiced" | "Familiar" | "Strong" | "Mastered";
export type MemoryStrength = "Weak" | "Medium" | "Strong";

export interface VocabEntry {
  id: string;
  korean: string;
  romanization: string;
  english: string;
  category: string;
  example: string; // korean example sentence
  exampleRoman: string;
  exampleEnglish: string;
}

// ── 10 vocab entries (correct grammar, do not invent) ────────────────────────
export const VOCAB: VocabEntry[] = [
  {
    id: "annyeong",
    korean: "안녕하세요",
    romanization: "annyeonghaseyo",
    english: "Hello",
    category: "Greeting",
    example: "안녕하세요!",
    exampleRoman: "annyeonghaseyo!",
    exampleEnglish: "Hello!",
  },
  {
    id: "gamsa",
    korean: "감사합니다",
    romanization: "gamsahamnida",
    english: "Thank you",
    category: "Greeting",
    example: "감사합니다.",
    exampleRoman: "gamsahamnida.",
    exampleEnglish: "Thank you.",
  },
  {
    id: "ne",
    korean: "네",
    romanization: "ne",
    english: "Yes",
    category: "Response",
    example: "네, 맞아요.",
    exampleRoman: "ne, majayo.",
    exampleEnglish: "Yes, that's right.",
  },
  {
    id: "aniyo",
    korean: "아니요",
    romanization: "aniyo",
    english: "No",
    category: "Response",
    example: "아니요, 괜찮아요.",
    exampleRoman: "aniyo, gwaenchanayo.",
    exampleEnglish: "No, it's okay.",
  },
  {
    id: "joesong",
    korean: "죄송합니다",
    romanization: "joesonghamnida",
    english: "Sorry",
    category: "Greeting",
    example: "죄송합니다.",
    exampleRoman: "joesonghamnida.",
    exampleEnglish: "I'm sorry.",
  },
  {
    id: "gwaenchana",
    korean: "괜찮아요",
    romanization: "gwaenchanayo",
    english: "It's okay",
    category: "Response",
    example: "괜찮아요.",
    exampleRoman: "gwaenchanayo.",
    exampleEnglish: "It's okay.",
  },
  {
    id: "jeoneun",
    korean: "저는",
    romanization: "jeoneun",
    english: "I / as for me",
    category: "Grammar",
    example: "저는 아린입니다.",
    exampleRoman: "jeoneun Arin-imnida.",
    exampleEnglish: "I am Arin.",
  },
  {
    id: "ireum",
    korean: "이름",
    romanization: "ireum",
    english: "Name",
    category: "Noun",
    example: "이름이 뭐예요?",
    exampleRoman: "ireum-i mwoyeyo?",
    exampleEnglish: "What is your name?",
  },
  {
    id: "imnida",
    korean: "입니다",
    romanization: "imnida",
    english: "am / is / are",
    category: "Grammar",
    example: "저는 아린입니다.",
    exampleRoman: "jeoneun Arin-imnida.",
    exampleEnglish: "I am Arin.",
  },
  {
    id: "hangugeo",
    korean: "한국어",
    romanization: "hangugeo",
    english: "Korean language",
    category: "Noun",
    example: "저는 한국어를 배워요.",
    exampleRoman: "jeoneun hangugeoreul baewoyo.",
    exampleEnglish: "I learn Korean.",
  },
];

export function getVocab(id: string): VocabEntry | undefined {
  return VOCAB.find((v) => v.id === id);
}

// ── Hangul letters (vowels & consonants for Chapter 0) ───────────────────────
export interface HangulLetter {
  char: string;
  sound: string; // romanized sound
  type: "vowel" | "consonant";
  hint: string;
}

export const VOWELS: HangulLetter[] = [
  { char: "ㅏ", sound: "a", type: "vowel", hint: 'Like the "a" in "father".' },
  { char: "ㅓ", sound: "eo", type: "vowel", hint: 'Like the "u" in "but".' },
  { char: "ㅗ", sound: "o", type: "vowel", hint: 'Like the "o" in "go".' },
  { char: "ㅜ", sound: "u", type: "vowel", hint: 'Like the "oo" in "moon".' },
  { char: "ㅡ", sound: "eu", type: "vowel", hint: "A flat 'uh' with lips wide." },
  { char: "ㅣ", sound: "i", type: "vowel", hint: 'Like the "ee" in "see".' },
];

export const CONSONANTS: HangulLetter[] = [
  { char: "ㄱ", sound: "g/k", type: "consonant", hint: 'Soft "g" / "k".' },
  { char: "ㄴ", sound: "n", type: "consonant", hint: 'Like "n" in "no".' },
  { char: "ㄷ", sound: "d/t", type: "consonant", hint: 'Soft "d" / "t".' },
  { char: "ㄹ", sound: "r/l", type: "consonant", hint: 'Between "r" and "l".' },
  { char: "ㅁ", sound: "m", type: "consonant", hint: 'Like "m" in "moon".' },
];

// syllable building: consonant + vowel
export const SYLLABLES = [
  { parts: "ㄱ+ㅏ", result: "가", roman: "ga" },
  { parts: "ㄴ+ㅏ", result: "나", roman: "na" },
  { parts: "ㄷ+ㅏ", result: "다", roman: "da" },
  { parts: "ㄹ+ㅏ", result: "라", roman: "ra" },
  { parts: "ㅁ+ㅏ", result: "마", roman: "ma" },
];

// ── Question bank (mini-game types) ──────────────────────────────────────────
export type QuestionType =
  | "mc-translate" // Korean -> English meaning
  | "ko-to-en"
  | "en-to-ko"
  | "sound-match"
  | "syllable-builder"
  | "listening"
  | "fill-blank"
  | "word-order"
  | "npc-response"
  | "battle";

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string; // the question text
  subPrompt?: string; // korean shown large, or audio label
  options: string[];
  answer: string; // must match one option
  explanation: string; // shown on correct
  vocabId?: string; // links to a vocab entry for mastery tracking
}

// The exact 15 questions required.
export const QUESTIONS: Question[] = [
  {
    id: "q1",
    type: "mc-translate",
    prompt: "What does 안녕하세요 mean?",
    subPrompt: "안녕하세요",
    options: ["Hello", "Thank you", "No", "Water"],
    answer: "Hello",
    explanation: "Correct. 안녕하세요 (annyeonghaseyo) means Hello.",
    vocabId: "annyeong",
  },
  {
    id: "q2",
    type: "mc-translate",
    prompt: "What does 감사합니다 mean?",
    subPrompt: "감사합니다",
    options: ["Sorry", "Thank you", "House", "Book"],
    answer: "Thank you",
    explanation: "Correct. 감사합니다 (gamsahamnida) means Thank you.",
    vocabId: "gamsa",
  },
  {
    id: "q3",
    type: "en-to-ko",
    prompt: 'Korean for "Yes"?',
    options: ["네", "아니요", "물", "책"],
    answer: "네",
    explanation: "Correct. 네 (ne) means Yes.",
    vocabId: "ne",
  },
  {
    id: "q4",
    type: "en-to-ko",
    prompt: 'Korean for "No"?',
    options: ["네", "아니요", "감사합니다", "이름"],
    answer: "아니요",
    explanation: "Correct. 아니요 (aniyo) means No.",
    vocabId: "aniyo",
  },
  {
    id: "q5",
    type: "sound-match",
    prompt: "Sound of ㅏ?",
    subPrompt: "ㅏ",
    options: ["a", "eo", "o", "u"],
    answer: "a",
    explanation: 'Correct. ㅏ sounds like "a" as in "father".',
  },
  {
    id: "q6",
    type: "sound-match",
    prompt: "Sound of ㅓ?",
    subPrompt: "ㅓ",
    options: ["a", "eo", "o", "u"],
    answer: "eo",
    explanation: 'Correct. ㅓ sounds like "eo" as in "but".',
  },
  {
    id: "q7",
    type: "syllable-builder",
    prompt: "Build the syllable 가.",
    subPrompt: "가",
    options: ["ㄱ+ㅏ", "ㄴ+ㅏ", "ㄷ+ㅓ", "ㅁ+ㅗ"],
    answer: "ㄱ+ㅏ",
    explanation: "Correct. ㄱ (g) + ㅏ (a) = 가 (ga).",
  },
  {
    id: "q8",
    type: "mc-translate",
    prompt: "What does 이름 mean?",
    subPrompt: "이름",
    options: ["Name", "Friend", "Rice", "School"],
    answer: "Name",
    explanation: "Correct. 이름 (ireum) means Name.",
    vocabId: "ireum",
  },
  {
    id: "q9",
    type: "mc-translate",
    prompt: "What does 한국어 mean?",
    subPrompt: "한국어",
    options: ["Korean language", "Hello", "Person", "House"],
    answer: "Korean language",
    explanation: "Correct. 한국어 (hangugeo) means the Korean language.",
    vocabId: "hangugeo",
  },
  {
    id: "q10",
    type: "npc-response",
    prompt: "Best response to 안녕하세요?",
    subPrompt: "안녕하세요!",
    options: ["안녕하세요", "물", "책", "아니요"],
    answer: "안녕하세요",
    explanation: "Correct. You greet back with 안녕하세요.",
    vocabId: "annyeong",
  },
  {
    id: "q11",
    type: "mc-translate",
    prompt: "What does 저는 mean?",
    subPrompt: "저는",
    options: ["I / as for me", "Thank you", "No", "Book"],
    answer: "I / as for me",
    explanation: "Correct. 저는 (jeoneun) means I / as for me.",
    vocabId: "jeoneun",
  },
  {
    id: "q12",
    type: "mc-translate",
    prompt: "What does 입니다 mean?",
    subPrompt: "입니다",
    options: ["am / is / are", "water", "sorry", "friend"],
    answer: "am / is / are",
    explanation: "Correct. 입니다 (imnida) means am / is / are.",
    vocabId: "imnida",
  },
  {
    id: "q13",
    type: "ko-to-en",
    prompt: "Translate 저는 아린입니다.",
    subPrompt: "저는 아린입니다.",
    options: ["I am Arin.", "Thank you Arin.", "Hello Arin.", "Arin is Korean."],
    answer: "I am Arin.",
    explanation: "Correct. 저는 [name]입니다 = I am [name].",
    vocabId: "imnida",
  },
  {
    id: "q14",
    type: "en-to-ko",
    prompt: 'Korean for "Thank you"?',
    options: ["감사합니다", "안녕하세요", "아니요", "이름"],
    answer: "감사합니다",
    explanation: "Correct. 감사합니다 (gamsahamnida) means Thank you.",
    vocabId: "gamsa",
  },
  {
    id: "q15",
    type: "mc-translate",
    prompt: "What does 죄송합니다 mean?",
    subPrompt: "죄송합니다",
    options: ["Sorry", "Hello", "Yes", "Name"],
    answer: "Sorry",
    explanation: "Correct. 죄송합니다 (joesonghamnida) means Sorry.",
    vocabId: "joesong",
  },
];

export function getQuestion(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

// ── Word-order puzzle (special question type) ────────────────────────────────
export interface WordOrderPuzzle {
  id: string;
  prompt: string;
  english: string;
  tokens: string[]; // scrambled-ish display order
  answer: string[]; // correct order
  explanation: string;
}

export const WORD_ORDER: WordOrderPuzzle = {
  id: "wo1",
  prompt: "Arrange the sentence: \"I learn Korean.\"",
  english: "I learn Korean.",
  tokens: ["한국어를", "저는", "배워요"],
  answer: ["저는", "한국어를", "배워요"],
  explanation: "Correct. 저는 한국어를 배워요 = I learn Korean.",
};

export const FILL_BLANK = {
  id: "fb1",
  prompt: "Fill the blank: 저는 ___ 입니다 (I am Arin)",
  before: "저는",
  after: "입니다",
  options: ["아린", "감사", "물", "책"],
  answer: "아린",
  explanation: "Correct. 저는 아린입니다 = I am Arin.",
};

// ── Chapters & lessons ───────────────────────────────────────────────────────
export interface LessonNode {
  id: string;
  title: string;
  chapterId: string;
  goal: string; // learning goal shown in HUD
  kind: "letter" | "syllable" | "greeting" | "boss";
  area: string; // areaId where this lesson plays out
  questionIds: string[];
  vocabIds: string[];
  locked: boolean; // future stub
}

export interface Chapter {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  locked: boolean;
}

export const CHAPTERS: Chapter[] = [
  { id: "ch0", index: 0, title: "The First Letters", subtitle: "Vowels, consonants & syllables", locked: false },
  { id: "ch1", index: 1, title: "Greetings at Dawn Village", subtitle: "Your first Korean phrases", locked: false },
  { id: "ch2", index: 2, title: "Market of Words", subtitle: "Coming soon", locked: true },
  { id: "ch3", index: 3, title: "Verb Forest", subtitle: "Coming soon", locked: true },
  { id: "ch4", index: 4, title: "Sentence Gate", subtitle: "Coming soon", locked: true },
];

// The learning-path map nodes (8 nodes, last is the boss).
export const LESSONS: LessonNode[] = [
  {
    id: "l1",
    title: "The First Vowel",
    chapterId: "ch0",
    goal: "Learn the vowel ㅏ",
    kind: "letter",
    area: "shrine",
    questionIds: ["q5"],
    vocabIds: [],
    locked: false,
  },
  {
    id: "l2",
    title: "The Second Sound",
    chapterId: "ch0",
    goal: "Learn the vowel ㅓ",
    kind: "letter",
    area: "shrine",
    questionIds: ["q6"],
    vocabIds: [],
    locked: false,
  },
  {
    id: "l3",
    title: "Build a Syllable",
    chapterId: "ch0",
    goal: "Combine ㄱ + ㅏ into 가",
    kind: "syllable",
    area: "shrine",
    questionIds: ["q7"],
    vocabIds: [],
    locked: false,
  },
  {
    id: "l4",
    title: "First Greeting",
    chapterId: "ch1",
    goal: "Learn 안녕하세요 (Hello)",
    kind: "greeting",
    area: "village",
    questionIds: ["q1", "q10"],
    vocabIds: ["annyeong"],
    locked: false,
  },
  {
    id: "l5",
    title: "Thank the Villager",
    chapterId: "ch1",
    goal: "Learn 감사합니다 (Thank you)",
    kind: "greeting",
    area: "village",
    questionIds: ["q2", "q14"],
    vocabIds: ["gamsa"],
    locked: false,
  },
  {
    id: "l6",
    title: "Yes or No",
    chapterId: "ch1",
    goal: "Learn 네 / 아니요",
    kind: "greeting",
    area: "village",
    questionIds: ["q3", "q4"],
    vocabIds: ["ne", "aniyo"],
    locked: false,
  },
  {
    id: "l7",
    title: "Introduce Yourself",
    chapterId: "ch1",
    goal: "저는 [name]입니다 = I am [name]",
    kind: "greeting",
    area: "village",
    questionIds: ["q11", "q12", "q13", "q8"],
    vocabIds: ["jeoneun", "imnida", "ireum", "hangugeo"],
    locked: false,
  },
  {
    id: "l8",
    title: "Chapter Boss: The Silent Gate",
    chapterId: "ch1",
    goal: "Defeat the Silence Wisp with Korean",
    kind: "boss",
    area: "gate",
    questionIds: ["q1", "q2", "q3", "q5", "q10", "q15"],
    vocabIds: ["annyeong", "gamsa", "joesong"],
    locked: false,
  },
];

export function getLesson(id: string): LessonNode | undefined {
  return LESSONS.find((l) => l.id === id);
}

// Learner levels
export interface LearnerLevel {
  level: number;
  title: string;
  xpRequired: number; // cumulative xp to reach this level
}

export const LEARNER_LEVELS: LearnerLevel[] = [
  { level: 1, title: "New Traveler", xpRequired: 0 },
  { level: 2, title: "Letter Seeker", xpRequired: 60 },
  { level: 3, title: "Word Walker", xpRequired: 150 },
  { level: 4, title: "Phrase Caster", xpRequired: 280 },
  { level: 5, title: "Sentence Mage", xpRequired: 450 },
];

export function levelForXp(xp: number): LearnerLevel {
  let current = LEARNER_LEVELS[0];
  for (const l of LEARNER_LEVELS) {
    if (xp >= l.xpRequired) current = l;
  }
  return current;
}

export function nextLevel(xp: number): LearnerLevel | null {
  const cur = levelForXp(xp);
  return LEARNER_LEVELS.find((l) => l.level === cur.level + 1) ?? null;
}

// XP rewards
export const XP = {
  correct: 5,
  noHintBonus: 3,
  lessonComplete: 15,
  perfectLesson: 10,
  battleVictory: 25,
  streakContinue: 8,
  reviewCorrect: 4,
};
