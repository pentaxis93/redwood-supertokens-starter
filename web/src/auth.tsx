import SuperTokens, { SuperTokensWrapper } from 'supertokens-auth-react'
import Session from 'supertokens-auth-react/recipe/session'
import ThirdPartyPasswordless, {
  Github,
  Google,
} from 'supertokens-auth-react/recipe/thirdpartypasswordless'

import { createAuth } from '@redwoodjs/auth-supertokens-web'
import { isBrowser } from '@redwoodjs/prerender/browserUtils'

const websiteDomain =
  process.env.SUPERTOKENS_WEBSITE_DOMAIN || 'http://localhost:8910'
const apiDomain = process.env.SUPERTOKENS_API_DOMAIN || websiteDomain
const apiGatewayPath =
  process.env.SUPERTOKENS_API_GATEWAY_PATH || '/.redwood/functions'

const superTokensClient = {
  sessionRecipe: Session,
  redirectToAuth: SuperTokens.redirectToAuth,
}

isBrowser &&
  SuperTokens.init({
    appInfo: {
      appName: 'botcadabra',
      apiDomain,
      websiteDomain,
      apiGatewayPath,
      websiteBasePath: '/auth',
      apiBasePath: '/auth',
    },
    recipeList: [
      Session.init(),
      ThirdPartyPasswordless.init({
        contactMethod: "EMAIL",
        signInUpFeature: {
          providers: [
            Github.init(),
            Google.init(),
          ]
        },
        style: `
          [data-supertokens~=container] {
            --palette-background: 51, 51, 51;
            --palette-inputBackground: 41, 41, 41;
            --palette-inputBorder: 41, 41, 41;
            --palette-textTitle: 255, 255, 255;
            --palette-textLabel: 255, 255, 255;
            --palette-textPrimary: 255, 255, 255;
            --palette-error: 173, 46, 46;
            --palette-textInput: 169, 169, 169;
            --palette-textLink: 169, 169, 169;
          }
        `
      }),
    ],
  })

const { AuthProvider: SuperTokensAuthProvider, useAuth } =
  createAuth(superTokensClient)

interface Props {
  children: React.ReactNode
}

const AuthProvider = ({ children }: Props) => {
  return (
    <SuperTokensWrapper>
      <SuperTokensAuthProvider>{children}</SuperTokensAuthProvider>
    </SuperTokensWrapper>
  )
}

export { AuthProvider, useAuth }
