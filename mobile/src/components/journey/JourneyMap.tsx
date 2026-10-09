// JourneyMap — 예전에는 정거장 지그재그 지도를 그리던 파일이다. journey-binder-v42
// Task H가 그 그림을 우표 산책길(StationTrack.tsx)로 바꾸면서, 지도를 그리던 코드
// (`JourneyMap` 컴포넌트, `stationPoint`/`stationStates`, 레이아웃 상수들, Station·
// PathSegment·MilestoneFlag 조립)는 전부 StationTrack.tsx로 옮겼거나 필요 없어져
// 정리했다 — 이 파일의 `JourneyMap` 컴포넌트 자체는 그 이전부터 이미 어느 화면도
// 렌더하지 않고 있었다(1단계는 목록이, 2단계는 StationTrack이 대신 맡았다).
//
// 이 파일이 남아 있는 유일한 이유는 아래 두 타입이다 — `BinderShelf.tsx`·
// `DeptBinder.tsx`(부서 간지·서가 화면)와 그 테스트들이 여전히 이 이름으로 계약
// 타입을 가져다 쓴다. 두 컴포넌트가 옮겨 가지 않는 한 이 타입은 이 파일에 둔다.
import type { JourneyView } from '@/api/client';

/** 트랙 하나의 정거장(=주제) 하나 — `JourneyView['track']['curricula']`의 원소. */
export type JourneyCurriculum = NonNullable<NonNullable<JourneyView['track']>['curricula']>[number];

/** 트랙 하나의 마일스톤 — `JourneyView['track']['milestone']`. 서버가 안 보내면
 *  `undefined`다. */
export type JourneyMilestone = NonNullable<NonNullable<JourneyView['track']>['milestone']>;
