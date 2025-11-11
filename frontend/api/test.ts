export default async function handler(req: any, res: any) {
  return res.status(200).json({ 
    message: 'Test endpoint fungerer!',
    timestamp: new Date().toISOString(),
    path: '/api/test'
  });
}

