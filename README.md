# Khmer Traditional Medicine Archive

Live archive: https://khmer-medicine-archive.vercel.app/

GitHub repository: https://github.com/LyhengPHA/khmer-medicine-archive

## 1. What this is

The Khmer Traditional Medicine Archive is Lyheng PHA's ICT 340 capstone at AUPP. It preserves traditional medicine knowledge shared by នាង សុខជា (Neang Sokchea), who learned it in Takeo and now lives in Phnom Penh. Records retain ingredients, preparation, reported uses, precautions, and source/place information. Visitors browse and search published entries; contributors submit records with photos and manage their own entries; reviewers publish or return submissions. The collection documents cultural knowledge, and inclusion does not establish medical safety or effectiveness.

## 2. Who it's for

The archive serves Khmer-speaking readers, students, and contributors in Cambodia who want to explore and preserve traditional knowledge.

- Original Khmer names and descriptions are preserved.
- Search supports Khmer and English across titles, descriptions, ingredients, preparation, sources, and places.
- A site-wide ខ្មែរ / English switch defaults to Khmer and remembers the selected language in browser storage. Navigation, forms, feedback, and review actions show one language at a time.
- Noto Sans Khmer supports Khmer text display.
- Expandable entry cards keep detailed records accessible. Tree animation includes a pause control and respects reduced-motion preferences.
- Responsive layouts support phones; local mobile checks are recorded in section 8. Source and place fields keep credits with each record.

The language choice applies from navigation and authentication through search, contribution, ownership, review, loading, empty, and error states. Entry content uses existing translations; missing English translations retain the original Khmer with a pending notice. Choosing a language does not translate or change stored records. English translations and plant identifications in contributor records are drafts pending verification. The archive requires an internet connection; slow-connection performance has not been measured.

## 3. How it works

**Stack:** Next.js 15 App Router, React 19, JavaScript, plain CSS, Supabase, and Vercel.

Supabase Auth manages accounts. Postgres stores records in `entries` and reviewer membership in `reviewers`. Supabase Storage stores contribution images in the `photos` bucket. Archive identity is configured in `collection.config.js`.

Each entry includes its content, contributor/source information, place, owner UUID, review status, creation time, and photo URL. Ingredients, preparation, and usage are stored as arrays.

| Page | Purpose |
| --- | --- |
| `/` | Browse published entries, newest first, and search their content. |
| `/signup`, `/login` | Create an account and sign in. |
| `/contribute` | Submit an entry with a photo. |
| `/my-entries` | View the signed-in contributor's entries and statuses. |
| `/entries/[id]` | View an entry, subject to database read permissions. |
| `/entries/[id]/edit` | Edit an entry owned by the signed-in contributor. |
| `/review` | Reviewer-only queue, with pending entries shown oldest first. |

| Entry status | Meaning |
| --- | --- |
| `pending` | Waiting for review; excluded from public browse/search. |
| `published` | Approved for public access. |
| `returned` | Sent back for revision; excluded from public browse/search. |

**Read/write policies:** Public requests can read published entries. Signed-in contributors can also read their own unpublished entries, insert entries owned by their session UUID, and edit/delete only their own records. Reviewers can read pending entries for review and make publication decisions through the database function. Database controls prevent non-reviewers from publishing or assigning themselves reviewer membership.

**Review workflow:**

1. A signed-in contributor submits an entry. The server assigns ownership from the session, and the database defaults its status to `pending`.
2. A reviewer publishes the entry or returns it for revision.
3. Only `published` entries appear in public browse and search.
4. Editing an entry as a non-reviewer resets it to `pending`.

Published records are loaded together and searched in the browser. There is no pagination or offline mode.

## 4. Security decisions

**Authorization is enforced in the database and server routes.** Hiding buttons is only an interface convenience.

- **Visibility:** Database read policies protect unpublished records. The public homepage also explicitly filters for `published`.
- **Ownership:** Edit/delete routes authenticate the user, require a matching owner UUID, and filter mutations by both entry ID and owner. They check that a row was actually changed before reporting success.
- **Publication:** The review page checks `is_reviewer()` before loading the queue. Publish/Return actions call `review_entry(entry_id, decision)` with `published` or `returned`. The function checks reviewer authorization and whether the entry is still pending before accepting a decision. Keeping this gate in the database protects direct Console requests as well as page actions. A hidden button alone cannot prevent a database request. The interface removes an entry only when the function returns `true`.
- **Input and uploads:** Write routes check request origin and validate submitted content on the server. New entries require a JPEG, PNG, or WebP photo of up to 5 MB, checked by filename extension, MIME type, and file signature.
- **Photo handling:** Uploads use owner folders and randomized filenames. Failed saves attempt cleanup; replacement/deletion cleanup is restricted to the project's photo bucket and the owner's folder.
- **Credentials:** The application uses public Supabase configuration. Service-role credentials and account passwords do not belong in the repository.

