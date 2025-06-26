import { Space } from '../models/space';

export function mapRawSpaceToModel(raw: any): Space {
  return {
    id: raw._id,
    name: raw.spaceName,
    createdAt: new Date(raw.createdAt).getTime(),
    members: raw.members.map((m: any) => ({
      uid: m.uid,
      name: m.name,
    })),
  };
}
