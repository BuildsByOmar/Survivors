import React, { useEffect, useState } from "react";
import { Eye, User, ChevronLeft, Terminal, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import surv from "../assets/surv.png";


export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlineUsers] = useState(Math.floor(Math.random() * 50) + 10);
  const [search, setSearch] = useState('');
  const [typingEffect, setTypingEffect] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    document.body.classList.add('create-post-page');
    return () => {
      document.body.classList.remove('create-post-page');
    };
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:8000/api/posts');
        if (!res.ok) throw new Error("Erreur lors du chargement des posts");
        const data = await res.json();
        setPosts(data.posts || data); // selon la structure de l'API
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    const phrases = [
      'Rechercher un post technique...',
      'Tapez un mot clé...',
      'Explorez les découvertes...',
      'Trouvez une solution...'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    let typeTimeout;
    function type() {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        setTypingEffect(currentPhrase.substring(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
        typeTimeout = setTimeout(type, 50);
      } else {
        setTypingEffect(currentPhrase.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex === currentPhrase.length) {
          setTimeout(() => { isDeleting = true; type(); }, 2000);
        } else {
          typeTimeout = setTimeout(type, 100);
        }
      }
    }
    type();
    return () => clearTimeout(typeTimeout);
  }, []);

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
    <div className="home-container" style={containerStyle}>
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
        padding: '1rem 0',
        marginBottom: '2rem'
      }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => navigate('/create-post')}
              style={buttonStyle}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#00FF00'; e.target.style.color = '#000'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#00FF00'; }}
            >
              <Upload size={16} />
              <span>Nouveau post</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00FF00', opacity: 0.8 }}>
              <Terminal size={16} />
              <span>Accueil</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ color: '#00FF00', opacity: 0.8, fontSize: '0.95rem' }}> u/{user?.name || 'Utilisateur'}</span>
          <div
            style={{
            width: '2rem',
            height: '2rem',
            backgroundColor: 'rgba(0, 255, 0, 0.2)',
            border: '1px solid #00FF00',
            borderRadius: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Se déconnecter"
          onClick={() => {
            localStorage.removeItem('user');
            navigate('/login');
          }}
        >
          <User size={16} />
        </div>
            </div>
        </div>
      </div>

      {/* Logo centré */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
        <img
          src={surv}
          alt="Survivors logo"
          style={{ width: '40vw', height: '10vw', background: 'none', borderRadius: '0', boxShadow: 'none' }}
        />
      </div>

      {/* Barre de recherche */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder={typingEffect || "Rechercher un mot clé dans les posts..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '40vw',
            padding: '1rem',
            border: '2px solid #00FF00',
            borderRadius: '0.5rem',
            background: 'rgba(0,0,0,0.8)',
            color: '#00FF00',
            fontFamily: "'Hack', monospace",
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Affichage des posts */}
        {loading && <div style={{ color: '#FFD700', fontSize: '1.25rem', marginBottom: '2rem' }}>[LOADING] Chargement des posts...</div>}
        {error && <div style={{ color: '#ff4444', fontSize: '1.25rem', marginBottom: '2rem' }}>[ERROR] {error}</div>}
        {!loading && !error && posts.length === 0 && (
          <div style={{ color: '#00FF00', opacity: 0.7, fontSize: '1.1rem' }}>[INFO] Aucun post pour le moment.</div>
        )}
        {posts.filter(post => post.title.toLowerCase().includes(search.toLowerCase()) || post.content.toLowerCase().includes(search.toLowerCase())).map(post => (
          <div key={post.id} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '2rem', height: '2rem', backgroundColor: 'rgba(0, 255, 0, 0.2)', border: '1px solid #00FF00', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={16} />
              </div>
              <span style={{ color: '#00FF00', opacity: 0.8, fontSize: '0.95rem' }}>u/{post.author?.name || post.user?.name || 'Utilisateur'}</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#40FF40', marginBottom: '0.5rem', cursor: 'pointer' }} onClick={() => navigate(`/post/${post.id}`)}>
              {post.title}
            </h2>
            <div style={{ color: '#00FF00', opacity: 0.8, fontSize: '1rem', marginBottom: '1rem', lineHeight: 1.5 }}>
              {post.content?.slice(0, 180)}{post.content && post.content.length > 180 ? '...' : ''}
            </div>
            <button
              style={{ ...buttonStyle, fontSize: '0.95rem', padding: '0.5rem 1.25rem', marginTop: '0.5rem' }}
              onClick={() => navigate(`/post/${post.id}`)}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#00FF00'; e.target.style.color = '#000'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#00FF00'; }}
            >
              <ChevronLeft size={16} style={{ transform: 'rotate(180deg)' }} /> Voir le post
            </button>
          </div>
        ))}
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