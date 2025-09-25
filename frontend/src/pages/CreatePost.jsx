import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Terminal, Zap, User, Eye, AlertTriangle, CheckCircle, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [typingEffect, setTypingEffect] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [onlineUsers] = useState(Math.floor(Math.random() * 50) + 10);
  
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const CURRENT_USER_ID = 1; // TODO: remplacer par l'utilisateur authentifié

  // Appliquer le thème terminal au body
  useEffect(() => {
    document.body.classList.add('create-post-page');
    return () => {
      document.body.classList.remove('create-post-page');
    };
  }, []);

  // Effet de frappe pour le placeholder
  useEffect(() => {
    const phrases = [
      'Décrivez votre découverte...',
      'Partagez votre expertise...',
      'Posez votre question technique...',
      'Documentez votre solution...'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeEffect = setInterval(() => {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        setTypingEffect(currentPhrase.substring(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      } else {
        setTypingEffect(currentPhrase.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex === currentPhrase.length) {
          setTimeout(() => { isDeleting = true; }, 2000);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearInterval(typeEffect);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!title.trim() || !content.trim()) {
      setError('[ ERROR ] Titre et contenu requis pour l\'upload');
      return;
    }
    
    if (title.trim().length < 5) {
      setError('[ ERROR ] Titre trop court (min. 5 caractères)');
      return;
    }

    setLoading(true);
    
    // Notification de début d'upload
    const uploadNotif = {
      id: Date.now(),
      message: 'Upload en cours...',
      time: Date.now()
    };
    setNotifications(prev => [...prev, uploadNotif]);

    try {
      const res = await fetch('http://localhost:8000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ 
          title: title.trim(), 
          content: content.trim(), 
          user_id: CURRENT_USER_ID 
        })
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        throw new Error(data.message || '[ SYSTEM ERROR ] Connexion serveur échouée');
      }
      
      setSuccess(`[ SUCCESS ] Post uploadé avec succès | ID: ${data.post.id}`);
      
      // Notification de succès
      setNotifications(prev => prev.filter(n => n.id !== uploadNotif.id));
      const successNotif = {
        id: Date.now() + 1,
        message: `Post créé | ID: ${data.post.id}`,
        time: Date.now()
      };
      setNotifications(prev => [...prev, successNotif]);
      
      // Reset form
      setTitle('');
      setContent('');
      
      // Auto-suppression des notifications
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== successNotif.id));
      }, 4000);
      
    } catch (err) {
      setError(err.message);
      setNotifications(prev => prev.filter(n => n.id !== uploadNotif.id));
    } finally {
      setLoading(false);
    }
  };

  // Styles inline pour le thème terminal
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: '#00FF00',
    fontFamily: "'Hack', monospace",
    position: 'relative',
    overflowX: 'hidden'
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

  const inputStyle = {
    width: '100%',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    border: '2px solid #00FF00',
    borderRadius: '0.5rem',
    color: '#00FF00',
    fontFamily: "'Hack', monospace",
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'all 0.2s ease'
  };

  const cardStyle = {
    backgroundColor: '#000000',
    border: '2px solid #00FF00',
    borderRadius: '0.5rem',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 0 20px rgba(0, 255, 0, 0.1)'
  };

  return (
    <div className="create-post-container" style={containerStyle}>
      {/* Notifications Toast */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 50, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="animate-slide-in-right"
            style={{
              backgroundColor: '#00FF00',
              color: '#000000',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              fontFamily: "'Hack', monospace",
              fontSize: '0.875rem'
            }}
          >
            {notif.message}
          </div>
        ))}
      </div>

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
              <span>/create-post</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#00FF00', opacity: 0.8 }}>
            <Eye size={16} />
            <span>Session active</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Formulaire principal */}
        <div style={cardStyle}>
          {/* Header du formulaire */}
          <div style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(0, 255, 0, 0.3)', paddingBottom: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#40FF40' }}>
              <Upload size={32} />
              [UPLOAD] Nouveau Post
            </h1>
            <p style={{ color: '#00FF00', opacity: 0.8, fontSize: '0.875rem' }}>
              Partagez votre expertise technique avec la communauté
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Champ Titre */}
            <div>
              <label style={{ display: 'block', fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#40FF40' }}>
                [REQUIRED] Titre du post
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
                placeholder="[GUIDE] Votre découverte technique..."
                maxLength={255}
                onFocus={(e) => {
                  e.target.style.borderColor = '#40FF40';
                  e.target.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#00FF00';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: title.length > 240 ? '#ff4444' : '#00FF00',
                opacity: 0.8
              }}>
                <span>Taille recommandée: 20-80 caractères</span>
                <span>{title.length}/255</span>
              </div>
            </div>

            {/* Champ Contenu */}
            <div>
              <label style={{ display: 'block', fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#40FF40' }}>
                [REQUIRED] Contenu technique
              </label>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{
                  ...inputStyle,
                  minHeight: '300px',
                  resize: 'vertical',
                  lineHeight: '1.6'
                }}
                rows={12}
                placeholder={content ? '' : typingEffect}
                onFocus={(e) => {
                  e.target.style.borderColor = '#40FF40';
                  e.target.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#00FF00';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                marginTop: '0.75rem',
                fontSize: '0.75rem',
                color: '#00FF00',
                opacity: 0.6
              }}>
                <span>Format supporté: Markdown</span>
                <span>|</span>
                <span>**gras** *italique* `code`</span>
                <span>|</span>
                <span>{content.length} caractères</span>
              </div>
            </div>

            {/* Messages d'erreur/succès */}
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#ff4444',
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                border: '1px solid #ff4444',
                borderRadius: '0.25rem',
                padding: '0.75rem',
                fontSize: '0.875rem'
              }}>
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#40FF40',
                backgroundColor: 'rgba(0, 255, 0, 0.1)',
                border: '1px solid #40FF40',
                borderRadius: '0.25rem',
                padding: '0.75rem',
                fontSize: '0.875rem'
              }}>
                <CheckCircle size={16} />
                <span>{success}</span>
              </div>
            )}

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              style={{
                ...buttonStyle,
                padding: '1rem 2rem',
                fontSize: '1rem',
                backgroundColor: (loading || !title.trim() || !content.trim()) ? 'rgba(0, 255, 0, 0.2)' : (loading ? '#FFD700' : '#00FF00'),
                color: (loading || !title.trim() || !content.trim()) ? 'rgba(0, 255, 0, 0.6)' : (loading ? '#000' : '#000'),
                borderColor: (loading || !title.trim() || !content.trim()) ? 'rgba(0, 255, 0, 0.4)' : (loading ? '#FFD700' : '#00FF00'),
                cursor: (loading || !title.trim() || !content.trim()) ? 'not-allowed' : 'pointer',
                alignSelf: 'flex-start',
                minWidth: '200px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (!loading && title.trim() && content.trim()) {
                  e.target.style.backgroundColor = '#40FF40';
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 0 25px rgba(0, 255, 0, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && title.trim() && content.trim()) {
                  e.target.style.backgroundColor = '#00FF00';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? (
                <>
                  <Zap size={16} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Send size={16} />
                  [EXECUTE] Publier
                </>
              )}
            </button>
          </form>
        </div>

        {/* Infos utilisateur */}
        <div style={{
          ...cardStyle,
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.875rem',
          opacity: 0.8
        }}>
          <User size={16} />
          <span>Connecté en tant que: user_${CURRENT_USER_ID}</span>
          <span>|</span>
          <span>Permissions: READ/WRITE</span>
        </div>
      </div>

      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes pulse-green {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
        
        .animate-pulse-green {
          animation: pulse-green 2s infinite;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}