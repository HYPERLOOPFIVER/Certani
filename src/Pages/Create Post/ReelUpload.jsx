import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/Firebase';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { onAuthStateChanged } from '../../firebase/Firebase';
import { Link } from 'react-router-dom';

// Cloudinary setup
const CLOUD_NAME = 'dfzmg1jtd';
const UPLOAD_PRESET = 'ml_default';

const ReelUpload = () => {
  const [caption, setCaption] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file is a video
      if (!file.type.match('video.*')) {
        setError('Please select a video file');
        return;
      }
      
      // Check file size (limit to 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setError('Video size should be less than 100MB');
        return;
      }
      
      setVideoFile(file);
      setError('');
      
      // Create a preview URL
      const videoPreviewUrl = URL.createObjectURL(file);
      // Create video element to get thumbnail
      const video = document.createElement('video');
      video.src = videoPreviewUrl;
      video.onloadeddata = () => {
        // Create a canvas to capture the thumbnail
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setThumbnailUrl(canvas.toDataURL('image/jpeg'));
      };
    }
  };

  const handleVideoUpload = async () => {
    if (!videoFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', CLOUD_NAME);
    
    try {
      // Use XHR to track upload progress
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      };
      
      xhr.onload = async function() {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setVideoUrl(data.secure_url);
          setIsUploading(false);
          setUploadProgress(100);
        }
      };
      
      xhr.onerror = function() {
        setError('Error uploading video');
        setIsUploading(false);
      };
      
      xhr.send(formData);
    } catch (error) {
      setError('Error uploading video: ' + error.message);
      setIsUploading(false);
    }
  };

  const handleReelSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to post a reel.');
      return;
    }

    if (!caption || !videoUrl) {
      setError('Caption and video are required');
      return;
    }

    try {
      // Create a new reel in the 'reels' collection
      const reelRef = await addDoc(collection(db, 'reels'), {
        caption,
        videoUrl,
        thumbnailUrl,
        uid: user.uid,
        username: user.displayName || 'Anonymous', // Include username if available
        userAvatar: user.photoURL || '', // Include user avatar if available
        createdAt: new Date(),
        likes: [], // Initialize empty likes array
        comments: [], // Initialize empty comments array
        likeCount: 0, // Initialize like counter
        commentCount: 0, // Initialize comment counter
        views: 0 // Initialize views counter
      });

      // Update the user's document to include the new reel's ID
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        reels: arrayUnion(reelRef.id), // Add reel ID to user's reels array
      });

      setCaption('');
      setVideoFile(null);
      setVideoUrl('');
      setThumbnailUrl('');
      setError('');
      alert('Reel uploaded successfully');
    } catch (error) {
      setError('Error posting reel: ' + error.message);
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
        }}>Create a New Reel</h2>

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

        <form onSubmit={handleReelSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption for your reel..."
              required
              rows="3"
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
              Video
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
                id="videoInput"
                accept="video/*"
                onChange={handleVideoSelect}
                required={!videoUrl}
                style={{
                  display: 'none'
                }}
              />
              <label htmlFor="videoInput" style={{ cursor: 'pointer' }}>
                <div style={{ marginBottom: '10px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                </div>
                <p style={{ color: '#aaa' }}>{videoFile ? videoFile.name : 'Click to select a video'}</p>
                {videoFile && !videoUrl && !isUploading && (
                  <button 
                    type="button" 
                    onClick={handleVideoUpload}
                    style={{
                      marginTop: '10px',
                      padding: '8px 15px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Upload Video
                  </button>
                )}
              </label>
            </div>
          </div>

          {isUploading && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ marginBottom: '5px', color: '#ccc' }}>Uploading: {uploadProgress}%</p>
              <div style={{ 
                width: '100%', 
                backgroundColor: '#333', 
                borderRadius: '4px', 
                height: '10px' 
              }}>
                <div style={{ 
                  width: `${uploadProgress}%`, 
                  backgroundColor: '#2196F3', 
                  height: '10px', 
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
          )}

          {thumbnailUrl && !videoUrl && (
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <p style={{ marginBottom: '10px', color: '#ccc' }}>Thumbnail Preview:</p>
              <img 
                src={thumbnailUrl} 
                alt="Video Thumbnail" 
                style={{ 
                  maxWidth: '100%', 
                  borderRadius: '8px', 
                  maxHeight: '300px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' 
                }} 
              />
            </div>
          )}

          {videoUrl && (
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <p style={{ marginBottom: '10px', color: '#ccc' }}>Video Preview:</p>
              <video 
                src={videoUrl} 
                controls 
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
                backgroundColor: '#FF3366', // Different color for reel uploads
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: videoUrl ? 'pointer' : 'not-allowed',
                opacity: videoUrl ? '1' : '0.7',
                fontWeight: 'bold',
                transition: 'transform 0.2s, background-color 0.2s',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              disabled={!user || !videoUrl || isUploading}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E62E5C'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF3366'}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Share Reel
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
              Please log in to create a reel
            </p>
          )}
        </form>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <Link
          to={'/postupload'}
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            Post Image
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ReelUpload;
