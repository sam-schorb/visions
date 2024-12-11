// pages/api/saveImage.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { imgData } = req.body;

    const base64Data = imgData.replace(/^data:image\/png;base64,/, '');

    const rendersDir = path.join(process.cwd(), 'renders');
    if (!fs.existsSync(rendersDir)) {
      fs.mkdirSync(rendersDir);
    }

    const filePath = path.join(rendersDir, 'current_render.png');
    fs.writeFileSync(filePath, base64Data, 'base64', (err) => {
      if (err) {
        console.error('Failed to save the image:', err);
        res.status(500).json({ error: 'Failed to save the image' });
      } else {
        console.log('Image saved successfully:', filePath);
        res.status(200).json({ message: 'Image saved successfully' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
