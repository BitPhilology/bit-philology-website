# Writing the content of the website

A guide for the people who write the pages of the Bit Philology website. No programming is needed: the pages are written in a content manager, in the browser.

## How it works

1. The content manager (a "CMS", [Sveltia CMS](https://sveltiacms.app)) is at https://bitphilology.dh.unibe.ch/admin/.
2. You sign in, open a page (or create one), fill in a form and press **Save**.
3. A save is published at once: there are no drafts. The website is rebuilt and the change is online after about a minute.

The pages are kept as files in the repository of the website, on GitHub (`src/content`). The CMS is only a comfortable way of editing them: every save is recorded there, with your name, and can be undone by the maintainer.

## Signing in

You need a GitHub account that can write to the repository `BitPhilology/bit-philology-website`: ask the maintainer to add you.

1. Open https://bitphilology.dh.unibe.ch/admin/ and press **Sign In with GitHub**.
2. The first time, GitHub asks whether the content manager may act for you on public repositories: press **Authorize**.

The browser remembers you, so this is done once per browser. Press **Sign Out**, in the menu of your account, on a computer that is not yours.

If the button does not work, you can sign in with a **personal access token** instead, a password that you create on GitHub: open **Settings → Developer settings → Personal access tokens → Fine-grained tokens**, generate a token for the repository `bit-philology-website` of `BitPhilology` with **Contents** set to **Read and write**, then press **Sign In Using Access Token** in the CMS and paste it. Treat it like a password.

## Creating, editing and deleting a page

The menu on the left lists the sections of the website: **About**, **Events**, **Publications**, **Artifacts** and **Home images**, then two pages that are edited on their own, **About Bit Philology** and **Team**.

| To… | Do this |
| --- | --- |
| create a page | Open its section and press **New**. Fill in the form and press **Save** |
| edit a page | Open its section, click the page, change it and press **Save** |
| delete a page | Open the page and choose **Delete Entry** from its menu |
| edit the About Bit Philology page or the Team page | Click its name in the menu: each is a single page, with its list of people (the advisory board, the members). They are not in the list of **About** |

**The address of a page** comes from its title, when the page is created: "Digital Forensics in the Humanities" becomes `/events/digital-forensics-in-the-humanities/`. You can change it while you create the page (the **Slug** field), and not afterwards: changing the title later does not change the address, so links to the page keep working.

## The fields

Every section shows only the fields it uses. Only the title is required.

| Field | In | What it is |
| --- | --- | --- |
| Title | every page | The title of the page and of its card on the Home page |
| Subtitle | all but publications | A line under the title |
| Keywords | every page | The topics of the page, shown as `#keyword` labels. Three at most |
| Date | every page | `2026-05-08`, or only the year. The day of the event, or when the page or the publication came out |
| Venue, Location | events, publications | The institution, conference or journal; and the room or the city |
| Authors | publications, artifacts | For example `E. Spadini, E. Barchielli` |
| Type of publication | publications | For example `Poster`, `Paper`, `Article` |
| DOI, Download link | publications | The DOI (or its link), and the link to the file to download |
| Kind | artifacts | What kind of object it is, for example `Tool` or `Dataset` |
| Members | the Team page | The people of the team: name, role, affiliation, photo, the size of the photo (large, medium or small), web page |
| Advisory board | the About Bit Philology page | The advisory board: name, affiliation, web page |
| Text | every page | The text of the page |
| Position on the Home page | every page | The place of the card in the Home grid (see below) |
| Hide from the Home page | every page | Switch it on for a page without a card on the Home page, such as the credits |
| Position in the About menu | About pages, Team | The place of the page in the About menu of the navigation: `1` is the first. Empty: after the numbered pages, newest first |

## Writing the text

The **Text** field opens in a visual editor, with a toolbar for headings, bold, links, lists and images. The text is saved as Markdown: the button with the Markdown sign, at the right end of the toolbar, shows it as plain Markdown and back. Some things can only be typed as they are, in either view: `[no-lead]`, the notes and the lines for the lists of people (see below).

- **First paragraph.** It is the lead of the page and is shown bigger than the others. To have a normal first paragraph, start it with `[no-lead]`.
- **Headings.** Use the headings of the toolbar (in Markdown, `###` or `####`) for the sections of the page: the title of the page comes from the Title field, never from a `#` heading.
- **Images.** Put the cursor on an empty line and press the image button of the toolbar. Choose the file on your computer, and write its description and its title. The CMS uploads the file next to the page when you save, renamed without spaces, accents or capital letters; in Markdown the image is a line like `![A hand-drawn map of the archive](./assets/map.png "The archive in 1998")`. An image can only be uploaded in the visual editor: in the Markdown view the image button writes an empty `![]()`.

  The description, between the square brackets, is read aloud to people who cannot see the image: always write it. The title, between the quotes, is the caption shown beside the image; it can be left out. An image on a line of its own is shown large, in a frame. Do not link to an image that is on another website: the link would break as soon as that website changes.
- **Notes.** Write `[^a-label]` in the text where the note is called, and the note as a paragraph of its own, anywhere in the text: `[^a-label]: The text of the note.` The website numbers the notes and shows them beside the text.
- **Lists of people.** `{{team}}` on a line of its own shows the Members at that point of the page; `{{advisory-board}}` shows the Advisory board. Move the line to move the list. Do not delete the line while the list has entries, and do not empty the list while the line is there.

## The Home page

Every page has a card on the Home page. The card of an About, Team or Artifact page shows the first paragraph of its text.

- **Order.** Without a position, the cards follow their date, newest first. Position `1` is the first tile of the grid, `2` the second, and so on; `-1` is the last tile. Several pages with `-1` all go to the bottom. `0` is not a position.
- **Hiding a card.** "Hide from the Home page" leaves the page out of the Home page. The page keeps its address and stays in the list of its section in the navigation.
- **Images of the grid.** The image tiles between the cards are in **Home images**: a name, a colour (the one of a section), a position, one image and its description. Two images cannot have the same position.
- **The credits page.** The About page titled `Credits`, hidden from the Home page. The "Credits" link at the bottom of every page appears when this page exists.

## When a change does not show up

A save is online after about a minute. If it is not, the website could not be built from the new content, and it stays as it was before your save. The usual reasons:

- a position of `0`;
- two Home images with the same position;
- `{{team}}` or `{{advisory-board}}` in a text whose list is empty, written twice, or not on a line of its own.

Fix the page and save again. The maintainer can see the exact reason on GitHub, in the **Actions** tab of the repository.
