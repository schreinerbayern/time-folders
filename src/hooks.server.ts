import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');

	if (session) {
		// You can fetch user data from a database here
		// For now, we'll just use the session value as the user
		event.locals.user = { name: session };
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};