Two-account and direct Console checks confirmed that non-reviewers cannot publish, logged-out users cannot read unpublished entries, and contributors cannot edit or delete another owner's entries.

**Tradeoffs:** Photo URLs are public even when their entry is pending, so the bucket is unsuitable for confidential images. Returned entries receive a general revision message; there is no reviewer-written reason field. The queue has no general control for taking down published entries.

## 5. AI use

I used AI throughout the project for planning, implementation, debugging, testing guidance, and documentation. I reviewed the generated work against the assignment requirements and checked its behavior before accepting it. I remain responsible for the code, content, and decisions in the final archive.

### Tools and models

| Tool / model | Contribution |
| --- | --- |
| ChatGPT: Astra and Sol | Helped interpret assignment requirements, plan implementation steps, explain authentication and review controls, prepare test cases, interpret errors, and draft documentation. |
| Codex CLI: Astra and Sol | Assisted with contribution and review workflows, ownership checks, validation, bilingual interface corrections, mobile styling, and repository inspection. |
| Cline/OpenRouter: Nemotron, OX alpha, DeepSeek V4 Flash | Assisted during earlier development. I did not record a reliable breakdown of which individual model produced each change, so I cannot attribute specific files to those models. |
| Built-in image-generation tool | Created decorative illustrations. The homepage hero image and its prompt are documented in [hero image notes](public/images/hero-image-notes.md). Entry photographs were taken by me. |

Exact model versions were not recorded.

### What I kept and changed

I kept the AI-assisted contribution and review workflows after checking that submissions waited for review, reviewers could publish or return entries, and contributors could manage only their own records.

One correction was the **My entries** navigation. The links in two headers were English-only, which did not meet the archive's Khmer-first direction. I changed them to Khmer/English in commit `38c783a`. This showed me that working functionality still needs a separate review for language and usability.

I also refined the mobile entry cards to improve alignment, preserve complete Khmer titles, simplify closed previews, and make the expand/collapse control clearer. I accepted the CSS changes after signed-in checks at 360, 390, and 430px, plus a desktop check at 1024px.

For documentation, I corrected AI drafts using the actual code and my source's information. This included correcting the source credit to នាង សុខជា (Neang Sokchea), recording that he learned this knowledge in Takeo and now lives in Phnom Penh, and crediting my photographs.

### How I checked the work

- Read the generated changes and compared them with the assignment requirements.
- Ran the production build and `git diff --check`; both passed.
- Tested ownership with separate accounts and attempted unauthorized operations through the Console.
- Checked that logged-out requests could not read unpublished entries and non-reviewers could not publish.
- Checked signed-in mobile layouts at 360, 390, and 430px, plus desktop at 1024px, including Khmer text, expanded entry details, and browser Console messages.
- Ran the mocked mutation and photo-cleanup tests in `tests/entryMutations.test.cjs`: 30 passed and 0 failed (18 mutation tests and 12 language tests).
- Used repository/history secret scans.

AI-assisted commits include the bilingual navigation correction (`38c783a`) and review queue (`a055e10`).

### Human source of the collection

The traditional knowledge came from Neang Sokchea, with permission to publish it. AI was not used as evidence that a remedy works or that a plant identification is correct. English translations and plant identifications remain drafts pending verification.
## 6. Sources and credits

- **Curator and entry photographer:** Lyheng PHA.
- **Knowledge source:** នាង សុខជា (Neang Sokchea). He learned this knowledge in Takeo and now lives in Phnom Penh.
- **Source location recorded in entries:** ខេត្តតាកែវ ភូមិវាយឈ្នះ ស្រុកសំរោង ឃុំរវៀង.
- **Permission:** Neang Sokchea agreed to publication of his name and shared knowledge. Entry photographs were taken by Lyheng PHA and are used with permission.
- **Starter:** ICT 340 Khmer Living Archive.
- **Font:** Noto Sans Khmer; license included in [OFL-NotoSansKhmer.txt](public/fonts/OFL-NotoSansKhmer.txt).

Entry records retain contributor, source, and place information. English translations and plant identifications remain drafts pending verification. AI-generated illustrations are decorative and are separate from photographs documenting the entries.

## 7. Running it locally

You need Git, npm, a Node.js version supported by Next.js 15, and a configured Supabase project.

### Install

```bash
git clone https://github.com/LyhengPHA/khmer-medicine-archive.git
cd khmer-medicine-archive
npm ci
```

Create `.env.local` in the project root. The required environment variable names are:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Set them locally using your own Supabase project's public configuration. Do not commit `.env.local` or use a service-role key in these variables.

### Configure Supabase

The project requires:

- Email authentication enabled.
- An `entries` table matching the application fields, linked to Auth through its `owner` UUID, with default status `pending`.
- A `reviewers` table with reviewer membership in `user_id`.
- Row-level security policies and publication controls protecting visibility, ownership, and review decisions.
- The `is_reviewer()` and `review_entry(entry_id, decision)` functions.
- A `photos` bucket with public image access and storage policies restricting writes to each user's folder.

