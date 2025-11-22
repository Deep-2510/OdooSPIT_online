import { useState, useEffect } from 'react'
import { api } from '../services/utils'

export const useQuery = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get(url, options)
        setData(response.data)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, JSON.stringify(options)])

  return { data, loading, error, refetch: () => {} }
}

export const useMutation = (mutationFn, options = {}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = async (data) => {
    try {
      setLoading(true)
      setError(null)
      const result = await mutationFn(data)
      if (options.onSuccess) {
        options.onSuccess(result.data)
      }
      return result
    } catch (err) {
      setError(err.response?.data?.error || 'Mutation failed')
      if (options.onError) {
        options.onError(err)
      }
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error }
}