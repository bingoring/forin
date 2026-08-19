#!/usr/bin/env python3
"""Build the app-introduction page: what forin is, screen by screen.

The screens are RECONSTRUCTIONS, not screenshots. This environment has no simulator
and cannot render React Native, so every frame here is HTML rebuilt from the real
sources — the palette from theme/tokens.ts, the layout from the components, and the
actual pixel fonts subsetted out of assets/fonts. The page says so, in the page.

Generated rather than hand-written so it can be regenerated when the palette moves:
the colours below are read out of tokens.ts, not retyped.
"""
import base64
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "scripts" / "out" / "showcase.html"
CHARS = Path("/tmp/subset_chars.txt")


def palette() -> dict:
    """Colour tokens, read from the app rather than copied."""
    src = (ROOT / "src" / "theme" / "tokens.ts").read_text(encoding="utf-8")
    want = ("mint", "mintShadow", "peach", "peachShadow", "yellow", "yellowDeep",
            "yellowShadow", "cream", "paper", "ink", "pink", "blue", "red", "lilac",
            "text", "textSoft", "textFaint")
    out = {}
    for k in want:
        m = re.search(rf"^\s*{k}:\s*'(#[0-9A-Fa-f]{{3,8}})'", src, re.M)
        if m:
            out[k] = m.group(1)
    missing = [k for k in want if k not in out]
    if missing:
        raise SystemExit(f"tokens.ts: could not read {missing} — palette drifted, fix the regex")
    return out


def font(path: str) -> str:
    return base64.b64encode((ROOT / "scripts" / "out" / path).read_bytes()).decode()


def main() -> None:
    c = palette()
    html = TEMPLATE
    for k, v in c.items():
        html = html.replace(f"__{k}__", v)
    html = html.replace("__DGM__", font("dgm-sub.ttf")).replace("__GAL__", font("gal-sub.ttf"))
    if "__" in re.sub(r"__(DGM|GAL)__", "", html):
        leftover = set(re.findall(r"__[a-zA-Z]+__", html))
        raise SystemExit(f"unsubstituted placeholders: {leftover}")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html, encoding="utf-8")
    print(f"{OUT}  ·  {len(html) // 1024} KB")


