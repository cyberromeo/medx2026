# Skill: Add YouTube Video Lectures to MedX 2026

## Trigger

This skill activates when the user shares one or more YouTube embed URLs (containing `youtube.com/embed/`). The user may optionally specify a subject name — if not, infer it from the video titles.

## Overview

MedX 2026 is a medical lecture streaming app. All subject and video data lives in a single file: `src/data/subjects.js`. This file exports two things:

1. `subjects` — an array of subject card objects (UI metadata).
2. `videosBySubject` — an object mapping subject IDs to their video arrays.

When the user pastes YouTube embed links, this skill must:
1. Extract video IDs from the URLs.
2. Fetch each video's title from YouTube to determine the **subject name**, **date**, and **class/part number**.
3. Match the subject to an existing entry in `subjects.js`, or create a new one if it doesn't exist.
4. Add the new video entries into the correct position (chronological order by date).
5. Re-sequence all video IDs and class numbers (CLASS 1, CLASS 2, ... CLASS N) for that subject.
6. Update the module count and duration metadata (1 module = 4.5 hours).
7. Validate the JS syntax with `node -c src/data/subjects.js`.
8. Commit and push to GitHub.

---

## Step 1: Extract Video IDs and Fetch Titles

Given YouTube embed URLs like:
```
https://www.youtube.com/embed/VIDEO_ID?autoplay=1&...
```

Extract the video ID (the segment between `/embed/` and `?`).

Fetch the title by requesting `https://www.youtube.com/watch?v=VIDEO_ID` with a browser User-Agent header, then parsing the `<title>` tag from the HTML response.

### Title Format

MIST video titles follow this pattern:
```
MIST, {Subject} Online {Optional Topic}Class-{N}, {Date} - YouTube
```

Examples:
```
MIST, Pathology Online (Neoplasia )Class-1, 24th March 26 - YouTube
MIST, Radiology Online Class-2, 1st May 26 - YouTube
MIST, Biochemistry Online Class-5, 7th March 26 - YouTube
MIST, Forensic Medicine Class-3, 12th Feb 26 - YouTube
```

From each title, extract:
- **Subject name**: The word(s) between "MIST, " and " Online" or " Class"
- **Topic** (optional): Text inside parentheses, e.g., "(Neoplasia )"
- **Class number**: The number after "Class-"
- **Date**: The date string like "24th March 26", "1st May 26"

### Date Formatting

Convert the extracted date into the short format used in the app: `DD MMM` (uppercase 3-letter month).

Examples:
- "24th March 26" → `24 MAR`
- "1st May 26" → `1 MAY`
- "7th March 26" → `7 MAR`
- "12th Feb 26" → `12 FEB`

---

## Step 2: Subject Matching

### Known Subject ID Mapping

| YouTube Title Contains | Subject ID in `subjects.js` | Display Name |
|---|---|---|
| Anatomy | `anatomy` | Anatomy |
| Physiology | `physiology` | Physiology |
| Pathology | `pathology` | Pathology |
| Anesthesia / Anaesthesia | `anesthesia` | Anesthesia |
| Ophthalmology / Optha | `ophthalmology` | Ophthalmology |
| Forensic Medicine / FMT | `forensic` | Forensic Medicine |
| ENT | `ent` | ENT |
| Psychiatry | `psychiatry` | Psychiatry |
| Medicine | `medicine-kunal` | Medicine - Dr. Kunal |
| OB GYNE / Obstetrics / Gynaecology | `obgyne` | OB GYNE |
| Paediatrics / Pediatrics | `paediatrics` | Paediatrics |
| Radiology | `radiology` | Radiology |
| Biochemistry | `biochemistry` | Biochemistry |

If the subject from the YouTube title does **not** match any known subject, create a new subject entry (see Step 4).

### Duplicate Check

Before adding a video, check if its YouTube video ID already exists in the subject's video array inside `videosBySubject`. If it does, skip it and report "Already exists".

---

## Step 3: Add Videos to an Existing Subject

### Video Object Format

Each video in `videosBySubject[subjectId].videos` follows this exact structure:

```javascript
{
  id: '{prefix}-{NN}',           // e.g., 'path-01', 'radio-04'
  chapter: 'CLASS {N} — {DATE}', // e.g., 'CLASS 5 — 24 MAR'  (uses em-dash —)
  title: '{Topic} — Class {N}',  // e.g., 'Neoplasia — Class 5' or 'Radiology — Class 3'
  duration: 'LIVE',
  chapterColor: '{color}',       // cycles: 'tertiary', 'secondary', 'primary-container', 'tertiary', 'primary', 'tertiary' ...
  thumbnail: 'https://img.youtube.com/vi/{VIDEO_ID}/hqdefault.jpg',
  videoUrl: '{ORIGINAL_EMBED_URL}',   // keep the original embed URL exactly as provided
  variant: '{variant}',          // cycles: 'default', 'default', 'dark', 'default', 'default', 'muted' ...
}
```

