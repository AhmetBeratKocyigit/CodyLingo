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

  return `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420" role="img" aria-label="CodyLingo streak widget">
  <defs>
    <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#51c4ea"/>
      <stop offset="100%" stop-color="#45d0a6"/>
    </linearGradient>
  </defs>

  <rect width="420" height="420" rx="34" fill="url(#bg)"/>

  <g fill="rgba(255,255,255,0.8)">
    <rect x="34" y="112" width="10" height="10" rx="3" transform="rotate(-16 34 112)"/>
    <rect x="78" y="128" width="12" height="12" rx="3" transform="rotate(18 78 128)"/>
    <rect x="316" y="116" width="12" height="12" rx="3" transform="rotate(18 316 116)"/>
    <rect x="350" y="136" width="10" height="10" rx="3" transform="rotate(-16 350 136)"/>
    <circle cx="118" cy="62" r="5"/>
    <circle cx="300" cy="70" r="5"/>
    <circle cx="96" cy="302" r="4"/>
    <circle cx="331" cy="305" r="4"/>
  </g>

  <g>
    <circle cx="210" cy="56" r="20" fill="rgba(255,255,255,0.08)"/>
    <text x="210" y="67" text-anchor="middle" font-size="34" font-family="Arial, Helvetica, sans-serif">🔥</text>
  </g>

  <text x="210" y="138" text-anchor="middle" font-size="80" font-weight="800" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">${streak}</text>
  <text x="210" y="196" text-anchor="middle" font-size="27" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">Time to code, ${safeUsername}!</text>

  <image href="${mascotUrl}" x="65" y="230" width="290" height="185" preserveAspectRatio="xMidYMid meet"/>
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
