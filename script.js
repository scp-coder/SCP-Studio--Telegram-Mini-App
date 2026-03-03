/**
 * SCP Studio — Mini App Script
 * Neumorphic UI + Settings Sheet (mirroring scp_studio_settings_sheet.xml)
 */

const categories = {
    programmer: {
        title: "PROGRAMMER TOOLS",
        items: [
            { id: "keystore_tools", title: "KeyStore Tools", desc: "Manage, generate, and sign application keys securely." },
            { id: "password_gen", title: "Password Generator", desc: "Generate strong cryptographically secure passwords." }
        ]
    },
    protection: {
        title: "PROTECTION TOOLS",
        items: [
            { id: "apk_protector", title: "Apk Protector", desc: "Advanced obfuscation and anti-tampering for APKs." },
            { id: "file_protection", title: "File Protection", desc: "Encrypted storage lock for local assets." },
            { id: "text_encryption", title: "Text Encryption", desc: "AES-256 and SHA-based encryption for text." }
        ]
    },
    designer: {
        title: "DESIGNER TOOLS",
        items: [
            { id: "color_picker", title: "Color Picker", desc: "Extract hex/rgba codes from image assets." },
            { id: "color_converter", title: "Color Converter", desc: "Handle HSL, RGB, and HEX conversions." },
            { id: "icon_designer", title: "Icon Designer", desc: "Automate layered asset generation for icons." },
            { id: "app_designer", title: "App Designer", desc: "UI prototyping and blueprint creation." }
        ]
    },
    utility: {
        title: "UTILITY TOOLS",
        items: [
            { id: "firebase_tester", title: "Firebase Tester", desc: "Validate Firebase schemas and responses." },
            { id: "text_repeater", title: "Text Repeater", desc: "Generate text payloads for stress-testing." },
            { id: "text_sorter", title: "Text Sorter", desc: "Sort logic-based line arrays." },
            { id: "checker_tools", title: "Checker Tools", desc: "Validate codes and system inputs." },
            { id: "qr_gen", title: "QR Code Generator", desc: "Generate encrypted visual metadata links." }
        ]
    }
};

let currentCategory = 'programmer';
const tg = window.Telegram.WebApp;

// ─── Boot ──────────────────────────────────────────────
const initSystem = () => {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#1a1d21');
    tg.setBackgroundColor('#1a1d21');
    renderTools();
};

// ─── Render List ───────────────────────────────────────
const renderTools = () => {
    const list = document.getElementById('scp-list');
    const chipText = document.querySelector('#special-tools span');
    if (!list) return;

    const cat = categories[currentCategory];
    chipText.textContent = cat.title;

    list.classList.add('fading');
    setTimeout(() => {
        list.innerHTML = '';
        list.classList.remove('fading');

        cat.items.forEach((item, i) => {
            const card = document.createElement('article');
            card.className = 'list-item-card';
            card.innerHTML = `
                <div class="item-inner">
                    <header class="item-header"><h2 class="item-id">${item.title}</h2></header>
                    <p class="item-desc">${item.desc}</p>
                </div>`;
            card.addEventListener('click', () => handleToolClick(item));
            card.style.cssText = 'opacity:0;transform:translateY(15px)';
            list.appendChild(card);
            setTimeout(() => {
                card.style.transition = 'opacity .45s ease, transform .45s cubic-bezier(.19,1,.22,1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 55 * i);
        });
    }, 160);
};

const handleToolClick = (tool) => {
    tg.HapticFeedback.impactOccurred('medium');
    tg.showAlert(`${tool.title}\n\nStatus: SECURE\nInitializing module...`);
};

const switchCategory = () => {
    tg.HapticFeedback.impactOccurred('light');
    const keys = Object.keys(categories);
    currentCategory = keys[(keys.indexOf(currentCategory) + 1) % keys.length];
    renderTools();
};

// ─── Settings Sheet ────────────────────────────────────
const openSettings = () => {
    tg.HapticFeedback.selectionChanged();
    document.getElementById('settings-dialog').classList.add('open');
    document.getElementById('dialog-overlay').classList.add('open');
};

window.closeSettings = () => {
    document.getElementById('settings-dialog').classList.remove('open');
    document.getElementById('dialog-overlay').classList.remove('open');
};


// ─── Event Wiring ──────────────────────────────────────
const setupListeners = () => {
    document.getElementById('settings-trigger')?.addEventListener('click', openSettings);
    document.getElementById('special-tools')?.addEventListener('click', switchCategory);

    // Settings sheet buttons
    document.getElementById('btn-about')?.addEventListener('click', () => {
        tg.HapticFeedback.impactOccurred('light');
        tg.showAlert('SCP Studio\nBy the SCP Developer Team.\n\nA professional mobile toolkit for Android developers.');
    });
    document.getElementById('btn-theme')?.addEventListener('click', () => {
        tg.HapticFeedback.impactOccurred('light');
        tg.showAlert('Theme: DARK MODE LOCKED\nCurrently using Neumorphic Slate.');
    });
    document.getElementById('btn-app-icon')?.addEventListener('click', () => {
        tg.HapticFeedback.impactOccurred('light');
        tg.showAlert('App Icon: DEFAULT\nAlternative icons coming soon.');
    });
    document.getElementById('btn-protect')?.addEventListener('click', () => {
        tg.HapticFeedback.impactOccurred('heavy');
        tg.showAlert('Protection Layer: ACTIVE\nAll sessions are encrypted.');
    });
    document.getElementById('btn-anim')?.addEventListener('click', () => {
        tg.HapticFeedback.impactOccurred('light');
        tg.showAlert('Animations: ENABLED\nSmooth transitions active.');
    });
    document.getElementById('btn-phone-info')?.addEventListener('click', () => {
        tg.HapticFeedback.impactOccurred('light');
        const user = tg.initDataUnsafe?.user;
        tg.showAlert(`Device Info:\nTelegram User: ${user?.username || user?.first_name || 'Unknown'}\nPlatform: ${navigator.platform}`);
    });
    document.getElementById('btn-keyboard')?.addEventListener('click', () => {
        tg.HapticFeedback.selectionChanged();
        tg.showAlert('Keyboard Shortcuts:\n• Tap chip → Switch Category\n• Long press item → Options');
    });
    document.getElementById('btn-report')?.addEventListener('click', () => {
        tg.HapticFeedback.notificationOccurred('warning');
        tg.showAlert('Report a Bug:\nSend your report to @SCPStudioDev on Telegram.');
    });
    document.getElementById('btn-telegram')?.addEventListener('click', () => {
        tg.HapticFeedback.impactOccurred('light');
        window.open('https://t.me/SCPStudioDev', '_blank');
    });
    document.getElementById('btn-discord')?.addEventListener('click', () => {
        tg.HapticFeedback.impactOccurred('light');
        tg.showAlert('Discord: Coming Soon.');
    });
};

// ─── Start ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initSystem();
    setupListeners();
});
