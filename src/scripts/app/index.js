import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router-dom'
import store, { history } from './store'
import Main from './main'
import onSpotifyReady from './spotify'


window.onSpotifyWebPlaybackSDKReady = onSpotifyReady


class Root extends React.PureComponent {
  render() {
    return (
      <Provider store={store}>
        <React.Fragment>
          <ConnectedRouter history={history}>
            <React.Fragment>
              <Route exact path="/" component={Main} />
            </React.Fragment>
          </ConnectedRouter>
        </React.Fragment>
      </Provider>
    )
  }
}

ReactDOM.render(
  <Root />,
  document.getElementById('app'),
)