### ID Prefix Map

| Subject ID | Video ID Prefix |
|---|---|
| anatomy | ana |
| physiology | physio |
| pathology | path |
| anesthesia | anes |
| ophthalmology | optha |
| forensic | fmg |
| ent | ent |
| psychiatry | psych |
| medicine-kunal | med |
| obgyne | obg |
| paediatrics | paeds |
| radiology | radio |
| biochemistry | biochem |

### Chapter Color Cycle

Rotate through these colors in order for each sequential video:
```
tertiary → secondary → primary-container → tertiary → primary → tertiary → secondary → ...
```

### Variant Cycle

Rotate through these variants:
```
default → default → dark → default → default → muted → ...
```

### Title Construction

- If the YouTube title contains a topic in parentheses (e.g., `(Neoplasia)`), use that as the title prefix: `Neoplasia — Class {N}`
- If no topic is specified, use the subject display name: `Radiology — Class {N}`

### Insertion & Sequencing

1. Insert new videos into the array in **chronological order by date**.
2. After insertion, **re-sequence ALL videos** in that subject:
   - `id` fields: `{prefix}-01`, `{prefix}-02`, ..., `{prefix}-{NN}` (zero-padded to 2 digits)
   - `chapter` fields: `CLASS 1 — {DATE}`, `CLASS 2 — {DATE}`, ...
   - `title` fields: `{Topic} — Class 1`, `{Topic} — Class 2`, ... (keep the original topic portion, only update the class number)

---

## Step 4: Create a New Subject (if needed)

If the subject doesn't exist yet, add entries in **both** data structures.

### `subjects` Array Entry

Insert the new subject **before** the last entry (which is always the `'locked'` / `'More Subjects'` placeholder).

```javascript
{
  id: '{subject-id}',                    // lowercase, hyphenated
  name: '{Subject Name}',
  module: '{NN}',                        // next sequential 2-digit module number
  description: '{auto-generated}',       // Brief medical description
  units: {video_count},
  hours: '{video_count * 4.5}H',
  variant: 'featured',
  icon: '{material_icon}',              // choose appropriate Material Symbol
}
```

### `videosBySubject` Entry

Add a new key to the `videosBySubject` object:

```javascript
{subjectId}: {
  title: '{SUBJECT NAME}',              // UPPERCASE
  modules: {video_count},
  duration: '{video_count * 4.5}H',
  videos: [ ... ],                       // video objects as defined above
},
```

Choose a new **video ID prefix** (2-5 lowercase chars) for the subject.

---

## Step 5: Update Metadata

After adding/removing videos, update these counts:

### In `subjects` array (the card object):
- `units`: total number of videos for that subject
- `hours`: `'{units * 4.5}H'` (e.g., 18 videos → `'81H'`)

### In `videosBySubject` (the video library object):
- `modules`: total number of videos
- `duration`: `'{modules * 4.5}H'`

---

## Step 6: Validate and Push

1. **Validate JS syntax**: Run `node -c src/data/subjects.js` — must exit with code 0.
2. **Stage, commit, and push**:
   ```
   git add src/data/subjects.js
   git commit -m "feat: add {N} new {subject} video(s)"
   git push
   ```

> **IMPORTANT**: On Windows PowerShell, use `;` to chain commands, NOT `&&`.

---

## Critical Rules

- **Em-dash**: Always use the Unicode em-dash character `—` (U+2014) in `chapter` and `title` fields. Never use `--` or `-`.
- **Encoding**: Write files with UTF-8 encoding to preserve special characters.
- **No duplicates**: Always check if a video ID already exists before adding.
- **Preserve existing data**: Never delete or overwrite existing videos — only append new ones and re-sequence.
- **Syntax validation**: Always run `node -c` before committing. If it fails, debug and fix before pushing.
- **No zombie data**: After editing, ensure no orphaned video objects exist outside their proper array brackets. This has caused Vite parse errors before.

---

## Example Interaction

**User says:**
```
https://www.youtube.com/embed/iMb9nohv7j8?autoplay=1&...
https://www.youtube.com/embed/sEqpagbCueQ?autoplay=1&...
```

**Agent does:**
1. Extracts IDs: `iMb9nohv7j8`, `sEqpagbCueQ`
2. Fetches titles → "MIST, Radiology Online Class-1, 1st May 26" and "MIST, Radiology Online Class-2, 1st May 26"
3. Matches subject: `radiology`
4. Checks for duplicates (skips if already present)
5. Adds 2 new video objects to `videosBySubject.radiology.videos`
6. Re-sequences all video IDs and class numbers
7. Updates `units`/`hours` in subjects array and `modules`/`duration` in videosBySubject
8. Validates with `node -c`
9. Commits: `"feat: add 2 new radiology video(s)"`
10. Pushes to GitHub

**Agent responds:**
> Added 2 new Radiology videos (Class 3, Class 4 — May 1st). Total: 4 modules, 18H duration. Pushed to GitHub.
