/**
 * Wedding Invitation Configuration
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 설정이 필요 없습니다. 아래 폴더에 순번 파일명으로 넣으면 자동 감지됩니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 *   images/hero/1.jpg      - 메인 사진 (1장, 필수)
 *   images/story/1.jpg, 2.jpg, ...  - 스토리 사진들 (순번, 자동 감지)
 *   images/gallery/1.jpg, 2.jpg, ... - 갤러리 사진들 (순번, 자동 감지)
 *   images/location/1.jpg  - 약도/지도 이미지 (1장)
 *   images/og/1.jpg        - 카카오톡 공유 썸네일 (1장)
 */

const CONFIG = {
  // ── 방명록 (Firebase) ──
  firebaseConfig: {
      apiKey: "AIzaSyBVZ290EgV6R_9rXcqwPzEm9u84FeZHqjA",
      authDomain: "mobile-board-b551f.firebaseapp.com",
      projectId: "mobile-board-b551f",
      storageBucket: "mobile-board-b551f.firebasestorage.app",
      messagingSenderId: "709124590893",
      appId: "1:709124590893:web:d285b05486d1ee682097a4",
      databaseURL: "https://mobile-board-b551f-default-rtdb.firebaseio.com",
      measurementId: "G-2NZRBP0P0C"
  },

  // ── 배경음악 설정 ──
  useBgm: true,       // 배경음악 사용 여부
  bgmPath: "music/The Raindrop Flower.mp3", // 배경음악 파일 경로 (이곳에 mp3 파일 경로를 넣으세요)ㄹ

  // ── 메인 (히어로) ──
  groom: {
    name: "최진호",
    nameEn: "",
    father: "최종원",
    mother: "장미선",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "권민정",
    nameEn: "",
    father: "권혁두",
    mother: "문경애",
    fatherDeceased: false,
    motherDeceased: false
  },

  wedding: {
    date: "2026-07-04",
    time: "15:30",
    venue: "더 청담 2F 노블레스홀",
    hall: "",
    address: "서울 강남구 도산대로 434",
    tel: "02-518-8001",
    transit: {
      subway: "지하철 7호선 강남구청역 4번출구 도보 10분\n분당선 압구정로데오역 4번출구 도보 10분",
      shuttle: "지하철 7호선 및 수인분당선 강남구청역 4번출구 앞 (5~10분 간격 출발)",
      bus: "차병원 차움 : 4212\n농협 앞 : 343, 4212\nST송은빌딩 : 9407, 9507, 9607",
      parking: "(건물 내부 만차시, 외부 주차장 무료 발렛파킹)\n1. 신사역 사거리 > 영동대교 방면 > 청담스퀘어 다음 블럭\n2. 영동대교 남단 청담사거리 > 학동사거리방면 청담스퀘어 앞 U턴 후 다음 블럭",
      atm: "더청담 1층 로비 위치"
    },
    mapLinks: {
      kakao: "https://map.kakao.com/?from=roughmap&eName=%EB%8D%94%EC%B2%AD%EB%8B%B4&eX=509598.00000000047&eY=1117669.9999999977",
      naver: "https://map.naver.com/p/search/%EB%8D%94%EC%B2%AD%EB%8B%B4%EC%9B%A8%EB%94%A9%ED%99%80/place/11545023?c=15.29,0,0,0,dh&placePath=/home?from=map&fromPanelNum=2&timestamp=202603310048&locale=ko&svcName=map_pcv5&searchText=%EB%8D%94%EC%B2%AD%EB%8B%B4%EC%9B%A8%EB%94%A9%ED%99%80"
    }
  },

  // ── 인사말 ──
  greeting: {
    title: "소중한 분들을 초대합니다",
    content: "서로 다른 길을 걸어온 두 사람이\n이제 같은 길을 함께 걸어가려 합니다.\n\n저희의 새로운 시작을\n축복해 주시면 감사하겠습니다."
  },

  // ── 우리의 이야기 ──
  story: {
    title: "우리의 이야기",
    content: "서로 다른 길을 걷던 두 사람이\n하나의 길을 함께 걷게 되었습니다.\n\n여러분을 소중한 자리에 초대합니다."
  },

  // ── 오시는 길 ──
  // (mapLinks는 wedding 객체 내에 포함)

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑", name: "최진호", bank: "기업은행", number: "694-025626-01-016" },
      { role: "아버지", name: "최종원", bank: "농협", number: "302-2098-7755-41" },
      { role: "어머니", name: "장미선", bank: "농협", number: "689-02-185553" }
    ],
    bride: [
      { role: "신부", name: "권민정", bank: "우리은행", number: "1002-350-460411" },
      { role: "아버지", name: "권혁두", bank: "우리은행", number: "052-012930-02-001" },
      { role: "어머니", name: "문경애", bank: "하나은행", number: "408-279385-00207" }
    ]
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "신랑 ♥ 신부 결혼합니다",
    description: "2026년 7월 4일, 소중한 분들을 초대합니다."
  }
};
