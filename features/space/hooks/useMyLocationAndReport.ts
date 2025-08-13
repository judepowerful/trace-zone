import { useEffect, useState, useRef } from 'react'
import * as Location from 'expo-location'
import { SpaceMember } from '../../../models/space'

export function useMyLocationAndReport(
  self: SpaceMember | undefined,
  reportLocation: (
    latitude: number,
    longitude: number,
    city?: string,
    country?: string,
    district?: string
  ) => Promise<void>
) {
  const [location, setLocation] = useState<{
    latitude?: number
    longitude?: number
    city: string
    country: string
    district: string
    locationUpdatedAt?: string
    loading: boolean
  }>({
    latitude: self?.latitude,
    longitude: self?.longitude,
    city: self?.city || '',
    country: self?.country || '',
    district: self?.district || '',
    locationUpdatedAt: self?.locationUpdatedAt,
    loading: true,
  })

  const lastReportedUid = useRef<string | undefined>(undefined)
  const reportAttempted = useRef<boolean>(false)

  useEffect(() => {
    if (!self || !self.uid) return
    if (lastReportedUid.current === self.uid) return

    lastReportedUid.current = self.uid
    reportAttempted.current = false

    const fetchAndReport = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          setLocation({
            latitude: self?.latitude,
            longitude: self?.longitude,
            city: self?.city || '',
            country: self?.country || '',
            district: self?.district || '',
            locationUpdatedAt: self?.locationUpdatedAt,
            loading: false,
          })
          return
        }

        let loc = await Location.getCurrentPositionAsync({})
        const geo = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        })

        const first = geo[0] ?? {}
        const city = first.city || first.subregion || ''
        const district = first.district || ''
        const country = first.country || ''
        const now = new Date().toISOString()

        const newLocation = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          city,
          country,
          district,
          locationUpdatedAt: now,
          loading: false,
        }

        setLocation(newLocation)

        if (!reportAttempted.current) {
          reportAttempted.current = true
          try {
            await reportLocation(loc.coords.latitude, loc.coords.longitude, city, country, district)
          } catch (err: any) {
            console.error('位置上报失败，将重试一次:', err)
            try {
              await reportLocation(loc.coords.latitude, loc.coords.longitude, city, country, district)
            } catch (retryErr) {
              console.error('位置上报重试失败:', retryErr)
            }
          }
        }
      } catch (err) {
        console.error('定位失败:', err)
        setLocation({
          latitude: self?.latitude,
          longitude: self?.longitude,
          city: self?.city || '',
          country: self?.country || '',
          district: self?.district || '',
          locationUpdatedAt: self?.locationUpdatedAt,
          loading: false,
        })
      }
    }

    fetchAndReport()
  }, [self, reportLocation])

  return location
}



