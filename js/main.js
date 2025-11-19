/**
 * SimTest Main Logic
 */

// 다국어 지원 설정
const translations = {
    ko: {
        title: "SimTest",
        subtitle: "심심할 때 하는<br>초간단 심리테스트",
        randomBtn: "랜덤 테스트",
        darkModeBtn: "다크 모드",
        heroTitle1: "나를 알아가는",
        heroTitle2: "가장 즐거운 방법",
        heroDesc: "심심할 때, 고민이 있을 때, 친구와 함께.<br>SimTest에서 당신의 진짜 모습을 발견하세요.",
        heroBtn: "✨ 지금 바로 시작하기",
        tabAll: "전체",
        tabLove: "연애",
        tabPersonality: "성격",
        tabFun: "재미",
        tabKwave: "한류",
        footer: "© 2024 SimTest. All rights reserved."
    },
    en: {
        title: "SimTest",
        subtitle: "Simple & Fun<br>Psychological Tests",
        randomBtn: "Random Test",
        darkModeBtn: "Dark Mode",
        heroTitle1: "The Most Fun Way",
        heroTitle2: "To Discover Yourself",
        heroDesc: "Bored? Worried? With friends?<br>Discover your true self at SimTest.",
        heroBtn: "✨ Start Now",
        tabAll: "All",
        tabLove: "Love",
        tabPersonality: "Personality",
        tabFun: "Fun",
        tabKwave: "K-Wave",
        footer: "© 2024 SimTest. All rights reserved."
    }
};

let currentLang = localStorage.getItem('lang') || 'ko';

function initLanguage() {
    updateLanguage(currentLang);
}

function toggleLanguage() {
    currentLang = currentLang === 'ko' ? 'en' : 'ko';
    localStorage.setItem('lang', currentLang);
    updateLanguage(currentLang);

    // 현재 페이지가 테스트 페이지라면 새로고침하여 언어 적용 (간단한 처리를 위해)
    if (window.location.pathname.includes('/tests/')) {
        location.reload();
    }
}

function updateLanguage(lang) {
    document.documentElement.lang = lang;

    // 메인 페이지 텍스트 업데이트
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // 언어 버튼 텍스트 업데이트
    const langBtn = document.getElementById('current-lang');
    if (langBtn) {
        langBtn.innerText = lang === 'ko' ? 'KO' : 'EN';
    }
}

// 다크 모드 설정
function initDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('SimTest Platform Loaded');
    initDarkMode();
    initLanguage();
    if (document.getElementById('category-tabs')) {
        initTabs();
    }
});

function navigateToTest(url) {
    window.location.href = url;
}

function shareContent(title, text, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url,
        })
            .then(() => console.log('공유 성공'))
            .catch((error) => console.log('공유 실패', error));
    } else {
        // 클립보드 복사 폴백
        const tempInput = document.createElement("input");
        document.body.appendChild(tempInput);
        tempInput.value = url;
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        alert('주소가 복사되었습니다!');
    }
}

function startRandomTest() {
    const tests = document.querySelectorAll('.test-card');
    if (tests.length > 0) {
        const randomIndex = Math.floor(Math.random() * tests.length);
        const randomUrl = tests[randomIndex].getAttribute('onclick').match(/'([^']+)'/)[1];
        window.location.href = randomUrl;
    }
}

function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 활성 탭 스타일 변경
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 필터링
            const category = tab.getAttribute('data-category');
            filterTests(category);
        });
    });
}

function filterTests(category) {
    const tests = document.querySelectorAll('.test-card');
    tests.forEach(test => {
        if (category === 'all' || test.getAttribute('data-category') === category) {
            test.style.display = 'block';
            // Re-trigger animation
            test.classList.remove('animate-fade-in');
            void test.offsetWidth; // trigger reflow
            test.classList.add('animate-fade-in');
        } else {
            test.style.display = 'none';
        }
    });
}
