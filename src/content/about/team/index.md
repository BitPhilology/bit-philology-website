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
type: team

# ── WHAT THE PAGE IS ABOUT ────────────────────────────────────────────
# The title of the page, also shown on its card on the Home page.
title: Team
# A line under the title. Not used on publications.
subtitle:
# The topics of the page, one per line, each after "- ". They are shown as #keyword labels.
keywords:
-

# ── WHEN AND WHERE ────────────────────────────────────────────────────
# The day of the event, or when the page or the publication came out.
# Write YEAR-MONTH-DAY (2026-05-08) or only the year (2026).
date: 2025-09-29
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
members:
- name: Prof. Dr. Elena Spadini
  role: Principal Investigator
  affiliation: Universität Bern
  photo: ./assets/ElenaSpadini_eng.jpg
  external-url: https://www.dh.unibe.ch/about_us/people/prof_dr_spadini_elena/index_eng.html

- name: Elena Barchielli
  role: PhD Student
  affiliation: Universität Bern
  photo: ./assets/ElenaBarilli_eng.png
  external-url: https://www.dh.unibe.ch/about_us/people/barchielli_elena/index_eng.html

- name: Simon Willemin
  role: PhD Student
  affiliation: Universität Bern
  photo: ./assets/portrait-660_SimonFrancoisWille_eng.png
  external-url: https://www.dh.unibe.ch/about_us/people/willemin_simon/index_eng.html

- name: Tommaso Elli
  role: Research Associate
  affiliation: Universität Bern
  photo: https://picsum.photos/200
  external-url:

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
position: -1
# Write "true" to not display the content in the home page (e.g., as done for the "credits" page).
hidden-from-home:

# ── TECHNICAL SETTINGS ────────────────────────────────────────────────
# Leave it empty: the address of the page is computed from its title when the page is imported.
slug:
# Used by HedgeDoc to group the notes: leave it as it is.
tags: website/team-page

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
source: https://pad.dsl.unibe.ch/eXfd9t1LQui9OWZKRwYY0A
importedAt: 2026-10-06T11:30:36Z
---

The team working on the research project is composed by experts in Philology, Digital Archives, Born-Digital Materials, Information Visualization, and Digital Design.

The project is based at the Digital Humanities Center of the University of Bern, part of the Walter Benjamin Kolleg, and is funded by the Swiss National Science Foundation for the years 2025 to 2030. It is led by Elena Spadini, SNSF Assistant Professor, whose research covers digital philology and the technologies of text. Doctoral students and a research associate work with her on the description, edition and analysis of born-digital literary archives.

{{team}}
