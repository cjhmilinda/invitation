/**
 * Classic Elegant Wedding Invitation
 * Korean Mobile 청첩장 - Script
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     Utility Helpers
     ═══════════════════════════════════════════ */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function formatDate(dateStr, timeStr) {
    const d = new Date(`${dateStr}T${timeStr}:00`);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const day = days[d.getDay()];
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const period = hours < 12 ? '오전' : '오후';
    const h12 = hours % 12 || 12;
    const minuteStr = minutes > 0 ? ` ${minutes}분` : '';
    return `${year}년 ${month}월 ${date}일 ${day}요일 ${period} ${h12}시${minuteStr}`;
  }

  function getWeddingDateTime() {
    return new Date(`${CONFIG.wedding.date}T${CONFIG.wedding.time}:00`);
  }

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
        const path = `images/${folder}/${current}.jpg`;
        
        // Use HEAD request to check file existence without downloading the whole image
        fetch(path, { method: 'HEAD' })
          .then(res => {
            if (res.ok) {
              images.push(path);
              consecutiveFails = 0;
            } else {
              consecutiveFails++;
            }
            current++;
            tryNext();
          })
          .catch(() => {
            consecutiveFails++;
            current++;
            tryNext();
          });
      }

      tryNext();
    });
  }

  /* ═══════════════════════════════════════════
     Toast
     ═══════════════════════════════════════════ */

  let toastTimer = null;
  function showToast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2500);
  }

  /* ═══════════════════════════════════════════
     Clipboard
     ═══════════════════════════════════════════ */

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
     OG Meta Tags
     ═══════════════════════════════════════════ */

  function setMetaTags() {
    const m = CONFIG.meta;
    document.title = m.title;
    const setMeta = (attr, val, content) => {
      const el = document.querySelector(`meta[${attr}="${val}"]`);
      if (el) el.setAttribute('content', content);
    };
    setMeta('property', 'og:title', m.title);
    setMeta('property', 'og:description', m.description);
    setMeta('property', 'og:image', 'images/og/1.jpg');
    setMeta('name', 'description', m.description);
  }

  /* ═══════════════════════════════════════════
     BGM (Background Music)
     ═══════════════════════════════════════════ */

  let isBgmPlaying = false;

  function initBgm() {
    const audio = $('#bgmAudio');
    const toggleBtn = $('#bgmToggleBtn');

    if (!CONFIG.useBgm || !audio || !toggleBtn) {
      if (toggleBtn) toggleBtn.style.display = 'none';
      return;
    }

    audio.src = CONFIG.bgmPath;
    toggleBtn.classList.remove('is-hidden');

    toggleBtn.addEventListener('click', () => {
      if (isBgmPlaying) {
        audio.pause();
        isBgmPlaying = false;
        toggleBtn.classList.remove('is-playing');
      } else {
        audio.play().catch(() => showToast('음악을 재생할 수 없습니다.'));
        isBgmPlaying = true;
        toggleBtn.classList.add('is-playing');
      }
    });

    // 사용자가 첫 클릭이나 스크롤 시도 때 배경음악이 재생되도록 이벤트를 겁니다.
    document.addEventListener('scroll', startBgmIfEnabled, { once: true });
    document.addEventListener('click', startBgmIfEnabled, { once: true });
    document.addEventListener('touchstart', startBgmIfEnabled, { once: true });
  }

  function startBgmIfEnabled() {
    const audio = $('#bgmAudio');
    const toggleBtn = $('#bgmToggleBtn');
    if (CONFIG.useBgm && audio && !isBgmPlaying) {
      audio.play().then(() => {
        isBgmPlaying = true;
        toggleBtn.classList.add('is-playing');
      }).catch(err => {
        console.warn('BGM 자동 재생이 브라우저 정책으로 차단되었습니다.', err);
      });
    }
  }

  /* ═══════════════════════════════════════════
     Falling Petals
     ═══════════════════════════════════════════ */

  function initPetals() {
    const canvas = $('#petalCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    const petals = [];
    const PETAL_COUNT = 25;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height * -1 : -20;
        this.size = 12 + Math.random() * 15;
        this.speedY = 0.5 + Math.random() * 0.7; // 떨어지는 속도 (기존 1 + 1.5)
        this.speedX = -0.5 + Math.random() * 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02; // 회전 속도 (기존 0.04)
        this.oscillateAmp = 20 + Math.random() * 30;
        this.oscillateSpeed = 0.005 + Math.random() * 0.015; // 좌우 흔들림 속도 (기존 0.01 + 0.03)
        this.oscillateOffset = Math.random() * Math.PI * 2;
        this.opacity = 0.4 + Math.random() * 0.5;
        this.t = 0;
      }

      update() {
        this.t++;
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.t * this.oscillateSpeed + this.oscillateOffset) * 0.5;
        this.rotation += this.rotSpeed;
        if (this.y > height + 20) this.reset();
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Simulating 3D flip with a scale derived from time/oscillation
        const scaleY = Math.sin(this.t * this.oscillateSpeed * 2 + this.oscillateOffset);
        ctx.scale(1, Math.abs(scaleY) * 0.6 + 0.4);

        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        // Beautiful pink gradient like the requested image
        const grad = ctx.createLinearGradient(0, -this.size * 0.5, this.size, this.size * 0.5);
        grad.addColorStop(0, '#fff0f5'); // Lavender blush
        grad.addColorStop(0.5, '#ffd1dc'); // Soft pink
        grad.addColorStop(1, '#ffb6c1'); // Light pink

        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(255, 182, 193, 0.5)';
        ctx.shadowBlur = 5;

        ctx.beginPath();
        // More elegant and organic petal shape
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          this.size * 0.4, -this.size * 0.5,
          this.size * 0.9, -this.size * 0.4,
          this.size, 0
        );
        ctx.bezierCurveTo(
          this.size * 0.9, this.size * 0.4,
          this.size * 0.4, this.size * 0.5,
          0, 0
        );
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push(new Petal());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      petals.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ═══════════════════════════════════════════
     Hero Section
     ═══════════════════════════════════════════ */

  function initHero() {
    $('#heroPhoto').src = 'images/hero/1.jpg';
    $('#heroNames').textContent = `${CONFIG.groom.name}  ·  ${CONFIG.bride.name}`;
    $('#heroDate').textContent = formatDate(CONFIG.wedding.date, CONFIG.wedding.time);
    $('#heroVenue').textContent = CONFIG.wedding.venue;
  }

  /* ═══════════════════════════════════════════
     Countdown
     ═══════════════════════════════════════════ */

  function initCountdown() {
    const target = getWeddingDateTime();

    function update() {
      const now = new Date();
      const diff = target - now;

      const labelEl = $('#countdownLabel');

      if (diff <= 0) {
        $('#countDays').textContent = '0';
        $('#countHours').textContent = '0';
        $('#countMinutes').textContent = '0';
        $('#countSeconds').textContent = '0';
        labelEl.textContent = '결혼식이 시작되었습니다';
        return;
      }

      const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      labelEl.textContent = `결혼식까지 D-${totalDays}`;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      $('#countDays').textContent = days;
      $('#countHours').textContent = String(hours).padStart(2, '0');
      $('#countMinutes').textContent = String(minutes).padStart(2, '0');
      $('#countSeconds').textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ═══════════════════════════════════════════
     Greeting Section
     ═══════════════════════════════════════════ */

  function initGreeting() {
    $('#greetingTitle').textContent = CONFIG.greeting.title;
    $('#greetingContent').textContent = CONFIG.greeting.content;

    const g = CONFIG.groom;
    const b = CONFIG.bride;

    function parentLine(father, mother, fatherDeceased, motherDeceased) {
      const fd = fatherDeceased ? ' deceased' : '';
      const md = motherDeceased ? ' deceased' : '';
      return `<span class="${fd}">${father}</span> · <span class="${md}">${mother}</span>`;
    }

    const parentsHTML = `
      <div class="parent-row">
        ${parentLine(g.father, g.mother, g.fatherDeceased, g.motherDeceased)}
        <span class="parent-dot">●</span>
        의 아들 <span class="child-name">${g.name}</span>
      </div>
      <div class="parent-row">
        ${parentLine(b.father, b.mother, b.fatherDeceased, b.motherDeceased)}
        <span class="parent-dot">●</span>
        의 딸 <span class="child-name">${b.name}</span>
      </div>
    `;

    $('#greetingParents').innerHTML = parentsHTML;
  }

  /* ═══════════════════════════════════════════
     Calendar Section
     ═══════════════════════════════════════════ */

  function initCalendar() {
    const dt = getWeddingDateTime();
    const year = dt.getFullYear();
    const month = dt.getMonth();
    const weddingDay = dt.getDate();

    const grid = $('#calendarGrid');

    // Header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    grid.innerHTML = `<div class="calendar__header">${monthNames[month]} ${year}</div>`;

    // Weekdays
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const wdRow = document.createElement('div');
    wdRow.className = 'calendar__weekdays';
    weekdays.forEach(wd => {
      const el = document.createElement('span');
      el.className = 'calendar__weekday';
      el.textContent = wd;
      wdRow.appendChild(el);
    });
    grid.appendChild(wdRow);

    // Days
    const daysContainer = document.createElement('div');
    daysContainer.className = 'calendar__days';

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('span');
      empty.className = 'calendar__day is-empty';
      daysContainer.appendChild(empty);
    }

    for (let d = 1; d <= lastDate; d++) {
      const dayEl = document.createElement('span');
      dayEl.className = 'calendar__day';
      if (d === weddingDay) dayEl.classList.add('is-today');
      dayEl.textContent = d;
      daysContainer.appendChild(dayEl);
    }

    grid.appendChild(daysContainer);

    // Google Calendar link
    const startDate = dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDt = new Date(dt.getTime() + 2 * 60 * 60 * 1000);
    const endDate = endDt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CONFIG.groom.name + ' ♥ ' + CONFIG.bride.name + ' 결혼식')}&dates=${startDate}/${endDate}&location=${encodeURIComponent(CONFIG.wedding.venue + ' ' + CONFIG.wedding.address)}&details=${encodeURIComponent('결혼식에 초대합니다.')}`;
    $('#googleCalBtn').href = gcalUrl;

    // ICS download
    $('#icsDownloadBtn').addEventListener('click', () => {
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Wedding//Invitation//KO',
        'BEGIN:VEVENT',
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${CONFIG.groom.name} ♥ ${CONFIG.bride.name} 결혼식`,
        `LOCATION:${CONFIG.wedding.venue} ${CONFIG.wedding.address}`,
        'DESCRIPTION:결혼식에 초대합니다.',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wedding.ics';
      a.click();
      URL.revokeObjectURL(url);
      showToast('캘린더 파일이 다운로드됩니다');
    });
  }

  /* ═══════════════════════════════════════════
     Story Section
     ═══════════════════════════════════════════ */

  function initStory(storyImages) {
    $('#storyTitle').textContent = CONFIG.story.title;
    $('#storyContent').textContent = CONFIG.story.content;

    const container = $('#storyPhotos');
    // Remove loading placeholder if present
    const placeholder = container.querySelector('.loading-placeholder');
    if (placeholder) placeholder.remove();

    if (storyImages.length === 0) return;

    storyImages.forEach((src, i) => {
      const div = document.createElement('div');
      div.className = 'story__photo-item animate-item';
      div.setAttribute('data-animate', 'fade-up');
      div.innerHTML = `<img src="${src}" alt="스토리 사진 ${i + 1}" loading="lazy">`;
      div.addEventListener('click', () => openPhotoModal(storyImages, i));
      container.appendChild(div);
    });
  }

  /* ═══════════════════════════════════════════
     Gallery Section
     ═══════════════════════════════════════════ */

  function initGallery(galleryImages) {
    const grid = $('#galleryGrid');
    // Remove loading placeholder if present
    const placeholder = grid.querySelector('.loading-placeholder');
    if (placeholder) placeholder.remove();

    if (galleryImages.length === 0) {
      // Hide gallery section if no images found
      const gallerySection = $('#gallery');
      if (gallerySection) gallerySection.style.display = 'none';
      return;
    }

    galleryImages.forEach((src, i) => {
      const div = document.createElement('div');
      div.className = 'gallery__item animate-item';
      div.setAttribute('data-animate', 'scale-in');
      
      // 원본 경로에서 파일명 부분만 추출/교체하여 thumb 경로 생성
      // "images/gallery/1.jpg" -> "images/gallery/thumb/1.jpg"
      const thumbSrc = src.replace('images/gallery/', 'images/gallery/thumb/');
      
      // 그리드에는 저용량 썸네일을 표시 (대역폭 초절약)
      div.innerHTML = `<img src="${thumbSrc}" alt="갤러리 사진 ${i + 1}" loading="lazy">`;
      
      // 클릭 시 모달에는 원본 고해상도 이미지 배열(galleryImages)을 통째로 전달
      div.addEventListener('click', () => openPhotoModal(galleryImages, i));
      grid.appendChild(div);
    });
  }

  /* ═══════════════════════════════════════════
     Photo Modal (with swipe)
     ═══════════════════════════════════════════ */

  let modalImages = [];
  let modalIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  let savedScrollY = 0; // 스크롤 위치 저장용 변수

  function openPhotoModal(images, index) {
    modalImages = images;
    modalIndex = index;
    
    // 모달 여는 순간의 현재 스크롤 위치 기억
    savedScrollY = window.scrollY;
    
    showModalImage();
    $('#photoModal').classList.add('is-open');
    
    // 스크롤이 탑으로 튕기지 않게 현재 위치에 body를 고정
    document.body.style.top = `-${savedScrollY}px`;
    document.body.classList.add('no-scroll');
  }

  function closePhotoModal() {
    $('#photoModal').classList.remove('is-open');
    
    document.body.classList.remove('no-scroll');
    // 고정했던 top 속성 지우기
    document.body.style.removeProperty('top');
    // 저장해둔 스크롤 위치로 원래대로 돌려놓기 (수직 튐 방지)
    window.scrollTo(0, savedScrollY);
  }

  function showModalImage() {
    const img = $('#modalImg');
    img.src = modalImages[modalIndex];
    $('#modalCounter').textContent = `${modalIndex + 1} / ${modalImages.length}`;

    $('#modalPrev').style.display = modalIndex > 0 ? '' : 'none';
    $('#modalNext').style.display = modalIndex < modalImages.length - 1 ? '' : 'none';
  }

  function modalNavigate(dir) {
    const newIndex = modalIndex + dir;
    if (newIndex >= 0 && newIndex < modalImages.length) {
      modalIndex = newIndex;
      showModalImage();
    }
  }

  function initPhotoModal() {
    $('#modalClose').addEventListener('click', closePhotoModal);
    $('#modalPrev').addEventListener('click', () => modalNavigate(-1));
    $('#modalNext').addEventListener('click', () => modalNavigate(1));

    const modal = $('#photoModal');
    // 사용자가 요청한 대로, 모달 배경을 눌러도 닫히지 않고 X버튼으로만 닫히도록 유지합니다.
    /*
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.id === 'modalContainer') {
        closePhotoModal();
      }
    });
    */

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closePhotoModal();
      if (e.key === 'ArrowLeft') modalNavigate(-1);
      if (e.key === 'ArrowRight') modalNavigate(1);
    });

    // Swipe support
    const container = $('#modalContainer');

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    const minSwipe = 50;

    if (Math.abs(diffX) < minSwipe || Math.abs(diffX) < Math.abs(diffY)) return;

    if (diffX > 0) {
      modalNavigate(1); // swipe left -> next
    } else {
      modalNavigate(-1); // swipe right -> prev
    }
  }

  /* ═══════════════════════════════════════════
     Location Section
     ═══════════════════════════════════════════ */

  function initLocation() {
    const w = CONFIG.wedding;
    $('#locationVenue').textContent = w.venue;
    $('#locationHall').textContent = w.hall;
    $('#locationAddress').textContent = w.address;
    $('#locationTel').textContent = w.tel ? `Tel. ${w.tel}` : '';
    
    if (w.transit) {
      const setTransitInfo = (id, text) => {
        const p = $(`#${id}`);
        const wrapper = $(`#${id.replace('transit', 'transitItem')}`);
        if (p && wrapper) {
          if (text) {
            p.textContent = text;
            wrapper.style.display = '';
          } else {
            wrapper.style.display = 'none';
          }
        }
      };

      setTransitInfo('transitSubway', w.transit.subway);
      setTransitInfo('transitShuttle', w.transit.shuttle);
      setTransitInfo('transitBus', w.transit.bus);
      setTransitInfo('transitParking', w.transit.parking);
      setTransitInfo('transitAtm', w.transit.atm);
    }

    $('#kakaoMapBtn').href = w.mapLinks.kakao || '#';
    $('#naverMapBtn').href = w.mapLinks.naver || '#';

    $('#copyAddressBtn').addEventListener('click', () => {
      copyToClipboard(w.address, '주소가 복사되었습니다');
    });
  }

  /* ═══════════════════════════════════════════
     Account Section (축의금)
     ═══════════════════════════════════════════ */

  function renderAccounts(accounts, containerId) {
    const container = $(`#${containerId}`);
    accounts.forEach((acc) => {
      const item = document.createElement('div');
      item.className = 'account-item';
      item.innerHTML = `
        <div class="account-item__info">
          <div class="account-item__role">${acc.role}</div>
          <div class="account-item__detail">
            <span class="account-item__name">${acc.name || ''}</span>
            ${acc.bank} ${acc.number}
          </div>
        </div>
        <button class="account-item__copy" data-account="${acc.bank} ${acc.number} ${acc.name || ''}">
          복사
        </button>
      `;
      container.appendChild(item);
    });
  }

  function initAccordion(triggerId, panelId) {
    const trigger = $(`#${triggerId}`);
    const panel = $(`#${panelId}`);

    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', !expanded);

      if (!expanded) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      } else {
        panel.style.maxHeight = '0';
      }
    });
  }

  function initAccounts() {
    renderAccounts(CONFIG.accounts.groom, 'groomAccountList');
    renderAccounts(CONFIG.accounts.bride, 'brideAccountList');

    initAccordion('groomAccordion', 'groomAccordionPanel');
    initAccordion('brideAccordion', 'brideAccordionPanel');

    // Copy account delegates
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.account-item__copy');
      if (!btn) return;
      const text = btn.dataset.account;
      copyToClipboard(text, '계좌번호가 복사되었습니다');
    });
  }

  /* ═══════════════════════════════════════════
     Footer
     ═══════════════════════════════════════════ */

  function initFooter() {
    const dt = getWeddingDateTime();
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    $('#footerText').textContent = `${CONFIG.groom.name} & ${CONFIG.bride.name} — ${year}.${month}.${day}`;
  }

  /* ═══════════════════════════════════════════
     Loading Placeholders
     ═══════════════════════════════════════════ */

  function showLoadingPlaceholders() {
    const storyPhotos = $('#storyPhotos');
    const galleryGrid = $('#galleryGrid');

    const placeholderHTML = '<div class="loading-placeholder"><span class="loading-dot"></span><span class="loading-dot"></span><span class="loading-dot"></span></div>';

    if (storyPhotos) storyPhotos.innerHTML = placeholderHTML;
    if (galleryGrid) galleryGrid.innerHTML = placeholderHTML;
  }

  /* ═══════════════════════════════════════════
     Scroll Animations (IntersectionObserver)
     ═══════════════════════════════════════════ */

  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    // Observe initial static items
    $$('.animate-item').forEach((el) => observer.observe(el));

    // Re-observe after dynamic content is added (MutationObserver)
    const mutObs = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.classList && node.classList.contains('animate-item')) {
            observer.observe(node);
          }
          if (node.querySelectorAll) {
            node.querySelectorAll('.animate-item').forEach((el) => observer.observe(el));
          }
        });
      });
    });

    mutObs.observe(document.body, { childList: true, subtree: true });
  }

  /* ═══════════════════════════════════════════
     Guestbook
     ═══════════════════════════════════════════ */
  async function initGuestbook() {
    const listEl = $('#gbList');
    const submitBtn = $('#gbSubmitBtn');
    const paginationEl = $('#gbPagination');
    const config = CONFIG.firebaseConfig;

    if (!config || !config.apiKey) {
      if (listEl) listEl.innerHTML = '<div class="gb-loading" style="color:#ef4444;">방명록 설정(Firebase)이 필요합니다.</div>';
      return;
    }

    let allEntries = [];
    const ITEMS_PER_PAGE = 5;
    let currentPage = 1;

    try {
      const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js");
      const { getDatabase, ref, push, onValue } = await import("https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js");

      const app = initializeApp(config);
      const db = getDatabase(app);
      const dbRef = ref(db, 'guestbooks/classic_elegant');

      if (listEl) listEl.innerHTML = '<div class="gb-loading">방명록 데이터를 불러오는 중입니다...</div>';

      onValue(dbRef, (snapshot) => {
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
        allEntries = entries.reverse(); // 최신 등록순
        renderPage(1); // 글 쓰거나 처음 로드될 때 1페이지로
      });

      function renderPage(page) {
        if (!listEl) return;
        currentPage = page;
        
        if (allEntries.length === 0) {
          listEl.innerHTML = '<div class="gb-loading">가장 먼저 축하의 마음을 남겨주세요!</div>';
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

      if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
          const name = $('#gbName').value.trim();
          const pw = $('#gbPassword').value.trim();
          const msg = $('#gbMessage').value.trim();

          if (!name || !msg) {
            alert('이름과 메시지를 모두 입력해주세요.');
            return;
          }

          submitBtn.disabled = true;
          submitBtn.textContent = '등록 중...';

          const now = new Date();
          const dateStr = Utilities_formatDate_mock(now);

          try {
            await push(dbRef, { name, password: pw, message: msg, date: dateStr, timestamp: now.getTime() });
            $('#gbName').value = '';
            $('#gbPassword').value = '';
            $('#gbMessage').value = '';
          } catch (err) {
            console.error(err);
            alert('방명록 등록 중 오류가 발생했습니다.');
          } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '등록하기';
          }
        });
      }
    } catch (err) {
      console.error(err);
      if (listEl) listEl.innerHTML = '<div class="gb-loading" style="color:#ef4444;">오류가 발생했습니다. 잠시 후 다시 시도해주세요.</div>';
    }
  }

  function Utilities_formatDate_mock(d) {
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    const hr = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${yr}-${mo}-${da} ${hr}:${mi}`;
  }

  /* ═══════════════════════════════════════════
     Init
     ═══════════════════════════════════════════ */

  async function init() {
    setMetaTags();
    initBgm();
    initPetals(); // 커튼이 없으므로 바로 실행
    initHero();
    initCountdown();
    initGreeting();
    initCalendar();

    // Show loading placeholders while detecting images
    showLoadingPlaceholders();

    // Init sections that don't depend on image detection
    initPhotoModal();
    initLocation();
    initAccounts();
    initFooter();
    initGuestbook();
    initScrollAnimations();

    // Set story text immediately (photos load async)
    $('#storyTitle').textContent = CONFIG.story.title;
    $('#storyContent').textContent = CONFIG.story.content;

    // Auto-detect story and gallery images in parallel
    const [storyImages, galleryImages] = await Promise.all([
      loadImagesFromFolder('story'),
      loadImagesFromFolder('gallery')
    ]);

    // Render sections with discovered images
    initStory(storyImages);
    initGallery(galleryImages);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
