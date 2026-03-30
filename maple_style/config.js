/**
 * Wedding Invitation Configuration - MapleStory Theme
 */

const CONFIG = {
    // 방명록 (구글 앱스스크립트 연동 URL)
    // 하객들이 남긴 방명록을 저장하고 불러올 스크립트 웹앱 주소입니다.
    // 비워두면 방명록 기능이 비활성화 상태로 표시됩니다.
    guestbookUrl: "",

    // ── 초대장 열기 ──
    useCurtain: false,

    // ── 메인 (히어로) ──
    groom: {
        name: "기분탓이에요",
        nameEn: "Groom",
        father: "아버지",
        mother: "어머니",
        fatherDeceased: false,
        motherDeceased: false
    },

    bride: {
        name: "껀밍",
        nameEn: "Bride",
        father: "아버지",
        mother: "어머니",
        fatherDeceased: false,
        motherDeceased: false
    },

    wedding: {
        date: "2026-07-04",
        time: "15:30",
        venue: "더 청담 웨딩홀",
        hall: "그랜드홀 5층",
        address: "서울 강남구 도산대로 434",
        tel: "02-518-8001",
        mapLinks: {
            kakao: "https://map.kakao.com/?from=roughmap&eName=%EB%8D%94%EC%B2%AD%EB%8B%B4&eX=509598.00000000047&eY=1117669.9999999977",
            naver: "https://map.naver.com/p/search/%EB%8D%94%EC%B2%AD%EB%8B%B4%EC%9B%A8%EB%94%A9%ED%99%80/place/11545023?c=15.29,0,0,0,dh&placePath=/home?from=map&fromPanelNum=2&timestamp=202603310048&locale=ko&svcName=map_pcv5&searchText=%EB%8D%94%EC%B2%AD%EB%8B%B4%EC%9B%A8%EB%94%A9%ED%99%80"
        }
    },

    // ── 인사말 ──
    greeting: {
        title: "[퀘스트] 검은마법사 토벌, 그리고...",
        content: "어느 날 검은마법사에게 잡혀버린 기분탓을..\n그를 구하기 위해 홀로 보스 레이드에 뛰어든 껀밍!\n\n무사히 기분탓을 구출하고 두 번의 메결을 넘어 평생의 파티를 맺게 된 두 사람.\n저희의 새로운 챕터에 축복의 버프를 주시면 감사하겠습니다."
    },

    // ── 우리의 이야기 ──
    story: {
        title: "메이플 월드 구출 작전",
        content: "어둠에 갇힌 기분탓을 구하기 위해 망설임 없이 검은마법사의 방으로 진격한 껀밍.\n치열한 파티 퀘스트 끝에 기분탓을 구원해낸 껀밍의 활약으로\n두 사람의 인연은 영원한 길드 창설로 이어집니다.\n\n가장 소중한 퀘스트를 시작하는 자리에 여러분을 초대합니다."
    },

    // ── 마음 전하실 곳 ──
    accounts: {
        groom: [
            { role: "신랑", name: "홍길동", bank: "국민은행", number: "000-000-000000" }
        ],
        bride: [
            { role: "신부", name: "김영희", bank: "하나은행", number: "000-000-000000" }
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
        title: "신랑 ♥ 신부 파티 결성",
        description: "새로운 퀘스트에 여러분을 초대합니다."
    }
};
