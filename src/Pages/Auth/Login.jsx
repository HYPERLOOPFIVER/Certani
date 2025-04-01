import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/Firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserPosts(currentUser.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserPosts = async (userUid) => {
    try {
      const postsQuery = query(collection(db, 'posts'), where('uid', '==', userUid));
      const postsSnapshot = await getDocs(postsQuery);
      const postsList = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsList);
      fetchCommentsForPosts(postsList);
    } catch (error) {
      setError('Error fetching posts: ' + error.message);
    }
  };

  const fetchCommentsForPosts = async (postsList) => {
    try {
      const commentsData = {};
      for (const post of postsList) {
        const commentsQuery = query(collection(db, 'comments'), where('postId', '==', post.id));
        const commentsSnapshot = await getDocs(commentsQuery);
        const commentsForPost = commentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        commentsData[post.id] = commentsForPost;
      }
      setComments(commentsData);
    } catch (error) {
      setError('Error fetching comments: ' + error.message);
    }
  };

  const deletePost = async (postId) => {
    try {
      const postDoc = doc(db, 'posts', postId);
      await deleteDoc(postDoc);
      setPosts(posts.filter((post) => post.id !== postId));
      const updatedComments = { ...comments };
      delete updatedComments[postId];
      setComments(updatedComments);
    } catch (error) {
      setError('Error deleting post: ' + error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      setError('Error logging in: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError('Error logging out: ' + error.message);
    }
  };

  return (
    <div style={{
      backgroundColor: '#0f0f12',
      minHeight: '100vh',
      padding: '0',
      fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
      color: '#fff',
      backgroundImage: 'linear-gradient(135deg, rgba(24, 24, 32, 0.8) 0%, rgba(10, 10, 15, 1) 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '52px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #6e68fa 0%, #c2a0fd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 15px rgba(110, 104, 250, 0.3)',
            marginBottom: '10px',
            letterSpacing: '1px'
          }}>CERTANO</h1>
          <h2 style={{
            fontSize: '20px',
            color: '#a9a9b9',
            marginBottom: '0',
            fontWeight: '300',
            letterSpacing: '5px',
            textTransform: 'uppercase'
          }}>Premium Social Experience</h2>
          <p style={{
            fontSize: '16px',
            color: '#6e68fa',
            fontWeight: 'bold',
            marginTop: '10px',
            letterSpacing: '1px',
            opacity: '0.9'
          }}>ELEVATE YOUR CONNECTIONS</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(28, 28, 40, 0.7) 0%, rgba(16, 16, 24, 0.9) 100%)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(110, 104, 250, 0.15), 0 0 30px rgba(194, 160, 253, 0.15)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          padding: '40px',
          backdropFilter: 'blur(10px)',
          position: 'relative'
        }}>
          {/* Decorative element - top right corner */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, rgba(110, 104, 250, 0.4) 0%, rgba(110, 104, 250, 0) 70%)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            zIndex: '0'
          }}></div>
          
          {/* Decorative element - bottom left corner */}
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            left: '-50px',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, rgba(194, 160, 253, 0.4) 0%, rgba(194, 160, 253, 0) 70%)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            zIndex: '0'
          }}></div>

          {user ? (
            <div style={{ textAlign: 'center', position: 'relative', zIndex: '1' }}>
              <div style={{
                padding: '30px',
                borderRadius: '20px',
                background: 'linear-gradient(145deg, rgba(32, 32, 44, 0.7), rgba(20, 20, 28, 0.9))',
                marginBottom: '40px',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <h2 style={{
                  color: '#c2a0fd',
                  fontSize: '32px',
                  marginBottom: '30px',
                  fontWeight: '600'
                }}>Welcome, {user.displayName || user.email.split('@')[0]}</h2>
                <div style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  margin: '0 auto 30px',
                  background: 'conic-gradient(from 45deg, #6e68fa, #9a7dfc, #c2a0fd, #6e68fa)',
                  padding: '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)'
                }}>
                  <div style={{
                    width: '122px',
                    height: '122px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid #14141c'
                  }}>
                    <img
                      src={user.photoURL || 'https://via.placeholder.com/150'}
                      alt="Profile"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                </div>
                <p style={{
                  fontSize: '16px',
                  color: '#a9a9b9',
                  marginBottom: '30px',
                  fontWeight: '300'
                }}>Email: <span style={{ color: '#fff', fontWeight: '600' }}>{user.email}</span></p>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '14px 36px',
                    background: 'linear-gradient(145deg, #ef4a6e, #d8365a)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '30px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(239, 74, 110, 0.3)',
                    transition: 'all 0.3s',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 15px 25px rgba(239, 74, 110, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 20px rgba(239, 74, 110, 0.3)';
                  }}
                >
                  Logout
                </button>
              </div>

              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: '40px'
              }}>
                <h3 style={{
                  fontSize: '26px',
                  color: '#6e68fa',
                  marginBottom: '30px',
                  textAlign: 'left',
                  borderLeft: '4px solid #c2a0fd',
                  paddingLeft: '20px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>Your Posts</span>
                  <Link to="/create-post" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 24px',
                    background: 'linear-gradient(145deg, rgba(110, 104, 250, 0.2), rgba(110, 104, 250, 0.1))',
                    color: '#6e68fa',
                    textDecoration: 'none',
                    borderRadius: '30px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: '1px solid rgba(110, 104, 250, 0.3)',
                    transition: 'all 0.3s'
                  }}>
                    <span style={{ marginRight: '8px' }}>+</span> New Post
                  </Link>
                </h3>
                
                {posts.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '25px'
                  }}>
                    {posts.map((post) => (
                      <div key={post.id} style={{
                        background: 'linear-gradient(145deg, rgba(25, 25, 35, 0.9), rgba(15, 15, 24, 0.9))',
                        borderRadius: '16px',
                        padding: '25px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.3s, box-shadow 0.3s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-5px)';
                        e.target.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                      }}>
                        {/* Decorative accent */}
                        <div style={{
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          width: '100%',
                          height: '5px',
                          background: 'linear-gradient(90deg, #6e68fa, #c2a0fd)',
                          borderTopLeftRadius: '16px',
                          borderTopRightRadius: '16px'
                        }}></div>
                        
                        <h4 style={{
                          fontSize: '20px',
                          color: '#fff',
                          marginBottom: '15px',
                          marginTop: '10px',
                          fontWeight: '600'
                        }}>{post.title}</h4>
                        <p style={{
                          fontSize: '16px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          marginBottom: '20px',
                          lineHeight: '1.6',
                          flex: '1'
                        }}>{post.content}</p>
                        
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '15px'
                        }}>
                          <button
                            onClick={() => deletePost(post.id)}
                            style={{
                              padding: '8px 20px',
                              backgroundColor: 'rgba(239, 74, 110, 0.1)',
                              color: '#ef4a6e',
                              border: '1px solid rgba(239, 74, 110, 0.3)',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              transition: 'all 0.3s',
                              fontWeight: '500'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = 'rgba(239, 74, 110, 0.2)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = 'rgba(239, 74, 110, 0.1)';
                            }}
                          >
                            Delete
                          </button>
                          
                          <div style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontWeight: '300'
                          }}>
                            {post.timestamp ? new Date(post.timestamp.toDate()).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }) : 'Date unavailable'}
                          </div>
                        </div>
                        
                        <div style={{
                          marginTop: '25px',
                          borderTop: '1px dashed rgba(255, 255, 255, 0.07)',
                          paddingTop: '15px'
                        }}>
                          <h5 style={{
                            fontSize: '16px',
                            color: '#6e68fa',
                            marginBottom: '15px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <span style={{
                              display: 'inline-block',
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#6e68fa',
                              borderRadius: '50%',
                              marginRight: '10px'
                            }}></span>
                            Comments ({comments[post.id]?.length || 0})
                          </h5>
                          
                          <div style={{
                            maxHeight: '150px',
                            overflowY: 'auto',
                            padding: '5px',
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#6e68fa rgba(255, 255, 255, 0.05)'
                          }}>
                            {comments[post.id] && comments[post.id].length > 0 ? (
                              comments[post.id].map((comment) => (
                                <div key={comment.id} style={{
                                  padding: '12px 15px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                  borderRadius: '12px',
                                  marginBottom: '10px',
                                  border: '1px solid rgba(255, 255, 255, 0.05)',
                                  position: 'relative'
                                }}>
                                  <p style={{ margin: '0' }}>
                                    <strong style={{ color: '#c2a0fd' }}>{comment.userName}</strong>{': '}
                                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{comment.text}</span>
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p style={{ 
                                color: 'rgba(255, 255, 255, 0.5)', 
                                fontStyle: 'italic',
                                textAlign: 'center',
                                padding: '15px 0'
                              }}>No comments yet.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    backgroundColor: 'rgba(20, 20, 30, 0.5)',
                    borderRadius: '16px',
                    border: '1px dashed rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(110, 104, 250, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      fontSize: '30px',
                      color: '#6e68fa'
                    }}>
                      📝
                    </div>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      fontSize: '18px',
                      marginBottom: '30px',
                      fontWeight: '300'
                    }}>No posts found. Create your first post to get started!</p>
                    <Link to="/create-post" style={{
                      display: 'inline-block',
                      marginTop: '10px',
                      padding: '14px 35px',
                      background: 'linear-gradient(145deg, #6e68fa, #5750f8)',
                      color: '#fff',
                      textDecoration: 'none',
                      borderRadius: '30px',
                      fontWeight: '600',
                      transition: 'all 0.3s',
                      boxShadow: '0 10px 25px rgba(110, 104, 250, 0.2)',
                      letterSpacing: '1px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 15px 30px rgba(110, 104, 250, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 10px 25px rgba(110, 104, 250, 0.2)';
                    }}>
                      Create Your First Post
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', position: 'relative', zIndex: '1' }}>
              <div style={{
                maxWidth: '400px',
                margin: '0 auto',
                position: 'relative'
              }}>
                <h2 style={{
                  fontSize: '32px',
                  marginBottom: '40px',
                  color: '#fff',
                  textShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                  fontWeight: '600'
                }}>
                  <span style={{ background: 'linear-gradient(to right, #6e68fa, #c2a0fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Welcome to Certano
                  </span>
                </h2>

                {error && (
                  <div style={{
                    padding: '15px 20px',
                    backgroundColor: 'rgba(239, 74, 110, 0.1)',
                    border: '1px solid rgba(239, 74, 110, 0.3)',
                    borderRadius: '12px',
                    marginBottom: '25px',
                    color: '#ef4a6e',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ 
                      display: 'inline-block', 
                      width: '18px', 
                      height: '18px', 
                      borderRadius: '50%', 
                      backgroundColor: '#ef4a6e',
                      color: '#fff',
                      marginRight: '10px',
                      lineHeight: '18px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>!</span>
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
                  <div style={{ marginBottom: '25px', position: 'relative' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontSize: '16px',
                      color: '#a9a9b9',
                      fontWeight: '500'
                    }}>
                      Email
                    </label>
                    <div style={{
                      position: 'relative',
                    }}>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          paddingLeft: '50px',
                          backgroundColor: 'rgba(20, 20, 30, 0.6)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '16px',
                          transition: 'all 0.3s',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#6e68fa';
                          e.target.style.boxShadow = '0 0 0 3px rgba(110, 104, 250, 0.1)';
                          e.target.style.backgroundColor = 'rgba(30, 30, 42, 0.8)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.boxShadow = 'none';
                          e.target.style.backgroundColor = 'rgba(20, 20, 30, 0.6)';
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        left: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#6e68fa',
                        fontSize: '18px'
                      }}>
                        @
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '35px', position: 'relative' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontSize: '16px',
                      color: '#a9a9b9',
                      fontWeight: '500'
                    }}>
                      Password
                    </label>
                    <div style={{
                      position: 'relative',
                    }}>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          paddingLeft: '50px',
                          backgroundColor: 'rgba(20, 20, 30, 0.6)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '16px',
                          transition: 'all 0.3s',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#6e68fa';
                          e.target.style.boxShadow = '0 0 0 3px rgba(110, 104, 250, 0.1)';
                          e.target.style.backgroundColor = 'rgba(30, 30, 42, 0.8)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.boxShadow = 'none';
                          e.target.style.backgroundColor = 'rgba(20, 20, 30, 0.6)';
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        left: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#6e68fa',
                        fontSize: '18px'
                      }}>
                        🔒
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'linear-gradient(to right, #6e68fa, #c2a0fd)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '30px',
                      fontSize: '18px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: '0 10px 25px rgba(110, 104, 250, 0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 15px 30px rgba(110, 104, 250, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 10px 25px rgba(110, 104, 250, 0.2)';
                    }}
                  >
                    Sign In
                  </button>
                </form>

                <p style={{
                  marginTop: '40px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  paddingTop: '30px',
                  fontWeight: '300'
                }}>
                  Don't have an account?{' '}
                  <Link to="/signup" style={{
                    color: '#c2a0fd',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                    position: 'relative',
                    display: 'inline-block'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.textShadow = '0 0 10px rgba(194, 160, 253, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.textShadow = 'none';
                  }}>
                    Sign up
                
                  
                    <span style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: '0',
                      width: '100%',
                      height: '1px',
                      background: '#138808',
                      transform: 'scaleX(0)',
                      transformOrigin: 'right',
                      transition: 'transform 0.3s ease'
                    }}></span>
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '14px',
          padding: '20px 0',
          borderTop: '1px solid rgba(255,255,255,0.03)'
        }}>
          <p>&copy; 2025 Certano - India's First Social Media Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;