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

function buildSvg(streak, username) {
  const safeUsername = String(username || 'octocat')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const mascotUrl = 'https://raw.githubusercontent.com/AhmetBeratKocyigit/CodyLingo/main/public/duo.png';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="220" viewBox="0 0 420 220" role="img" aria-label="CodyLingo streak widget">
  <defs>
    <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#52c3eb"/>
      <stop offset="100%" stop-color="#45d0a7"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="rgba(0,0,0,0.12)"/>
    </filter>
  </defs>

  <rect width="420" height="220" rx="36" fill="url(#bg)"/>

  <g fill="rgba(255,255,255,0.8)">
    <rect x="28" y="148" width="10" height="10" rx="2" transform="rotate(-18 28 148)"/>
    <rect x="64" y="132" width="12" height="12" rx="3" transform="rotate(18 64 132)"/>
    <rect x="318" y="140" width="10" height="10" rx="2" transform="rotate(12 318 140)"/>
    <rect x="348" y="128" width="12" height="12" rx="3" transform="rotate(-18 348 128)"/>
    <circle cx="322" cy="52" r="5"/>
    <circle cx="110" cy="66" r="5"/>
    <circle cx="80" cy="186" r="4"/>
    <circle cx="350" cy="182" r="4"/>
  </g>

  <g filter="url(#softShadow)">
    <circle cx="210" cy="42" r="20" fill="rgba(255,255,255,0.08)"/>
    <text x="210" y="52" text-anchor="middle" font-size="34" font-family="Arial, Helvetica, sans-serif">🔥</text>
  </g>

  <text x="210" y="105" text-anchor="middle" font-size="68" font-weight="800" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">${streak}</text>
  <text x="210" y="160" text-anchor="middle" font-size="26" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">Time to code, ${safeUsername}!</text>

  <image href="${mascotUrl}" x="100" y="100" width="220" height="150" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
}

module.exports = async (req, res) => {
  try {
    const username = (req.query?.username || 'octocat').toString().trim();
    
    const githubRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100`,
      { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'CodyLingo' } }
    );

    if (!githubRes.ok) throw new Error('GitHub API error');

    const events = await githubRes.json();
    const streak = computeStreak(events);
    const svg = buildSvg(streak, username);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.status(200).end(svg);
  } catch (err) {
    const username = (req.query?.username || 'octocat').toString().trim();
    const fallbackSvg = buildSvg(0, username);
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.status(200).end(fallbackSvg);
  }
};
