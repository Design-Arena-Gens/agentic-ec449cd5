'use client';

import { useState } from 'react';

export default function Home() {
  const [offers, setOffers] = useState([
    { id: 1, title: 'Offre Standard', price: '99€', description: 'Gestion de base de vos réseaux sociaux' },
    { id: 2, title: 'Offre Premium', price: '199€', description: 'Gestion complète + création de contenu' },
    { id: 3, title: 'Offre Enterprise', price: '399€', description: 'Solution tout-en-un avec analytics avancés' }
  ]);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 49)]);
  };

  const handleAddOffer = () => {
    const newOffer = {
      id: offers.length + 1,
      title: `Nouvelle Offre ${offers.length + 1}`,
      price: '0€',
      description: 'Description de l\'offre'
    };
    setOffers([...offers, newOffer]);
    addLog(`Offre ajoutée: ${newOffer.title}`);
  };

  const handleUpdateOffer = (id: number, field: string, value: string) => {
    setOffers(offers.map(offer =>
      offer.id === id ? { ...offer, [field]: value } : offer
    ));
  };

  const handleDeleteOffer = (id: number) => {
    const offer = offers.find(o => o.id === id);
    setOffers(offers.filter(offer => offer.id !== id));
    addLog(`Offre supprimée: ${offer?.title}`);
  };

  const generateResponse = () => {
    let response = "Bonjour ! 👋\n\nMerci de votre message ! Voici nos offres disponibles :\n\n";
    offers.forEach((offer, index) => {
      response += `${index + 1}. ${offer.title} - ${offer.price}\n`;
      response += `   ${offer.description}\n\n`;
    });
    response += "N'hésitez pas à me dire quelle offre vous intéresse ou si vous avez des questions ! 😊";
    return response;
  };

  const handleActivate = async () => {
    if (!webhookUrl || !accessToken) {
      addLog('❌ Erreur: URL webhook et token requis');
      alert('Veuillez renseigner l\'URL du webhook et le token d\'accès');
      return;
    }

    setIsActive(!isActive);
    if (!isActive) {
      addLog('✅ Bot activé - En attente de messages Instagram');

      // Simulation d'événements pour la démo
      setTimeout(() => {
        addLog('📩 Nouveau message reçu de @utilisateur123');
        addLog('🤖 Réponse automatique envoyée');
      }, 3000);
    } else {
      addLog('⏸️ Bot désactivé');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          color: 'white',
          textAlign: 'center',
          fontSize: '2.5rem',
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🤖 Instagram Auto-Responder
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.9)',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '1.1rem'
        }}>
          Répondez automatiquement aux messages Instagram avec vos offres
        </p>

        {/* Configuration */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ marginTop: 0, color: '#333', fontSize: '1.5rem' }}>⚙️ Configuration</h2>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
              URL Webhook Instagram
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://votre-serveur.com/webhook"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
              Token d'accès Instagram
            </label>
            <input
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Votre token d'accès Instagram API"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={handleActivate}
            style={{
              width: '100%',
              padding: '15px',
              background: isActive ? '#ef4444' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isActive ? '⏸️ Désactiver le Bot' : '▶️ Activer le Bot'}
          </button>
        </div>

        {/* Gestion des offres */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#333', fontSize: '1.5rem' }}>💼 Vos Offres</h2>
            <button
              onClick={handleAddOffer}
              style={{
                padding: '10px 20px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              + Ajouter une offre
            </button>
          </div>

          {offers.map((offer) => (
            <div key={offer.id} style={{
              background: '#f9fafb',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '15px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  value={offer.title}
                  onChange={(e) => handleUpdateOffer(offer.id, 'title', e.target.value)}
                  style={{
                    width: '70%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    marginRight: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                />
                <input
                  type="text"
                  value={offer.price}
                  onChange={(e) => handleUpdateOffer(offer.id, 'price', e.target.value)}
                  style={{
                    width: 'calc(30% - 10px)',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                />
              </div>
              <textarea
                value={offer.description}
                onChange={(e) => handleUpdateOffer(offer.id, 'description', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  minHeight: '60px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
              <button
                onClick={() => handleDeleteOffer(offer.id)}
                style={{
                  marginTop: '10px',
                  padding: '6px 12px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Supprimer
              </button>
            </div>
          ))}
        </div>

        {/* Prévisualisation */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ marginTop: 0, color: '#333', fontSize: '1.5rem' }}>👁️ Prévisualisation de la réponse</h2>
          <div style={{
            background: '#f3f4f6',
            padding: '15px',
            borderRadius: '10px',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.6',
            border: '2px solid #e5e7eb'
          }}>
            {generateResponse()}
          </div>
        </div>

        {/* Logs */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ marginTop: 0, color: '#333', fontSize: '1.5rem' }}>📋 Journal d'activité</h2>
          <div style={{
            background: '#1f2937',
            padding: '15px',
            borderRadius: '10px',
            maxHeight: '300px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#10b981'
          }}>
            {logs.length === 0 ? (
              <div style={{ color: '#6b7280' }}>Aucune activité pour le moment...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} style={{ marginBottom: '5px' }}>{log}</div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '15px',
          padding: '20px',
          marginTop: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>📖 Instructions d'utilisation</h3>
          <ol style={{ color: '#555', lineHeight: '1.8' }}>
            <li>Configurez vos offres en modifiant les titres, prix et descriptions</li>
            <li>Obtenez un token d'accès Instagram via Facebook Developer Console</li>
            <li>Configurez un webhook pour recevoir les messages Instagram</li>
            <li>Activez le bot pour commencer à répondre automatiquement</li>
          </ol>
          <p style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: 0 }}>
            ⚠️ Note: Cette démo nécessite une configuration réelle de l'API Instagram pour fonctionner en production.
          </p>
        </div>
      </div>
    </div>
  );
}
