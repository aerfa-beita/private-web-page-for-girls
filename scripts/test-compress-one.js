const fs = require('fs'); const os = require('os'); const sharp = require('sharp');
const src = 'assets/Photograph/IMG_20260228/IMG_20250704_133732.jpg';
(async () => {
    const buf = await sharp(src).resize(1200, null, { withoutEnlargement: true, fit: 'inside' }).jpeg({ quality: 80, progressive: true }).toBuffer();
    const tmp = os.tmpdir() + '/test_compress.jpg';
    fs.writeFileSync(tmp, buf);
    fs.copyFileSync(tmp, src);
    fs.unlinkSync(tmp);
    console.log('成功: ' + src);
})();
