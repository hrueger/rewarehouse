import type { PageServerLoad, Action } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	//
};

export const POST: Action = async ({ request }) => {
	//
};

export const PATCH: Action = async ({ request, locals }) => {
	//
};

export const DELETE: Action = async ({ request }) => {
	//
};
