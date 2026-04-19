const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Data file path
const DATA_FILE = path.join(__dirname, 'dane.txt');

// Modern interface - dark square theme
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Sign Up</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #00ff88;
            --primary-glow: rgba(0, 255, 136, 0.3);
            --secondary: #0a0a0a;
            --background: #000000;
            --surface: #0d0d0d;
            --surface-light: #1a1a1a;
            --text: #ffffff;
            --text-dim: #666666;
            --border: #1f1f1f;
            --success: #00ff88;
            --error: #ff0055;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: var(--background);
            color: var(--text);
            font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            position: relative;
            overflow: hidden;
        }

        /* Animated grid background */
        body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                linear-gradient(var(--border) 1px, transparent 1px),
                linear-gradient(90deg, var(--border) 1px, transparent 1px);
            background-size: 50px 50px;
            opacity: 0.3;
            animation: gridMove 20s linear infinite;
            pointer-events: none;
        }

        @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
        }

        .container {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 480px;
        }

        .card {
            background: var(--surface);
            border: 2px solid var(--border);
            border-radius: 0;
            padding: 60px 50px;
            position: relative;
            overflow: hidden;
            box-shadow: 
                0 0 0 1px var(--border),
                0 20px 60px rgba(0, 0, 0, 0.8);
        }

        /* Corner decorations */
        .card::before,
        .card::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            border: 2px solid var(--primary);
        }

        .card::before {
            top: -2px;
            left: -2px;
            border-right: none;
            border-bottom: none;
        }

        .card::after {
            bottom: -2px;
            right: -2px;
            border-left: none;
            border-top: none;
        }

        .corner-tl,
        .corner-br {
            position: absolute;
            width: 20px;
            height: 20px;
            border: 2px solid var(--primary);
        }

        .corner-tl {
            top: -2px;
            right: -2px;
            border-left: none;
            border-bottom: none;
        }

        .corner-br {
            bottom: -2px;
            left: -2px;
            border-right: none;
            border-top: none;
        }

        /* Glow effect */
        .glow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%);
            opacity: 0;
            transition: opacity 0.5s;
            pointer-events: none;
        }

        .card:hover .glow {
            opacity: 1;
        }

        .header {
            margin-bottom: 40px;
            text-align: center;
        }

        .status-bar {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
            font-size: 11px;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .status-dot {
            width: 6px;
            height: 6px;
            background: var(--primary);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        h1 {
            color: var(--text);
            font-weight: 700;
            font-size: 32px;
            letter-spacing: -1px;
            margin-bottom: 8px;
            text-transform: uppercase;
        }

        .subtitle {
            color: var(--text-dim);
            font-size: 14px;
            letter-spacing: 0.5px;
        }

        .form-group {
            margin-bottom: 24px;
            position: relative;
        }

        label {
            display: block;
            margin-bottom: 10px;
            color: var(--text);
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        input {
            width: 100%;
            padding: 16px 18px;
            background-color: var(--surface-light);
            color: var(--text);
            border: 2px solid var(--border);
            border-radius: 0;
            font-size: 16px;
            font-family: 'Space Grotesk', sans-serif;
            transition: all 0.3s;
        }

        input:focus {
            border-color: var(--primary);
            outline: none;
            background-color: var(--secondary);
            box-shadow: 0 0 0 4px rgba(0, 255, 136, 0.1);
        }

        input::placeholder {
            color: var(--text-dim);
        }

        button {
            width: 100%;
            padding: 18px;
            background: var(--primary);
            color: var(--background);
            border: 2px solid var(--primary);
            border-radius: 0;
            font-size: 14px;
            font-weight: 700;
            font-family: 'Space Grotesk', sans-serif;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            margin-top: 10px;
        }

        button::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }

        button:hover::before {
            width: 300px;
            height: 300px;
        }

        button:hover {
            background: var(--background);
            color: var(--primary);
            box-shadow: 
                0 0 20px var(--primary-glow),
                inset 0 0 20px var(--primary-glow);
        }

        button:active {
            transform: scale(0.98);
        }

        .confirmation {
            display: none;
            padding: 24px;
            background: var(--surface-light);
            border: 2px solid var(--success);
            border-radius: 0;
            color: var(--success);
            text-align: center;
            margin-top: 30px;
            position: relative;
            animation: slideIn 0.5s ease;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .confirmation-icon {
            font-size: 48px;
            margin-bottom: 12px;
        }

        .confirmation-text {
            font-weight: 600;
            font-size: 18px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .loading {
            display: none;
            justify-content: center;
            align-items: center;
            gap: 4px;
            margin-top: 20px;
        }

        .loading-dot {
            width: 8px;
            height: 8px;
            background: var(--primary);
            animation: loading 1.4s infinite both;
        }

        .loading-dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .loading-dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes loading {
            0%, 80%, 100% {
                opacity: 0.3;
                transform: scale(0.8);
            }
            40% {
                opacity: 1;
                transform: scale(1);
            }
        }

        .error {
            display: none;
            padding: 16px;
            background: rgba(255, 0, 85, 0.1);
            border: 2px solid var(--error);
            color: var(--error);
            margin-top: 20px;
            font-size: 14px;
            border-radius: 0;
        }

        /* Responsywność */
        @media (max-width: 480px) {
            .card {
                padding: 40px 30px;
            }

            h1 {
                font-size: 26px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="glow"></div>
            <span class="corner-tl"></span>
            <span class="corner-br"></span>
            
            <div class="header">
                <div class="status-bar">
                    <span class="status-dot"></span>
                    <span>System Online</span>
                </div>
                <h1>Join Us</h1>
                <p class="subtitle">Start your journey with us</p>
            </div>

            <form id="contactForm" onsubmit="submitForm(event)">
                <div class="form-group">
                    <label for="imie">Name</label>
                    <input 
                        type="text" 
                        id="imie" 
                        name="imie" 
                        placeholder="Enter your name"
                        required 
                    />
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="your@email.com"
                        required 
                    />
                </div>
                <button type="submit">
                    <span>Sign Up</span>
                </button>
            </form>

            <div class="loading" id="loading">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>

            <div id="error" class="error"></div>

            <div id="confirmation" class="confirmation">
                <div class="confirmation-icon">✓</div>
                <div class="confirmation-text">Successfully registered!</div>
            </div>
        </div>
    </div>

    <script>
        async function submitForm(event) {
            event.preventDefault();

            const formData = new FormData(event.target);
            const loadingEl = document.getElementById('loading');
            const errorEl = document.getElementById('error');
            const submitBtn = event.target.querySelector('button');

            // Reset states
            errorEl.style.display = 'none';
            loadingEl.style.display = 'flex';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(formData)
                });

                loadingEl.style.display = 'none';

                if (response.ok) {
                    document.getElementById('contactForm').style.display = 'none';
                    document.getElementById('confirmation').style.display = 'block';
                } else {
                    throw new Error('Error saving data');
                }
            } catch (error) {
                loadingEl.style.display = 'none';
                submitBtn.disabled = false;
                errorEl.textContent = 'An error occurred. Please try again.';
                errorEl.style.display = 'block';
                console.error('Error:', error);
            }
        }
    </script>
</body>
</html>
    `);
});

// Save data
app.post('/', (req, res) => {
    const { imie, email } = req.body;

    if (!imie || !email) {
        return res.status(400).send('Please fill in both fields!');
    }

    fs.appendFile(DATA_FILE, `${email};${imie}\n`, (err) => {
        if (err) {
            console.error('Save error:', err);
            return res.status(500).send('Server error!');
        }
        res.sendStatus(200);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});