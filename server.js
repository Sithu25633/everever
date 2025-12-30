
const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// CONFIGURATION
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const SECRET_KEY = process.env.JWT_SECRET || 'love_is_eternal_kash_manika';

const ghApi = axios.create({
  baseURL: `https://api.github.com/repos/${GITHUB_REPO}/contents`,
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
  }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));

async function getFile(filePath) {
  try {
    const res = await ghApi.get(`/${filePath}?ref=${GITHUB_BRANCH}`);
    return res.data;
  } catch (err) { return null; }
}

async function saveFile(filePath, content, message, isBinary = false) {
  const existing = await getFile(filePath);
  const data = {
    message: message,
    content: isBinary ? content : Buffer.from(content).toString('base64'),
    branch: GITHUB_BRANCH
  };
  if (existing) data.sha = existing.sha;
  await ghApi.put(`/${filePath}`, data);
}

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthenticated' });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// --- STANDARD AUTH ---
app.post('/api/register', async (req, res) => {
  const dbFile = await getFile('db.json');
  let db = dbFile ? JSON.parse(Buffer.from(dbFile.content, 'base64').toString()) : { account: null, letters: [] };
  if (db.account) return res.status(400).json({ error: 'Account exists' });
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  db.account = { username: req.body.username, password: hashedPassword };
  await saveFile('db.json', JSON.stringify(db, null, 2), 'Register account');
  res.json({ success: true });
});

app.post('/api/login', async (req, res) => {
  const dbFile = await getFile('db.json');
  if (!dbFile) return res.status(401).json({ error: 'No account found' });
  const db = JSON.parse(Buffer.from(dbFile.content, 'base64').toString());
  const { username, password } = req.body;
  if (!db.account || db.account.username !== username) return res.status(401).json({ error: 'Invalid creds' });
  const match = await bcrypt.compare(password, db.account.password);
  if (!match) return res.status(401).json({ error: 'Invalid creds' });
  res.json({ token: jwt.sign({ username }, SECRET_KEY) });
});

// --- MEDIA ---
app.get('/api/memories/:type', authenticate, async (req, res) => {
  const { type } = req.params;
  const folder = req.query.folder || '';
  const path = `${type}${folder ? '/' + folder : ''}`;
  try {
    const response = await ghApi.get(`/${path}?ref=${GITHUB_BRANCH}`);
    const items = response.data.map(item => ({
      name: item.name,
      isDirectory: item.type === 'dir',
      url: item.type === 'dir' ? null : `/api/proxy?path=${encodeURIComponent(item.path)}`,
      path: item.path
    }));
    res.json(items);
  } catch (err) { res.json([]); }
});

app.get('/api/proxy', authenticate, async (req, res) => {
  const { path } = req.query;
  try {
    const file = await getFile(path);
    if (!file) return res.status(404).end();
    const buffer = Buffer.from(file.content, 'base64');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(buffer);
  } catch (err) { res.status(500).end(); }
});

app.post('/api/folders/:type', authenticate, async (req, res) => {
  const { type } = req.params;
  const { name, parent } = req.body;
  const folderPath = `${type}${parent ? '/' + parent : ''}/${name}/.keep`;
  try {
    await saveFile(folderPath, Buffer.from("").toString('base64'), `Create folder: ${name}`, true);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

const upload = multer({ storage: multer.memoryStorage() });
app.post('/api/upload/:type', authenticate, upload.array('files'), async (req, res) => {
  const { type } = req.params;
  const folder = req.query.folder || '';
  const basePath = `${type}${folder ? '/' + folder : ''}`;
  try {
    for (const file of req.files) {
      const filePath = `${basePath}/${Date.now()}-${file.originalname}`;
      await saveFile(filePath, file.buffer.toString('base64'), `Upload: ${file.originalname}`, true);
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'GitHub upload failed' }); }
});

// --- LETTERS ---
app.get('/api/letters', authenticate, async (req, res) => {
  const dbFile = await getFile('db.json');
  const db = dbFile ? JSON.parse(Buffer.from(dbFile.content, 'base64').toString()) : { letters: [] };
  res.json(db.letters || []);
});

app.post('/api/letters', authenticate, async (req, res) => {
  const dbFile = await getFile('db.json');
  let db = dbFile ? JSON.parse(Buffer.from(dbFile.content, 'base64').toString()) : { letters: [] };
  const newLetter = { 
    id: Date.now().toString(), 
    title: req.body.title, 
    content: req.body.content, 
    date: new Date().toLocaleDateString() 
  };
  db.letters = db.letters || [];
  db.letters.unshift(newLetter);
  await saveFile('db.json', JSON.stringify(db, null, 2), 'New letter');
  res.json(newLetter);
});

app.get('/api/stats', authenticate, async (req, res) => {
  const dbFile = await getFile('db.json');
  const db = dbFile ? JSON.parse(Buffer.from(dbFile.content, 'base64').toString()) : { letters: [] };
  
  let photoCount = 0;
  let videoCount = 0;
  
  try {
    const pRes = await ghApi.get(`/photos?ref=${GITHUB_BRANCH}`);
    photoCount = pRes.data.filter(i => i.type === 'file' && i.name !== '.keep').length;
    const vRes = await ghApi.get(`/videos?ref=${GITHUB_BRANCH}`);
    videoCount = vRes.data.filter(i => i.type === 'file' && i.name !== '.keep').length;
  } catch (e) {}

  res.json({ 
    photos: photoCount, 
    videos: videoCount, 
    letters: db.letters?.length || 0 
  });
});

app.listen(PORT, () => console.log(`Secure GitHub Storage backend active at port ${PORT}`));
