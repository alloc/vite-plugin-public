import { publicHash } from 'vite-plugin-public'
import reactPlugin from '@vitejs/plugin-react-refresh'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [reactPlugin(), publicHash()],
  build: {
    base: '/test/',
  }
}

export default config
