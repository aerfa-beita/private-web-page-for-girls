/* Vercel Serverless Function — 将环境变量安全注入前端，密钥不进 Git 仓库
   部署后自动可用：https://love.xiahuaaitalk.top/api/config
   本地开发时不会调用此接口，直接使用 config.js */

module.exports = (req, res) => {
    // 只允许 GET 请求
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    // 读取 Vercel 环境变量（需在小花先生在 Vercel 控制台设置）
    const moonLettersRaw = process.env.MOON_LETTERS || '';
    let moonLetters = [];
    if (moonLettersRaw) {
        try { moonLetters = JSON.parse(moonLettersRaw); } catch (e) { /* 格式错误时忽略 */ }
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    res.status(200).json({
        WEATHER_API_KEY: process.env.WEATHER_API_KEY || '',
        MOON_LETTERS: moonLetters
    });
};
