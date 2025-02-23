import { toast } from 'vue-sonner'

export const errorToast = (message: string) => {
    toast.error(
        message,
        {
            style: {
                background: '#121212',
            }
        }
    )
}

export const successToast = (message: string) => {
    toast.success(
        message,
        {
            style: {
                background: '#121212',
            }
        }
    )
}