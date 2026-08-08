#!/usr/bin/env bash
# think-first 스킬을 ~/.claude/skills/think-first 에 심볼릭 링크로 연결한다.
# 이후에는 이 레포에서 git pull만 하면 최신 버전이 그대로 반영된다.
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
skill_source="$repo_root/.claude/skills/think-first"
skills_dir="$HOME/.claude/skills"
skill_target="$skills_dir/think-first"

mkdir -p "$skills_dir"

if [ -e "$skill_target" ] || [ -L "$skill_target" ]; then
  if [ -L "$skill_target" ]; then
    rm "$skill_target"
  else
    echo "이미 존재하는 폴더/파일이 있어 건드리지 않았습니다: $skill_target"
    echo "직접 확인 후 비우거나 옮긴 뒤 다시 실행해주세요."
    exit 1
  fi
fi

ln -s "$skill_source" "$skill_target"
echo "설치 완료: $skill_target -> $skill_source"
echo "업데이트 받을 때는 이 레포 폴더에서 'git pull'만 하면 됩니다."
