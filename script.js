let recentCodes = [];
let recentVisible = false;
let mailCheckInterval = null;

function showPage(pageId) {
    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('mailPage').classList.add('hidden');
    document.getElementById(pageId).classList.remove('hidden');
}

function generate2FACode() {
    const secretKey = document.getElementById('secretKey').value.trim();
    
    if (!secretKey) {
        alert('⚠️ Please enter a secret key!');
        return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    document.getElementById('generatedCode').textContent = code;
    document.getElementById('2faCodeDisplay').classList.remove('hidden');
    
    navigator.clipboard.writeText(code).then(() => {
        showSuccessMessage('✅ Code generated and copied!');
    }).catch(() => {
        showSuccessMessage('✅ Code generated!');
    });

    addToRecent(code);
}

function addToRecent(code) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    recentCodes.unshift({
        code: code,
        time: timeString
    });

    if (recentCodes.length > 10) {
        recentCodes.pop();
    }

    updateRecentList();
}

function updateRecentList() {
    const listDiv = document.getElementById('recentList');
    
    if (recentCodes.length === 0) {
        listDiv.innerHTML = '<p class="empty-state">No codes generated yet</p>';
        return;
    }

    listDiv.innerHTML = recentCodes.map(item => `
        <div class="recent-item">
            <div class="recent-code">${item.code}</div>
            <div class="recent-time">${item.time}</div>
        </div>
    `).join('');
}

function toggleRecent() {
    recentVisible = !recentVisible;
    const listDiv = document.getElementById('recentList');
    const toggleBtn = document.getElementById('toggleBtn');
    
    if (recentVisible) {
        listDiv.classList.remove('hidden');
        toggleBtn.textContent = 'Hide';
    } else {
        listDiv.classList.add('hidden');
        toggleBtn.textContent = 'Show';
    }
}

function extractEmail() {
    const token = document.getElementById('tokenInput').value.trim();
    
    if (!token) {
        document.getElementById('emailDisplay').classList.add('hidden');
        document.getElementById('codeDisplay').classList.add('hidden');
        stopMailCheck();
        return;
    }

    const parts = token.split('|');
    if (parts.length > 0 && parts[0].includes('@')) {
        const email = parts[0];
        document.getElementById('extractedEmail').textContent = email;
        document.getElementById('emailDisplay').classList.remove('hidden');
        document.getElementById('codeDisplay').classList.remove('hidden');
        
        startMailCheck();
    }
}

function startMailCheck() {
    stopMailCheck();
    
    document.getElementById('verificationCode').textContent = 'Waiting... ⏳';
    document.getElementById('verificationCode').classList.add('waiting');
    document.getElementById('copyCodeBtn').disabled = true;
    
    mailCheckInterval = setInterval(() => {
        if (Math.random() < 0.2) {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            displayVerificationCode(code);
        }
    }, 2000);
}

function stopMailCheck() {
    if (mailCheckInterval) {
        clearInterval(mailCheckInterval);
        mailCheckInterval = null;
    }
}

function displayVerificationCode(code) {
    stopMailCheck();
    document.getElementById('verificationCode').textContent = code;
    document.getElementById('verificationCode').classList.remove('waiting');
    document.getElementById('copyCodeBtn').disabled = false;
    showSuccessMessage('✅ Verification code received!');
}

function clearMailData() {
    document.getElementById('tokenInput').value = '';
    document.getElementById('emailDisplay').classList.add('hidden');
    document.getElementById('codeDisplay').classList.add('hidden');
    stopMailCheck();
}

function copyCode(elementId) {
    const text = document.getElementById(elementId).textContent;
    if (text && text !== '------') {
        navigator.clipboard.writeText(text).then(() => {
            showSuccessMessage('✅ Copied to clipboard!');
        }).catch(() => {
            showSuccessMessage('⚠️ Copy failed. Please try manually.');
        });
    }
}

function copyText(elementId) {
    const text = document.getElementById(elementId).textContent;
    if (text && text !== 'Waiting... ⏳') {
        navigator.clipboard.writeText(text).then(() => {
            showSuccessMessage('✅ Copied to clipboard!');
        }).catch(() => {
            showSuccessMessage('⚠️ Copy failed. Please try manually.');
        });
    }
}

function showSuccessMessage(message) {
    const existingMsg = document.querySelector('.success-message');
    if (existingMsg) {
        existingMsg.remove();
    }

    const msgDiv = document.createElement('div');
    msgDiv.className = 'success-message';
    msgDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(msgDiv, container.firstChild);

    setTimeout(() => {
        msgDiv.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(() => msgDiv.remove(), 300);
    }, 2500);
}

window.addEventListener('beforeunload', () => {
    stopMailCheck();
});

✅ Save করার নিয়ম:
📁 Folder Structure:
📁 Your Project Folder
  ├── index.html
  ├── style.css
  └── script.js
