import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages:
//  - The included GitHub Actions workflow sets BASE_PATH to "/<repo-name>/" automatically.
//  - For a user site (repo named "<username>.github.io"), BASE_PATH should be "/".
//  - Locally (and as a fallback) a relative base "./" works because the site is a
//    single page that navigates with section anchors, not a client-side router.
export default defineConfig({
  base: process.env.BASE_PATH || './',
  plugins: [react()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
})
