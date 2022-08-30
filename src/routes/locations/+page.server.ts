import type { PageServerLoad, Action } from './$types';
import { PrismaClient, type Location } from '@prisma/client';
import type { Extended } from '$lib/helpers.server';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	const locations = await prisma.location.findMany({select: {id: true, name: true, color: true }}) as Extended<Location>[];
	return {
		locations,
	};
};

export const POST: Action = async ({ request }) => {
	const form = await request.formData();
	await prisma.location.create({
		data: {
			name: form.get('name') as string || "",
			color: form.get('color') as string || "",
		},
	});
};

export const PATCH: Action = async ({ request }) => {
	const form = await request.formData();
	await prisma.location.update({
		where: {
			id: form.get('id') as string,
		},
		data: {
			name: form.get('name') as string || "",
			color: form.get('color') as string || "",
		},
	});
};

export const DELETE: Action = async ({ request }) => {
	const form = await request.formData();
	await prisma.location.delete({ where: { id: form.get('id') as string } });
};
