import { NextApiRequest, NextApiResponse } from 'next';
import { sampleUserData } from '../../../utils/sample-data';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!Array.isArray(sampleUserData)) {
      throw new Error('Cannot find user data');
    }

    const data = new Promise((res) => {
      setTimeout(() => {
        res(sampleUserData);
      }, 1000);
    });

    const users = await data;

    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}

export default handler;
