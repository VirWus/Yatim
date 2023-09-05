import axios from 'axios'
const serverAdress = JSON.parse(localStorage.getItem('Ser'))|| ""
//console.log(serverAdress)
const baseUrl = `http://${serverAdress}/api` 
export class StaffService {
  getStaffs(token) {
    return axios
      .get(`${baseUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => res.data.success.data)
  }

  getStaff(token) {
    return axios
      .get(
       `${baseUrl}/me`,
  
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(res => res.data.success)
  }

  updateStaff(id, user, token) {
    //console.log(user)
    return axios
    .put(
      `${baseUrl}/users/${id}`,
      
      {
        //params: {
          firstName: user.firstName,
          lastName: user.lastName,
          birthday: user.birthday,
          country: user.country,
          city: user.city,
          address: user.address,
          activate: user.activate,
          gender: user.gender,
          phoneNumber: user.phoneNumber,
          email: user.email,
          password: user.password || null,
          c_password: user.c_password || null,
          role: user.role
     //   }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(
      res => res.data.success.data //console.log(res) //res.data[1].articles
    )
  }

  deleteStaff(id, token) {
    //console.log(user)
    return axios
    .delete(
      `${baseUrl}/users/${id}` ,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(
      res => res.data.success.data //console.log(res) //res.data[1].articles
    )
  }
  createStaff(user, token) {
    //console.log('user : ', user)
    return axios
      .post(
       `${baseUrl}/create`,
       // null,
        {
          //params: {
            firstName: user.firstName,
            lastName: user.lastName,
            birthday: user.birthday,
            country: user.country,
            city: user.city,
            address: user.address,
            activate: user.activate,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            email: user.email,
            password: '123456',
            c_password: '123456',
            role: user.role
       //   }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(
        res => res.data.success.data //console.log(res) //res.data[1].articles
      )
  }
}
