import type { PageServerLoad, Action } from './$types';
import { PrismaClient, type Category } from '@prisma/client';
import type { Extended } from '$lib/helpers.server';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	const categories = await prisma.category.findMany() as Extended<Category>[];
	return {
		categories,
	};
};

export const POST: Action = async ({ request }) => {
	const form = await request.formData();
	await prisma.category.create({
		data: {
			name: form.get('name') as string || "",
		},
	});
};

export const PATCH: Action = async ({ request }) => {
	const form = await request.formData();
	await prisma.category.update({
		where: {
			id: form.get('id') as string,
		},
		data: {
			name: form.get('name') as string || "",
		},
	});
};

export const DELETE: Action = async ({ request }) => {
	const form = await request.formData();
	await prisma.category.delete({ where: { id: form.get('id') as string } });
};
