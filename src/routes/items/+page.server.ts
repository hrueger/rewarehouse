import type { PageServerLoad, Action } from './$types';
import { PrismaClient } from '@prisma/client';
import { fixDates, type ExtendedArray } from '$lib/helpers.server';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	const items = await prisma.item.findMany({ include: { currentLocation: true, product: { include: { category: true } } } });
	return {
		items: fixDates(items) as ExtendedArray<typeof items>,
		categories: await prisma.category.findMany(),
	};
};

export const POST: Action = async ({ request }) => {
	const form = await request.formData();
	const price = form.get('price') as string;
	await prisma.product.create({
		data: {
			manufacturer: form.get('manufacturer') as string || "",
			name: form.get('name') as string || "",
			price: price.includes(",") ? parseFloat(price.replace(",", ".")) : parseFloat(price),
			categoryId: form.get('category') as string || "",
		}
	});
};

export const PATCH: Action = async ({ request, locals }) => {
	const form = await request.formData();
};

export const DELETE: Action = async ({ request }) => {
	const form = await request.formData();
	await prisma.product.delete({where: {id: form.get('id') as string}});
};
