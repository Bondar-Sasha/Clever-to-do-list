import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Provider} from 'react-redux'

import App from '../ui/App'
import {setupStore} from '../redux'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={setupStore()}>
      <App />
    </Provider>
  </StrictMode>
)