TEMPLATE = r"""<title>forin 화면 소개</title>
<style>
  @font-face { font-family: 'DGM'; src: url(data:font/ttf;base64,__DGM__) format('truetype'); font-display: swap; }
  @font-face { font-family: 'Galmuri'; src: url(data:font/ttf;base64,__GAL__) format('truetype'); font-display: swap; }

  :root {
    --ink: __ink__; --paper: __paper__; --cream: __cream__;
    --mint: __mint__; --mintShadow: __mintShadow__;
    --peach: __peach__; --peachShadow: __peachShadow__;
    --yellow: __yellow__; --yellowDeep: __yellowDeep__; --yellowShadow: __yellowShadow__;
    --pink: __pink__; --blue: __blue__; --red: __red__; --lilac: __lilac__;
    --text: __text__; --soft: __textSoft__; --faint: __textFaint__;
    --page: #EFE7D6; --panel: __cream__;
  }
  /* The app itself has one visual world — a lit pixel ward — and it does not have a
     dark mode. Inventing one for the introduction would show a product that does not
     exist, so the page commits to the app's own palette and paints every colour
     explicitly so it holds on either host background. */
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) { --page: #241F1A; --panel: #2E2823; }
  }
  :root[data-theme="dark"] { --page: #241F1A; --panel: #2E2823; }

  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--page); color: var(--ink);
    font: 15px/1.65 'Galmuri', ui-monospace, Menlo, monospace;
    -webkit-font-smoothing: none; font-smooth: never;
  }
  .wrap { max-width: 1180px; margin: 0 auto; padding: 0 20px 80px; }

  header { padding: 64px 0 8px; }
  .eyebrow { font-family: 'DGM'; font-size: 12px; letter-spacing: .22em; color: var(--soft); }
  h1 { font-family: 'DGM'; font-size: clamp(30px, 6vw, 52px); margin: 12px 0 0; line-height: 1.15; text-wrap: balance; }
  .lede { max-width: 62ch; margin: 18px 0 0; font-size: 16px; color: var(--text); }
  .lede b { font-family: 'DGM'; font-weight: normal; background: var(--yellow); padding: 0 3px; }

  .disclaimer {
    margin: 28px 0 0; padding: 13px 15px; background: var(--panel);
    border: 3px solid var(--ink); box-shadow: 5px 5px 0 var(--ink);
    max-width: 68ch; font-size: 13.5px; line-height: 1.6;
  }
  .disclaimer strong { font-family: 'DGM'; font-weight: normal; }

  .facts { display: flex; flex-wrap: wrap; gap: 8px; margin: 30px 0 0; }
  .fact {
    font-family: 'DGM'; font-size: 12px; background: var(--panel);
    border: 2px solid var(--ink); padding: 5px 9px; box-shadow: 3px 3px 0 var(--ink);
  }
  .fact b { color: var(--ink); font-weight: normal; }

  h2 {
    font-family: 'DGM'; font-size: 20px; margin: 66px 0 6px;
    padding-bottom: 8px; border-bottom: 3px solid var(--ink);
  }
  h2 .n { color: var(--soft); margin-right: 10px; }
  .note { max-width: 66ch; margin: 0 0 22px; font-size: 14.5px; color: var(--text); }

  .row { display: grid; grid-template-columns: repeat(auto-fit, minmax(288px, 1fr)); gap: 26px; align-items: start; }

  /* ── phone frame ─────────────────────────────────────────────────────────── */
  .phone {
    width: 288px; background: var(--paper); border: 4px solid var(--ink);
    box-shadow: 8px 8px 0 var(--ink); overflow: hidden; color: var(--ink);
  }
  .phone .cap { font-family: 'DGM'; font-size: 10px; letter-spacing: .1em; background: var(--ink); color: var(--cream); padding: 4px 8px; }
  .scr { padding: 12px; display: flex; flex-direction: column; gap: 9px; min-height: 420px; }
  .tabs { display: flex; border-top: 3px solid var(--ink); background: var(--cream); }
  .tabs div { flex: 1; text-align: center; font-family: 'DGM'; font-size: 9px; padding: 7px 0; color: var(--faint); }
  .tabs .on { color: var(--ink); background: var(--paper); }

  /* pixel card: a solid offset shadow, never blurred (tokens.ts §hard shadow) */
  .card { border: 3px solid var(--ink); background: #fff; padding: 10px; box-shadow: 4px 4px 0 var(--ink); position: relative; }
  .card.mint { background: var(--mint); box-shadow: 4px 4px 0 var(--mintShadow); }
  .card.cream { background: var(--cream); }
  .card.peach { background: var(--peach); }
  .card.blue { background: var(--blue); }
  .card.lilac { background: var(--lilac); }
  .tag {
    position: absolute; top: -9px; left: 10px; background: var(--ink); color: var(--cream);
    font-family: 'DGM'; font-size: 8.5px; padding: 2px 6px;
  }
  .hd { font-family: 'DGM'; font-size: 13px; }
  .sm { font-size: 11px; color: var(--soft); }
  .xs { font-family: 'DGM'; font-size: 9px; color: var(--soft); }
  .btn {
    font-family: 'DGM'; font-size: 12px; background: var(--ink); color: var(--cream);
    border: 3px solid var(--ink); padding: 8px; text-align: center;
  }
  .btn.y { background: var(--yellow); color: var(--ink); box-shadow: 3px 3px 0 var(--yellowShadow); }
  .btn.m { background: var(--mint); color: var(--ink); box-shadow: 3px 3px 0 var(--mintShadow); }
  .chip { font-family: 'DGM'; font-size: 9px; border: 2px solid var(--ink); padding: 1px 5px; display: inline-block; }
  .strip { display: flex; gap: 3px; }
  .strip i { width: 14px; height: 16px; border: 2px solid var(--ink); background: #fff; }
  .strip i.f { background: var(--mintShadow); }
  .strip i.t { background: var(--yellow); }
  .bar { height: 11px; border: 2px solid var(--ink); background: #fff; position: relative; }
  .bar span { position: absolute; inset: 0 auto 0 0; background: var(--mintShadow); }
  .rowline { display: flex; align-items: center; gap: 7px; }
  .grow { flex: 1; min-width: 0; }
  .bub { border: 2.5px solid var(--ink); padding: 7px 9px; font-size: 11.5px; max-width: 78%; }
  .bub.npc { background: #fff; align-self: flex-start; }
  .bub.me { background: var(--mint); align-self: flex-end; }
  .syl { display: flex; flex-wrap: wrap; gap: 3px; }
  .syl b { font-family: 'DGM'; font-weight: normal; font-size: 10px; border: 2px solid var(--ink); padding: 2px 5px; }
  .face {
    width: 58px; height: 68px; border: 3px solid var(--ink); background: var(--peach);
    position: relative; overflow: hidden; flex: none;
  }
  .face .hair { position: absolute; left: 8px; right: 8px; top: 8px; height: 15px; background: #3C2A18; }
  .face .head { position: absolute; left: 12px; right: 12px; top: 20px; bottom: 12px; background: #F8D7B2; }
  .face .eye { position: absolute; top: 32px; width: 5px; height: 5px; background: var(--ink); }
  .face .eye.l { left: 18px; } .face .eye.r { right: 18px; }
  .face .mouth { position: absolute; left: 24px; top: 46px; width: 10px; height: 3px; background: var(--ink); }
  .face .body { position: absolute; left: 8px; right: 8px; bottom: 0; height: 12px; background: var(--mint); }

  footer { margin-top: 76px; padding-top: 18px; border-top: 3px solid var(--ink); font-size: 13px; color: var(--soft); }
  code { font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; background: var(--panel); border: 1px solid var(--ink); padding: 0 3px; }
  a { color: var(--ink); text-decoration-thickness: 2px; text-underline-offset: 3px; }
</style>

<div class="wrap">
<header>
  <div class="eyebrow">MOBILE · GAME-SHAPED LANGUAGE LEARNING</div>
  <h1>forin</h1>
  <p class="lede">
    미국 취업을 준비하는 간호사를 위한 임상 영어 앱. 교재를 읽는 앱이 아니라,
    픽셀아트 병동을 걸어 들어가 <b>환자·동료와 AI 역할극으로 실제 대화</b>하고,
    말한 문장을 <b>발음 채점</b>받고, 틀린 표현이 <b>복습 카드</b>로 돌아온다.
  </p>

  <div class="disclaimer">
    <strong>이 페이지의 화면은 재구성입니다 — 실제 캡처가 아닙니다.</strong><br />
    생성 환경에 시뮬레이터가 없어 React Native를 렌더할 수 없습니다. 그래서 각 프레임은
    앱의 실제 소스에서 다시 그린 HTML입니다: 색은 <code>theme/tokens.ts</code>에서 읽었고,
    레이아웃은 해당 컴포넌트를 따랐고, 글꼴은 <code>assets/fonts</code>의 DungGeunMo·Galmuri11을
    이 페이지에 쓰인 354자만 서브셋해 실제로 심었습니다. 픽셀 캐릭터는 앱에서 SVG로 그려지므로
    여기서는 단순화된 대역입니다.
  </div>

  <div class="facts">
    <span class="fact">건물 <b>5</b> · 층 <b>24</b></span>
    <span class="fact">걸어다닐 부서 <b>27</b></span>
    <span class="fact">커리큘럼 <b>89</b></span>
    <span class="fact">시나리오 <b>3,203</b></span>
    <span class="fact">퀴즈 <b>993</b></span>
    <span class="fact">퀴즈 유형 <b>14</b></span>
    <span class="fact">UI 언어 <b>4</b></span>
    <span class="fact">테스트 <b>298</b> + 스모크 <b>98</b></span>
  </div>
</header>

<h2><span class="n">01</span>첫 화면 — 누를 것이 하나다</h2>
<p class="note">
  아무것도 클리어하지 않은 사용자에게는 순서를 뒤집는다. 성취를 과제보다 먼저 보여주는 게
  기본값이지만, 신규 사용자에게는 성취가 없어서 <b>빈 10일 스트립</b>이 첫 화면을 차지하고
  눌러야 할 하나가 아래로 밀린다. 그래서 첫 실행에는 과제가 먼저 온다.
</p>
<div class="row">
  <div>
    <div class="phone">
      <div class="cap">첫 실행 · 홈</div>
      <div class="scr">
        <div class="rowline">
          <div class="grow">
            <div class="xs">8월 19일 수요일</div>
            <div class="hd" style="font-size:16px;margin-top:4px">천천히 시작해요</div>
          </div>
          <div class="face"><div class="hair"></div><div class="head"></div><div class="eye l"></div><div class="eye r"></div><div class="mouth"></div><div class="body"></div></div>
        </div>
        <div class="card mint" style="margin-top:8px">
          <div class="tag">여기서 시작</div>
          <div class="rowline" style="margin-top:3px">
            <div class="chip" style="background:#fff">말</div>
            <div class="grow">
              <div class="xs" style="color:var(--ink);opacity:.75">본관 1F 응급의료센터 · 첫 출근 · 인계받기</div>
              <div class="hd">첫 출근 · 자기소개</div>
            </div>
          </div>
          <div class="sm" style="color:var(--ink);opacity:.8;margin-top:8px">
            환자·동료와 영어로 대화해요. 가장 쉬운 것부터 시작하니 틀려도 괜찮아요.
          </div>
          <div class="btn" style="margin-top:10px">▶ 첫 대화 시작하기</div>
        </div>
        <div class="rowline" style="gap:8px;margin-top:4px">
          <div class="card" style="flex:1;padding:8px"><div class="hd" style="font-size:11px">둘러보기</div><div class="xs">건물·층에서<br />원하는 과 고르기</div></div>
          <div class="card blue" style="flex:1;padding:8px"><div class="hd" style="font-size:11px">오늘의 상황</div><div class="xs">지금 벌어진 일<br />3건 대기중</div></div>
        </div>
      </div>
      <div class="tabs"><div class="on">홈</div><div>커리어</div><div>상황판</div><div>리뷰랩</div><div>프로필</div></div>
    </div>
  </div>
  <div>
    <div class="phone">
      <div class="cap">이후 · 홈</div>
      <div class="scr">
        <div class="rowline">
          <div class="grow"><div class="xs">8월 19일 수요일</div><div class="hd" style="font-size:16px;margin-top:4px">오늘 몫은 끝냈어요</div></div>
          <div class="face"><div class="hair"></div><div class="head"></div><div class="eye l"></div><div class="eye r"></div><div class="mouth"></div><div class="body"></div></div>
        </div>
        <div class="card cream">
          <div class="rowline"><div class="hd" style="font-size:11px">7일 연속</div><div class="grow"></div><div class="xs">최근 10일</div></div>
          <div class="strip" style="margin-top:7px">
            <i class="f"></i><i class="f"></i><i></i><i class="f"></i><i class="f"></i><i class="f"></i><i class="f"></i><i class="f"></i><i class="f"></i><i class="t"></i>
          </div>
        </div>
        <div class="card mint">
          <div class="tag">오늘의 한 가지</div>
          <div class="rowline" style="margin-top:3px">
            <div class="chip" style="background:#fff">말</div>
            <div class="grow"><div class="xs" style="color:var(--ink);opacity:.75">본관 8F 내과 병동 · 만성질환 교육</div><div class="hd">혈당 변동 설명</div></div>
          </div>
          <div class="btn" style="margin-top:10px">▶ 시작하기</div>
        </div>
        <div class="card peach"><div class="xs">멘토 쪽지</div><div class="sm" style="color:var(--ink);margin-top:3px">인계할 때 숫자를 먼저 말하면 상대가 훨씬 편해요.</div></div>
      </div>
      <div class="tabs"><div class="on">홈</div><div>커리어</div><div>상황판</div><div>리뷰랩</div><div>프로필</div></div>
    </div>
  </div>
</div>

<h2><span class="n">02</span>커리어 — 건물 → 층 → 커리큘럼</h2>
<p class="note">
  탭이 둘로 갈려 있었다: 챕터 25행 로드맵과, 그 챕터를 가리키는 층 목록. 같은 길을 두 언어로
  두 번 보여주고 있었고 층 목록은 서버와 어긋나 있었다. 하나의 계층으로 합쳤고, <b>계층이 곧
  로드맵</b>이다. 자물쇠는 그리지 않는다 — 층과 커리큘럼은 전부 열려 있고 순차는 스텝에만 있다.
</p>
<div class="row">
  <div>
    <div class="phone">
      <div class="cap">커리어 탭</div>
      <div class="scr">
        <div class="rowline"><div class="hd" style="font-size:15px">커리어</div><div class="chip" style="background:var(--mint)">Lv.B1</div><div class="grow"></div><div class="xs">7일 연속</div></div>
        <div class="card mint">
          <div class="tag">이어하기</div>
          <div class="xs" style="color:var(--ink);opacity:.75;margin-top:3px">본관 8F 일반 내과 병동</div>
          <div class="hd" style="margin-top:2px">만성질환 교육</div>
          <div class="bar" style="margin-top:7px"><span style="width:50%"></span></div>
          <div class="rowline" style="margin-top:8px"><div class="sm grow" style="color:var(--ink)">다음 · 혈당 변동 설명</div><div class="btn" style="padding:5px 9px;font-size:11px">▶ 이어하기</div></div>
        </div>
        <div class="card" style="padding:0">
          <div class="rowline" style="background:var(--cream);border-bottom:2.5px solid var(--ink);padding:8px 9px">
            <div class="chip" style="background:var(--red)">본</div>
            <div class="grow"><div class="hd" style="font-size:12px">본관</div><div class="xs">응급 · 수술 · 중환자 · 병동</div></div>
            <div class="xs">7/29</div>
          </div>
          <div style="padding:8px 9px;border-bottom:1.5px dotted var(--ink)">
            <div class="rowline"><div class="chip" style="background:var(--ink);color:var(--cream)">1F</div>
              <div class="grow"><div class="sm" style="color:var(--ink)">응급의료센터</div>
                <div class="strip" style="margin-top:4px"><i class="f" style="width:9px;height:9px"></i><i class="f" style="width:9px;height:9px"></i><i style="width:9px;height:9px"></i><i style="width:9px;height:9px"></i><i style="width:9px;height:9px"></i></div>
              </div><div class="xs">커리큘럼 5</div></div>
          </div>
          <div style="padding:8px 9px;background:var(--paper)">
            <div class="rowline"><div class="chip" style="background:var(--ink);color:var(--cream)">8F</div>
              <div class="grow"><div class="sm" style="color:var(--ink)">일반 내과 병동</div></div><div class="xs">커리큘럼 3</div></div>
            <div style="margin-top:7px;display:flex;flex-direction:column;gap:5px">
              <div class="rowline" style="border:2px solid var(--ink);background:var(--mint);padding:6px 8px"><div class="grow"><div class="hd" style="font-size:11px">입원 첫날</div></div><div class="xs" style="color:var(--ink)">3/3</div></div>
              <div class="rowline" style="border:3px solid var(--yellowDeep);background:var(--paper);padding:6px 8px"><div class="grow"><div class="hd" style="font-size:11px">만성질환 교육</div><div class="xs">다음 · 혈당 변동 설명</div></div><div class="chip" style="background:var(--yellowDeep)">NOW</div></div>
              <div class="rowline" style="border:2px solid var(--ink);background:#fff;padding:6px 8px"><div class="grow"><div class="hd" style="font-size:11px">악화와 인계</div></div><div class="xs">0/3</div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="tabs"><div>홈</div><div class="on">커리어</div><div>상황판</div><div>리뷰랩</div><div>프로필</div></div>
    </div>
  </div>
  <div>
    <div class="phone">
      <div class="cap">커리큘럼 스텝 시트</div>
      <div class="scr">
        <div style="background:var(--cream);border-bottom:3px solid var(--ink);margin:-12px -12px 0;padding:10px 12px">
          <div class="xs">본관 1F 응급의료센터</div>
          <div class="hd" style="margin-top:2px">첫 출근 · 인계받기</div>
          <div class="bar" style="margin-top:8px"><span style="width:33%"></span></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-top:6px">
          <div class="rowline" style="border:2.5px solid var(--ink);background:#fff;padding:8px 9px"><div class="chip" style="border:0">말</div><div class="grow"><div class="sm" style="color:var(--ink)">첫 출근 · 자기소개</div><div class="xs">대화</div></div><div class="hd" style="color:var(--mintShadow)">✓</div></div>
          <div class="rowline" style="border:2.5px solid var(--ink);background:var(--blue);padding:8px 9px"><div class="chip" style="border:0">말</div><div class="grow"><div class="sm" style="color:var(--ink)">인계 받기 · 오늘 배정</div><div class="xs">대화</div></div><div class="chip" style="background:var(--ink);color:var(--cream)">NOW</div></div>
          <div class="rowline" style="border:2.5px solid var(--ink);background:var(--pink);padding:8px 9px;opacity:.55"><div class="chip" style="border:0">시험</div><div class="grow"><div class="sm" style="color:var(--ink)">첫 환자 인사 · 신원 확인</div><div class="xs">챕터 시험</div></div></div>
        </div>
        <div class="card cream" style="margin-top:6px">
          <div class="xs">이 세 편은 새로 저작했다</div>
          <div class="sm" style="margin-top:4px">
            이전 카탈로그는 “출근 · 인사와 자기소개”를 약속하고 흉통 트리아지를 열었다.
            id는 전부 존재해서 시드 가드는 통과했고, 이름과 내용을 비교하는 테스트가 없었다.
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<h2><span class="n">03</span>AI 역할극 — 대화가 본체다</h2>
<p class="note">
  시나리오의 페르소나(이름·나이·기분·말투)로 LLM이 환자를 연기한다. 학습자의 모국어와 목표
  언어가 프롬프트에 들어가므로 <b>대화는 목표 언어로, 교정 설명은 모국어로</b> 나온다.
  타이핑해도 되고 마이크를 눌러 말해도 된다. 환자 대사는 역할·성별·연령대에 맞는 목소리로 읽어준다.
</p>
<div class="row">
  <div>
    <div class="phone">
      <div class="cap">대화 · SPEAK FREELY</div>
      <div class="scr" style="background:var(--peach)">
        <div class="rowline">
          <div class="chip" style="background:#fff">×</div><div class="chip" style="background:#fff">소리</div>
          <div class="grow"></div><div class="chip" style="background:var(--ink);color:var(--cream)">상황 종료</div>
        </div>
        <div class="rowline" style="margin-top:2px">
          <div class="face" style="width:44px;height:52px"><div class="hair" style="background:#4A4A4A"></div><div class="head"></div><div class="eye l" style="top:24px;left:13px"></div><div class="eye r" style="top:24px;right:13px"></div><div class="mouth" style="top:36px;left:18px;width:8px"></div><div class="body" style="background:var(--blue)"></div></div>
          <div class="grow"><div class="hd" style="font-size:12px">Mr. Robinson</div><div class="xs">환자 · 58y / Male · 통증</div></div>
          <div class="chip" style="background:#fff">차트</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:7px;margin-top:6px">
          <div class="bub npc">It feels like an elephant on my chest…<div class="xs" style="margin-top:4px">탭하면 번역</div></div>
          <div class="bub me">Can you describe the pain for me?</div>
          <div class="bub npc">Sharp. It goes to my left arm.</div>
        </div>
        <div class="grow"></div>
        <div class="card" style="background:#fff;padding:8px">
          <div class="xs">SPEAK FREELY · 마이크를 눌러 말하기</div>
          <div class="rowline" style="margin-top:7px">
            <div class="sm grow">자유롭게 영어로 답하거나…</div>
            <div class="chip" style="background:var(--mint)">마이크</div>
            <div class="chip" style="background:var(--ink);color:var(--cream)">보내기</div>
          </div>
        </div>
        <div class="rowline"><div class="chip" style="background:var(--yellow)">힌트</div><div class="chip" style="background:var(--lilac)">직접 말하기</div></div>
      </div>
    </div>
  </div>
  <div>
    <div class="phone">
      <div class="cap">발음 채점</div>
      <div class="scr">
        <div class="card" style="background:#fff">
          <div class="tag">따라 말해보세요</div>
          <div style="font-size:13px;margin-top:5px;line-height:1.7">
            Give <b style="background:var(--lilac);border:2px solid var(--ink);padding:0 3px">heparin</b>
            <b style="background:var(--yellow);border:2px solid var(--ink);padding:0 3px">5,000 units</b> subcutaneously.
          </div>
          <div class="xs" style="margin-top:7px;letter-spacing:.3px">/ɡɪv ˈhɛpəɹɪn faɪv ˈθaʊzənd ˈjunɪts ˌsʌbkjuˈteɪniəsli/</div>
          <div class="rowline" style="margin-top:9px;padding-top:8px;border-top:2px dotted var(--ink)">
            <div class="chip" style="background:var(--blue)">원어민</div><div class="chip" style="background:#fff">0.5× 느리게</div>
            <div class="grow"></div><div class="xs">3회 중 2회차</div>
          </div>
        </div>
        <div class="card cream">
          <div class="rowline">
            <div style="width:56px;height:56px;border:3px solid var(--ink);background:var(--mint);display:flex;align-items:center;justify-content:center" class="hd">82</div>
            <div class="grow" style="display:flex;flex-direction:column;gap:5px">
              <div class="rowline"><div class="xs" style="width:34px">정확도</div><div class="bar grow"><span style="width:86%"></span></div><div class="xs">86</div></div>
              <div class="rowline"><div class="xs" style="width:34px">유창성</div><div class="bar grow"><span style="width:78%"></span></div><div class="xs">78</div></div>
              <div class="rowline"><div class="xs" style="width:34px">억양</div><div class="bar grow"><span style="width:74%"></span></div><div class="xs">74</div></div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="hd" style="font-size:11px">음절별 결과</div>
          <div class="syl" style="margin-top:7px">
            <b style="background:var(--mint)">Give</b><b style="background:var(--mint)">he</b>
            <b style="background:var(--yellow)">pa</b><b style="background:var(--red)">rin</b>
            <b style="background:var(--mint)">five</b><b style="background:var(--mint)">thou</b>
            <b style="background:var(--mint)">sand</b><b style="background:var(--yellow)">u</b>
            <b style="background:var(--mint)">nits</b>
          </div>
          <div class="rowline" style="margin-top:9px;padding-top:8px;border-top:2px dotted var(--ink)">
            <div class="xs">■ 좋아요</div><div class="xs">■ 애매해요</div><div class="xs">■ 다시!</div>
          </div>
        </div>
        <div class="card peach"><div class="xs">━ 교정 포인트 2 ━━━</div><div class="sm" style="color:var(--ink);margin-top:4px">/ɹ/이 약해요. 혀끝을 입천장에 닿지 않게 두고 소리를 굴리세요.</div></div>
      </div>
    </div>
  </div>
</div>

<h2><span class="n">04</span>클리어 — 캐릭터가 반응한다</h2>
<p class="note">
  통과하면 초상이 환호하며 커지고, 아니면 처지며 작아진다. 서버가 판정을 돌려준 <b>뒤에</b>
  트리거한다 — 그 전에 반응하면 아직 아무도 판정하지 않은 결과를 축하한다. 효과음도 같은
  순간을 표시하고, Reduce Motion을 켜면 움직임은 멈춘다.
</p>
<div class="row">
  <div>
    <div class="phone">
      <div class="cap">결과 · 통과</div>
      <div class="scr" style="align-items:center;text-align:center">
        <div class="xs">SCENARIO CLEAR!</div>
        <div class="hd" style="font-size:19px;color:var(--yellowShadow)">완료 · PASS</div>
        <div class="face" style="width:76px;height:88px;margin-top:6px"><div class="hair"></div><div class="head"></div><div class="eye l" style="left:22px"></div><div class="eye r" style="right:22px"></div><div class="mouth" style="left:30px;width:14px;height:4px"></div><div class="body"></div></div>
        <div style="width:88px;height:88px;border:3px dashed var(--ink);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-top:8px">
          <div style="font-size:26px">⭐</div><div class="hd" style="font-size:12px">참 잘했어요</div>
        </div>
        <div class="card" style="align-self:stretch;margin-top:8px;text-align:left">
          <div class="rowline"><div class="xs grow">경험치</div><div class="hd" style="font-size:12px">+ 140 XP</div></div>
          <div class="bar" style="margin-top:6px"><span style="width:64%"></span></div>
          <div class="xs" style="margin-top:5px">칭호 스티커 (누적 12장)</div>
        </div>
        <div class="card lilac" style="align-self:stretch;text-align:left">
          <div class="rowline"><div class="chip" style="border:0">칭호</div><div class="grow"><div class="hd" style="font-size:11px">새 칭호 획득!</div><div class="sm" style="color:var(--ink)">말이 길어지는 사람</div></div></div>
        </div>
        <div class="sm">오늘 당신은 환자에게 따뜻한 미소를 주었습니다.</div>
        <div class="btn m" style="align-self:stretch">▶ 다음 시나리오</div>
      </div>
    </div>
  </div>
  <div>
    <div class="phone">
      <div class="cap">리뷰랩 · 교정 노트</div>
      <div class="scr">
        <div class="rowline"><div class="hd" style="font-size:15px">리뷰랩</div><div class="grow"></div><div class="chip" style="background:var(--yellow)">복습 대기 6</div></div>
        <div class="card cream">
          <div class="xs">현지인처럼 말하기</div>
          <div class="sm" style="margin-top:5px;text-decoration:line-through;color:var(--faint)">I want to ask about your pain.</div>
          <div class="sm" style="margin-top:3px;color:var(--ink)">→ <b style="background:var(--mint)">Can you tell me about your pain?</b></div>
          <div class="xs" style="margin-top:6px">환자에게는 허락을 구하는 형태가 더 자연스러워요.</div>
          <div class="rowline" style="margin-top:8px"><div class="xs grow">숙련 ■■□</div><div class="chip" style="background:#fff">발음</div></div>
        </div>
        <div class="rowline" style="gap:5px">
          <div class="btn" style="flex:1;background:var(--red);color:var(--ink);border-color:var(--ink);font-size:10px">다시</div>
          <div class="btn" style="flex:1;background:var(--peach);color:var(--ink);font-size:10px">어려움</div>
          <div class="btn" style="flex:1;background:var(--mint);color:var(--ink);font-size:10px">알맞음</div>
          <div class="btn" style="flex:1;background:var(--yellow);color:var(--ink);font-size:10px">쉬움</div>
        </div>
        <div class="xs">SM-2 간격 반복 · 다음 복습: 6일 후</div>
        <div class="card"><div class="xs">대화 중 AI가 교정한 문장이 자동으로 여기 등록된다. 카드마다 어떤 상황에서 나온 말인지 맥락이 붙는다.</div></div>
      </div>
      <div class="tabs"><div>홈</div><div>커리어</div><div>상황판</div><div class="on">리뷰랩</div><div>프로필</div></div>
    </div>
  </div>
</div>

<h2><span class="n">05</span>프로필 — 컬렉션은 하나다</h2>
<p class="note">
  볼 수만 있고 쓸 수는 없는 배지 8개와 장착 가능한 칭호 6개가 나란히 있었다. 배지를 칭호로
  흡수해 하나로 만들고, <b>코믹 히든 칭호 4개</b>를 더했다 — 조건은 전부 앱이 이미 기록하는
  신호만 쓴다. 얻을 수 없는 칭호는 펀치라인 없는 농담이다.
</p>
<div class="row">
  <div>
    <div class="phone">
      <div class="cap">프로필 · MY CARD</div>
      <div class="scr" style="background:var(--cream)">
        <div class="hd" style="font-size:15px">MY CARD</div>
        <div class="card" style="padding:0;overflow:hidden">
          <div style="height:8px;background:var(--mint);border-bottom:2px solid var(--ink)"></div>
          <div class="rowline" style="padding:11px;align-items:flex-start">
            <div style="position:relative">
              <div class="face" style="width:66px;height:78px"><div class="hair"></div><div class="head"></div><div class="eye l" style="left:19px"></div><div class="eye r" style="right:19px"></div><div class="mouth" style="left:26px"></div><div class="body"></div></div>
              <div class="chip" style="position:absolute;bottom:-4px;right:-4px;background:var(--yellow)">편집</div>
            </div>
            <div class="grow">
              <div class="xs">RANK</div>
              <div class="hd" style="font-size:16px">주니어 간호사</div>
              <div class="chip" style="background:var(--lilac);margin-top:4px">병동의 벗</div>
              <div class="bar" style="margin-top:7px"><span style="width:42%"></span></div>
              <div class="xs" style="margin-top:4px">Lv.6 · 1,240 XP</div>
            </div>
          </div>
        </div>
        <div class="rowline"><div class="hd" style="font-size:12px">칭호</div><div class="grow"></div><div class="xs">8 / 15</div></div>
        <div style="display:flex;flex-direction:column;gap:5px">
          <div class="rowline" style="border:3px solid var(--ink);background:var(--lilac);padding:7px 9px"><div class="chip" style="border:0">♥</div><div class="grow"><div class="hd" style="font-size:11px">병동의 벗</div><div class="xs">환자들이 편안해하는 따뜻한 손길</div></div><div class="chip" style="background:var(--yellow)">장착 중</div></div>
          <div class="rowline" style="border:2px solid var(--ink);background:#fff;padding:7px 9px"><div class="chip" style="border:0">말</div><div class="grow"><div class="hd" style="font-size:11px">말이 길어지는 사람</div><div class="xs">하루에 30분 넘게 대화했어요</div></div></div>
          <div class="rowline" style="border:2px solid var(--ink);background:var(--cream);padding:7px 9px;opacity:.6"><div class="chip" style="border:0">?</div><div class="grow"><div class="hd" style="font-size:11px">???</div><div class="xs">조건은 비밀이에요. 지내다 보면 만나요.</div></div></div>
        </div>
      </div>
      <div class="tabs"><div>홈</div><div>커리어</div><div>상황판</div><div>리뷰랩</div><div class="on">프로필</div></div>
    </div>
  </div>
  <div>
    <div class="phone">
      <div class="cap">아바타 · 얼굴 스캔</div>
      <div class="scr">
        <div style="background:var(--cream);border-bottom:3px solid var(--ink);margin:-12px -12px 0;padding:10px;text-align:center">
          <div class="face" style="width:78px;height:92px;margin:0 auto"><div class="hair"></div><div class="head"></div><div class="eye l" style="left:23px"></div><div class="eye r" style="right:23px"></div><div class="mouth" style="left:31px;width:14px"></div><div class="body"></div></div>
          <div class="hd" style="font-size:12px;margin-top:7px">내 얼굴 만들기</div>
        </div>
        <div class="btn" style="background:var(--blue);color:var(--ink);margin-top:8px">사진으로 색 잡기</div>
        <div><div class="xs">머리 모양</div><div class="syl" style="margin-top:5px"><b>단발</b><b style="background:var(--yellow)">긴머리</b><b>포니</b><b>양갈래</b><b>번</b><b>곱슬</b></div></div>
        <div><div class="xs">머리 색</div><div class="syl" style="margin-top:5px">
          <b style="background:#1B1B1B;width:22px">&nbsp;</b><b style="background:#3C2A18;width:22px">&nbsp;</b>
          <b style="background:#6B4A2F;width:22px;border-width:3px">&nbsp;</b><b style="background:#A9743F;width:22px">&nbsp;</b>
          <b style="background:#C9A227;width:22px">&nbsp;</b><b style="background:#8A8A8A;width:22px">&nbsp;</b><b style="background:#E8E4DC;width:22px">&nbsp;</b>
        </div></div>
        <div><div class="xs">피부 톤</div><div class="syl" style="margin-top:5px">
          <b style="background:#FBE3C8;width:22px">&nbsp;</b><b style="background:#F8D7B2;width:22px;border-width:3px">&nbsp;</b>
          <b style="background:#E8B584;width:22px">&nbsp;</b><b style="background:#C68642;width:22px">&nbsp;</b>
          <b style="background:#8D5524;width:22px">&nbsp;</b><b style="background:#5C3317;width:22px">&nbsp;</b>
        </div></div>
        <div class="card cream">
          <div class="xs">얼굴 스캔이 하는 일</div>
          <div class="sm" style="margin-top:4px">
            닮은 얼굴을 그리는 게 아니라, 사진에서 <b>머리·피부 색</b>을 읽어 위 값의 출발점을 잡아준다.
            사진은 기기를 떠나지 않고 저장되지 않는다.
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<h2><span class="n">06</span>언어 — 번역 완성도를 숨기지 않는다</h2>
<p class="note">
  UI 언어는 설정에서 바꾸고 재시작 없이 즉시 반영된다. 배우는 언어는 온보딩에서 고른 나라가
  정한다(별개 축이다 — 한국인이 영어 UI를 써도 교정 설명은 한국어여야 한다). 번역 완성도는
  카탈로그에서 <b>계산</b>해 그대로 보여주고, 의료 용어를 기계번역으로 채우지 않는다.
</p>
<div class="row">
  <div>
    <div class="phone">
      <div class="cap">설정 · 언어</div>
      <div class="scr" style="background:var(--cream)">
        <div class="rowline"><div class="chip" style="border:0">말</div><div class="hd" style="font-size:13px">언어</div></div>
        <div class="card" style="padding:0">
          <div class="rowline" style="padding:10px 11px">
            <div class="grow"><div class="hd" style="font-size:12px">앱 언어</div><div class="xs">화면에 보이는 말이 한국어로 나와요.</div></div>
            <div class="hd" style="font-size:11px">한국어</div><div class="xs">›</div>
          </div>
          <div class="rowline" style="padding:9px 11px;background:var(--cream);border-top:2px solid var(--ink)">
            <div class="grow"><div class="hd" style="font-size:11px">배우는 언어</div><div class="xs">English · 온보딩에서 고른 나라로 정해져요.</div></div>
          </div>
        </div>
        <div class="card cream" style="margin-top:4px">
          <div class="hd" style="font-size:12px">앱 언어 고르기</div>
          <div class="xs" style="margin-top:3px">번역이 없는 부분은 한국어로 보여요. 기계번역으로 채우지 않았어요.</div>
          <div style="display:flex;flex-direction:column;gap:5px;margin-top:8px">
            <div class="rowline" style="border:2.5px solid var(--ink);background:var(--mint);padding:7px 9px"><div class="grow"><div class="hd" style="font-size:11px">한국어</div><div class="xs">Korean</div></div><div class="hd" style="font-size:11px">✓</div></div>
            <div class="rowline" style="border:2.5px solid var(--ink);background:#fff;padding:7px 9px"><div class="grow"><div class="hd" style="font-size:11px">English</div><div class="xs">English</div></div><div class="chip" style="background:var(--yellow)">번역 44%</div></div>
            <div class="rowline" style="border:2.5px solid var(--ink);background:#fff;padding:7px 9px"><div class="grow"><div class="hd" style="font-size:11px">日本語</div><div class="xs">Japanese</div></div><div class="chip" style="background:var(--yellow)">번역 31%</div></div>
            <div class="rowline" style="border:2.5px solid var(--ink);background:#fff;padding:7px 9px"><div class="grow"><div class="hd" style="font-size:11px">Deutsch</div><div class="xs">German</div></div><div class="chip" style="background:var(--yellow)">번역 31%</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <div class="phone">
      <div class="cap">온보딩 · 어디로 가시나요?</div>
      <div class="scr">
        <div class="rowline"><div class="xs">‹</div><div class="grow" style="text-align:center"><div class="hd" style="font-size:12px">LANGUAGE</div></div><div class="xs">1/4</div></div>
        <div class="hd" style="font-size:17px;margin-top:6px">어디서 오셨나요?</div>
        <div class="xs">앱이 사용할 모국어를 골라주세요.</div>
        <div class="rowline" style="gap:8px;flex-wrap:wrap;margin-top:4px">
          <div class="card mint" style="width:47%;padding:9px"><div class="hd" style="font-size:12px">한국어</div><div class="xs">Korean</div></div>
          <div class="card" style="width:47%;padding:9px"><div class="hd" style="font-size:12px">日本語</div><div class="xs">Japanese</div><div class="chip" style="background:var(--yellow);margin-top:5px">번역 31%</div></div>
        </div>
        <div class="hd" style="font-size:14px;margin-top:10px">⇨ 어디로 가시나요?</div>
        <div class="rowline" style="gap:8px;flex-wrap:wrap">
          <div class="card mint" style="width:47%;padding:9px"><div class="hd" style="font-size:12px">미국</div><div class="xs">English-US</div></div>
          <div class="card" style="width:47%;padding:9px;background:var(--paper);border-color:var(--faint);opacity:.6"><div class="hd" style="font-size:12px">독일</div><div class="xs">Deutsch</div><div class="chip" style="background:var(--yellow);margin-top:5px">준비 중</div></div>
        </div>
        <div class="card cream" style="margin-top:6px">
          <div class="xs">왜 독일이 잠겨 있나</div>
          <div class="sm" style="margin-top:4px">
            AI 대화는 어느 언어로든 된다. 따라가지 않는 건 <b>저작된 예시 문장</b>이고, 그게 가르치는
            대상이다 — 1,299개가 전부 영어다. 추측한 독일어를 넣으면 간호사가 환자에게 잘못된
            말을 하도록 가르친다. 서버가 <code>ReadyTargetLangs</code>를 선언하고 시드가 그걸 검증한다.
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<h2><span class="n">07</span>병동을 걸어 다닌다</h2>
<p class="note">
  27개 부서 인테리어가 타일맵으로 그려져 있고, 엘리베이터로 층을 옮긴다. 방·기구·NPC에
  상호작용 지점이 붙어 있어 걸어가서 말을 건다. 간판은 <b>영어 용어 + 모국어 주석</b>이
  의도된 이중언어다 — 영어 쪽이 학습 대상이고 한국어가 그 뜻이다.
</p>
<div class="row">
  <div>
    <div class="phone">
      <div class="cap">인테리어 · 본관 1F 응급의료센터</div>
      <div class="scr" style="background:#E6DCC8;padding:0;min-height:420px;position:relative">
        <div style="position:absolute;inset:0;background:
            repeating-linear-gradient(0deg,#0000 0 22px,#0001 22px 23px),
            repeating-linear-gradient(90deg,#0000 0 22px,#0001 22px 23px)"></div>
        <div style="position:absolute;left:10px;top:10px;right:10px;height:74px;border:3px solid var(--ink);background:var(--blue)">
          <div class="xs" style="padding:5px 7px;color:var(--ink)">TRIAGE · KTAS</div>
        </div>
        <div style="position:absolute;left:10px;top:96px;width:120px;height:96px;border:3px solid var(--ink);background:var(--red)">
          <div class="xs" style="padding:5px 7px;color:var(--ink)">RESUS · 소생실</div>
        </div>
        <div style="position:absolute;right:10px;top:96px;width:118px;height:96px;border:3px solid var(--ink);background:var(--peach)">
          <div class="xs" style="padding:5px 7px;color:var(--ink)">제1진료실 · 내과</div>
        </div>
        <div style="position:absolute;left:10px;bottom:74px;right:10px;height:72px;border:3px solid var(--ink);background:var(--cream)">
          <div class="xs" style="padding:5px 7px;color:var(--ink)">중앙 너스 스테이션 · 약품실</div>
        </div>
        <div class="chip" style="position:absolute;left:44px;top:150px;background:var(--yellow)">!</div>
        <div class="chip" style="position:absolute;right:52px;top:150px;background:var(--blue)">i</div>
        <div class="face" style="position:absolute;left:120px;bottom:96px;width:34px;height:40px"><div class="hair"></div><div class="head"></div><div class="eye l" style="top:16px;left:9px;width:4px;height:4px"></div><div class="eye r" style="top:16px;right:9px;width:4px;height:4px"></div><div class="body"></div></div>
        <div style="position:absolute;left:0;right:0;bottom:0;border-top:3px solid var(--ink);background:var(--cream);padding:7px 9px" class="rowline">
          <div class="chip" style="background:var(--mint)">ZONE · 트리아지</div>
          <div class="grow"></div>
          <div class="chip" style="background:var(--ink);color:var(--cream)">말 걸기</div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <div class="phone">
      <div class="cap">엘리베이터</div>
      <div class="scr" style="background:var(--ink);color:var(--cream)">
        <div class="hd" style="font-size:13px;color:var(--cream)">본관</div>
        <div class="xs" style="color:var(--peachShadow)">응급 · 수술 · 중환자 · 병동</div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px">
          <div class="rowline" style="border:2.5px solid var(--cream);padding:7px 9px"><div class="chip" style="background:var(--cream);color:var(--ink)">8F</div><div class="grow"><div class="sm" style="color:var(--cream)">일반 내과 병동</div></div><div class="chip" style="background:var(--yellowDeep);color:var(--ink)">NOW</div></div>
          <div class="rowline" style="border:2.5px solid var(--cream);padding:7px 9px;opacity:.75"><div class="chip" style="background:var(--cream);color:var(--ink)">4F</div><div class="grow"><div class="sm" style="color:var(--cream)">중앙 중환자실 ICU</div></div></div>
          <div class="rowline" style="border:2.5px solid var(--cream);padding:7px 9px;opacity:.75"><div class="chip" style="background:var(--cream);color:var(--ink)">3F</div><div class="grow"><div class="sm" style="color:var(--cream)">수술실 · PACU</div></div></div>
          <div class="rowline" style="border:2.5px solid var(--cream);padding:7px 9px;opacity:.75"><div class="chip" style="background:var(--cream);color:var(--ink)">1F</div><div class="grow"><div class="sm" style="color:var(--cream)">응급의료센터</div></div><div class="chip" style="background:var(--red);color:var(--ink)">긴급</div></div>
          <div class="rowline" style="border:2.5px solid var(--cream);padding:7px 9px;opacity:.75"><div class="chip" style="background:var(--cream);color:var(--ink)">P1</div><div class="grow"><div class="sm" style="color:var(--cream)">중앙 약제부</div></div></div>
        </div>
        <div class="xs" style="color:var(--peachShadow);margin-top:8px">문이 닫히고 층 표시가 흐르다가, 맵이 실제로 그려진 뒤에 열린다.</div>
      </div>
    </div>
  </div>
</div>

<footer>
  <p>
    <strong style="font-family:'DGM';font-weight:normal">다시 강조합니다: 위 화면은 재구성입니다.</strong>
    색은 <code>mobile/src/theme/tokens.ts</code>에서 읽어왔고, 글꼴은 <code>mobile/assets/fonts</code>의
    DungGeunMo·Galmuri11을 이 페이지에 쓰인 354자만 서브셋해 심었습니다. 레이아웃은 각 화면의
    컴포넌트를 따랐지만 픽셀 캐릭터·타일맵은 앱에서 SVG로 그려지므로 여기서는 단순화했습니다.
    실제 캡처는 시뮬레이터에서 <code>Cmd+S</code>로 받으면 됩니다.
  </p>
  <p>
    <code>mobile/scripts/showcase.py</code>로 생성 · 팔레트가 바뀌면 다시 돌리면 됩니다.
  </p>
</footer>
</div>
"""

if __name__ == "__main__":
    main()
