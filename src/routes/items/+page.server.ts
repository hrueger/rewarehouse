import type { PageServerLoad, Action } from './$types';
import { PrismaClient } from '@prisma/client';
import { fixDates, type ExtendedArray } from '$lib/helpers.server';
import { error } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	const items = await prisma.item.findMany({
		include: {
			currentLocation: true,
			product: { include: { category: true } },
			label: true,
		},
		orderBy: [
			{ product: { category: { name: "asc" } } },
			{ product: { manufacturer: "asc" } },
			{ product: { name: "asc" } },
			{ product: { length: "asc" } },
		],
	});
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

export const PATCH: Action = async ({ request }) => {
	const form = await request.formData();
	const code = parseInt(form.get('code') as string || "");
	const itemId = form.get('id') as string || "";
	try {
		await prisma.label.create({
			data: {
				code: code,
				itemId: itemId,
			}
		});
	} catch {
		console.log("Error")
		throw error(409, "Label already exists or Item already has a label");
	}
};

export const DELETE: Action = async ({ request }) => {
	const form = await request.formData();
	await prisma.product.delete({where: {id: form.get('id') as string}});
};
