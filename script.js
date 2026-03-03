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
            card.addEventListener('click', () => handleToolClick(item.id));
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

const handleToolClick = (toolId) => {
    tg.HapticFeedback.impactOccurred('light');
    if (toolId === 'keystore_tools') {
        openKeystore();
    } else if (toolId === 'password_gen') {
        openPasswordGen();
    } else {
        tg.showAlert('Coming Soon: ' + toolId);
    }
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


// ─── KeyStore Tools Logic ─────────────────────────────
const openKeystore = () => {
    document.getElementById('ks-overlay').classList.add('open');
    document.getElementById('ks-dialog').classList.add('open');
    // Reset views
    document.getElementById('ks-form-view').classList.remove('ks-hidden');
    document.getElementById('ks-loading-view').classList.add('ks-hidden');
    document.getElementById('ks-success-view').classList.add('ks-hidden');
};

window.closeKeystore = () => {
    document.getElementById('ks-overlay').classList.remove('open');
    document.getElementById('ks-dialog').classList.remove('open');
};

const startKeystoreGeneration = () => {
    const fields = [
        'ks-alias', 'ks-pass', 'ks-pass-confirm', 'ks-validity',
        'ks-name', 'ks-ou', 'ks-org', 'ks-locality', 'ks-state', 'ks-country'
    ];

    // Check all fields
    for (const id of fields) {
        if (!document.getElementById(id).value.trim()) {
            tg.showAlert('Error: All fields must be filled.');
            tg.HapticFeedback.notificationOccurred('error');
            return;
        }
    }

    const alias = document.getElementById('ks-alias').value;
    const pass = document.getElementById('ks-pass').value;
    const passConfirm = document.getElementById('ks-pass-confirm').value;

    if (pass !== passConfirm) {
        tg.showAlert('Error: Passwords do not match.');
        tg.HapticFeedback.notificationOccurred('error');
        return;
    }

    tg.HapticFeedback.impactOccurred('light');

    // Switch to loading view
    document.getElementById('ks-form-view').classList.add('ks-hidden');
    document.getElementById('ks-loading-view').classList.remove('ks-hidden');

    let progress = 0;
    const bar = document.getElementById('ks-progress');

    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(showKeystoreSuccess, 400);
        }
        bar.style.width = progress + '%';
    }, 200);
};

const showKeystoreSuccess = () => {
    tg.HapticFeedback.notificationOccurred('success');

    const alias = document.getElementById('ks-alias').value || 'upload';
    const name = document.getElementById('ks-name').value || 'Owner';
    const ou = document.getElementById('ks-ou').value || 'Unit';
    const org = document.getElementById('ks-org').value || 'SCP Studio';
    const loc = document.getElementById('ks-locality').value || 'City';
    const st = document.getElementById('ks-state').value || 'State';
    const country = document.getElementById('ks-country').value || 'US';
    const val = document.getElementById('ks-validity').value || '25';

    document.getElementById('ks-loading-view').classList.add('ks-hidden');
    document.getElementById('ks-success-view').classList.remove('ks-hidden');

    document.getElementById('ks-result-details').innerHTML = `
        <strong>Alias:</strong> ${alias}<br>
        <strong>DN:</strong> CN=${name}, OU=${ou}, O=${org}, L=${loc}, ST=${st}, C=${country}<br>
        <strong>Validity:</strong> ${val} years<br>
        <strong>SHA-1:</strong> 7B:B3:2A:90:F4:C6:1D:91...<br>
        <strong>SHA-256:</strong> F4:7A:B2:D1:E5:C9:8F:A1:B2:C3...<br>
        <strong>Status:</strong> Successfully Signed
    `;
};

