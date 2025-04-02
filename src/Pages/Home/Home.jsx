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

    <Post/>
    </>
  )
}