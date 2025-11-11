// frontend/api/test.ts
export default async function handler(req: any, res: any) {
  try {
    return res.status(200).json({ 
      message: 'Test endpoint fungerer!',
      timestamp: new Date().toISOString(),
      path: '/api/test',
      method: req.method
    });
  } catch (err) {
    console.error('test-api error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}

