import { UserAgentApplication, AuthenticationParameters, AuthResponse, Account } from "msal"

const MSALObj = new UserAgentApplication({
    auth: {
        clientId: "20d2bd98-52b3-4b1d-94f8-375d27d3413c",
        authority: "https://login.microsoftonline.com/f19f14f9-42ce-4812-8f6e-0f5c443a06ef",
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
    }
})

const req: AuthenticationParameters = {
    scopes: ["user.read"]
}

MSALObj.handleRedirectCallback((err, res) => {
    if (err || !res) {
        console.error(err)
    } else {
        if (res.tokenType === "access_token") {
            // We have token here
        } else console.log(`Recieved token of type: ${res.tokenType}`)
    }
})

/**
 * Prompt user to sign in using popup
 * @returns Promise to user account.
 * @throws All kinds of errors if login is not successfull
 */
export async function signInPopup() {
    return MSALObj.loginPopup(req)
}

/**
 * Prompt user to sign in using redirects
 */
export function signInRedirect() {
    MSALObj.loginRedirect(req)
}

/**
 * Sign out user
 */
export function signOut() {
    MSALObj.logout()
}

/**
 * Try to get an account info. If not present null is returned
 * @returns account info or null
 */
export function account(): Account | null {
    return MSALObj.getAccount()
}

/**
 * Make a http get request to a MS Graph api. Authed with token
 * @param url MS Graph endpoint url
 * @param token Access token to be used
 * @returns promise to a user info
 * @throws in case of unreachable endpoint
 */
export async function callMSGraph(url: string, token: string) {
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return res.json()
}

/**
 * `whoami` in a world of MS Graph
 * @param token user access token
 * @returns user info from MS Graph
 * @throws in case of unreachable endpoint
 */
export function getUserInfo(token: string) {
    return callMSGraph("https://graph.microsoft.com/v1.0/me", token)
}

/**
 * Try to get token in the background. Without prompting user to sign in
 * @return promise to a user account object. Or rejects if token cannot be aquired silently 
 *         (or for whatever reason MS thinks it should fail)
 */
export function aquireSilent() {
    return MSALObj.acquireTokenSilent(req)
}

/**
 * Try to get token with user consent
 * @return promise to a user account object. Or rejects if token cannot be aquired silently 
 *         (or for whatever reason MS thinks it should fail) 
 */
export function acqiurePopup() {
    return MSALObj.acquireTokenPopup(req)
}

/**
 * Combination of trying to get token silently and with popup if needed
 * @return promise to a token response. Or rejects if can't be aquired
 */
export async function getToken() {
    let token: AuthResponse
    try {
        token = await MSALObj.acquireTokenSilent(req)
    } catch (e) {
        console.warn(e)
        if (e.name === "InteractionRequiredAuthError") {
            token = await MSALObj.acquireTokenPopup(req)
        } else throw e
    }
    return token
}

/**
 * Dude. I don't wanna to deal with all of this auth stuff. Just give me current user
 * @return user info if sucessfull
 * @throws Oh boi it throws a lot of things at ya.
 */
export async function justGetUser4head(): Promise<any> {
    if (MSALObj.getAccount()) {
        let token = await getToken()
        return getUserInfo(token.accessToken)
    } else {
        await signInPopup()
        return justGetUser4head() // I feel the recursion depth increasing
    }
}