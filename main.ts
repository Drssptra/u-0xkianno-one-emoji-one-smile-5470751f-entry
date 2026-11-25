// One Emoji, One Smile — make.fun entry v2 (u-0xkianno-one-emoji-one-smile-5470751f)
//
// v2 entry: 🤗 — hugging face. The brief asks for exactly one emoji that
// makes a stranger smile, and this one does the work with its face: open
// arms plus a genuine smile, warm without being romantic, readable at any
// size and any age, a deliberate pick rather than the default smiley.
// It differs from v1 (🫶 heart hands, a gesture with no face) because the
// warmth here is in the face itself — you meet a happy face first.
import * as fs from "node:fs";
import * as path from "node:path";

// The entry, fixed. One code point, inside the 1–8 gate.
const SMILE = "🤗";

const GATE = Object.freeze({ minCodePoints: 1, maxCodePoints: 8 });

type Problem = string;
type Checker = (text: string) => Problem | null;

// Each gate rule is its own small checker; all problems are collected
// before anything is written, instead of failing on the first one.
const CHECKERS: readonly Checker[] = [
  (text) => (text.length === 0 ? "entry is empty" : null),
  (text) => {
    const n = Array.from(text).length;
    return n < GATE.minCodePoints || n > GATE.maxCodePoints
      ? `entry has ${n} code points, gate allows ${GATE.minCodePoints}-${GATE.maxCodePoints}`
      : null;
  },
  (text) => (text.trim().length === 0 ? "entry is only whitespace" : null),
];

function collectProblems(text: string): Problem[] {
  const found: Problem[] = [];
  for (const check of CHECKERS) {
    const problem = check(text);
    if (problem !== null) found.push(problem);
  }
  return found;
}

function resolveOutDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return fromEnv !== undefined && fromEnv !== "" ? fromEnv : "/output";
}

function emit(text: string): void {
  const problems = collectProblems(text);
  if (problems.length > 0) {
    throw new Error(`entry failed gate: ${problems.join("; ")}`);
  }
  const dir = resolveOutDir();
  fs.mkdirSync(dir, { recursive: true });
  // Buffer write, no newline appended: entry.txt must be byte-exactly
  // the entry text, nothing more.
  const payload = Buffer.from(text, "utf8");
  const target = path.join(dir, "entry.txt");
  fs.writeFileSync(target, payload);
  // Read-back guard: what landed on disk must be byte-identical to the
  // entry, otherwise fail loudly instead of shipping a wrong file.
  const onDisk = fs.readFileSync(target);
  if (!onDisk.equals(payload)) {
    throw new Error(
      `entry.txt mismatch: wrote ${payload.length} bytes, disk has ${onDisk.length}`,
    );
  }
}

// Top-level flow: no main() wrapper — run, report, and let a thrown
// error set a non-zero exit code instead of crashing mid-write.
try {
  emit(SMILE);
  console.log(SMILE);
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
}
