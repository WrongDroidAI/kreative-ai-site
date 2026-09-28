# Agent skills in this repo

Third-party skills are installed as project skills in `.claude/skills/`. Their sources and installed commits are listed in `.claude/vendor/skills.lock`, and `.claude/vendor/update-skills.sh` reinstalls them from upstream.

- Superpowers skills are installed without their plugin prefix: `superpowers:<name>` in their text means the `<name>` skill (for example, `superpowers:brainstorming` is `brainstorming`).
- gstack lives in `.claude/vendor/gstack`. Its skills expect it at `~/.claude/skills/gstack`; in cloud sessions `.claude/hooks/session-start.sh` creates that link. On a computer without that folder, install gstack with its official installer.
- gstack's browser skills (`/browse`, `/qa`, `/qa-only`, `/design-review`, `/scrape` and others) also need gstack's compiled browser tools, which have not been built here.
- None of this is part of the website: the Pages workflow leaves `.claude/` out of the published site.
