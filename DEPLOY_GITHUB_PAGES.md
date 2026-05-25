# Deploy KUNAKA TECH to GitHub Pages

This folder is ready for static hosting.

## 1) Push to GitHub

If this folder is your repo root:

```powershell
git add .
git commit -m "Prepare site for GitHub Pages"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

If your repo root is one level above and this folder is `KUNAKATECH/`, run from repo root:

```powershell
git add KUNAKATECH
git commit -m "Prepare KUNAKATECH site for GitHub Pages"
git push
```

## 2) Enable GitHub Pages

1. Open your repository on GitHub.
2. Go to Settings -> Pages.
3. Under Build and deployment:
   - Source: Deploy from a branch
   - Branch: `main`
   - Folder:
     - `/ (root)` if this folder is repo root, or
     - `/KUNAKATECH` if publishing from that folder is supported in your repo setup.
4. Save.

If your repo keeps the site inside `KUNAKATECH/` and GitHub Pages only allows root/docs, copy this site to `docs/` or make `KUNAKATECH/` the repository root.

## 3) Verify

- Wait 1-3 minutes for deployment.
- Open: `https://<your-username>.github.io/<your-repo>/`
- Check home video, navigation, and contact form.

## Notes

- `.nojekyll` is included to avoid accidental Jekyll processing.
- Local video/assets are already referenced with relative paths under `assets/`.
