import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/Firebase'; // Import Firestore and auth instances
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore'; // Correct Firestore imports
import { onAuthStateChanged } from '../../firebase/Firebase'; // Listen to authentication state changes
import { Link } from 'react-router-dom';

// Cloudinary setup
const CLOUD_NAME = 'dzf155vhq';
const UPLOAD_PRESET = 'posts_certano';

const PostUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('cloud_name', CLOUD_NAME);

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setImageUrl(data.secure_url); // Get the uploaded image URL
        setIsUploading(false);
      } catch (error) {
        setError('Error uploading image');
        setIsUploading(false);
      }
    }
  };

  const handlePostUpload = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to create a post.');
      return;
    }

    if (!title || !description || !imageUrl) {
      setError('All fields are required');
      return;
    }

    try {
      // Create a new post in the 'posts' collection with empty likes and comments arrays
      const postRef = await addDoc(collection(db, 'posts'), {
        title,
        description,
        image: imageUrl,
        uid: user.uid,
        createdAt: new Date(),
        likes: [], // Initialize empty likes array
        comments: [], // Initialize empty comments array
        likeCount: 0, // Initialize like counter
        commentCount: 0 // Initialize comment counter
      });

      // Now, update the user's document to include the new post's ID using arrayUnion
      const userRef = doc(db, 'users', user.uid); // Get reference to user's document
      await updateDoc(userRef, {
        posts: arrayUnion(postRef.id), // Add post ID to user's posts array
      });

      setTitle(''); // Clear title input
      setDescription(''); // Clear description input
      setImageUrl(''); // Clear image URL
      setError(''); // Clear error
      alert('Post uploaded successfully');
    } catch (error) {
      setError('Error uploading post: ' + error.message);
    }
  };

  return (
    <div style={{
      backgroundColor: '#121212',
      minHeight: '100vh',
      padding: '40px 20px',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        backgroundColor: '#1e1e1e',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
        padding: '30px',
        border: '1px solid #333'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          marginBottom: '25px',
          textAlign: 'center',
          color: '#f0f0f0',
          borderBottom: '1px solid #333',
          paddingBottom: '15px'
        }}>Create a New Post</h2>

        {error && (
          <div style={{
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            color: '#ff6b6b',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handlePostUpload}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a catchy title"
              required
              style={{
                width: '100%',
                padding: '14px',
                border: '1px solid #444',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: '#2d2d2d',
                color: 'white',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell your story..."
              required
              rows="4"
              style={{
                width: '100%',
                padding: '14px',
                border: '1px solid #444',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: '#2d2d2d',
                color: 'white',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>
              Image
            </label>
            <div style={{
              border: '2px dashed #444',
              borderRadius: '8px',
              padding: '25px 15px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: '#262626'
            }}>
              <input
                type="file"
                id="fileInput"
                onChange={handleImageUpload}
                required
                style={{
                  display: 'none'
                }}
              />
              <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                <div style={{ marginBottom: '10px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                    <line x1="16" y1="5" x2="22" y2="5"></line>
                    <line x1="19" y1="2" x2="19" y2="8"></line>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                </div>
                <p style={{ color: '#aaa' }}>Click to upload your image</p>
              </label>
              {isUploading && <p style={{ marginTop: '10px', color: '#888' }}>Uploading...</p>}
            </div>
          </div>

          {imageUrl && (
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <p style={{ marginBottom: '10px', color: '#ccc' }}>Preview:</p>
              <img 
                src={imageUrl} 
                alt="Uploaded" 
                style={{ 
                  maxWidth: '100%', 
                  borderRadius: '8px', 
                  maxHeight: '300px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' 
                }} 
              />
            </div>
          )}

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <button
              type="submit"
              style={{
                padding: '14px 30px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'transform 0.2s, background-color 0.2s',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              disabled={!user || isUploading}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0069d9'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isUploading ? 'Uploading...' : 'Share Post'}
            </button>
          </div>
          
          {!user && (
            <p style={{ 
              textAlign: 'center', 
              marginTop: '20px',
              padding: '12px',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              borderRadius: '8px',
              color: '#ff6b6b' 
            }}>
              Please log in to create a post
            </p>
          )}
        </form>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <Link
          to={'/Reelupload'}
          style={{
            display: 'inline-block',
            padding: '14px 25px',
            backgroundColor: '#333',
            color: 'white',
            border: '1px solid #444',
            borderRadius: '8px',
            fontSize: '16px',
            textAlign: 'center',
            marginTop: '20px',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#444';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#333';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
            Post Reel
          </span>
        </Link>
      </div>
    </div>
  );
};

export default PostUpload;