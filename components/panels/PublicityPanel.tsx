'use client'

import MediaPlayer from '@/components/MediaPlayer'

export default function PublicityPanel() {
  return (
    <div className="panel panel-publicidad">
      <div className="publicity-header">
        <div>
          <div className="panel-title">📣 MEGAL ROCHA</div>
          <div className="publicity-subtitle">Distribuidor Oficial en Rocha</div>
        </div>
        <div className="publicity-price">
          <span>GARRAFA 13 KG</span>
          <strong>$ 1.216</strong>
        </div>
      </div>

      <div className="panel-body publicity-video-body">
        <MediaPlayer />
      </div>
    </div>
  )
}
