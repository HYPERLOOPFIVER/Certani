import { Link } from "react-router-dom";
import styles from "../Navbar/Nav.module.css";
import { FiUser, FiHome, FiSearch, FiPlus, FiVideo } from "react-icons/fi";
import { FaGamepad } from "react-icons/fa"; // 🎮 Game icon

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

      <Link to="/games" className={styles.link}>
        <FaGamepad className={styles.icon} />
      </Link>

      <Link to="/" className={styles.link}>
        <FiUser className={styles.icon} />
      </Link>
    </nav>
  );
}
