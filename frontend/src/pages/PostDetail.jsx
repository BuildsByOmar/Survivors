import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ThumbsUp, ThumbsDown, MessageCircle, Send, User, Clock, Hash, Share2, Bookmark, Eye, Award, Filter, ChevronUp, ChevronDown, Reply, Flag, Edit3, MoreHorizontal, Heart, Zap } from 'lucide-react';

export default function PostDetail() {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comment, setComment] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewCount, setViewCount] = useState(1247);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [typingEffect, setTypingEffect] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [notifications, setNotifications] = useState([]);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [commentLikes, setCommentLikes] = useState({});
  const [onlineUsers] = useState(Math.floor(Math.random() * 50) + 10);
  
  const textareaRef = useRef(null);
  const shareMenuRef = useRef(null);

  const [comments, setComments] = useState([
    { 
      id: 1, 
      author: 'Alice_42', 
      content: 'Super intéressant ! Cette approche résout vraiment le problème. J\'ai implémenté quelque chose de similaire sur mon projet et ça marche parfaitement.', 
      time: '2h', 
      likes: 12,
      replies: [
        { id: 101, author: 'TechMaster_2024', content: 'Merci Alice ! Tu peux partager ton implémentation ?', time: '1h45', likes: 3 }
      ],
      award: 'helpful'
    },
    { 
      id: 2, 
      author: 'Bob_dev', 
      content: 'Je suis d\'accord 💯 Quelqu\'un a testé en prod ? J\'aimerais avoir des retours d\'expérience.', 
      time: '1h', 
      likes: 8,
      replies: [],
      controversial: true
    },
    { 
      id: 3, 
      author: 'CyberCat', 
      content: 'Merci pour le partage ! Documentation très claire et exemples pratiques. Exactement ce que je cherchais 🚀', 
      time: '45min', 
      likes: 15,
      replies: [
        { id: 301, author: 'DevNinja', content: 'Totalement d\'accord ! Bookmark direct', time: '30min', likes: 2 },
        { id: 302, author: 'CodeWizard', content: 'Les schémas sont top 👌', time: '25min', likes: 1 }
      ]
    }
  ]);

  // Appliquer la classe CSS au body au montage du composant
  useEffect(() => {
    document.body.classList.add('post-detail-page');
    return () => {
      document.body.classList.remove('post-detail-page');
    };
  }, []);

  // Effet de frappe pour le placeholder
  useEffect(() => {
    const phrases = [
      'Partagez votre expérience...',
      'Posez une question...',
      'Donnez votre avis...',
      'Contribuez à la discussion...'
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

  // Simulation d'activité en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setViewCount(prev => prev + Math.floor(Math.random() * 3));
      
      // Notifications aléatoires
      if (Math.random() < 0.1) {
        const messages = [
          'Nouveau like sur votre post !',
          'Quelqu\'un a commenté',
          'Votre post est tendance !',
          'Nouveau follower !'
        ];
        const newNotif = {
          id: Date.now(),
          message: messages[Math.floor(Math.random() * messages.length)],
          time: Date.now()
        };
        setNotifications(prev => [...prev.slice(-2), newNotif]);
        
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
        }, 4000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Gestion des clics extérieurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 300);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    const message = bookmarked ? 'Retiré des favoris' : 'Ajouté aux favoris';
    setNotifications(prev => [...prev, { id: Date.now(), message, time: Date.now() }]);
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        author: 'User_' + Math.floor(Math.random() * 1000),
        content: comment,
        time: 'maintenant',
        likes: 0,
        replies: []
      };
      
      if (replyingTo) {
        setComments(prev => prev.map(c => 
          c.id === replyingTo 
            ? { ...c, replies: [...c.replies, { ...newComment, id: Date.now() + 1000 }] }
            : c
        ));
        setReplyingTo(null);
      } else {
        setComments([newComment, ...comments]);
      }
      
      setComment('');
      setNotifications(prev => [...prev, { id: Date.now(), message: 'Commentaire publié !', time: Date.now() }]);
    }
  };

  const handleCommentLike = (commentId) => {
    setCommentLikes(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleReply = (commentId, authorName) => {
    setReplyingTo(commentId);
    setComment(`@${authorName} `);
    textareaRef.current?.focus();
  };

  const toggleCommentExpansion = (commentId) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const sortedComments = [...comments].sort((a, b) => {
    switch(sortBy) {
      case 'popular': return b.likes - a.likes;
      case 'controversial': return b.controversial ? 1 : -1;
      case 'recent': 
      default: return new Date(b.time) - new Date(a.time);
    }
  });

  const sharePost = (platform) => {
    const url = window.location.href;
    const text = "Architecture microservices avec Docker et Kubernetes";
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      copy: () => {
        navigator.clipboard.writeText(url);
        setNotifications(prev => [...prev, { id: Date.now(), message: 'Lien copié !', time: Date.now() }]);
      }
    };
    
    if (platform === 'copy') {
      shareUrls.copy();
    } else {
      window.open(shareUrls[platform], '_blank');
    }
    setShowShareMenu(false);
  };

  // Styles inline pour éviter les conflits CSS
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
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    color: '#00FF00',
    border: '1px solid #00FF00',
    borderRadius: '0.25rem',
    fontFamily: "'Hack', monospace",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#00FF00',
    color: '#000000'
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
    <div className="post-detail-container" style={containerStyle}>
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
        <span>{onlineUsers} en ligne</span>
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
              style={buttonStyle}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#00FF00'; e.target.style.color = '#000'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#00FF00'; }}
            >
              <ChevronLeft size={16} />
              <span>Retour</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00FF00', opacity: 0.8 }}>
              <Hash size={16} />
              <span>r/development</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#00FF00', opacity: 0.8 }}>
              <Eye size={16} />
              <span>{viewCount.toLocaleString()}</span>
            </div>
            <div style={{ position: 'relative' }} ref={shareMenuRef}>
              <button 
                onClick={() => setShowShareMenu(!showShareMenu)}
                style={buttonStyle}
                onMouseEnter={(e) => { e.target.style.backgroundColor = '#00FF00'; e.target.style.color = '#000'; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#00FF00'; }}
              >
                <Share2 size={16} />
              </button>
              
              {showShareMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '3rem',
                  backgroundColor: '#000000',
                  border: '2px solid #00FF00',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  zIndex: 40,
                  minWidth: '12rem'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button 
                      onClick={() => sharePost('twitter')}
                      style={{ ...buttonStyle, width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                      onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.2)'; }}
                      onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; }}
                    >
                      🐦 Twitter
                    </button>
                    <button 
                      onClick={() => sharePost('linkedin')}
                      style={{ ...buttonStyle, width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                      onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.2)'; }}
                      onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; }}
                    >
                      💼 LinkedIn
                    </button>
                    <button 
                      onClick={() => sharePost('copy')}
                      style={{ ...buttonStyle, width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                      onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.2)'; }}
                      onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; }}
                    >
                      📋 Copier le lien
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Post principal */}
        <div style={cardStyle}>
          {/* Meta info */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#00FF00', opacity: 0.8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '2rem', height: '2rem', backgroundColor: 'rgba(0, 255, 0, 0.2)', border: '1px solid #00FF00', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} />
                </div>
                <span>u/TechMaster_2024</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} />
                <span>il y a 3h</span>
              </div>
              <div className="animate-pulse-green" style={{ padding: '0.25rem 0.5rem', backgroundColor: 'rgba(0, 255, 0, 0.2)', border: '1px solid #00FF00', borderRadius: '0.25rem', fontSize: '0.75rem' }}>
                🔥 TENDANCE
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award style={{ color: '#FFD700' }} size={20} />
              <span style={{ color: '#FFD700', fontSize: '0.875rem' }}>Gold Award</span>
            </div>
          </div>

          {/* Titre */}
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#40FF40', lineHeight: '1.2' }}>
            [GUIDE] Architecture microservices avec Docker et Kubernetes
          </h1>

          {/* Contenu */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '1.125rem', marginBottom: '1rem', lineHeight: '1.6' }}>
              Salut la communauté ! 👋 Après plusieurs mois de travail sur une architecture microservices,
              je partage avec vous les <span style={{ color: '#40FF40', fontWeight: '600', backgroundColor: 'rgba(0, 255, 0, 0.1)', padding: '0 0.25rem', borderRadius: '0.125rem' }}>bonnes pratiques</span> que j'ai découvertes.
            </p>
            <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
              Cette approche m'a permis de <span style={{ color: '#40FF40', fontWeight: '600', backgroundColor: 'rgba(0, 255, 0, 0.1)', padding: '0 0.25rem', borderRadius: '0.125rem' }}>réduire le temps de déploiement de 80%</span> 
              et d'améliorer significativement la scalabilité de nos applications.
            </p>
            <div style={{ backgroundColor: 'rgba(0, 255, 0, 0.1)', borderLeft: '4px solid #00FF00', paddingLeft: '1.5rem', padding: '1rem 0 1rem 1.5rem', margin: '1.5rem 0', borderRadius: '0 0.25rem 0.25rem 0' }}>
              <p style={{ color: '#40FF40', fontWeight: '600', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={16} />
                Points clés :
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>• Isolation des services avec Docker</li>
                <li style={{ marginBottom: '0.5rem' }}>• Orchestration avec Kubernetes</li>
                <li style={{ marginBottom: '0.5rem' }}>• Monitoring avec Prometheus + Grafana</li>
                <li>• CI/CD avec GitLab</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0, 255, 0, 0.3)' }}>
            <button 
              onClick={handleLike}
              style={liked ? { ...activeButtonStyle, boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)' } : buttonStyle}
              onMouseEnter={(e) => {
                if (!liked) {
                  e.target.style.backgroundColor = '#00FF00';
                  e.target.style.color = '#000';
                }
              }}
              onMouseLeave={(e) => {
                if (!liked) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#00FF00';
                }
              }}
            >
              <ThumbsUp size={16} />
              <span>{liked ? '248' : '247'}</span>
            </button>
            
            <button 
              onClick={handleDislike}
              style={disliked ? { ...buttonStyle, backgroundColor: '#ff0000', color: '#fff', borderColor: '#ff0000' } : buttonStyle}
              onMouseEnter={(e) => {
                if (!disliked) {
                  e.target.style.backgroundColor = '#ff0000';
                  e.target.style.color = '#fff';
                  e.target.style.borderColor = '#ff0000';
                }
              }}
              onMouseLeave={(e) => {
                if (!disliked) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#00FF00';
                  e.target.style.borderColor = '#00FF00';
                }
              }}
            >
              <ThumbsDown size={16} />
              <span>12</span>
            </button>
            
            <button 
              onClick={handleBookmark}
              style={bookmarked ? { ...buttonStyle, backgroundColor: '#FFD700', color: '#000', borderColor: '#FFD700' } : buttonStyle}
              onMouseEnter={(e) => {
                if (!bookmarked) {
                  e.target.style.backgroundColor = '#FFD700';
                  e.target.style.color = '#000';
                  e.target.style.borderColor = '#FFD700';
                }
              }}
              onMouseLeave={(e) => {
                if (!bookmarked) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#00FF00';
                  e.target.style.borderColor = '#00FF00';
                }
              }}
            >
              <Bookmark size={16} />
              <span>{bookmarked ? 'Sauvegardé' : 'Sauvegarder'}</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00FF00', opacity: 0.8, marginLeft: '1rem' }}>
              <MessageCircle size={16} />
              <span>{comments.reduce((total, comment) => total + 1 + comment.replies.length, 0)} commentaires</span>
            </div>
          </div>
        </div>

        {/* Tri des commentaires */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Filter size={16} />
          <span style={{ fontSize: '0.875rem' }}>Trier par :</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { key: 'recent', label: '🕐 Récents' },
              { key: 'popular', label: '🔥 Populaires' },
              { key: 'controversial', label: '⚡ Controversés' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                style={sortBy === key ? { ...buttonStyle, backgroundColor: 'rgba(0, 255, 0, 0.2)', color: '#40FF40' } : buttonStyle}
                onMouseEnter={(e) => {
                  if (sortBy !== key) {
                    e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sortBy !== key) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Section commentaires */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MessageCircle size={24} />
            Commentaires ({comments.reduce((total, comment) => total + 1 + comment.replies.length, 0)})
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {sortedComments.map((comment) => (
              <div key={comment.id} style={{ ...cardStyle, padding: '1.5rem' }}>
                {/* Commentaire principal */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '2rem', height: '2rem', backgroundColor: 'rgba(0, 255, 0, 0.2)', border: '1px solid #00FF00', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={16} />
                      </div>
                      <span style={{ color: '#40FF40', fontWeight: '600' }}>u/{comment.author}</span>
                      <span style={{ color: '#00FF00', opacity: 0.8, fontSize: '0.875rem' }}>• il y a {comment.time}</span>
                      {comment.award && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#FFD700', fontSize: '0.75rem' }}>
                          <Award size={12} />
                          <span>{comment.award}</span>
                        </div>
                      )}
                      {comment.controversial && (
                        <span style={{ color: '#FFA500', fontSize: '0.75rem' }}>⚡ Controversé</span>
                      )}
                    </div>
                    <button style={{ ...buttonStyle, padding: '0.25rem' }}>
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  
                  <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>{comment.content}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem' }}>
                    <button 
                      onClick={() => handleCommentLike(comment.id)}
                      style={{ 
                        ...buttonStyle, 
                        padding: '0.25rem 0.5rem',
                        color: commentLikes[comment.id] ? '#40FF40' : '#00FF00'
                      }}
                    >
                      <ThumbsUp size={14} />
                      <span>{comment.likes + (commentLikes[comment.id] ? 1 : 0)}</span>
                    </button>
                    <button 
                      onClick={() => handleReply(comment.id, comment.author)}
                      style={{ ...buttonStyle, padding: '0.25rem 0.5rem' }}
                    >
                      <Reply size={14} />
                      Répondre
                    </button>
                    <button style={{ ...buttonStyle, padding: '0.25rem 0.5rem' }}>
                      <Flag size={14} />
                      Signaler
                    </button>
                    {comment.replies.length > 0 && (
                      <button 
                        onClick={() => toggleCommentExpansion(comment.id)}
                        style={{ ...buttonStyle, padding: '0.25rem 0.5rem' }}
                      >
                        {expandedComments.has(comment.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {comment.replies.length} réponse{comment.replies.length > 1 ? 's' : ''}
                      </button>
                    )}
                  </div>
                </div>

                {/* Réponses */}
                {expandedComments.has(comment.id) && comment.replies.length > 0 && (
                  <div style={{ borderTop: '1px solid rgba(0, 255, 0, 0.3)', backgroundColor: 'rgba(0, 255, 0, 0.05)', marginTop: '1rem', paddingTop: '1rem' }}>
                    {comment.replies.map((reply) => (
                      <div key={reply.id} style={{ padding: '1rem', marginLeft: '1.5rem', borderLeft: '2px solid rgba(0, 255, 0, 0.3)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <div style={{ width: '1.5rem', height: '1.5rem', backgroundColor: 'rgba(0, 255, 0, 0.2)', border: '1px solid #00FF00', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={12} />
                          </div>
                          <span style={{ color: '#40FF40', fontWeight: '600', fontSize: '0.875rem' }}>u/{reply.author}</span>
                          <span style={{ color: '#00FF00', opacity: 0.8, fontSize: '0.75rem' }}>• il y a {reply.time}</span>
                        </div>
                        <p style={{ fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '0.75rem' }}>{reply.content}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem' }}>
                          <button style={{ ...buttonStyle, padding: '0.125rem 0.25rem', fontSize: '0.75rem' }}>
                            <ThumbsUp size={12} />
                            <span>{reply.likes}</span>
                          </button>
                          <button style={{ ...buttonStyle, padding: '0.125rem 0.25rem', fontSize: '0.75rem' }}>
                            Répondre
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ajout de commentaire */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit3 size={20} />
            {replyingTo ? 'Répondre au commentaire' : 'Ajouter un commentaire'}
          </h3>
          
          {replyingTo && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(0, 255, 0, 0.1)', border: '1px solid rgba(0, 255, 0, 0.3)', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem' }}>Réponse en cours...</span>
              <button 
                onClick={() => {setReplyingTo(null); setComment('');}}
                style={{ color: '#ff4444', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'Hack', monospace" }}
              >
                ✕
              </button>
            </div>
          )}
          
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '2px solid #00FF00',
              borderRadius: '0.5rem',
              color: '#00FF00',
              fontFamily: "'Hack', monospace",
              fontSize: '0.875rem',
              lineHeight: '1.5',
              resize: 'none',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            rows="4"
            placeholder={comment ? '' : typingEffect}
            onFocus={(e) => {
              e.target.style.borderColor = '#40FF40';
              e.target.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#00FF00';
              e.target.style.boxShadow = 'none';
            }}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: comment.length > 900 ? '#ff4444' : '#00FF00', opacity: 0.8 }}>
                {comment.length}/1000 caractères
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: '#00FF00', opacity: 0.6 }}>
                <span>**gras**</span>
                <span>*italique*</span>
                <span>`code`</span>
              </div>
            </div>
            
            <button 
              onClick={handleAddComment}
              disabled={!comment.trim() || comment.length > 1000}
              style={{
                ...buttonStyle,
                padding: '0.75rem 1.5rem',
                fontWeight: '600',
                backgroundColor: comment.trim() && comment.length <= 1000 ? '#00FF00' : 'rgba(0, 255, 0, 0.2)',
                color: comment.trim() && comment.length <= 1000 ? '#000' : '#00FF00',
                cursor: comment.trim() && comment.length <= 1000 ? 'pointer' : 'not-allowed',
                opacity: comment.trim() && comment.length <= 1000 ? 1 : 0.6
              }}
              onMouseEnter={(e) => {
                if (comment.trim() && comment.length <= 1000) {
                  e.target.style.backgroundColor = '#40FF40';
                  e.target.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (comment.trim() && comment.length <= 1000) {
                  e.target.style.backgroundColor = '#00FF00';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              <Send size={16} />
              {replyingTo ? 'Répondre' : 'Publier'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        borderTop: '1px solid rgba(0, 255, 0, 0.3)', 
        marginTop: '4rem', 
        padding: '2rem 0', 
        textAlign: 'center', 
        color: '#00FF00', 
        opacity: 0.8,
        fontSize: '0.875rem',
        background: 'linear-gradient(to top, rgba(0, 255, 0, 0.05), transparent)'
      }}>
        <p style={{ margin: 0, cursor: 'pointer', transition: 'color 0.2s ease' }}
           onMouseEnter={(e) => e.target.style.color = '#40FF40'}
           onMouseLeave={(e) => e.target.style.color = '#00FF00'}
        >
          © 2024 Terminal Forum - Powered by React ⚡
        </p>
      </div>

      {/* Styles CSS pour les animations */}
      <style jsx>{`
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
      `}</style>
    </div>
  );
}