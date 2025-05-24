import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./Componenets/Navbar/Nav";
import Home from "./Pages/Home/Home";
import Trending from "./Pages/Trending/Trending";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/signup/Signup";
import News from "./Pages/News/News";
import PostUpload from "./Pages/Create Post/Createpost";
import Reels from "./Pages/Reels/Reels";
import FetchIdeas from "./Pages/Ideas/Idea";
import PostIdea from "./Pages/ideacreate/PostIdea";
import SearchPage from "./Pages/Auth/SearchPage";
import ReelUpload from "./Pages/Create Post/ReelUpload";
import AllUsers from "./Pages/Create Post/Profiles";
import SearchUsers from "./Pages/Create Post/Searchusers";
import UserProfile from "./Pages/Create Post/UserProfile";
import ChatPage from "./Componenets/Navbar/ChatPage";
import ReelsDisplay from "./Pages/Create Post/ReelsDisiplay";

function App() {
  const currentUser = { id: "exampleId", name: "Test User" }; // Replace with actual user

  return (
    <HelmetProvider>
<>
  <h1>ZFuck U bitch sv</h1>
</>
    </HelmetProvider>
  );
}

export default App;
