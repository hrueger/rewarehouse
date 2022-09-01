import { error } from "./toasts";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

export async function request(method: Method, url: string, data?: Record<string, any>): Promise<void> {
    const options = {
        method: "POST",
        headers: {
            "Accept": "application/json",
        },
    } as any;
    if (data) {
        options.body = toFormData(data);
    }
    await fetch(`${url}?_method=${method}`, options).then(async (res) => {
        if (res.ok) {
            return;
        } else {
            throw new Error((await res.json()).message);
        }
    }).catch((m) => {
        error(m.toString());
    });
}

export function toFormData(obj: Record<string, any>) {
    const formData = new FormData();
    for (const [k, v] of Object.entries(obj)) {
        formData.append(k, v);
    }
    return formData;
}