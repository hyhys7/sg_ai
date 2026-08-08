# sg_ai

"먼저, 생각 (Think First)" 프로젝트. AI에게 곧장 답을 구하기 전에, 스스로 생각할 기회를 돌려주는 되묻기 워크플로우입니다.

> 처음엔 Next.js + Gemini 웹서비스로 만들었지만, 멘토 피드백(이미 Claude/GPT에 유사한 접근이 있고, 새 프로덕트보다 기존 AI 위에 스킬을 얹는 방식이 유용성이 크다는 지적)을 받아 **Claude Code 스킬** 방식으로 방향을 바꿨습니다. 아래 웹앱은 데모/참고용으로 남겨둡니다.

## 스킬 (현재 방향)

- **think-first** (v0.1) — 사용자의 요청이 짧고 정리되지 않았을 때, 답을 바로 주지 않고 되물어 생각을 구체화시킨 뒤에만 답하는 스킬. 자세한 내용은 [`.claude/skills/think-first/SKILL.md`](.claude/skills/think-first/SKILL.md) 참고.

### 설치 (처음 한 번)

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

### 업데이트 받기 (동기화)

```bash
cd sg_ai
git pull
```

링크로 연결되어 있어서 `git pull`만 하면 최신 버전이 그대로 반영됩니다. 재설치 필요 없습니다.
(단, 링크 생성이 안 되는 환경에서는 복사본이 설치되며, 이 경우 업데이트할 때마다 설치 스크립트를 다시 실행해야 합니다 — 스크립트가 실행 시 알려줍니다.)

### 권한 구조

- 이 레포는 public이며, **owner(hyhys7)만 push 권한**을 가집니다.
- 누구나 clone/pull로 최신 스킬을 받아갈 수 있지만(read-only), 이 레포에 변경을 반영하려면 owner에게 직접 요청하거나 별도로 PR을 보내야 합니다.

### 버전 규칙

- 1.0 미만은 자기 자신만 쓰는 실험 단계
- 소소한 수정: 0.11, 0.12 ...
- 워크플로우가 완전히 달라지는 변경: 0.2로 승격

변경 시마다 각 스킬의 `SKILL.md` 안 "버전 기록" 섹션에 사유를 남깁니다.

## 데모 웹앱 (참고용, 이전 버전)

멘토에게 리뷰받았던 초기 데모입니다. 같은 되묻기 워크플로우를 Next.js + Gemini로 구현한 웹서비스이며, 지금은 스킬 방향으로 옮겨가는 중이라 유지보수 우선순위는 낮습니다.

- **Why** — 무언가 궁금할 때 바로 AI에게 묻는 것이 습관이 되면서, 스스로 생각해보는 힘과 의지가 점점 줄어드는 현상을 막고 싶다.
- **What** — 사용자가 질문을 던지면 AI는 곧바로 답하지 않고 되묻는다. 대화가 충분히 쌓이면 "답변 받아보기"를 눌러야 AI가 답을 주고, 그 순간 사용자 자신의 생각과 AI 답변을 나란히 비교해서 보여준다. 평가/점수 없음, 회원가입 없이 링크 하나로 사용.
- **기술 스택**: Next.js (Frontend/Server), Gemini API (Google)

### 설치 및 실행

```bash
npm install
```

`.env.local`에 Gemini API 키 설정 ([Google AI Studio](https://aistudio.google.com/apikey)에서 발급):

```bash
GEMINI_API_KEY=your-api-key
```

```bash
npm run dev
```

## 라이선스

MIT
