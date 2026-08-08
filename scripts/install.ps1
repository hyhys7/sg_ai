# think-first 스킬을 %USERPROFILE%\.claude\skills\think-first 에 연결한다.
# 이후에는 이 레포 폴더에서 git pull만 하면 최신 버전이 그대로 반영된다.
# 관리자 권한 없이도 되도록 디렉터리 접합(Junction)을 우선 사용하고,
# 그게 안 되면 심볼릭 링크 -> 복사 순서로 대체한다.

$repoRoot = Split-Path -Parent $PSScriptRoot
$skillSource = Join-Path $repoRoot ".claude\skills\think-first"
$skillsDir = Join-Path $HOME ".claude\skills"
$skillTarget = Join-Path $skillsDir "think-first"

if (-not (Test-Path $skillSource)) {
    Write-Host "스킬 소스를 찾을 수 없습니다: $skillSource"
    exit 1
}

if (-not (Test-Path $skillsDir)) {
    New-Item -ItemType Directory -Force -Path $skillsDir | Out-Null
}

if (Test-Path $skillTarget) {
    $item = Get-Item $skillTarget -Force
    if ($item.LinkType -in @("SymbolicLink", "Junction")) {
        Remove-Item $skillTarget -Force -Recurse
    } else {
        Write-Host "이미 존재하는 폴더/파일이 있어 건드리지 않았습니다: $skillTarget"
        Write-Host "직접 확인 후 비우거나 옮긴 뒤 다시 실행해주세요."
        exit 1
    }
}

try {
    New-Item -ItemType Junction -Path $skillTarget -Target $skillSource -ErrorAction Stop | Out-Null
    Write-Host "설치 완료 (Junction): $skillTarget -> $skillSource"
}
catch {
    try {
        New-Item -ItemType SymbolicLink -Path $skillTarget -Target $skillSource -ErrorAction Stop | Out-Null
        Write-Host "설치 완료 (심볼릭 링크): $skillTarget -> $skillSource"
    }
    catch {
        Copy-Item -Path $skillSource -Destination $skillTarget -Recurse
        Write-Host "설치 완료 (복사본, 링크 생성 실패): $skillTarget"
        Write-Host "주의: 링크가 아니라 복사본이라 'git pull'만으로는 갱신되지 않습니다."
        Write-Host "업데이트할 때마다 이 스크립트를 다시 실행해주세요."
    }
}

Write-Host ""
Write-Host "업데이트 받을 때는 이 레포 폴더에서 'git pull'만 하면 됩니다 (링크 방식인 경우)."
