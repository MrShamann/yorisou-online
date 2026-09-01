#!/usr/bin/env bash
# Lighthouse via the CLI so nothing is added to package.json. Three runs, median reported.
#
# Lighthouse's DEFAULT preset is mobile: a 412x823 screen AND mobile CPU/network throttling. An
# earlier version of this script passed `--preset=desktop` and then re-specified the mobile screen
# flags, which changed the screen but left DESKTOP throttling in place. It reported 100/100/100/100
# — a number that says nothing about a phone. Do not add `--preset` back without meaning it.
set -euo pipefail
TARGET="${1:-http://localhost:3111/}"
OUT="${2:-/tmp/lh}"
mkdir -p "$OUT"
for i in 1 2 3; do
  npx -y lighthouse@12 "$TARGET" \
    --quiet --chrome-flags="--headless=new --no-sandbox" \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json --output-path="$OUT/run$i.json" >/dev/null 2>&1 || echo "run $i failed"
done
node -e '
const fs=require("fs");const out=process.argv[1];
const rows=[1,2,3].map(i=>{try{const j=JSON.parse(fs.readFileSync(`${out}/run${i}.json`,"utf8"));const c=j.categories;
return{p:Math.round(c.performance.score*100),a:Math.round(c.accessibility.score*100),b:Math.round(c["best-practices"].score*100),s:Math.round(c.seo.score*100),
lcp:j.audits["largest-contentful-paint"].numericValue,cls:j.audits["cumulative-layout-shift"].numericValue,tbt:j.audits["total-blocking-time"].numericValue};}catch(e){return null;}}).filter(Boolean);
if(!rows.length){console.log("no lighthouse runs completed");process.exit(1);}
const med=k=>{const v=rows.map(r=>r[k]).sort((x,y)=>x-y);return v[Math.floor(v.length/2)];};
console.log("runs:",rows.map(r=>`${r.p}/${r.a}/${r.b}/${r.s}`).join("  "));
console.log(`median  perf ${med("p")}  a11y ${med("a")}  best-practices ${med("b")}  seo ${med("s")}`);
console.log(`median  LCP ${(med("lcp")/1000).toFixed(2)}s  CLS ${med("cls").toFixed(3)}  TBT ${Math.round(med("tbt"))}ms`);
' "$OUT"
