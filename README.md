<div align="center">

# 🔥 CodyLingo — GitHub Streak Widget

<p align="center">
  <strong>Gamify your GitHub profile with a Duolingo-inspired daily coding streak badge!</strong>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
  <a href="#features">Features</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#license">License</a>
</p>

---

</div>

<br />

<div align="center">
  <img src="https://cody-lingo.vercel.app/api/widget?username=ahmetberatkocyigit" alt="CodyLingo Widget Preview" width="260" />
</div>

<br />

## ✨ Features

- 🦉 **Duolingo-Style Aesthetic** — Vibrant gradients, playful confetti, and an encouraging mascot.
- 🔥 **Real-Time Streak Tracking** — Computes consecutive daily GitHub contribution streaks from public events.
- 🛡️ **README & Proxy Friendly** — Embedded Base64 assets ensure flawless rendering across GitHub Markdown, Camo proxy, and external websites.
- 📐 **Smart Dynamic Layout** — Intelligent multi-line wrapping and proportional typography for usernames of any length.
- ⚡ **Lightning Fast & Serverless** — Built as a lightweight Vercel Serverless Function with optimized HTTP caching headers.

---

## 🚀 Quick Start

Add the widget directly to your GitHub Profile `README.md`:

### Markdown

```markdown
[![CodyLingo Streak](https://cody-lingo.vercel.app/api/widget?username=YOUR_GITHUB_USERNAME)](https://github.com/YOUR_GITHUB_USERNAME)
```

### HTML

```html
<a href="https://github.com/YOUR_GITHUB_USERNAME">
  <img src="https://cody-lingo.vercel.app/api/widget?username=YOUR_GITHUB_USERNAME" alt="CodyLingo Streak" width="380" />
</a>
```

> **Replace** `YOUR_GITHUB_USERNAME` with your GitHub handle.

---

## 🛠️ One-Click Deployment (Vercel)

Deploy your own instance in less than a minute:

1. **Fork or Clone** this repository:
   ```bash
   git clone https://github.com/AhmetBeratKocyigit/CodyLingo.git
   ```
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository and keep the default configuration.
4. Click **Deploy**!

Your serverless SVG endpoint will be live at:
```text
https://your-project.vercel.app/api/widget?username=your_username
```

---

## 💻 Local Development

Clone and run the development server locally:

```bash
# Clone the repository
git clone https://github.com/AhmetBeratKocyigit/CodyLingo.git
cd CodyLingo

# Install dependencies (if any)
npm install

# Start local server (using Vercel CLI or any static/node server)
npx vercel dev
```

Visit in your browser:
```text
http://localhost:3000/api/widget?username=octocat
```

---

## 🔍 API Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `username` | `string` | `octocat` | Target GitHub username to compute the active streak for. |

---

## 🧠 How It Works

1. Queries GitHub's Public Events API (`/users/{username}/events/public`).
2. Filters distinct contribution dates (commits, PRs, issues, etc.).
3. Computes consecutive day streaks ending on today/yesterday.
4. Generates an adaptive SVG badge containing dynamic text scaling and self-contained Base64 graphics.

---

## 📄 License

Distributed under the [MIT License](LICENSE).

<div align="center">
  <sub>Made with ❤️ by <a href="https://github.com/AhmetBeratKocyigit">Ahmet Berat Koçyiğit</a></sub>
</div>
