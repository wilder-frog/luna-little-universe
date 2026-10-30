# Publish LUNA to GitHub Pages

Prepared on 2026-10-31. The site is not published yet.

## Included photo

Only approved photo #3 (the landscape selfie with both people facing the
camera) is included, as `public/assets/photos/us-together.jpeg`. It appears
in the ending. The other ten slots retain their placeholders. Originals in
Downloads were not modified. No captions or personal writing were changed.

## Account details needed

Git is installed, but no Git author name/email was configured when checked.
The GitHub CLI is not installed. Use Git and GitHub in your browser; no extra
CLI is required. Use your actual GitHub username below and a commit email
from GitHub Settings → Emails (the GitHub-provided no-reply email is fine).

## Publish steps (PowerShell)

1. Sign into GitHub and create an empty **public** repository named
   `luna-little-universe`. Do not initialize it with a README, license, or
   gitignore; this project already contains its files.
2. Open PowerShell in this project. Set your local commit identity:

```powershell
git config user.name "YOUR NAME"
git config user.email "YOUR VERIFIED OR GITHUB NO-REPLY EMAIL"
```

3. Verify and commit the prepared files:

```powershell
npm test
npm run build
git status --short
git add .
git commit -m "LUNA — a little universe for you"
git remote add origin https://github.com/YOUR-USERNAME/luna-little-universe.git
```

4. In the repository, open **Settings → Pages → Build and deployment →
   Source**, and select **GitHub Actions**. The workflow is already included;
   do not replace it with a template. If the empty repository does not yet
   expose Pages settings, push first, enable this setting, then rerun the
   workflow from the Actions tab.
5. Push, completing GitHub sign-in if prompted:

```powershell
git push -u origin main
```

6. Open **Actions → Deploy to GitHub Pages**. Wait for both build and deploy
   to succeed. If the first run happened before Pages was enabled, use
   **Re-run all jobs** after enabling it.
7. Open the deployed URL shown by GitHub. The expected address is
   `https://YOUR-USERNAME.github.io/luna-little-universe/`, but it is not live
   until the deployment succeeds and the address has actually been opened.
8. Check the title screen, start the game, and confirm there are no missing
   assets. Play through to confirm the ending photo opens when clicked.

Official Pages instructions:
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Deliberately awaiting your content

- The ending note remains the original draft in `src/data/finale.js`.
- The playlist URL remains empty in `src/config.js`.
- Love notes and the poem remain unchanged.

These do not prevent publishing. Supply the desired wording and real playlist
link whenever ready. Do not edit or regenerate the poem.

## Repository safeguards

Dependencies, build output, local editor settings, and environment files are
ignored. `.gitattributes` disables line-ending conversion for both poem files,
so Git preserves their exact bytes on Windows and Linux.
