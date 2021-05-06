import React, { useCallback } from 'react'
import { TileLayer, useMap } from 'react-leaflet'

import { useMasterfile, useStore } from '../hooks/useStore'
import Nav from './layout/Nav'
import QueryData from './QueryData'

export default function Map() {
  const map = useMap()
  const filters = useStore(state => state.filters)
  const settings = useStore(state => state.settings)
  const setLocation = useStore(state => state.setLocation)
  const setZoom = useStore(state => state.setZoom)
  const { menus } = useMasterfile(state => state.ui)

  const initialBounds = {
    minLat: map.getBounds()._southWest.lat - 0.01,
    maxLat: map.getBounds()._northEast.lat + 0.01,
    minLon: map.getBounds()._southWest.lng - 0.01,
    maxLon: map.getBounds()._northEast.lng + 0.01,
  }

  const onMove = useCallback(() => {
    const newCenter = map.getCenter()
    setLocation([newCenter.lat, newCenter.lng])
    setZoom(map.getZoom())
  }, [map])

  return (
    <>
      <TileLayer
        key={settings.tileServers.name}
        attribution={settings.tileServers.attribution}
        url={settings.tileServers.url}
      />
      {Object.entries({ ...menus, ...menus.wayfarer, ...menus.admin }).map(category => {
        const [item, value] = category
        let enabled = false
        switch (item) {
          default:
            if (filters[item]
              && filters[item].enabled
              && value) {
              enabled = true
            } break
          case 'gyms':
            if ((filters[item].gyms && value.gyms)
              || (filters[item].raids && value.raids)
              || (filters[item].exEligible && value.exEligible)
              || (filters[item].inBattle && value.inBattle)) {
              enabled = true
            } break
          case 'pokestops':
            if ((filters[item].pokestops && value.pokestops)
              || (filters[item].lures && value.lures)
              || (filters[item].invasions && value.invasions)
              || (filters[item].quests && value.quests)) {
              enabled = true
            } break
        }
        if (enabled) {
          return (
            <QueryData
              key={item}
              bounds={initialBounds}
              filters={filters[item]}
              onMove={onMove}
              perms={value}
              category={item}
            />
          )
        }
        return ''
      })}
      <Nav />
    </>
  )
}
