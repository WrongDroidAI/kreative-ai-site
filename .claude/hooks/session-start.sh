#!/bin/bash
# SessionStart hook for Claude Code on the web.
#
# Cloud sessions start with an empty home directory, so this sets up the
# parts of the vendored skills (.claude/skills, .claude/vendor) that expect
# files outside the repo. It does nothing on your own computer.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

PROJECT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
GSTACK="$PROJECT/.claude/vendor/gstack"

# gstack's skills run everything from ~/.claude/skills/gstack.
mkdir -p "$HOME/.claude/skills"
if [ ! -e "$HOME/.claude/skills/gstack" ]; then
  ln -s "$GSTACK" "$HOME/.claude/skills/gstack"
fi

# gstack keeps its settings in ~/.gstack, which is empty in every new cloud
# session. Answer its one-time questions here so they are not asked each time.
if [ ! -f "$HOME/.gstack/config.yaml" ]; then
  cfg="$GSTACK/bin/gstack-config"
  "$cfg" set telemetry off
  "$cfg" set update_check false   # updates come from .claude/vendor/update-skills.sh
  "$cfg" set auto_upgrade false
  "$cfg" set routing_declined true
  "$cfg" set cross_project_learnings false
  for marker in .telemetry-prompted .proactive-prompted .completeness-intro-seen \
                .writing-style-prompted .feature-prompted-model-overlay; do
    touch "$HOME/.gstack/$marker"
  done
fi

# Last 30 Days: skip its setup wizard (it would rerun every session) and turn
# off browser-cookie lookups, since there is no browser of yours here.
L30="$HOME/.config/last30days/.env"
if [ ! -f "$L30" ]; then
  mkdir -p "$(dirname "$L30")"
  printf 'SETUP_COMPLETE=true\nFROM_BROWSER=off\nAGENTCOOKIE=off\n' > "$L30"
  chmod 600 "$L30"
fi
