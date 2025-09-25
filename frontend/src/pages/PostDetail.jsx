import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, User, Eye, Terminal, Clock, ThumbsUp, ThumbsDown, Send, Filter } from 'lucide-react';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlineUsers] = useState(Math.floor(Math.random() * 50) + 10);

  // Likes/dislikes
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userLike, setUserLike] = useState(null); // 'like', 'dislike', ou null

  // Commentaires
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const textareaRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('post-detail-page');
    return () => {
      document.body.classList.remove('post-detail-page');
    };
  }, []);

  // Récupérer le post et les likes/dislikes
  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8000/api/posts/${id}`);
        if (!res.ok) throw new Error("Erreur lors du chargement du post");
        const data = await res.json();
        setPost(data);
        setLikes(data.likes_count || 0);
        setDislikes(data.dislikes_count || 0);
        setUserLike(data.user_like || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  // Récupérer les commentaires
  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/posts/${id}/comments`);
      if (!res.ok) throw new Error("Erreur lors du chargement des commentaires");
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      // Optionnel : setError(err.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  // Like/dislike
  const handleLike = async () => {
    if (userLike === 'like') return;
    await fetch(`http://localhost:8000/api/posts/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 1 }) // adapte selon ton auth
    });
    setLikes(likes + 1);
    if (userLike === 'dislike') setDislikes(dislikes - 1);
    setUserLike('like');
  };
  const handleDislike = async () => {
    if (userLike === 'dislike') return;
    await fetch(`http://localhost:8000/api/posts/${id}/dislike`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 1 })
    });
    setDislikes(dislikes + 1);
    if (userLike === 'like') setLikes(likes - 1);
    setUserLike('dislike');
  };

  // Ajouter un commentaire
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setCommentLoading(true);
    try {
      await fetch(`http://localhost:8000/api/posts/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment, user_id: 1 }) // adapte user_id selon ton auth
      });
      setComment('');
      // Recharge les commentaires après ajout
      fetchComments();
    } catch (err) {
      // Optionnel : setError(err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  // Tri des commentaires
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'popular') return (b.likes || 0) - (a.likes || 0);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  if (loading) return <div style={{ color: '#FFD700', padding: '2rem' }}>[LOADING] Chargement du post...</div>;
  if (error) return <div style={{ color: '#ff4444', padding: '2rem' }}>[ERROR] {error}</div>;
  if (!post) return null;

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: '#00FF00',
    fontFamily: "'Hack', monospace",
    position: 'relative',
    overflowX: 'hidden',
    width: '80vw',
    margin: '0 auto'
  };
  const cardStyle = {
    backgroundColor: '#000000',
    border: '2px solid #00FF00',
    borderRadius: '0.5rem',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 0 20px rgba(0, 255, 0, 0.1)'
  };
  const buttonStyle = {
    margin: '0',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    color: '#00FF00',
    border: '2px solid #00FF00',
    borderRadius: '0.25rem',
    fontFamily: "'Hack', monospace",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600'
  };

  return (
    <div className="post-detail-container" style={containerStyle}>
      {/* Indicateur d'activité */}
      <div style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        border: '1px solid #00FF00',
        borderRadius: '0.5rem',
        padding: '0.5rem 0.75rem',
        fontSize: '0.75rem'
      }}>
        <div className="animate-pulse-green" style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#00FF00', borderRadius: '50%' }}></div>
        <span>{onlineUsers} développeurs en ligne</span>
      </div>

      {/* Header */}
      <div style={{
        borderBottom: '1px solid #00FF00',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        padding: '1rem 0'
      }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => navigate('/')}
              style={buttonStyle}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#00FF00'; e.target.style.color = '#000'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#00FF00'; }}
            >
              <ChevronLeft size={16} />
              <span>Retour</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00FF00', opacity: 0.8 }}>
              <Terminal size={16} />
              <span>/post/{id}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#00FF00', opacity: 0.8 }}>
            <Eye size={16} />
            <span>Session active</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Carte du post seule */}
        <div style={cardStyle}>
          {/* Meta info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#00FF00', opacity: 0.8, marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '2rem', height: '2rem', backgroundColor: 'rgba(0, 255, 0, 0.2)', border: '1px solid #00FF00', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={16} />
              </div>
              <span>u/{post.user?.name || 'Utilisateur'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} />
              <span>{post.created_at ? new Date(post.created_at).toLocaleString() : ''}</span>
            </div>
          </div>

          {/* Titre */}
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#40FF40', lineHeight: '1.2' }}>
            {post.title}
          </h1>

          {/* Contenu */}
          <div style={{ marginBottom: '2rem', fontSize: '1.125rem', lineHeight: '1.6' }}>
            {post.content}
          </div>

          {/* Likes/Dislikes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={handleLike}
              style={{ ...buttonStyle, backgroundColor: userLike === 'like' ? '#00FF00' : 'transparent', color: userLike === 'like' ? '#000' : '#00FF00' }}
            >
              <ThumbsUp size={16} />
              <span>{likes}</span>
            </button>
            <button
              onClick={handleDislike}
              style={{ ...buttonStyle, backgroundColor: userLike === 'dislike' ? '#ff4444' : 'transparent', color: userLike === 'dislike' ? '#fff' : '#00FF00', borderColor: userLike === 'dislike' ? '#ff4444' : '#00FF00' }}
            >
              <ThumbsDown size={16} />
              <span>{dislikes}</span>
            </button>
          </div>
        </div>

        {/* Formulaire ajout commentaire */}
        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            style={{
              flex: 1,
              minHeight: '60px',
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '2px solid #00FF00',
              borderRadius: '0.5rem',
              color: '#00FF00',
              fontFamily: "'Hack', monospace",
              fontSize: '0.95rem',
              padding: '0.75rem'
            }}
            disabled={commentLoading}
          />
          <button
            type="submit"
            style={{ ...buttonStyle, padding: '0.75rem 1.5rem', fontSize: '1rem' }}
            disabled={commentLoading || !comment.trim()}
          >
            <Send size={16} />
            Publier
          </button>
        </form>

        {/* Filtres commentaires */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Filter size={16} />
          <button style={{ ...buttonStyle, backgroundColor: sortBy === 'recent' ? '#00FF00' : 'transparent', color: sortBy === 'recent' ? '#000' : '#00FF00' }} onClick={() => setSortBy('recent')}>Récents</button>
          <button style={{ ...buttonStyle, backgroundColor: sortBy === 'popular' ? '#00FF00' : 'transparent', color: sortBy === 'popular' ? '#000' : '#00FF00' }} onClick={() => setSortBy('popular')}>Populaires</button>
        </div>

        {/* Liste des commentaires */}
        <div style={{ marginBottom: '2rem' }}>
          {comments.length === 0 ? (
            <div style={{ color: '#00FF00', opacity: 0.7, marginBottom: '2rem' }}>
              [INFO] Aucun commentaire pour ce post.
            </div>
          ) : (
            comments.map(c => (
              <div key={c.id} style={{ borderBottom: '1px solid #00FF00', padding: '1rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <User size={14} />
                  <span style={{ color: '#40FF40' }}>u/{c.user?.name || 'Utilisateur'}</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{c.created_at ? new Date(c.created_at).toLocaleString() : ''}</span>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>{c.content}</div>
                {/* Likes/Dislikes sous le commentaire */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <button style={{ background: 'transparent', border: 'none', color: '#00FF00', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                    <ThumbsUp size={16} />
                    <span>{Math.floor(Math.random() * 20)}</span>
                  </button>
                  <button style={{ background: 'transparent', border: 'none', color: '#ff4444', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                    <ThumbsDown size={16} />
                    <span>{Math.floor(Math.random() * 5)}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes pulse-green {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-green {
          animation: pulse-green 2s infinite;
        }
      `}</style>
    </div>
  );
}