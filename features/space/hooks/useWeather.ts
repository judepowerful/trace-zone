import { useEffect, useState } from 'react'
import * as Location from 'expo-location'
import axios from 'axios'
import ClearDay from '../../../assets/lottie/clear-day.json'
import PartlyCloudy from '../../../assets/lottie/partly-cloudy-day.json'
import Cloudy from '../../../assets/lottie/cloudy.json'
import Fog from '../../../assets/lottie/fog.json'
import Drizzle from '../../../assets/lottie/drizzle.json'
import Rain from '../../../assets/lottie/rain.json'
import Snow from '../../../assets/lottie/snow.json'
import Thunderstorm from '../../../assets/lottie/thunderstorms.json'

async function getLocalCityInfo(lat: number, lon: number): Promise<{ city?: string; district?: string; country?: string }> {
  try {
    const geo = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon })
    const first = geo[0] ?? {}
    return { city: first.city || first.subregion || '', district: first.district || '', country: first.country || '' }
  } catch {
    return {}
  }
}

type Weather = {
  temp: string
  animationSource: any
  desc: string
  city?: string
  country?: string
}

const iconMap = {
  0: ClearDay,
  1: PartlyCloudy,
  2: PartlyCloudy,
  3: Cloudy,
  45: Fog,
  48: Fog,
  51: Drizzle,
  53: Drizzle,
  55: Drizzle,
  61: Rain,
  63: Rain,
  65: Rain,
  71: Snow,
  73: Snow,
  75: Snow,
  80: Rain,
  81: Rain,
  82: Rain,
  95: Thunderstorm,
  96: Thunderstorm,
  99: Thunderstorm,
}

export function useWeather(latitude?: number, longitude?: number) {
  const [weather, setWeather] = useState<Weather | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (latitude == null || longitude == null) {
      setWeather(null)
      setLoading(false)
      return
    }

    const fetchWeather = async () => {
      try {
        const localInfo = await getLocalCityInfo(latitude, longitude)
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
        const res = await axios.get(url)
        const w = res.data.current_weather
        setWeather({
          temp: w.temperature + '°C',
          animationSource: iconMap[w.weathercode as keyof typeof iconMap] || Cloudy,
          desc: '',
          city: (localInfo.city || '') + (localInfo.district ? '/' + localInfo.district : ''),
          country: localInfo.country,
        })
      } catch (e) {
        console.error('天气加载失败', e)
        setWeather({ temp: '--', animationSource: Cloudy, desc: '获取失败' })
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [latitude, longitude])

  return { weather, loading }
}



