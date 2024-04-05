"use client"
import * as React from 'react'
import { atou } from '../utils'
import MapContainer from '@/components/chart/amap'

type Props = {}

export default function Page({}: Props) {
  const hash = window.location.hash

  let baseOption
  try {
    baseOption = JSON.parse(atou(hash.slice(1)))
  } catch (error) {
    baseOption = {}
  }

  return (
    <MapContainer className="w-screen h-screen" option={baseOption} />
  )
}
