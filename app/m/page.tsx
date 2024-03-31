"use client"
import * as React from 'react'
import { atou } from '../utils'
import { Map } from '@/components/chart/map'

type Props = {}

export default function Ifrme({}: Props) {
  const hash = window.location.hash
  const baseOption = JSON.parse(atou(hash.slice(1)))

  return (
    <Map className="w-screen h-screen" option={baseOption} />
  )
}