Database migrations are not included. Cloning the repository and setting environment variables alone will not provision these Supabase resources. Reviewer membership must be configured by the project owner.

### Run

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000).

For a production build:

```bash
npm run build
npm run start
```

Run the existing mocked tests:

```bash
node --experimental-vm-modules --test tests/*.test.cjs
```

For Vercel deployment, set the same two environment variables and connect the GitHub repository. Keep the Supabase project active.

## 8. Submission checklist

Status updated 22 November 2026. Earlier workflow checks are retained; the curator confirmed local language-switch browser checks; final deployed-site verification remains pending. Pending items remain open until completed.

| Check | Status | Where to look / evidence |
| --- | --- | --- |
| Live archive loads logged out and searches published entries only | Previously verified; final post-push deployment check pending | [Live archive](https://khmer-medicine-archive.vercel.app/); recheck after the final deployment. |
| Contributor can sign up, submit text/photo, and see the entry waiting for review | Final live walkthrough pending | `/signup`, `/contribute`, and `/my-entries`; demonstrate in the video. |
| Reviewer can publish or return pending entries | Earlier workflow tests passed; final live walkthrough pending | `/review`; `components/ReviewEntryActions.js`. |
| A stranger cannot publish through the page or Console | Yes | Two-account and Console checks; section 4. |
| Logged-out requests cannot read pending or returned entries | Yes | Direct database read checks returned no unpublished rows; section 4. |
| Contributors can edit/delete only their own entries | Yes | Two-account checks; `app/api/entries/[id]/route.js`. |
| Repository/history secret scan completed | Yes | Latest scan confirmed by the curator. |
| Small commits with AI-assisted work identified | Yes | Git history includes separate AI-assisted commits for mobile CSS, bilingual/source corrections, mutation tests, and final documentation. |
| At least eight real entries with credited sources | Yes | Live collection and entry source details. |
| Khmer throughout user-facing screens, including the queue | Yes locally; deployment recheck pending | Navigation, authentication, search, feedback, ownership controls, and reviewer messages follow the selected language. The switch defaults to Khmer. |
| Works on a phone | Local language-switch checks confirmed by the curator; deployment recheck pending | Khmer and English checked at 360, 390, and 430px, plus desktop at 1024px. |
| Mutation and language tests | Yes | 30 passed and 0 failed (18 mutation tests and 12 language tests) with `node --experimental-vm-modules --test tests/*.test.cjs`. |
| Production build and diff checks | Yes | `npm run build` and `git diff --check` passed. |
| Empty states and plain error messages | Implemented; final live walkthrough pending | Homepage search, contribution form, My entries, and review queue. |
| No test entries, lorem ipsum, or TODO comments in the public collection | Yes | The public shelf contains sourced records. Unpublished test submissions are retained in the reviewer queue. |
| No console errors on main pages | None observed locally; deployed-site recheck pending | Browser Console during local page checks. |
| `jesseorndorff` is a collaborator | Yes | GitHub repository collaborator settings. |
| Supabase project awake and working | Yes, 21 November 2026 | Supabase dashboard and live record loading. |
| Final polish committed and pushed | Earlier polish pushed; language switch pending review | Main contains the earlier four AI-assisted polish commits. Review and verify the language switch before deployment. |
| Demo video is five minutes or less, in English, with screen and voice | Not yet | Show visitor search, account/contribution/ownership, and review/publication; name one decision and one AI mistake. |
| Demo link opens without login in a private window | Not yet | Submit the tested public/unlisted link in the separate Canvas **Demo Video** assignment and in Show Your Archive. |
| Four reflection answers submitted with the live URL and repo link | Not yet | One Final Capstone text box, in order: live URL, repo link, then four short reflection paragraphs. |
| Show Your Archive post completed | Not yet | Video link and two collection sentences by 22 November. |
| Two peer replies completed | Not yet | One strength and one suggested change per classmate; due 29 November, 11:59 PM. |
| Q&A slot booked | Yes | Class Bookings page; bring a laptop with the repository open. |

Signed-in local mobile checks at 360, 390, and 430px covered search/card alignment, horizontal overflow, full Khmer titles, closed previews, expanded bilingual descriptions, accessible entry details, and the expand/collapse target. The desktop hanging-tree layout was retained at 1024px. The production build, all 30 automated tests, and diff checks passed. The curator also confirmed the local language-switch browser checks on 22 November. Final data-display guards hide empty optional sections and preserve original Khmer when translation values have the wrong type; regression tests cover these cases. Final deployed-site verification remains pending.

The Final Capstone and separate Demo Video assignments are both due 22 November 2026 at 11:59 PM. There is no late window, even though Canvas remains available until 29 November. Final AI-use documentation is in section 5; no separate final Prompt Journal is required.
