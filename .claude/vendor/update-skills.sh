#!/usr/bin/env bash
# Install or update the third-party agent skills in .claude/skills.
#
# Each skill pack is copied from its upstream GitHub repo (latest default
# branch). Skills a pack installed last time are removed first, so skills
# dropped upstream disappear too. The installed commits are written to
# .claude/vendor/skills.lock.
#
# Usage:  .claude/vendor/update-skills.sh
#         SKILLS_SRC=/path/to/clones .claude/vendor/update-skills.sh
#           (reuse existing clones laid out as <owner>/<repo> instead of cloning)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SKILLS="$ROOT/.claude/skills"
VENDOR="$ROOT/.claude/vendor"
LOCK="$VENDOR/skills.lock"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$SKILLS" "$VENDOR/licenses"

# Remove the skills recorded in the previous lock file.
if [ -f "$LOCK" ]; then
  grep -v '^#' "$LOCK" | while read -r _pack _repo _commit skills; do
    for s in ${skills//,/ }; do rm -rf "${SKILLS:?}/$s"; done
  done
fi

LOCK_TMP="$TMP/skills.lock"
{
  echo "# Written by update-skills.sh. Columns: pack repo commit skills"
  echo "# Installed $(date -u +%Y-%m-%d)"
} > "$LOCK_TMP"

# fetch <owner/repo>: prints the path of a checkout of that repo.
fetch() {
  local repo="$1" dir
  if [ -n "${SKILLS_SRC:-}" ] && [ -d "$SKILLS_SRC/$repo/.git" ]; then
    echo "$SKILLS_SRC/$repo"
    return
  fi
  dir="$TMP/src/$repo"
  GIT_LFS_SKIP_SMUDGE=1 git clone --quiet --depth 1 "https://github.com/$repo" "$dir"
  echo "$dir"
}

# copy_skill <src dir> <name>: installs one skill folder.
copy_skill() {
  rm -rf "${SKILLS:?}/$2"
  cp -a "$1" "$SKILLS/$2"
  find "$SKILLS/$2" \( -name __pycache__ -o -name node_modules -o -name .DS_Store \) -prune -exec rm -rf {} +
}

# keep_license <pack> <src dir> <files...>: stores the pack's license files.
keep_license() {
  local pack="$1" src="$2"; shift 2
  rm -rf "$VENDOR/licenses/$pack"
  mkdir -p "$VENDOR/licenses/$pack"
  for f in "$@"; do
    [ -f "$src/$f" ] && cp "$src/$f" "$VENDOR/licenses/$pack/"
  done
  return 0
}

# record <pack> <repo> <src dir> <skills...>
record() {
  local pack="$1" repo="$2" src="$3"; shift 3
  local IFS=,
  echo "$pack $repo $(git -C "$src" rev-parse --short=12 HEAD) $*" >> "$LOCK_TMP"
  echo "  $pack: $# skill(s)"
}

# Every subfolder of <dir> that holds a SKILL.md.
skill_dirs() {
  local d
  for d in "$1"/*/; do
    [ -f "$d/SKILL.md" ] && [ ! -L "${d%/}" ] && basename "$d"
  done
  return 0
}

echo "Installing skills into $SKILLS"

# 1. Humanizer: the repo root is the skill.
src="$(fetch blader/humanizer)"
mkdir -p "$SKILLS/humanizer"
cp "$src/SKILL.md" "$SKILLS/humanizer/SKILL.md"
keep_license humanizer "$src" LICENSE
record humanizer blader/humanizer "$src" humanizer

# 2. Remotion: all skills in skills/.
src="$(fetch remotion-dev/skills)"
names=()
for s in $(skill_dirs "$src/skills"); do copy_skill "$src/skills/$s" "$s"; names+=("$s"); done
record remotion remotion-dev/skills "$src" "${names[@]}"

# 3. Watch videos (claude-video): only the skill, not the plugin hook.
src="$(fetch bradautomates/claude-video)"
copy_skill "$src/skills/watch" watch
rm -f "$SKILLS/watch/scripts/build-skill.sh"   # dev-only, points outside the skill
keep_license watch "$src" LICENSE
record watch bradautomates/claude-video "$src" watch

# 4. Superpowers: all skills in skills/, plus the plugin's SessionStart hook,
# which loads using-superpowers into every session (see .claude/settings.json).
src="$(fetch obra/superpowers)"
names=()
for s in $(skill_dirs "$src/skills"); do copy_skill "$src/skills/$s" "$s"; names+=("$s"); done
mkdir -p "$ROOT/.claude/hooks"
cp "$src/hooks/session-start" "$ROOT/.claude/hooks/superpowers-session-start"
chmod +x "$ROOT/.claude/hooks/superpowers-session-start"
keep_license superpowers "$src" LICENSE
record superpowers obra/superpowers "$src" "${names[@]}"

# 5. Impeccable: the Claude Code build of the skill and its subagents.
src="$(fetch pbakaus/impeccable)"
copy_skill "$src/.claude/skills/impeccable" impeccable
mkdir -p "$ROOT/.claude/agents"
rm -f "$ROOT"/.claude/agents/impeccable-*.md
cp "$src"/.claude/agents/impeccable-*.md "$ROOT/.claude/agents/"
keep_license impeccable "$src" LICENSE NOTICE.md
record impeccable pbakaus/impeccable "$src" impeccable

# 6. Last 30 Days, without its 14 MB of demo media (unused at runtime).
src="$(fetch mvanhorn/last30days-skill)"
copy_skill "$src/skills/last30days" last30days
rm -rf "$SKILLS/last30days/assets" "$SKILLS/last30days/agents"
keep_license last30days "$src" LICENSE
record last30days mvanhorn/last30days-skill "$src" last30days

# 7. SkillSpector: the skill-inspector skill (the scanner CLI is installed separately).
src="$(fetch nvidia/skillspector)"
copy_skill "$src/skills/skill-inspector" skill-inspector
keep_license skillspector "$src" LICENSE THIRD_PARTY_NOTICES.md
record skillspector nvidia/skillspector "$src" skill-inspector

# 8. HyperFrames: the user-facing skills in skills/ (they reference each other,
# so they keep their upstream names).
src="$(fetch heygen-com/hyperframes)"
names=()
for s in $(skill_dirs "$src/skills"); do copy_skill "$src/skills/$s" "$s"; names+=("$s"); done
keep_license hyperframes "$src" LICENSE CREDITS.md
record hyperframes heygen-com/hyperframes "$src" "${names[@]}"

# 9. gstack: a trimmed copy lives in .claude/vendor/gstack. Like gstack's own
# ./setup, each skill gets a folder in .claude/skills whose entries are
# symlinks into that copy. The skills expect ~/.claude/skills/gstack, which
# .claude/hooks/session-start.sh links to the copy in cloud sessions.
src="$(fetch garrytan/gstack)"
rm -rf "$VENDOR/gstack"
mkdir -p "$VENDOR/gstack"
tar -C "$src" -cf - \
  --exclude=./.git --exclude=./.github --exclude=./test --exclude=./browse/test \
  --exclude=./CHANGELOG.md --exclude=./TODOS.md --exclude=node_modules --exclude=dist \
  --exclude=./docs . | tar -C "$VENDOR/gstack" -xf -
mkdir -p "$VENDOR/gstack/docs"
cp "$src"/docs/askuserquestion-*.md "$VENDOR/gstack/docs/" 2>/dev/null || true
# lib/diagram-render ships its built bundle in dist/, which the tar above skips.
if [ -d "$src/lib/diagram-render/dist" ]; then
  mkdir -p "$VENDOR/gstack/lib/diagram-render"
  cp -a "$src/lib/diagram-render/dist" "$VENDOR/gstack/lib/diagram-render/"
fi
names=()
for d in $(skill_dirs "$VENDOR/gstack"); do
  name="$(sed -n 's/^name:[[:space:]]*//p' "$VENDOR/gstack/$d/SKILL.md" | head -1 | tr -d '[:space:]')"
  name="${name:-$d}"
  rm -rf "${SKILLS:?}/$name"
  mkdir -p "$SKILLS/$name"
  for entry in "$VENDOR/gstack/$d"/*; do
    base="$(basename "$entry")"
    case "$base" in node_modules|dist|test|*.tmpl) continue ;; esac
    ln -s "../../vendor/gstack/$d/$base" "$SKILLS/$name/$base"
  done
  names+=("$name")
done
# The suite's router skill is the gstack root SKILL.md.
mkdir -p "$SKILLS/gstack"
ln -s ../../vendor/gstack/SKILL.md "$SKILLS/gstack/SKILL.md"
names+=(gstack)
record gstack garrytan/gstack "$src" "${names[@]}"

mv "$LOCK_TMP" "$LOCK"
echo "Done. Installed commits are in ${LOCK#"$ROOT"/}."
