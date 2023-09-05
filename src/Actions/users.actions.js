import { useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil'

import { history } from '../Helpers/history'
import { useFetchWrapper } from '../Helpers/fetch-wrapper'
import { authAtom } from '../States/Atoms/auth'
import { usersAtom, userAtom } from '../States/Atoms/users'

export { useUserActions }

function useUserActions() {
  const serverAdress = JSON.parse(localStorage.getItem('Ser'))
  //console.log(serverAdress)
  const baseUrl = `http://${serverAdress}/api` 
  //console.log(baseUrl)
  const fetchWrapper = useFetchWrapper()
  const [auth, setAuth] = useRecoilState(authAtom)
  const setUsers = useSetRecoilState(usersAtom)
  const setUser = useSetRecoilState(userAtom)

  return {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete,
    resetUsers: useResetRecoilState(usersAtom),
    resetUser: useResetRecoilState(userAtom)
  }

  function login({ username, password }) {
    localStorage.setItem('user', JSON.stringify({ username, password , "type": "admin" }));
    //console.log({ username, password })

    setAuth({username,password});
    const { from } = history.location.state || { from: { pathname: '/' } }
    history.push(from)
    //console.log("fdsfds")
    // return fetchWrapper
    //   .post(`${baseUrl}/login`, { username, password })
    //   .then(user => {
    //     // store user details and jwt token in local storage to keep user logged in between page refreshes
    //     //user.push({"type": "admin" })
    //     // user.push({"type": "pharm" })
    //     localStorage.setItem('user', JSON.stringify(user))
    //     setAuth(user)
    //     //console.log(user)
    //     // get return url from location state or default to home page
    //     const { from } = history.location.state || { from: { pathname: '/' } }
    //     history.push(from)
    //
    //   })
     
  }

  function logout() {
    // remove user from local storage, set auth state to null and redirect to login page
    localStorage.removeItem('user')
    //console.log("logout")
    setAuth(null)
    history.push('/login')
  }

  function register(user) {
    return fetchWrapper.post(`${baseUrl}/register`, user)
  }

  function getAll() {
    return fetchWrapper.get(baseUrl).then(setUsers)
  }

  function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`).then(setUser)
  }

  function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params).then(x => {
      // update stored user if the logged in user updated their own record
      if (id === auth?.id) {
        // update local storage
        const user = { ...auth, ...params }
        localStorage.setItem('user', JSON.stringify(user))

        // update auth user in recoil state
        setAuth(user)
      }
      return x
    })
  }

  // prefixed with underscored because delete is a reserved word in javascript
  function _delete(id) {
    setUsers(users =>
      users.map(x => {
        // add isDeleting prop to user being deleted
        if (x.id === id) return { ...x, isDeleting: true }

        return x
      })
    )

    return fetchWrapper.delete(`${baseUrl}/${id}`).then(() => {
      // remove user from list after deleting
      setUsers(users => users.filter(x => x.id !== id))

      // auto logout if the logged in user deleted their own record
      if (id === auth?.id) {
        logout()
      }
    })
  }
}
