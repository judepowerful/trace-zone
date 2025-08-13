import { Space } from '../../../models/space'

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
      ? { date: raw.todayFeeding.date, fedUsers: raw.todayFeeding.fedUsers || [] }
      : undefined,
    coFeedingDays: raw.coFeedingDays ?? 0,
    lastCoFeedingDate: raw.lastCoFeedingDate ?? '',
  }
}


