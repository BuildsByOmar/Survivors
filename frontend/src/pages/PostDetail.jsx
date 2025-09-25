import React, { useState } from 'react';
import { ChevronLeft, ThumbsUp, ThumbsDown, MessageCircle, Send, User, Clock, Hash } from 'lucide-react';

export default function PostDetail() {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'Alice_42', content: 'Super intéressant ! Cette approche résout vraiment le problème.', time: '2h', likes: 12 },
    { id: 2, author: 'Bob_dev', content: 'Je suis d\'accord 💯 Quelqu\'un a testé en prod ?', time: '1h', likes: 8 },
    { id: 3, author: 'CyberCat', content: 'Merci pour le partage, j\'ai implémenté quelque chose de similaire récemment.', time: '45min', likes: 5 }
  ]);

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: 'User_' + Math.floor(Math.random() * 1000),
        content: comment,
        time: 'maintenant',
        likes: 0
      };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header avec navigation */}
      <div className="border-b border-green-600 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-2 border border-green-600 rounded hover:bg-green-600 hover:text-black transition-all duration-200">
            <ChevronLeft size={16} />
            <span>Retour</span>
          </button>
          <div className="flex items-center gap-2 text-green-500">
            <Hash size={16} />
            <span>r/development</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Post principal */}
        <div className="mb-8 p-8 border-2 border-green-600 rounded-lg bg-gradient-to-br from-green-900/10 to-black shadow-2xl shadow-green-500/10">
          {/* Meta info */}
          <div className="flex items-center gap-4 mb-6 text-sm text-green-500">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>u/TechMaster_2024</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>il y a 3h</span>
            </div>
            <div className="px-2 py-1 bg-green-600/20 border border-green-600 rounded text-xs">
              DISCUSSION
            </div>
          </div>

          {/* Titre */}
          <h1 className="text-3xl font-bold mb-6 text-green-300 leading-tight">
            [GUIDE] Architecture microservices avec Docker et Kubernetes
          </h1>

          {/* Contenu */}
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg mb-4 leading-relaxed">
              Salut la communauté ! 👋 Après plusieurs mois de travail sur une architecture microservices,
              je partage avec vous les <span className="text-green-300 font-semibold">bonnes pratiques</span> que j'ai découvertes.
            </p>
            <p className="mb-4 leading-relaxed">
              Cette approche m'a permis de <span className="text-green-300 font-semibold">réduire le temps de déploiement de 80%</span> 
              et d'améliorer significativement la scalabilité de nos applications.
            </p>
            <div className="bg-green-600/10 border-l-4 border-green-600 pl-6 py-4 my-6 rounded-r">
              <p className="text-green-300 font-semibold mb-2">💡 Points clés :</p>
              <ul className="space-y-2 text-sm">
                <li>• Isolation des services avec Docker</li>
                <li>• Orchestration avec Kubernetes</li>
                <li>• Monitoring avec Prometheus + Grafana</li>
                <li>• CI/CD avec GitLab</li>
              </ul>
            </div>
            <p className="leading-relaxed">
              N'hésitez pas à poser vos questions, je serai ravi d'échanger sur le sujet ! 🚀
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 border-t border-green-600/30">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 border rounded transition-all duration-200 ${
                liked 
                  ? 'border-green-400 bg-green-600 text-black' 
                  : 'border-green-600 hover:bg-green-600 hover:text-black'
              }`}
            >
              <ThumbsUp size={16} />
              <span>247</span>
            </button>
            <button 
              onClick={handleDislike}
              className={`flex items-center gap-2 px-4 py-2 border rounded transition-all duration-200 ${
                disliked 
                  ? 'border-red-400 bg-red-600 text-white' 
                  : 'border-green-600 hover:bg-red-600 hover:text-white hover:border-red-600'
              }`}
            >
              <ThumbsDown size={16} />
              <span>12</span>
            </button>
            <div className="flex items-center gap-2 text-green-500 ml-4">
              <MessageCircle size={16} />
              <span>{comments.length} commentaires</span>
            </div>
          </div>
        </div>

        {/* Section commentaires */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <MessageCircle size={24} />
            Commentaires ({comments.length})
          </h2>
          
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="p-6 border border-green-600 rounded-lg bg-gradient-to-br from-green-900/5 to-black shadow-lg hover:shadow-green-500/10 transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600/20 border border-green-600 rounded flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <span className="text-green-300 font-semibold">u/{comment.author}</span>
                    <span className="text-green-500 text-sm">• il y a {comment.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-500 text-sm">
                    <ThumbsUp size={14} />
                    <span>{comment.likes}</span>
                  </div>
                </div>
                <p className="leading-relaxed">{comment.content}</p>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <button className="text-green-500 hover:text-green-300 transition-colors">
                    Répondre
                  </button>
                  <button className="text-green-500 hover:text-green-300 transition-colors">
                    Signaler
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ajout de commentaire */}
        <div className="p-6 border-2 border-green-600 rounded-lg bg-gradient-to-br from-green-900/10 to-black shadow-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Send size={20} />
            Ajouter un commentaire
          </h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 bg-black/50 border-2 border-green-600 rounded-lg text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
            rows="4"
            placeholder="Partagez votre opinion, posez une question, ou donnez votre feedback..."
          />
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-green-600">
              {comment.length}/1000 caractères
            </div>
            <button 
              onClick={handleAddComment}
              disabled={!comment.trim()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                comment.trim()
                  ? 'bg-green-600 text-black hover:bg-green-500 shadow-lg hover:shadow-green-500/20'
                  : 'bg-green-600/20 text-green-600 cursor-not-allowed'
              }`}
            >
              <Send size={16} />
              Publier
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-green-600/30 mt-16 py-8 text-center text-green-600 text-sm">
        <p>© 2024 Terminal Forum - Powered by React ⚡</p>
      </div>
    </div>
  );
}