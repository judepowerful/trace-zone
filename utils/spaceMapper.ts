// File: trace-zone/utils/spaceMapper.ts
// This file contains utility functions to map raw space data to the Space model.
import { Space } from '../models/space';

export function mapRawSpaceToModel(raw: any): Space {
  return {
    id: raw._id,
    name: raw.spaceName,
    createdAt: new Date(raw.createdAt).getTime(),
    members: raw.members.map((m: any) => ({
      uid: m.uid,
      name: m.name,
      latitude: m.latitude,
      longitude: m.longitude,
      city: m.city,
      country: m.country,
      district: m.district,
      locationUpdatedAt: m.locationUpdatedAt,
    })),
    todayFeeding: raw.todayFeeding
      ? {
          date: raw.todayFeeding.date,
          fedUsers: raw.todayFeeding.fedUsers || []
        }
      : undefined,
    coFeedingDays: raw.coFeedingDays ?? 0,         // ✅ 新增
    lastCoFeedingDate: raw.lastCoFeedingDate ?? '', // ✅ 新增
  };
}
