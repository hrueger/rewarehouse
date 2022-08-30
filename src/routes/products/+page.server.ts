import type { PageServerLoad, Action } from './$types';
import { PrismaClient } from '@prisma/client';
import { fixDates, type ExtendedArray } from '$lib/helpers.server';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	const products = await prisma.product.findMany({ include: { category: { select: { name: true } }, _count: { select: { items: true } } } });

	return {
		products: fixDates(products) as ExtendedArray<typeof products>,
		manufacturers: products.map((p) => p.manufacturer).filter((v, i, a) => a.indexOf(v) === i),
		categories: await prisma.category.findMany(),
	};
};

export const POST: Action = async ({ request }) => {
	const form = await request.formData();
	const price = form.get('price') as string;
	const { id } = await prisma.product.create({
		data: {
			manufacturer: form.get('manufacturer') as string || "",
			name: form.get('name') as string || "",
			price: price.includes(",") ? parseFloat(price.replace(",", ".")) : parseFloat(price),
			categoryId: form.get('category') as string || "",
		},
	});
	await prisma.item.create({
		data: {
			purchaseDate: new Date(),
			productId: id,
			currentLocationId: (await prisma.location.findFirst({select: {id: true}, where: {default: true}}))?.id as any as string,
		},
	});
};

export const PATCH: Action = async ({ request, locals }) => {
	const form = await request.formData();
};

export const DELETE: Action = async ({ request }) => {
	const form = await request.formData();
	await prisma.product.delete({where: {id: form.get('id') as string}});
};
