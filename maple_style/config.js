/**
 * Wedding Invitation Configuration - MapleStory Theme
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

    // ── 초대장 열기 ──
    useCurtain: false,

    // ── 메인 (히어로) ──
    groom: {
        name: "최진호",
        nameEn: "기분탓",
        father: "",
        mother: "",
        fatherDeceased: false,
        motherDeceased: false
    },

    bride: {
        name: "권민정",
        nameEn: "껀밍",
        father: "",
        mother: "",
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
        title: "[퀘스트] 검은마법사 토벌, 그리고...",
        content: "어느 날 검은마법사에게 잡혀버린 기분탓..\n그를 구하기 위해 홀로 보스 레이드에 뛰어든 껀밍!\n\n무사히 기분탓을 구출하고 두 번의 메결을 넘어 평생의 파티를 맺게 된 두 사람.\n저희의 새로운 챕터에 축복의 버프를 주시면 감사하겠습니다."
    },

    // ── 우리의 이야기 ──
    story: {
        title: "메이플 월드 구출 작전",
        content: "어둠에 갇힌 기분탓을 구하기 위해 망설임 없이 검은마법사의 방으로 진격한 껀밍.\n치열한 파티 퀘스트 끝에 기분탓을 구원해낸 껀밍의 활약으로\n두 사람의 인연은 영원한 길드 창설로 이어집니다.\n\n가장 소중한 퀘스트를 시작하는 자리에 여러분을 초대합니다."
    },

    // ── 마음 전하실 곳 ──
    accounts: {
        groom: [
            { role: "신랑", name: "최진호", bank: "기업은행", number: "694-025626-01-016" }
        ],
        bride: [
            { role: "신부", name: "권민정", bank: "우리은행", number: "1002-350-460411" }
        ]
    },

    // ── 별도 커스텀 텍스트 (UI용) ──
    ui: {
        levelPrefix: "Lv.",
        questTitle: "진행 중인 퀘스트",
        mesoTitle: "축하 메소(Meso) 전송",
        galleryTitle: "스크린샷 갤러리",
        mapTitle: "월드맵 위치"
    },

    meta: {
        title: "최진호 ♥ 권민정 파티 결성",
        description: "2026년 7월 4일, 소중한 분들을 초대합니다."
    }
};
