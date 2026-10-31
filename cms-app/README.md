# Jade Share CMS serverless

Deploy this directory as a Vercel project with `cms.jadeshare.space`.

## Required environment variables

- `GITHUB_TOKEN`: fine-grained token with **Contents: Read and write** for only `jadee2811/jadee2811.github.io`.
- `CMS_ACCESS_KEY`: a separate high-entropy password protecting the publish API.

Never commit either value. The server generates an SEO-ready static Blog or Work page and writes it to the website repository. GitHub Pages then deploys it.
