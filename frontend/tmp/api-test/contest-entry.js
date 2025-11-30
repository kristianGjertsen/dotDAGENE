"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const node_crypto_1 = require("node:crypto");
const kv_1 = require("@vercel/kv");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
async function handler(req, res) {
    var _a, _b;
    if (req.method !== 'POST')
        return res.status(405).end();
    try {
        let body = req.body;
        if (!body) {
            const chunks = [];
            for await (const chunk of req)
                chunks.push(chunk);
            const raw = Buffer.concat(chunks).toString('utf8');
            body = raw ? JSON.parse(raw) : {};
        }
        else if (typeof body === 'string') {
            body = JSON.parse(body);
        }
        const name = ((_a = body === null || body === void 0 ? void 0 : body.name) !== null && _a !== void 0 ? _a : '').trim();
        const answer = ((_b = body === null || body === void 0 ? void 0 : body.answer) !== null && _b !== void 0 ? _b : '').trim();
        if (!name || !answer) {
            return res.status(400).json({ error: 'Navn og svar må fylles ut.' });
        }
        const entry = {
            id: (0, node_crypto_1.randomUUID)(),
            name,
            answer,
            createdAt: new Date().toISOString(),
            userAgent: req.headers['user-agent'],
        };
        const hasKvCredentials = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
        let storage = 'kv';
        if (!hasKvCredentials) {
            await appendToLocalFile(entry);
            storage = 'local';
        }
        else {
            await kv_1.kv.rpush('advent-calendar:entries', JSON.stringify(entry));
        }
        return res.status(201).json({ ok: true, storage });
    }
    catch (error) {
        console.error('contest-entry error', error);
        return res.status(500).json({ error: 'Kunne ikke lagre svaret nå.' });
    }
}
async function appendToLocalFile(entry) {
    const dir = node_path_1.default.resolve(process.cwd(), '.data');
    await node_fs_1.promises.mkdir(dir, { recursive: true });
    const filePath = node_path_1.default.join(dir, 'contest-entries.json');
    let existing = [];
    try {
        const raw = await node_fs_1.promises.readFile(filePath, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            existing = parsed;
        }
    }
    catch {
        existing = [];
    }
    existing.push(entry);
    await node_fs_1.promises.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf8');
}
