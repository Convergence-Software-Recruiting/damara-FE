/**
 * 아이콘 제거 후 깨진 삼항 연산자 패턴 수정
 * {expr ?  : }  →  {expr ? null : null}
 * {expr ?  : <Something>}  →  {expr ? null : <Something>}
 * 기타 빈 JSX 표현식 정리
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "src");

function walk(dir) {
  const result = [];
  for (const item of fs.readdirSync(dir)) {
    if (["node_modules", ".git", "dist"].includes(item)) continue;
    const p = path.join(dir, item);
    if (fs.statSync(p).isDirectory()) result.push(...walk(p));
    else if (/\.(tsx|ts)$/.test(item) && !item.endsWith(".d.ts"))
      result.push(p);
  }
  return result;
}

function processFile(filePath) {
  let code = fs.readFileSync(filePath, "utf8");
  const original = code;

  // {expr ?  :  }  →  null (전체 삼항 제거)
  // 패턴: 삼항의 양쪽이 모두 비어있을 때
  code = code.replace(/\{\s*[^{}?:]+\?\s*:\s*\}/g, "");

  // {expr ?  : <something>}  →  <something>
  // 삼항의 true 브랜치가 비어있을 때
  code = code.replace(/\{[^{}?:]+\?\s*:\s*(<[^}]+>)\s*\}/g, "$1");

  // {expr ? <something> : }  →  삼항 조건이 있을 때 true 브랜치만
  code = code.replace(/\{([^{}?:]+)\?\s*(<[^>]+\/?>)\s*:\s*\}/g, "{$1 && $2}");

  // 완전히 빈 JSX 표현식 {} (아무것도 없는 것)
  // 단독으로 줄에 있는 경우만
  code = code.replace(/^\s*\{\s*\}\s*$/gm, "");

  // Loader2 같은 조건부 렌더링 패턴:
  // {loading ? (<><이미지제거된빈fragment/> 텍스트</>) : ("버튼텍스트")}
  // 복잡한 케이스는 빌드 에러 위치로 찾아 수동 처리

  if (code !== original) {
    fs.writeFileSync(filePath, code, "utf8");
    return true;
  }
  return false;
}

const files = walk(ROOT).filter(f =>
  /\.(tsx|ts)$/.test(f) && !f.endsWith(".d.ts")
);

let count = 0;
for (const f of files) {
  if (processFile(f)) {
    count++;
    console.log("FIX " + f.replace(ROOT, "").replace(/\\/g, "/"));
  }
}
console.log(`\n완료: ${count}개 파일 수정`);
