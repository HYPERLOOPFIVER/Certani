import  Post from '../../Componenets/Post/Post'
import { Helmet } from 'react-helmet-async'
export default function Home () {
  return(
    <>
        <div>
      <Helmet>
        <title>Home | Lightupswift</title>
        <meta name="Home" content="Home" />
      </Helmet>
          
     
    </div>
<h1>
Music of the day
</h1>
      <iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/6qrifdo7QINdPQr80IelGi?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    <Post/>
    </>
  )
}
