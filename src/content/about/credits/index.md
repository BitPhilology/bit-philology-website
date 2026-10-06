---
# ══════════════════════════════════════════════════════════════════════
#  PAGE SETTINGS
#  How to write a page:
#  https://github.com/BitPhilology/bit-philology-website/blob/main/docs/CONTENT.md
#
#  Lines that start with "#" are notes for you: the website ignores them.
#  Every type of page has the same settings. Some of them only apply to
#  some types: on the other types they are ignored, so you can leave them
#  empty or delete them.
# ══════════════════════════════════════════════════════════════════════

# ── TYPE OF PAGE ──────────────────────────────────────────────────────
# One of: about, team, event, publication, artifact.
type: about

# ── WHAT THE PAGE IS ABOUT ────────────────────────────────────────────
# The title of the page, also shown on its card on the Home page.
# With a colon (:) inside, write it in quotes: "Born-digital archives: a first survey".
title: Credits
# A line under the title. Not used on publications.
subtitle:
# The topics of the page, one per line, each after "- ". They are shown as #keyword labels.
keywords:

# ── WHEN AND WHERE ────────────────────────────────────────────────────
# The day of the event, or when the page or the publication came out.
# Write YEAR-MONTH-DAY (2026-05-08) or only the year (2026).
date: 2026-09-27
# Events and publications only: the institution, the conference or the journal.
venue:
# Events and publications only: the room or the city, when it adds something to the venue.
location:

# ── PUBLICATIONS AND ARTIFACTS ONLY ───────────────────────────────────
# Who made it, for example: E. Spadini, E. Barchielli.
authors:
# Publications only: what it is, for example: Poster, Oral Communication, Article.
publication-type:
# Publications only: the DOI (10.5281/zenodo.1234567) or its link.
doi:
# Publications only: the link to the file to download.
download-link:
# Artifacts only: what kind of object it is, for example: Tool, Dataset.
kind:

# ── LISTS OF PEOPLE ───────────────────────────────────────────────────
# Team page only: the people of the team, shown where the text has {{team}}.
# A photo is uploaded to HedgeDoc like any image (see the end of these settings): here goes only its link.
# To add a person, copy these lines without the "#":
# - name: Jane Doe
#   role: PhD Student
#   affiliation: Universität Bern
#   photo: https://pad.dsl.unibe.ch/uploads/1a2b3c4d.jpg
#   external-url: https://link-to-her-web-page
members:
# About page only: the advisory board, shown where the text has {{advisory-board}}.
# To add a person, copy these lines without the "#":
# - name: Jane Doe
#   affiliation: Universität Bern
#   external-url: https://link-to-her-web-page
advisory-board:

# ── HOME PAGE ─────────────────────────────────────────────────────────
# The text on the card of the page (About, Team and Artifact only).
# Empty: the card shows the first paragraph of the page.
excerpt:
# Where the card sits in the Home grid: 1 is the first tile, 2 the second…; -1 is the last one.
# Empty: the cards follow their date, newest first.
position:
# Write "true" to not display the content in the home page (e.g., as done for the "credits" page).
hidden-from-home: true

# ── TECHNICAL SETTINGS ────────────────────────────────────────────────
# Leave it empty: the address of the page is computed from its title when the page is imported.
slug:
# Used by HedgeDoc to group the notes: leave it as it is.
tags: website/Credits Page

# ── HOW TO ADD AN IMAGE TO THE TEXT ───────────────────────────────────
# Always upload the image to HedgeDoc: never link to an image that is on another website.
# 1. Put the cursor on an empty line of the text, below these settings.
# 2. Press the "Upload Image" button in the toolbar of HedgeDoc. HedgeDoc writes a line like this:
#      ![](https://pad.dsl.unibe.ch/uploads/1a2b3c4d.png)
# 3. Complete that line with a description and a caption:
#      ![A hand-drawn map of the archive](https://pad.dsl.unibe.ch/uploads/1a2b3c4d.png "The archive in 1998")
#    Between [ ]: the description of the image, read aloud to people who cannot see it. Always write it.
#    Between " ", after a space: the caption, shown beside the image. You can leave it out.

# ── ADDED BY THE IMPORT: DO NOT EDIT ──────────────────────────────────
source: https://pad.dsl.unibe.ch/Pccv0jyDQIuq0ENqbjinxQ
importedAt: 2026-10-06T11:30:36Z
---

[no-lead]The Bit Philology website stands on the work of many open-source communities, who made the typefaces, the icons and the software that you are using right now. Thank you.

###### Open-source Software

* [Svelte](https://svelte.dev/) and [SvelteKit](https://svelte.dev/docs/kit), with its static adapter and the Vite plugin for Svelte: the framework. MIT license.
* [Vite](https://vite.dev/): the build tool. MIT license.
* [Tailwind CSS](https://tailwindcss.com/): the styles. MIT license.
* [TypeScript](https://www.typescriptlang.org/) and svelte-check: the language and its checks. Apache-2.0 and MIT licenses.
* [unified](https://unifiedjs.com/), with remark (parse, GFM and rehype), rehype-slug and hast-util-to-html: the conversion of Markdown pages into HTML. MIT license.
* [yaml](https://eemeli.org/yaml/): the reading of the page settings. ISC license.

###### Typefaces

All the typefaces are open source, released under the [SIL Open Font License 1.1](https://openfontlicense.org/), and are served from this website through [Fontsource](https://fontsource.org/).

* [Mona Sans](https://github.com/github/mona-sans), by the Mona Sans Project Authors (GitHub)
* [Bitcount Prop Single](https://github.com/petrvanblokland/TYPETR-Bitcount), by the Bitcount Project Authors (Petr van Blokland, TYPETR)
* [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), by the JetBrains Mono Project Authors

###### Icons

* [Pixelarticons](https://pixelarticons.com/), by Gerrit Halfmann. MIT license.

###### Contents

The contents are curated by the Bit Philology team: Elena Spadini, Elena Barchielli, Simon Willemin and Tommaso Elli. You can find them on the [team page](/about/team/).

###### Images

Unless differently specified, the images and illustrations of the website are created by the team, even with the use of AI image tools.

###### Tools

* [Penpot](https://www.penpot.app/): the design of the website (initial)
* [Figma](https://www.figma.com/): the design of the website
* [GitHub](https://github.com/): source code versioning
* [Claude Code](https://claude.com/claude-code), by Anthropic

The full text of the licenses is included in the packages of each project.

###### Project and partners

Bit Philology is a Starting Grant project of the [Swiss National Science Foundation](https://www.snf.ch/) running from 2025 to 2030. It is conducted at the [Digital Humanities Center](https://www.dh.unibe.ch/), part of the [Walter Benjamin Kolleg](https://www.wbkolleg.unibe.ch/) at the University of Bern. The logos of these institutions belong to them and are used here to acknowledge their support.
