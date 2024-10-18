
import fetcher from '@/libs/fetcher'
import useSwr from 'swr'

const useUsers = () => {
    const { data, isLoading, mutate } = useSwr('/api/users', fetcher)

    return {
        data,
        isLoading,
        mutate
    }
}

export default useUsers;