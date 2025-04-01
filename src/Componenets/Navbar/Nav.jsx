import { Link } from "react-router-dom";
import styles from "../Navbar/Nav.module.css";
import { IoMdHome } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
import { SlMagnifier } from "react-icons/sl";
import { TiMessageTyping } from "react-icons/ti";
import { PiFilmReelThin } from "react-icons/pi";
import { CiCirclePlus } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import { FiVideo } from "react-icons/fi";
export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link to="/Home" className={styles.link}>
          <FiHome className={styles.icon} /> 
      </Link>
      
      <Link to="/serch" className={styles.link}>
        <FiSearch className={styles.icon} /> 
      </Link>
    
      <Link to="/Reels/random" className={styles.link}>
        <FiVideo className={styles.icon} />
      </Link>
      <Link to="/PostUpload" className={styles.link}>
        <FiPlus className={styles.icon} /> 
      </Link>
      <Link to="/" className={styles.link}>
        <FiUser className={styles.icon} /> 
      </Link>
    </nav>
  );
}
