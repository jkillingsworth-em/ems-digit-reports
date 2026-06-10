export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url param');
 
  // Only allow Google Sheets published CSV URLs
  if (!url.startsWith('https://docs.google.com/spreadsheets/')) {
    return res.status(403).send('Forbidden');
  }
 
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Upstream HTTP ' + response.status);
    const text = await response.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Cache-Control', 's-maxage=300'); // cache 5 min on Vercel edge
    res.status(200).send(text);
  } catch (err) {
    res.status(500).send('Proxy error: ' + err.message);
  }
}
 