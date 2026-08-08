# sg_ai

Claude Code 스킬 저장소. "먼저, 생각(Think First)" 프로젝트의 실제 구현이 여기 있습니다.

## 스킬 목록

- **think-first** (v0.1) — 사용자의 요청이 짧고 정리되지 않았을 때, 답을 바로 주지 않고 되물어 생각을 구체화시킨 뒤에만 답하는 스킬. 자세한 내용은 [`.claude/skills/think-first/SKILL.md`](.claude/skills/think-first/SKILL.md) 참고.

## 설치 (처음 한 번)

```bash
git clone https://github.com/hyhys7/sg_ai.git
cd sg_ai
```

- macOS / Linux / Git Bash:
  ```bash
  bash scripts/install.sh
  ```
- Windows PowerShell:
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts/install.ps1
  ```

설치 스크립트는 `.claude/skills/think-first`를 `~/.claude/skills/think-first`(사용자 전역 스킬 폴더)에 링크(Junction/심볼릭 링크)로 연결합니다. 이후 Claude Code에서 바로 이 스킬을 쓸 수 있습니다.

## 업데이트 받기 (동기화)

```bash
cd sg_ai
git pull
```

링크로 연결되어 있어서 `git pull`만 하면 최신 버전이 그대로 반영됩니다. 재설치 필요 없습니다.
(단, 링크 생성이 안 되는 환경에서는 복사본이 설치되며, 이 경우 업데이트할 때마다 설치 스크립트를 다시 실행해야 합니다 — 스크립트가 실행 시 알려줍니다.)

## 권한 구조

- 이 레포는 public이며, **owner(hyhys7)만 push 권한**을 가집니다.
- 누구나 clone/pull로 최신 스킬을 받아갈 수 있지만(read-only), 이 레포에 변경을 반영하려면 owner에게 직접 요청하거나 별도로 PR을 보내야 합니다.

## 버전 규칙

- 1.0 미만은 자기 자신만 쓰는 실험 단계
- 소소한 수정: 0.11, 0.12 ...
- 워크플로우가 완전히 달라지는 변경: 0.2로 승격

변경 시마다 각 스킬의 `SKILL.md` 안 "버전 기록" 섹션에 사유를 남깁니다.
