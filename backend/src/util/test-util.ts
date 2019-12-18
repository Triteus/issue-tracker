
export function authHeaderObject(token: string) {
    return {
        Authorization: 'Bearer ' + token
    }
}