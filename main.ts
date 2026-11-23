// One Emoji, One Smile — make.fun entry (u-0xkianno-one-emoji-one-smile-5470751f)
//
// The entry is a single fixed emoji, chosen for the warmth judge:
// a warm, open-armed welcome that reads as kind and friendly at first
// glance, with no words and no context needed.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Revised choice: heart hands. A hug from a stranger can read as too
// intimate (criterion 5), but heart hands send the same warmth from a
// respectful distance — kind, instantly readable at any age, clearly
// chosen rather than the default smiley, with no romantic or flirty
// charge. Warmth at first glance, no context needed.
const ENTRY = "🫶";

function main(): void {
  // Gate self-check: UTF-8, 1–8 Unicode code points, not only whitespace.
  const codePoints = [...ENTRY];
  if (codePoints.length < 1 || codePoints.length > 8) {
    throw new Error(
      `entry must be 1-8 characters, got ${codePoints.length}: ${JSON.stringify(ENTRY)}`,
    );
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
}

main();
