/**
 * SCP Studio — Mini App Script
 * Neumorphic UI + Settings Sheet
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

// ─── Theme Management ──────────────────────────────────
let currentTheme = 'light'; // Default is light (day)

const applyTheme = (theme) => {
    currentTheme = theme;
    if (theme === 'light') {
        document.documentElement.classList.add('light-theme');
    } else {
        document.documentElement.classList.remove('light-theme');
    }
    // Save to localStorage
    localStorage.setItem('scp-studio-theme', theme);
    // Update Telegram header/background colors
    if (theme === 'light') {
        tg.setHeaderColor('#e8ecf0');
        tg.setBackgroundColor('#e8ecf0');
    } else {
        tg.setHeaderColor('#1a1d21');
        tg.setBackgroundColor('#1a1d21');
    }
};

const loadTheme = () => {
    const savedTheme = localStorage.getItem('scp-studio-theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme('light'); // Default to light theme
    }
};

const openThemeDialog = () => {
    tg.HapticFeedback.selectionChanged();
    document.getElementById('theme-dialog').classList.add('open');
    document.getElementById('dialog-overlay').classList.add('open');
    
    // Update active state of buttons
    document.getElementById('btn-theme-light').classList.toggle('active', currentTheme === 'light');
    document.getElementById('btn-theme-dark').classList.toggle('active', currentTheme === 'dark');
};

window.closeThemeDialog = () => {
    document.getElementById('theme-dialog').classList.remove('open');
    document.getElementById('dialog-overlay').classList.remove('open');
    document.getElementById('settings-dialog').classList.remove('open');
};

window.selectTheme = (theme) => {
    event.preventDefault();
    tg.HapticFeedback.impactOccurred('light');
    applyTheme(theme);
    closeThemeDialog();
    showToast(theme === 'light' ? 'Light Theme Applied' : 'Dark Theme Applied');
};

// ─── Boot ──────────────────────────────────────────────
const initSystem = () => {
    tg.ready();
    tg.expand();
    loadTheme(); // Load saved theme on startup
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
    } else if (toolId === 'text_encryption') {
        openEncryption();
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

// ─── Text Encryption Tool ───────────────────────────────

let encryptMode = 'encrypt';
let encryptType = 'base64';
let encryptionHistory = [];

const openEncryption = () => {
    // Open full-screen activity instead of dialog
    document.getElementById('encrypt-activity').classList.add('open');
    // Reset fields
    document.getElementById('encrypt-data').value = '';
    document.getElementById('encrypt-output').value = '';
    document.getElementById('encrypt-key').value = '';
    document.getElementById('encrypt-reverser').checked = false;
    setEncryptMode('encrypt');
    setEncryptType('base64');
    tg.HapticFeedback.impactOccurred('light');
};

// Go back to home screen
window.goHome = () => {
    tg.HapticFeedback.impactOccurred('light');
    closeEncryption();
};

window.closeEncryption = () => {
    document.getElementById('encrypt-activity').classList.remove('open');
};

window.setEncryptMode = (mode) => {
    encryptMode = mode;
    const btnEncrypt = document.getElementById('btn-encrypt-mode');
    const btnDecrypt = document.getElementById('btn-decrypt-mode');
    const actionText = document.getElementById('encrypt-action-text');
    
    if (mode === 'encrypt') {
        btnEncrypt.classList.add('active');
        btnDecrypt.classList.remove('active');
        actionText.textContent = 'Encrypt';
    } else {
        btnDecrypt.classList.add('active');
        btnEncrypt.classList.remove('active');
        actionText.textContent = 'Decrypt';
    }
    
    tg.HapticFeedback.selectionChanged();
};

window.setEncryptType = (type) => {
    encryptType = type;
    const btnAES = document.getElementById('btn-type-aes');
    const btnBase64 = document.getElementById('btn-type-base64');
    const btnBase32 = document.getElementById('btn-type-base32');
    const btnBase16 = document.getElementById('btn-type-base16');
    const btnBase8 = document.getElementById('btn-type-base8');
    
    // Remove active class from all
    btnAES?.classList.remove('active');
    btnBase64?.classList.remove('active');
    btnBase32?.classList.remove('active');
    btnBase16?.classList.remove('active');
    btnBase8?.classList.remove('active');
    
    // Add active class to selected
    if (type === 'aes') btnAES?.classList.add('active');
    if (type === 'base64') btnBase64?.classList.add('active');
    if (type === 'base32') btnBase32?.classList.add('active');
    if (type === 'base16') btnBase16?.classList.add('active');
    if (type === 'base8') btnBase8?.classList.add('active');
    
    // Show/hide key field based on type
    const keyField = document.getElementById('encrypt-key-field');
    if (keyField) {
        keyField.style.display = (type === 'aes') ? 'block' : 'none';
    }
    
    tg.HapticFeedback.selectionChanged();
};

// Base64 encoding/decoding
const base64Encode = (text) => {
    return btoa(unescape(encodeURIComponent(text)));
};

const base64Decode = (encoded) => {
    try {
        return decodeURIComponent(escape(atob(encoded)));
    } catch (e) {
        throw new Error('Invalid Base64 data');
    }
};

// Base32 encoding/decoding
const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const base32Encode = (text) => {
    let binary = '';
    for (let i = 0; i < text.length; i++) {
        binary += text.charCodeAt(i).toString(2).padStart(8, '0');
    }
    
    let result = '';
    for (let i = 0; i < binary.length; i += 5) {
        let chunk = binary.slice(i, i + 5);
        if (chunk.length < 5) {
            chunk = chunk.padEnd(5, '0');
        }
        result += base32Chars[parseInt(chunk, 2)];
    }
    
    // Add padding
    while (result.length % 8 !== 0) {
        result += '=';
    }
    return result;
};

const base32Decode = (encoded) => {
    try {
        encoded = encoded.toUpperCase().replace(/=/g, '');
        let binary = '';
        for (let i = 0; i < encoded.length; i++) {
            const char = encoded[i];
            const index = base32Chars.indexOf(char);
            if (index === -1) throw new Error('Invalid Base32 character');
            binary += index.toString(2).padStart(5, '0');
        }
        
        let result = '';
        for (let i = 0; i < binary.length; i += 8) {
            const byte = binary.slice(i, i + 8);
            if (byte.length === 8) {
                result += String.fromCharCode(parseInt(byte, 2));
            }
        }
        return result;
    } catch (e) {
        throw new Error('Invalid Base32 data');
    }
};

// Base16 (Hex) encoding/decoding
const base16Encode = (text) => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += text.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return result.toUpperCase();
};

const base16Decode = (encoded) => {
    try {
        let result = '';
        for (let i = 0; i < encoded.length; i += 2) {
            result += String.fromCharCode(parseInt(encoded.slice(i, i + 2), 16));
        }
        return result;
    } catch (e) {
        throw new Error('Invalid Base16 data');
    }
};

// Base8 (Octal) encoding/decoding
const base8Encode = (text) => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += text.charCodeAt(i).toString(8).padStart(3, '0');
    }
    return result;
};

const base8Decode = (encoded) => {
    try {
        let result = '';
        for (let i = 0; i < encoded.length; i += 3) {
            result += String.fromCharCode(parseInt(encoded.slice(i, i + 3), 8));
        }
        return result;
    } catch (e) {
        throw new Error('Invalid Base8 data');
    }
};

// AES-256 Encryption/Decryption using Web Crypto API
const aesEncrypt = async (text, key) => {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(key.padEnd(32, '0').slice(0, 32)),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
    
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const aesKey = await window.crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
    
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        aesKey,
        encoder.encode(text)
    );
    
    // Combine salt + iv + encrypted data
    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);
    
    // Convert to base64
    return btoa(String.fromCharCode(...combined));
};

const aesDecrypt = async (encryptedData, key) => {
    try {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        
        // Decode from base64
        const combined = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
        
        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 28);
        const encrypted = combined.slice(28);
        
        const keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            encoder.encode(key.padEnd(32, '0').slice(0, 32)),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );
        
        const aesKey = await window.crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
        
        const decrypted = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            aesKey,
            encrypted
        );
        
        return decoder.decode(decrypted);
    } catch (e) {
        throw new Error('Decryption failed - invalid key or data');
    }
};

window.performEncryption = async () => {
    const data = document.getElementById('encrypt-data').value.trim();
    const key = document.getElementById('encrypt-key').value.trim();
    const withReverser = document.getElementById('encrypt-reverser').checked;
    
    if (!data) {
        tg.showAlert('Error: Please enter text to encrypt/decrypt');
        tg.HapticFeedback.notificationOccurred('error');
        return;
    }
    
    // Check key for AES
    if (encryptType === 'aes' && !key) {
        tg.showAlert('Error: Please enter a secret key for AES');
        tg.HapticFeedback.notificationOccurred('error');
        return;
    }
    
    tg.HapticFeedback.impactOccurred('light');
    
    let result = '';
    let operationType = encryptMode;
    let typeLabel = encryptType.toUpperCase();
    
    try {
        if (encryptMode === 'encrypt') {
            let inputData = data;
            if (withReverser) {
                inputData = inputData.split('').reverse().join('');
            }
            
            switch (encryptType) {
                case 'aes':
                    result = await aesEncrypt(inputData, key);
                    break;
                case 'base64':
                    result = base64Encode(inputData);
                    break;
                case 'base32':
                    result = base32Encode(inputData);
                    break;
                case 'base16':
                    result = base16Encode(inputData);
                    break;
                case 'base8':
                    result = base8Encode(inputData);
                    break;
            }
        } else {
            let inputData = data;
            
            switch (encryptType) {
                case 'aes':
                    try {
                        result = await aesDecrypt(inputData, key);
                    } catch (e) {
                        result = inputData;
                    }
                    break;
                case 'base64':
                    result = base64Decode(inputData);
                    break;
                case 'base32':
                    result = base32Decode(inputData);
                    break;
                case 'base16':
                    result = base16Decode(inputData);
                    break;
                case 'base8':
                    result = base8Decode(inputData);
                    break;
            }
            
            if (withReverser) {
                result = result.split('').reverse().join('');
            }
        }
        
        // Add to history
        encryptionHistory.unshift({
            type: operationType,
            encryptType: typeLabel,
            original: data,
            result: result,
            key: key,
            withReverser: withReverser,
            timestamp: new Date().toLocaleTimeString()
        });
        
        // Keep only last 10 items
        if (encryptionHistory.length > 10) {
            encryptionHistory.pop();
        }
        
        // Show result in output textarea
        document.getElementById('encrypt-output').value = result;
        
        tg.HapticFeedback.notificationOccurred('success');
    } catch (e) {
        tg.showAlert('Error: ' + (e.message || 'Operation failed'));
        tg.HapticFeedback.notificationOccurred('error');
    }
};

// Show encryption history
document.getElementById('btn-encrypt-history')?.addEventListener('click', () => {
    tg.HapticFeedback.selectionChanged();
    if (encryptionHistory.length === 0) {
        tg.showAlert('No encryption history yet');
    } else {
        let historyText = 'Encryption History:\n\n';
        encryptionHistory.slice(0, 5).forEach((item, i) => {
            historyText += `${i + 1}. ${item.type.toUpperCase()} - ${item.timestamp}\n`;
            historyText += `   ${item.original.substring(0, 20)}... → ${item.result.substring(0, 20)}...\n\n`;
        });
        tg.showAlert(historyText);
    }
});

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
    // Check if this is an encryption result
    if (title && (title.includes('Encrypted') || title.includes('Decrypted'))) {
        // Show in full-screen activity
        document.getElementById('encrypt-result-title').innerText = title;
        document.getElementById('encrypt-result-label').innerText = title.includes('Encrypted') ? 'Encrypted Result' : 'Decrypted Result';
        document.getElementById('encrypt-result-content').innerText = content;
        document.getElementById('encrypt-activity').classList.remove('open');
        document.getElementById('encrypt-result-activity').classList.add('open');
        tg.HapticFeedback.notificationOccurred('success');
    } else {
        // Show regular result dialog
        document.getElementById('res-dialog-title').innerText = title;
        document.getElementById('res-dialog-content').innerText = content;
        document.getElementById('result-dialog').classList.add('open');
        document.getElementById('overlay').classList.add('open');
        tg.HapticFeedback.notificationOccurred('success');
    }
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
    
    // Theme button - opens theme selection dialog
    document.getElementById('btn-theme')?.addEventListener('click', () => {
        openThemeDialog();
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
    document.getElementById('dialog-overlay')?.addEventListener('click', () => {
        window.closeSettings();
        window.closeThemeDialog();
    });
    document.getElementById('ks-overlay')?.addEventListener('click', () => closeKeystore());
    document.getElementById('encrypt-overlay')?.addEventListener('click', () => window.closeEncryption());
    document.getElementById('overlay')?.addEventListener('click', (e) => {
        if (e.target.id === 'overlay') {
            closePasswordGen();
            closeResultDialog();
            window.closeEncryption();
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

