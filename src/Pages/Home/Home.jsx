import Post from '../../Componenets/Post/Post'
import { Helmet } from 'react-helmet-async'

export default function Home() {
  return (
    <>
      <div>
        <Helmet>
          <title>Home | Lightupswift</title>
          <meta name="Home" content="Home" />
        </Helmet>
      </div>
      
      <h1>Music of the day</h1>
      
      <iframe 
        style={{ borderRadius: "12px" }} 
        src="https://open.spotify.com/embed/track/3oEkAQ5toT682srK2zTusi?utm_source=generator&theme=0" 
        width="100%" 
        height="352" 
        frameBorder="0" 
        allowFullScreen="" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"
      />
      <Post />
    </>
  )
}
