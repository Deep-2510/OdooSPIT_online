import { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_MODAL':
      return { ...state, modal: action.payload }
    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.payload }
    default:
      return state
  }
}

const initialState = {
  loading: false,
  modal: null,
  sidebarOpen: true,
  currentWarehouse: null
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const openModal = (modal) => {
    dispatch({ type: 'SET_MODAL', payload: modal })
  }

  const closeModal = () => {
    dispatch({ type: 'SET_MODAL', payload: null })
  }

  const setSidebarOpen = (open) => {
    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: open })
  }

  const value = {
    ...state,
    setLoading,
    openModal,
    closeModal,
    setSidebarOpen
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}