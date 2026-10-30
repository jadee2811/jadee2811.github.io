# Jade Share CMS

Static editorial interface for creating Blog and Work drafts.

## Current behaviour

- Rich-text drafting, category, tags, related content and SEO preview.
- Browser-local draft storage while the secure publisher is being connected.
- Public website remains `jadeshare.space`.

## Publishing architecture

The production CMS must use server-side GitHub authorization. It will validate content, generate static Blog/Work pages and SEO files, then commit to this repository for GitHub Pages to deploy. A GitHub credential must never be embedded in this static page.
