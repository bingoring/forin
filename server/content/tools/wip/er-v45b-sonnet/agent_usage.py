"""서브에이전트 기록(jsonl)에서 모델·토큰·시간을 뽑는다 (결정 13 실험 기록용).

    python3 agent_usage.py <agent.jsonl> [...]

토큰은 API 호출(message.id)마다 한 번씩만 센다 — 한 응답이 블록마다 줄을 나눠 쓰므로.
주의: 기록에 남는 output_tokens 는 스트리밍 시작 시점 값이라 실제보다 훨씬 작다. 토큰 합계는
Agent 완료 알림의 total_tokens 를 쓰고, 이 스크립트는 모델 확인과 시간(min)에만 쓴다.
"""
import json
import sys
from datetime import datetime


def ts(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00"))


for path in sys.argv[1:]:
    seen, models = {}, set()
    first = last = None
    for line in open(path):
        d = json.loads(line)
        if "timestamp" in d:
            t = ts(d["timestamp"])
            first = first or t
            last = t
        m = d.get("message") or {}
        if m.get("role") == "assistant" and m.get("usage"):
            seen[m.get("id")] = m["usage"]
            models.add(m.get("model"))
    tot = {k: sum(u.get(k, 0) or 0 for u in seen.values())
           for k in ("input_tokens", "cache_creation_input_tokens", "cache_read_input_tokens", "output_tokens")}
    mins = (last - first).total_seconds() / 60 if first else 0
    print(f"{path.split('/')[-1]}: models={sorted(models)} calls={len(seen)} "
          f"in={tot['input_tokens']:,} cache_w={tot['cache_creation_input_tokens']:,} "
          f"cache_r={tot['cache_read_input_tokens']:,} out={tot['output_tokens']:,} "
          f"total={sum(tot.values()):,} min={mins:.0f}")
