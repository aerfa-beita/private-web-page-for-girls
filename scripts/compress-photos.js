/* 压缩 ≥6MB 的照片，fs.readFileSync 读入内存避免 sharp 锁文件 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DIR = path.join(__dirname, '..', 'assets', 'Photograph', 'IMG_20260228');
const BACKUP = path.join(__dirname, '..', 'assets', 'Photograph', 'IMG_20260228_original');
const MIN = 3 * 1024 * 1024; // ≥3MB

if (!fs.existsSync(BACKUP)) fs.mkdirSync(BACKUP, { recursive: true });

const files = fs.readdirSync(DIR).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

(async () => {
    let count = 0;
    for (const name of files) {
        const src = path.join(DIR, name);
        const size = fs.statSync(src).size;
        if (size < MIN) continue;

        // 备份
        const bak = path.join(BACKUP, name);
        if (!fs.existsSync(bak)) fs.copyFileSync(src, bak);

        // 读入内存 → sharp 处理 → 写回
        const input = fs.readFileSync(src);
        const buf = await sharp(input)
            .resize(1200, null, { withoutEnlargement: true, fit: 'inside' })
            .jpeg({ quality: 80, progressive: true })
            .toBuffer();

        const out = src.replace(/\.(jpe?g|png)$/i, '.jpg');
        if (out !== src) fs.unlinkSync(src);
        fs.writeFileSync(out, buf);

        const newsize = fs.statSync(out).size;
        count++;
        console.log(`${name}  ${(size/1e6).toFixed(1)}MB → ${(newsize/1e6).toFixed(2)}MB`);
    }
    console.log(`\n完成，压缩了 ${count} 张`);
})();
