import { NextRequest, NextResponse } from 'next/server';

// Configuration des offres (peut être stocké en base de données)
const getOffers = () => [
  { id: 1, title: 'Offre Standard', price: '99€', description: 'Gestion de base de vos réseaux sociaux' },
  { id: 2, title: 'Offre Premium', price: '199€', description: 'Gestion complète + création de contenu' },
  { id: 3, title: 'Offre Enterprise', price: '399€', description: 'Solution tout-en-un avec analytics avancés' }
];

// Génère la réponse automatique
const generateAutoResponse = () => {
  const offers = getOffers();
  let response = "Bonjour ! 👋\n\nMerci de votre message ! Voici nos offres disponibles :\n\n";

  offers.forEach((offer, index) => {
    response += `${index + 1}. ${offer.title} - ${offer.price}\n`;
    response += `   ${offer.description}\n\n`;
  });

  response += "N'hésitez pas à me dire quelle offre vous intéresse ou si vous avez des questions ! 😊";
  return response;
};

// Envoie un message via l'API Instagram
async function sendInstagramMessage(recipientId: string, message: string, accessToken: string) {
  const url = `https://graph.instagram.com/v18.0/me/messages`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message },
        access_token: accessToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending Instagram message:', error);
    throw error;
  }
}

// Endpoint pour la vérification du webhook Instagram
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN || 'your_verify_token_here';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    return new NextResponse(challenge, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
  }
}

// Endpoint pour recevoir les messages Instagram
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Webhook received:', JSON.stringify(body, null, 2));

    // Vérifie que c'est bien un événement de message
    if (body.object === 'instagram') {
      const entry = body.entry?.[0];
      const messaging = entry?.messaging?.[0];

      if (messaging?.message) {
        const senderId = messaging.sender.id;
        const messageText = messaging.message.text;

        console.log(`Message reçu de ${senderId}: ${messageText}`);

        // Génère et envoie la réponse automatique
        const autoResponse = generateAutoResponse();
        const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

        if (!accessToken) {
          console.error('Instagram access token not configured');
          return NextResponse.json({ error: 'Access token not configured' }, { status: 500 });
        }

        await sendInstagramMessage(senderId, autoResponse, accessToken);
        console.log(`Réponse automatique envoyée à ${senderId}`);

        return NextResponse.json({ status: 'Message sent' }, { status: 200 });
      }
    }

    return NextResponse.json({ status: 'Event received' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
