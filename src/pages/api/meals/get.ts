import type { APIRoute } from 'astro';
import { db, Room, Meal, eq } from 'astro:db';

export const GET: APIRoute = async ({ url }) => {
  const roomName = url.searchParams.get('roomName');

  if (!roomName) {
    return new Response('Nom de room requis', { status: 400 });
  }

  try {
    // Trouver la room
    const room = await db.select().from(Room).where(eq(Room.name, roomName)).get();

    if (!room) {
      return new Response('Room non trouvée', { status: 404 });
    }

    // Récupérer tous les meals de la room
    const meals = await db.select().from(Meal).where(eq(Meal.roomId, room.id));

    // Construire un objet avec les données par jour
    const mealsData: Record<string, { midi: string; soir: string }> = {};

    meals.forEach(meal => {
      const content = JSON.parse(meal.content || '{"midi": "", "soir": ""}');
      mealsData[meal.day] = content;
    });

    // S'assurer que tous les jours existent
    const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    days.forEach(day => {
      if (!mealsData[day]) {
        mealsData[day] = { midi: '', soir: '' };
      }
    });

    return new Response(JSON.stringify(mealsData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    return new Response('Erreur serveur', { status: 500 });
  }
};