import React from 'react'
import '@/styles/global.css'
import '@/styles/map.css'
import '@/styles/light.css'
import '@/styles/font.css'
import 'comment-core-library/dist/css/style.css'
import Provider from '@/components/provider/Provider'
import Initializer from '@/components/initializer/Initializer'
import LoginModel from '@/components/layout/models/login-model/LoginModel'
import Footer from '@/components/layout/footer/Footer'

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='zh' suppressHydrationWarning>
      <head>
        <title>咪哩咪哩 (゜-゜)つロ 干杯~-milimili</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content='咪哩咪哩 (゜-゜)つロ 干杯~-milimili' />
        <meta
          name='keywords'
          content='milimili,咪哩咪哩,咪哩咪哩动画,咪哩咪哩弹幕网,弹幕视频,M站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃'
        />
      </head>
      <body>
        <Provider>
          <Initializer />
          {children}
          <Footer />
          <LoginModel />
        </Provider>
      </body>
    </html>
  )
}
