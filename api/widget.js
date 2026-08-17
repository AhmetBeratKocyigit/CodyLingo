const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function computeStreak(events) {
  if (!Array.isArray(events) || events.length === 0) return 0;

  const activityDays = new Set();
  events.forEach((event) => {
    if (!event || !event.created_at) return;
    const date = new Date(event.created_at);
    date.setHours(0, 0, 0, 0);
    activityDays.add(formatDateKey(date));
  });

  if (activityDays.size === 0) return 0;

  const sortedDates = Array.from(activityDays).sort();
  let streak = 0;
  const cursor = new Date(sortedDates[sortedDates.length - 1]);
  cursor.setHours(0, 0, 0, 0);

  while (activityDays.has(formatDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

module.exports = async function handler(req, res) {
  const url = new URL(req.url || 'https://example.com/api/widget');
  const username = (req.query?.username || url.searchParams.get('username') || 'octocat').trim();

  try {
    const githubRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'CodyLingo-Vercel-App'
        }
      }
    );

    if (!githubRes.ok) {
      throw new Error(`GitHub API responded with ${githubRes.status}`);
    }

    const events = await githubRes.json();
    const streak = computeStreak(events);
    const label = `Time to code, ${username}!`;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="420" height="200" viewBox="0 0 420 200" role="img" aria-labelledby="title desc">
        <title id="title">Coding streak widget</title>
        <desc id="desc">Duolingo-inspired streak widget showing the user's GitHub streak.</desc>
        <defs>
          <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#4ac0e8" />
            <stop offset="100%" stop-color="#30cf7c" />
          </linearGradient>
        </defs>

        <rect width="420" height="200" rx="30" fill="url(#bg)"/>
        <circle cx="53" cy="40" r="20" fill="rgba(255,255,255,0.12)"/>
        <text x="37" y="50" font-size="28" font-family="Arial, Helvetica, sans-serif">🔥</text>

        <text x="370" y="70" text-anchor="end" font-size="56" font-weight="800" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">${streak}</text>
        <text x="210" y="120" text-anchor="middle" font-size="26" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">${escapeHtml(label)}</text>

        <rect x="148" y="142" width="124" height="32" rx="16" fill="rgba(15,23,42,0.16)"/>
        <text x="210" y="163" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff" letter-spacing="1.5" font-family="Arial, Helvetica, sans-serif">DAILY STREAK</text>

        <image href="https://raw.githubusercontent.com/ahmeteyup/CodyLingo/main/public/duo.png" x="290" y="90" width="90" height="90" preserveAspectRatio="xMidYMid meet"/>
      </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    res.status(200).send(svg);
  } catch (error) {
    const fallbackSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="420" height="200" viewBox="0 0 420 200" role="img" aria-labelledby="title desc">
        <title id="title">Coding streak widget</title>
        <desc id="desc">Fallback streak widget if GitHub API fails.</desc>
        <defs>
          <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#4ac0e8" />
            <stop offset="100%" stop-color="#30cf7c" />
          </linearGradient>
        </defs>
        <rect width="420" height="200" rx="30" fill="url(#bg)"/>
        <circle cx="53" cy="40" r="20" fill="rgba(255,255,255,0.12)"/>
        <text x="37" y="50" font-size="28" font-family="Arial, Helvetica, sans-serif">🔥</text>
        <text x="370" y="70" text-anchor="end" font-size="56" font-weight="800" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">0</text>
        <text x="210" y="120" text-anchor="middle" font-size="26" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">Time to code, ${escapeHtml(username)}!</text>
        <rect x="148" y="142" width="124" height="32" rx="16" fill="rgba(15,23,42,0.16)"/>
        <text x="210" y="163" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff" letter-spacing="1.5" font-family="Arial, Helvetica, sans-serif">DAILY STREAK</text>
        <image href="https://raw.githubusercontent.com/ahmeteyup/CodyLingo/main/public/duo.png" x="290" y="90" width="90" height="90" preserveAspectRatio="xMidYMid meet"/>
      </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(fallbackSvg);
  }
};
