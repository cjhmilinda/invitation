/**
 * MapleStory Theme Wedding Invitation - Script
 */

(function () {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    /* ═══════════════════════════════════════════
       Image Auto-Detection
       ═══════════════════════════════════════════ */

    function loadImagesFromFolder(folder, maxAttempts = 50) {
        return new Promise(resolve => {
            const images = [];
            let current = 1;
            let consecutiveFails = 0;

            function tryNext() {
                if (current > maxAttempts || consecutiveFails >= 3) {
                    resolve(images);
                    return;
                }
                const img = new Image();
                const path = `images/${folder}/${current}.jpg`;
                img.onload = function () {
                    images.push(path);
                    consecutiveFails = 0;
                    current++;
                    tryNext();
                };
                img.onerror = function () {
                    consecutiveFails++;
                    current++;
                    tryNext();
                };
                img.src = path;
            }

            tryNext();
        });
    }

    /* ═══════════════════════════════════════════
       Toast & Clipboard
       ═══════════════════════════════════════════ */

    let toastTimer = null;
    function showToast(message) {
        const el = $('#toast');
        if (!el) return;
        el.textContent = message;
        el.classList.add('is-visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2500);
    }

    async function copyToClipboard(text, successMsg) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                document.execCommand('copy');
                ta.remove();
            }
            showToast(successMsg || '복사되었습니다');
        } catch {
            showToast('복사에 실패했습니다');
        }
    }

    /* ═══════════════════════════════════════════
       Typewriter Effect (NPC Dialog)
       ═══════════════════════════════════════════ */

    function typeWriterEffect(element, text, speed = 50) {
        if (!element) return;
        element.innerHTML = '';
        let i = 0;

        // Replace newlines with <br> for HTML rendering, but type character by character
        const htmlText = text.replace(/\n/g, '<br>');
        // Simple approach: we just set innerHTML progressively. 
        // To handle <br>, we might need a custom parser, but for simplicity:
        const lines = text.split('\n');
        let currentLine = 0;
        let currentChar = 0;

        function type() {
            if (currentLine < lines.length) {
                if (currentChar < lines[currentLine].length) {
                    element.innerHTML += lines[currentLine].charAt(currentChar);
                    currentChar++;
                    setTimeout(type, speed);
                } else {
                    element.innerHTML += '<br>';
                    currentLine++;
                    currentChar = 0;
                    setTimeout(type, speed);
                }
            }
        }
        type();
    }

    /* ═══════════════════════════════════════════
       Core Setup
       ═══════════════════════════════════════════ */

    function initHero() {
        const w = CONFIG.wedding;
        if ($('#groomNameCard')) $('#groomNameCard').textContent = CONFIG.groom.name;
        if ($('#brideNameCard')) $('#brideNameCard').textContent = CONFIG.bride.name;
        if ($('#heroNames')) $('#heroNames').textContent = `${CONFIG.groom.name} ♥ ${CONFIG.bride.name}`;

        // Format Date: 2026년 7월 4일
        try {
            const d = new Date(`${w.date}T${w.time}:00`);
            $('#heroDate').textContent = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
        } catch (e) { }

        $('#heroVenue').textContent = w.venue;
    }

    function initGreeting() {
        $('#greetingTitle').textContent = CONFIG.greeting.title;

        // Start typewriter when dialog is somewhat in view
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                typeWriterEffect($('#greetingContent'), CONFIG.greeting.content, 40);
                observer.disconnect();
            }
        }, { threshold: 0.5 });

        const dialogSection = $('.npc-dialog-modern') || $('.npc-dialog');
        if (dialogSection) observer.observe(dialogSection);
    }

    function initMap() {
        const w = CONFIG.wedding;
        $('#locationVenue').textContent = w.venue;
        if ($('#locationHall')) $('#locationHall').textContent = w.hall;
        $('#locationAddress').textContent = w.address;
        if ($('#locationTel')) $('#locationTel').textContent = w.tel ? `Tel. ${w.tel}` : '';

        if ($('#kakaoMapBtn')) $('#kakaoMapBtn').href = w.mapLinks.kakao || '#';
        if ($('#naverMapBtn')) $('#naverMapBtn').href = w.mapLinks.naver || '#';

        if ($('#copyAddressBtn')) {
            $('#copyAddressBtn').addEventListener('click', () => {
                copyToClipboard(w.address, '주소가 복사되었습니다.');
            });
        }
    }

    function initAccounts() {
        const renderAcc = (list, containerId) => {
            const parent = $(`#${containerId}`);
            if (!parent || !list) return;
            list.forEach(acc => {
                const div = document.createElement('div');
                div.className = 'account-item';
                div.innerHTML = `
          <span>[${acc.role}] ${acc.name} - ${acc.bank} ${acc.number}</span>
          <button class="maple-btn account-copy-btn" data-acc="${acc.bank} ${acc.number}">복사</button>
        `;
                parent.appendChild(div);
            });
        };

        renderAcc(CONFIG.accounts.groom, 'groomAccountList');
        renderAcc(CONFIG.accounts.bride, 'brideAccountList');

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('account-copy-btn')) {
                copyToClipboard(e.target.dataset.acc, '메소(계좌) 정보가 복사되었습니다.');
            }
        });
    }

    function initBGM() {
        const bgmBtn = $('#bgmControl');
        if (!bgmBtn) return;

        // In a real scenario, you'd have an Audio object here
        // const audio = new Audio('bgm.mp3');
        // audio.loop = true;
        let isPlaying = false;

        bgmBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                bgmBtn.textContent = '🔇 BGM OFF';
                // audio.play();
            } else {
                bgmBtn.textContent = '🔈 BGM ON';
                // audio.pause();
            }
        });
    }

    function initModal() {
        // Simple photo modal
        const modal = $('#photoModal');
        const modalImg = $('#modalImg');
        const closeBtn = $('#modalCloseBtn');
        const bg = $('#modalClose');

        const closeModal = () => modal.classList.remove('is-open');
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (bg) bg.addEventListener('click', closeModal);

        // Attach click to story gallery
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG' && e.target.closest('.story-gallery')) {
                if (modalImg && modal) {
                    modalImg.src = e.target.src;
                    $('#modalCounter').textContent = 'Image'; // Optional indexing
                    modal.classList.add('is-open');
                }
            }
        });
    }

    function initLeaves() {
        const canvas = document.getElementById('leafCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const leaves = [];
        const numLeaves = 25;
        const colors = ['#f97316', '#ea580c', '#ef4444', '#f59e0b', '#fbbf24'];

        class Leaf {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height - height;
                this.size = Math.random() * 12 + 15; // 단풍잎 크기를 기존보다 약 2.5배 확대
                this.speedY = Math.random() * 1.5 + 0.5;
                this.speedX = Math.random() * 2 - 1;
                this.angle = Math.random() * Math.PI * 2;
                this.spin = (Math.random() - 0.5) * 0.05;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX + Math.sin(this.angle) * 0.5;
                this.angle += this.spin;
                if (this.y > height + this.size) {
                    this.y = -this.size;
                    this.x = Math.random() * width;
                }
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = 0.8;

                // 실제 단풍잎(Maple Leaf) 모양 그리기
                ctx.beginPath();
                ctx.moveTo(0, this.size * 0.5); // 줄기 끝
                ctx.lineTo(-this.size * 0.1, this.size * 0.5);
                ctx.lineTo(0, this.size * 0.15); // 아랫부분
                // 좌측 하단 잎
                ctx.lineTo(-this.size * 0.6, this.size * 0.2);
                ctx.lineTo(-this.size * 0.3, -this.size * 0.05);
                // 좌측 중단 잎
                ctx.lineTo(-this.size * 0.7, -this.size * 0.3);
                ctx.lineTo(-this.size * 0.2, -this.size * 0.35);
                // 상단 중심 잎
                ctx.lineTo(0, -this.size * 0.8);
                // 우측 중단 잎
                ctx.lineTo(this.size * 0.2, -this.size * 0.35);
                ctx.lineTo(this.size * 0.7, -this.size * 0.3);
                // 우측 하단 잎
                ctx.lineTo(this.size * 0.3, -this.size * 0.05);
                ctx.lineTo(this.size * 0.6, this.size * 0.2);
                ctx.lineTo(0, this.size * 0.15); // 시작점으로 복귀
                ctx.closePath();
                ctx.fill();

                ctx.restore();
            }
        }

        for (let i = 0; i < numLeaves; i++) {
            leaves.push(new Leaf());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            leaves.forEach(leaf => {
                leaf.update();
                leaf.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    }

    async function initGuestbook() {
        const listEl = $('#gbList');
        const submitBtn = $('#gbSubmitBtn');
        const config = CONFIG.firebaseConfig;

        if (!config || !config.apiKey) {
            if (listEl) listEl.innerHTML = '<div class="gb-loading" style="color:#ef4444;">방명록 기능이 비활성화되었습니다. (Firebase 설정 필요)</div>';
            if (submitBtn) submitBtn.disabled = true;
            return;
        }

        try {
            // Firebase 모듈 동적 로드 (버전 12.12.0)
            const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js");
            const { getDatabase, ref, push, onValue } = await import("https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js");

            const app = initializeApp(config);
            const db = getDatabase(app);
            const dbRef = ref(db, 'guestbooks/maple_style');

            if (listEl) listEl.innerHTML = '<div class="gb-loading">실시간 데이터를 연결 중입니다...</div>';

            let allEntries = [];
            const ITEMS_PER_PAGE = 5;
            let currentPage = 1;
            const paginationEl = $('#gbPagination');

            // 실시간 데이터 수신 리스너 추가
            onValue(dbRef, (snapshot) => {
                if (listEl) listEl.innerHTML = '';
                const data = snapshot.val();
                
                if (!data) {
                    allEntries = [];
                    renderPage(1);
                    return;
                }

                const entries = [];
                for (const key in data) {
                    entries.push({ id: key, ...data[key] });
                }

                allEntries = entries.reverse(); // 최신순
                renderPage(1);
            }, (error) => {
                console.error("Firebase read err: ", error);
                if (listEl) listEl.innerHTML = '<div class="gb-loading" style="color:#ef4444;">데이터베이스 접속 오류 (초기 세팅 규칙을 확인해 주세요.)</div>';
            });

            function renderPage(page) {
                if (!listEl) return;
                currentPage = page;
                
                if (allEntries.length === 0) {
                    listEl.innerHTML = '<div class="gb-loading">첫 번째 파티 축하글의 주인공이 되어보세요!</div>';
                    if (paginationEl) paginationEl.style.display = 'none';
                    return;
                }

                const start = (page - 1) * ITEMS_PER_PAGE;
                const end = start + ITEMS_PER_PAGE;
                const pageItems = allEntries.slice(start, end);

                listEl.innerHTML = '';
                pageItems.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'gb-item';

                    const safeName = String(item.name || '').replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    const safeMsg = String(item.message || '').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br>');

                    div.innerHTML = `
                        <div class="gb-header">
                            <span class="gb-name">${safeName}</span>
                            <span class="gb-date">${item.date || ''}</span>
                        </div>
                        <div class="gb-content">${safeMsg}</div>
                    `;
                    listEl.appendChild(div);
                });

                renderPagination();
            }

            function renderPagination() {
                if (!paginationEl) return;
                const totalPages = Math.ceil(allEntries.length / ITEMS_PER_PAGE);
                
                if (totalPages <= 1) {
                    paginationEl.style.display = 'none';
                    return;
                }
                
                paginationEl.style.display = 'flex';
                paginationEl.innerHTML = '';

                for (let i = 1; i <= totalPages; i++) {
                    const btn = document.createElement('button');
                    btn.className = 'pagination-btn' + (i === currentPage ? ' active' : '');
                    btn.textContent = i;
                    btn.onclick = () => renderPage(i);
                    paginationEl.appendChild(btn);
                }
            }

            // 작성하기 기능 (빠른 응답)
            if (submitBtn) {
                submitBtn.addEventListener('click', async () => {
                    const name = $('#gbName').value.trim();
                    const pw = $('#gbPassword').value.trim();
                    const msg = $('#gbMessage').value.trim();

                    if (!name || !msg) {
                        showToast('닉네임과 내용을 모두 입력해주세요!');
                        return;
                    }

                    submitBtn.disabled = true;
                    submitBtn.textContent = '전송 중...';

                    const now = new Date();
                    const dateStr = Utilities_formatDate_mock(now);

                    try {
                        await push(dbRef, {
                            name: name,
                            password: pw,
                            message: msg,
                            date: dateStr,
                            timestamp: now.getTime()
                        });
                        
                        showToast('방명록이 등록되었습니다!');
                        $('#gbName').value = '';
                        $('#gbPassword').value = '';
                        $('#gbMessage').value = '';

                    } catch (err) {
                        console.error("Firebase write err: ", err);
                        showToast('방명록 등록 오류가 발생했습니다.');
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.textContent = '글쓰기 등록';
                    }
                });
            }
        } catch (err) {
            console.error("Firebase SDK init err: ", err);
            if (listEl) listEl.innerHTML = '<div class="gb-loading" style="color:#ef4444;">시스템 모듈 오류, 접속 환경을 확인하세요.</div>';
        }

        function Utilities_formatDate_mock(d) {
            const yr = d.getFullYear();
            const mo = String(d.getMonth() + 1).padStart(2, '0');
            const da = String(d.getDate()).padStart(2, '0');
            const hr = String(d.getHours()).padStart(2, '0');
            const mi = String(d.getMinutes()).padStart(2, '0');
            return `${yr}-${mo}-${da} ${hr}:${mi}`;
        }
    }

    async function init() {
        // Basic Meta
        document.title = CONFIG.meta.title;

        initHero();
        initGreeting();
        initMap();
        initAccounts();
        initBGM();
        initModal();
        initLeaves();
        initGuestbook();

        // Set Footer
        if ($('#footerText')) {
            $('#footerText').textContent = `${CONFIG.groom.name} & ${CONFIG.bride.name} Wedding`;
        }

        // Story text
        if ($('#storyTitle')) $('#storyTitle').textContent = CONFIG.story.title || '퀘스트 로그';
        if ($('#storyContent')) $('#storyContent').textContent = CONFIG.story.content;

        // Load dynamic images (Story)
        const storyImages = await loadImagesFromFolder('story');
        const storyGallery = $('#storyPhotos');
        if (storyGallery && storyImages.length > 0) {
            storyImages.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.style.cursor = 'pointer';
                storyGallery.appendChild(img);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
