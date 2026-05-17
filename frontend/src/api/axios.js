import axios from 'axios'

const api = axios.create({
  baseURL: 'https://padhai-production.up.railway.app/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api


cd C:\Users\arushi\OneDrive\Desktop\My_Startup
git add .
git commit -m "feat: update API URL to Railway"
git push