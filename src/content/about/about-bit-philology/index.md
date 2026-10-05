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
title: About Bit Philology
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
venue: Universität Bern
# Events and publications only: the room or the city, when it adds something to the venue.
location:

# ── PUBLICATIONS AND ARTIFACTS ONLY ───────────────────────────────────
# Who made it, for example: E. Spadini, E. Barchielli.
authors:
# Publications only: what it is, for example: Poster, Oral Communication, Article.
publication-type: poster
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
advisory-board:
- name: Emmanuela Carbé
  affiliation: Università Ca' Foscari Venezia
  external-url: https://www.unive.it/persone/emmanuela.carbe

- name: Paola Maria Carmela Italia
  affiliation: Università di Bologna
  external-url: https://www.unibo.it/sitoweb/paola.italia/en

- name: Matthew G. Kirschenbaum
  affiliation: University of Virginia
  external-url: https://english.as.virginia.edu/people/matthew-kirschenbaum

- name: Elena Pierazzo
  affiliation: Université de Tours
  external-url: https://cesr.cnrs.fr/membre/pierazzo-elena/

- name: Thorsten Ries
  affiliation: The University of Texas at Austin
  external-url: https://liberalarts.utexas.edu/eue/faculty/tr24969

- name: Francesca Tomasi
  affiliation: Università di Bologna
  external-url: https://www.unibo.it/sitoweb/francesca.tomasi/en

- name: Joris van Zundert
  affiliation: Huygens Institute — KNAW
  external-url: https://jorisvanzundert.net/

# ── HOME PAGE ─────────────────────────────────────────────────────────
# The text on the card of the page (About, Team and Artifact only).
# Empty: the card shows the first paragraph of the page.
excerpt:
# Where the card sits in the Home grid: 1 is the first tile, 2 the second…; -1 is the last one.
# Empty: the cards follow their date, newest first.
position: 2
# Write "true" to not display the content in the home page (e.g., as done for the "credits" page).
hidden-from-home:

# ── TECHNICAL SETTINGS ────────────────────────────────────────────────
# Leave it empty: the address of the page is computed from its title when the page is imported.
slug:
# Used by HedgeDoc to group the notes: leave it as it is.
tags: website/page

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
source: https://pad.dsl.unibe.ch/IMcrjOtPTSuAKrw46RXggg
importedAt: 2026-10-05T21:57:04Z
---

Today, much literature is created *digitally*. Literary archives, which preserve the manuscripts of writers, increasingly include digital documents (known as *born-digital*), which pose challenges for their study. The Bit Philology project will propose innovative solutions for describing, editing and analyzing digital literary archives, while meeting the scientific and societal needs of our digital age.

![Two big circles with a hole in the middle, their surface is covered with radial sectors and rings (simialr to trees) colored by various red shades](./assets/cb0c1dae-48b9-432a-8b56-7190a99aa412.webp
 "A floppy disk, seen as magnetic traces. Both sides of one disk, showing the raw magnetic signal a drive reads before it becomes files. Each thin ring is a track (a circular path the read head follows). The finely striped grey wedges are sectors (blocks of data), the lighter bands are the markers between them, and the smooth, even area on the right is empty filler space at the end of each track.")

Philology is a discipline that is thousands of years old [^philology-ref]. Textual scholars have studied and continue to study papyri, manuscripts, epigraphic and printed sources, and have developed methodological tools to work with texts preserved in different forms and on different media. But what happens when a text is born digital? A growing number of born-digital texts are currently being archived, including documents of historical importance and literary material. This project focuses on the latter, the born-digital literary archive, as a source for the philology of the present and the future.

[^philology-ref]: For an accessible introduction, see James Turner, *Philology: The Forgotten Origins of the Modern Humanities* (Princeton University Press, 2014).

Scholarship on born-digital sources [^born-digital-ref] has identified the need for a rethinking of traditional methodologies in order to transform the born-digital source into a scholarly object of study. The Bit Philology project seeks to respond to this need by **describing**, **editing** and **analyzing** born-digital literary sources. The aim of the project is to establish a methodological and technical toolkit for the study of born-digital literary sources created before the advent of cloud computing. The project is highly interdisciplinary and will combine approaches from digital humanities (data modeling, distant reading); authorial philology (filologia d’autore) and genetic criticism (critique génétique); the philological tradition concerned with the materiality of textual documents (filologia materiale, material bibliography, digital forensics); media and software studies; information design.

[^born-digital-ref]: Born-digital materials are texts and documents created on computers rather than digitised from paper. For an accessible introduction on how scholars study them, see Matthew G. Kirschenbaum, *Bitstreams: The Future of Digital Literary Heritage* (University of Pennsylvania Press, 2021)

#### Project outline
The project is organised around 3 main actions.

* Description of born-digital archives
* Edition of born-digital archives
* Analysis: looking for genetic dossiers

#### Advisory Board

The project is accompanied by an international advisory board. Its members are scholars based at universities and research institutes in Europe and the United States, and their work covers the fields the project draws on: authorial philology and the study of Italian literature, digital scholarly editing and text encoding, born-digital archives and digital forensics, archival science, and computational literary studies.

{{advisory-board}}
