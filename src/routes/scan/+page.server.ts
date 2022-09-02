import type { PageServerLoad, Action } from './$types';
import { PrismaClient } from '@prisma/client';
import { fixDates } from '$lib/helpers.server';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	const locations = await prisma.location.findMany();
	return {
		locations: fixDates(locations),
	};
};

export const POST: Action = async ({ request }) => {
	const form = await request.formData();
	//
};

export const PATCH: Action = async ({ request }) => {
	const form = await request.formData();
	const label = parseInt(form.get('label') as string);
	const locationId = form.get('locationId') as string;
	const status = form.get('status') as "AVAILABLE" | "USED";
	await prisma.label.update({
		where: {
			code: label,
		},
		data: {
			item: {
				update: {
					currentLocationId: locationId,
					status: status,
				}
			}
		},
	});
};

export const DELETE: Action = async ({ request }) => {
	const form = await request.formData();
	//
};