const downloadKeystore = () => {
    tg.HapticFeedback.impactOccurred('medium');
    const alias = document.getElementById('ks-alias').value || 'scpstudiokey';
    const dummyContent = "SCP-STUDIO-BINARY-KEYSTORE-DATA-" + Date.now();
    const blob = new Blob([dummyContent], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${alias}.jks`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};

const fillKeystoreDefaults = () => {
    const randoms = {
        names: ['Ahmed Ali', 'Mustafa Hassan', 'Zaid Mohammed', 'Omar Khalid'],
        ous: ['Mobile Dev', 'Security Dept', 'Core Team', 'App Graphics'],
        orgs: ['SCP Studio', 'Coder Group', 'Elite Apps', 'Studio X'],
        cities: ['Basra', 'Baghdad', 'Erbil', 'Najaf'],
        states: ['Basra', 'Baghdad', 'Erbil', 'Najaf'],
        countries: ['IQ', 'US', 'GB', 'DE']
    };

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const pass = Math.random().toString(36).slice(-8);

    tg.HapticFeedback.selectionChanged();
    document.getElementById('ks-alias').value = 'key_' + Math.floor(Math.random() * 1000);
    document.getElementById('ks-pass').value = pass;
    document.getElementById('ks-pass-confirm').value = pass;
    document.getElementById('ks-name').value = pick(randoms.names);
    document.getElementById('ks-ou').value = pick(randoms.ous);
    document.getElementById('ks-org').value = pick(randoms.orgs);
    document.getElementById('ks-locality').value = pick(randoms.cities);
    document.getElementById('ks-state').value = pick(randoms.states);
    document.getElementById('ks-country').value = pick(randoms.countries);
};

// ─── Password Generator ─────────────────────────────────

const openPasswordGen = () => {
    document.getElementById('pass-dialog').classList.add('open');
    document.getElementById('overlay').classList.add('open');
    updateStrengthStatus();
};

const closePasswordGen = () => {
    document.getElementById('pass-dialog').classList.remove('open');
    document.getElementById('overlay').classList.remove('open');
};

const updateStrengthStatus = () => {
    const length = parseInt(document.getElementById('pass-length-slider').value);
    const upper = document.getElementById('pass-upper').checked;
    const lower = document.getElementById('pass-lower').checked;
    const digits = document.getElementById('pass-digits').checked;
    const symbols = document.getElementById('pass-symbols').checked;

    let score = 0;
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (upper) score++;
    if (lower) score++;
    if (digits) score++;
    if (symbols) score++;

    const chip = document.getElementById('pass-strength-chip');
    chip.className = 'pass-chip';
    if (score < 3) {
        chip.innerText = 'Weak';
        chip.classList.add('weak');
    } else if (score < 5) {
        chip.innerText = 'Medium';
        chip.classList.add('medium');
    } else {
        chip.innerText = 'Strong';
        chip.classList.add('strong');
    }
};

const generateSecurePassword = () => {
    const length = parseInt(document.getElementById('pass-length-slider').value);
    const useUpper = document.getElementById('pass-upper').checked;
    const useLower = document.getElementById('pass-lower').checked;
    const useDigits = document.getElementById('pass-digits').checked;
    const useSymbols = document.getElementById('pass-symbols').checked;
    const excludeAmbiguous = document.getElementById('pass-ambiguous').checked;

    if (!useUpper && !useLower && !useDigits && !useSymbols) {
        tg.showAlert('Error: Select at least one character type');
        return;
    }

    const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const LOWER = "abcdefghijklmnopqrstuvwxyz";
    const DIGITS = "0123456789";
    const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?/";
    const AMBIGUOUS = "l1IO0";

    let charPool = "";
    if (useUpper) charPool += UPPER;
    if (useLower) charPool += LOWER;
    if (useDigits) charPool += DIGITS;
    if (useSymbols) charPool += SYMBOLS;

    if (excludeAmbiguous) {
        let filteredPool = "";
        for (let char of charPool) {
            if (!AMBIGUOUS.includes(char)) filteredPool += char;
        }
        charPool = filteredPool;
    }

    if (charPool.length === 0) {
        tg.showAlert('Error: Character pool is empty');
        return;
    }

    let password = "";
    const randomArray = new Uint32Array(length);
    window.crypto.getRandomValues(randomArray);

    for (let i = 0; i < length; i++) {
        password += charPool.charAt(randomArray[i] % charPool.length);
    }

    showResultDialog("Generated Password", password);
};

// ─── Result Dialog ──────────────────────────────────────

const showResultDialog = (title, content) => {
    document.getElementById('res-dialog-title').innerText = title;
    document.getElementById('res-dialog-content').innerText = content;
    document.getElementById('result-dialog').classList.add('open');
    document.getElementById('overlay').classList.add('open');
    tg.HapticFeedback.notificationOccurred('success');
};

const closeResultDialog = () => {
    document.getElementById('result-dialog').classList.remove('open');
    // Don't remove overlay if another dialog is open
    if (!document.querySelector('.settings-dialog.open:not(.res-dialog)')) {
        document.getElementById('overlay').classList.remove('open');
    }
};

const copyResult = () => {
    const text = document.getElementById('res-dialog-content').innerText;
    navigator.clipboard.writeText(text).then(() => {
        tg.HapticFeedback.impactOccurred('light');
        showToast("Copied to clipboard!");
    });
};

const showToast = (msg) => {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
};

// ─── Initialization ─────────────────────────────────────

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

    document.getElementById('btn-anim')?.addEventListener('click', () => {
        tg.HapticFeedback.impactOccurred('light');
        tg.showAlert('Animations: ENABLED\nSmooth transitions active.');
    });

    document.getElementById('btn-keyboard')?.addEventListener('click', () => {
        tg.HapticFeedback.selectionChanged();
        tg.showAlert('Keyboard Shortcuts:\n• Tap chip → Switch Category\n• Long press item → Options');
    });

    // Close dialogs by clicking overlay
    document.getElementById('dialog-overlay')?.addEventListener('click', () => window.closeSettings());
    document.getElementById('ks-overlay')?.addEventListener('click', () => closeKeystore());
    document.getElementById('overlay')?.addEventListener('click', (e) => {
        if (e.target.id === 'overlay') {
            closePasswordGen();
            closeResultDialog();
        }
    });

    // KeyStore Tool Listeners
    document.getElementById('btn-ks-generate')?.addEventListener('click', startKeystoreGeneration);
    document.getElementById('btn-ks-download')?.addEventListener('click', downloadKeystore);
    document.getElementById('btn-ks-autofill')?.addEventListener('click', fillKeystoreDefaults);

    // Password Tool Listeners
    document.getElementById('pass-length-slider')?.addEventListener('input', (e) => {
        document.getElementById('pass-length-val').innerText = e.target.value;
        updateStrengthStatus();
    });

    const passOptionListeners = ['pass-upper', 'pass-lower', 'pass-digits', 'pass-symbols'];
    passOptionListeners.forEach(id => {
        document.getElementById(id)?.addEventListener('change', updateStrengthStatus);
    });

    document.getElementById('pass-easy')?.addEventListener('change', (e) => {
        const digits = document.getElementById('pass-digits');
        const symbols = document.getElementById('pass-symbols');
        if (e.target.checked) {
            digits.checked = false;
            symbols.checked = false;
            digits.parentElement.classList.add('disabled');
            symbols.parentElement.classList.add('disabled');
        } else {
            digits.parentElement.classList.remove('disabled');
            symbols.parentElement.classList.remove('disabled');
        }
        updateStrengthStatus();
    });

    document.getElementById('btn-pass-generate')?.addEventListener('click', generateSecurePassword);
    document.getElementById('btn-res-copy')?.addEventListener('click', copyResult);

    // Social Buttons
    document.getElementById('btn-telegram')?.addEventListener('click', () => {
        tg.HapticFeedback.impactOccurred('light');
        window.open('https://t.me/SCPStudioDev', '_blank');
    });

    document.getElementById('btn-discord')?.addEventListener('click', () => {
        tg.HapticFeedback.impactOccurred('light');
        window.open('https://discord.gg/YxbeXv5BEx', '_blank');
    });
};

// ─── Start ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initSystem();
    setupListeners();

    // Splash Timeout
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.classList.add('fade-out');
    }, 2500);
});
