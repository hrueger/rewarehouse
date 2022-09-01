import { toast } from '@zerodevx/svelte-toast'

export const success = (m: string) => toast.push(m, {
    theme: {
        '--toastBackground': '#48BB78',
    '--toastBarBackground': '#2F855A'
    }
});
export const error = (m: string) => toast.push(m, {
    theme: {
        '--toastBackground': '#F56565',
        '--toastBarBackground': '#C53030'
    }
});