import React, { useState, useEffect, useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
//import { Calendar } from 'primereact/calendar'
import { RadioButton } from 'primereact/radiobutton'
import { StaffService } from '../service/StaffService'
import { useRecoilValue } from 'recoil'
import { authAtom } from '../States/Atoms/auth'
import { Button } from 'primereact/button'
import { Password } from 'primereact/password'
import { Toast } from 'primereact/toast'

const Profile = () => {
  const [gender, setGender] = useState('')

  const auth = useRecoilValue(authAtom)

  let emptyStaff = {
    firstName: '',
    lastName: '',
    email: '',
    activate: 0,
    role: gender,
    birthday: null,
    country: 'Algeria',
    city: 'Bordj Bou Arreridj',
    address: 'Bordj Bou Arreridj',
    password: '',
    cpassword: '',
    gender: '',
    phoneNumber: ''
  }

  const [staff, setStaff] = useState(emptyStaff)
  const [genders] = useState([
    { name: 'Male', code: 'Mr' },
    { name: 'Female', code: 'MMe' }
  ])

  const toast = useRef(null)
  const staffService = new StaffService()
  useEffect(() => {
    auth && staffService.getStaff(auth['token']).then(data => setStaff(data))
  }, [auth])

  useEffect(() => {
    for (let i = 0; i < genders.length; i++) {
      if (genders[i].name === staff.gender) {
        !gender && setGender(genders[i])
        break
      }
    }
  }, [genders, staff, gender])

  const saveStaff = () => {
    if (staff.email.trim()) {
      if (staff.id) {
        //const index = findIndexById(staff.id)
        //console.log(staff)
        //_staffs[index] = _staff
        // _staff.gender = gender.name
        //_staff.birthday = date

        staffService.updateStaff(staff.id, staff, auth['token']).then(
          data => {} //console.log(data)
        )

        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Profile Updated',
          life: 3000
        })
      }
    }
  }

  const onCategoryChange = e => {
    let _staff = { ...staff }
    _staff['role'] = e.value
    setStaff(_staff)
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || ''
    let _staff = { ...staff }
    _staff[`${name}`] = val

    setStaff(_staff)
  }

  return (
    <div className="card">
      <Toast ref={toast} />

      <div className="field">
        <div className="formgrid grid p-fluid ">
          <div className="col-6">
            <label htmlFor="name" className="block text-900 font-medium mb-2">
              First Name
            </label>
            <InputText
              id="firstName"
              value={staff.firstName}
              onChange={e => onInputChange(e, 'firstName')}
              required
              autoFocus
            />
          </div>
          <div className="col-6">
            <label htmlFor="name" className="block text-900 font-medium mb-2">
              Last Name
            </label>
            <InputText
              id="lastName"
              value={staff.lastName}
              onChange={e => onInputChange(e, 'lastName')}
              required
            />
          </div>
        </div>
      </div>
      <div className="field">
        <div className="formgrid grid p-fluid">
          <div className="col-4">
            <label
              className="block text-900 font-medium mb-2"
              htmlFor="dropdown"
            >
              Gender
            </label>
            <Dropdown
              id="gender"
              options={genders}
              value={gender}
              onChange={e => {
                //console.log(e.value)
                setGender(e.value)
              }}
              optionLabel="name"
            />
          </div>
          <div className="col-4">
            <label htmlFor="name" className="block text-900 font-medium mb-2">
              Address
            </label>
            <InputText
              id="address"
              value={staff.address}
              onChange={e => onInputChange(e, 'address')}
              required
            />
          </div>
          {/* <div className="col-4">
          <label htmlFor="birthday"  className="block text-900 font-medium mb-2">Birthday</label>
            <Calendar
              hourFormat="24"
              id="birthday"
              dateFormat="yy-mm-dd"
              value={staff.birthday}
              onChange={e =>
                setDate(dateFormat(e.value, 'yyyy-MM-dd hh:mm:ss'))
              }
            ></Calendar>
          </div> */}
          <div className="col-4">
            <label htmlFor="name" className="block text-900 font-medium mb-2">
              Phone Number
            </label>
            <InputText
              id="phoneNumber"
              value={staff.phoneNumber}
              onChange={e => onInputChange(e, 'phoneNumber')}
              required
            />
          </div>
        </div>
      </div>

      <div className="field">
        <div className="formgrid grid p-fluid">
          <div className="col-4">
            <label htmlFor="email" className="block text-900 font-medium mb-2">
              Email
            </label>
            <InputText
              id="email"
              value={staff.email}
              onChange={e => onInputChange(e, 'email')}
              required
            />
          </div>
          <div className="col-4">
            <label
              htmlFor="password1"
              className="block text-900 font-medium mb-2"
            >
              Password
            </label>
            <Password
              id="password"
              name="password"
              placeholder="Password"
              value={staff.password}
              onChange={e => onInputChange(e, 'password')}
              toggleMask
            ></Password>
          </div>
          <div className="col-4">
            <label
              htmlFor="password1"
              className="block text-900 font-medium mb-2"
            >
              Password
            </label>
            <Password
              id="cpassword"
              name="cpassword"
              placeholder="Confirm Password"
              value={staff.cpassword}
              onChange={e => onInputChange(e, 'cpassword')}
              toggleMask
            ></Password>
          </div>
        </div>
      </div>

      <div className="field p-fluid">
        <label className="mb-3">Type</label>
        <div className="formgrid grid">
          <div className="field-radiobutton col-4">
            <RadioButton
              inputId="category1"
              name="category"
              value="admin-tech"
              onChange={onCategoryChange}
              checked={staff.role === 'admin-tech'}
            />
            <label htmlFor="category1">Admin Tech</label>
          </div>
          <div className="field-radiobutton col-4">
            <RadioButton
              inputId="category2"
              name="category"
              value="admin-metier"
              onChange={onCategoryChange}
              checked={staff.role === 'admin-metier'}
            />
            <label htmlFor="category2">Admin Metier</label>
          </div>
          <div className="field-radiobutton col-4">
            <RadioButton
              inputId="category3"
              name="category"
              value="pharmacy"
              onChange={onCategoryChange}
              checked={staff.role === 'pharmacy'}
            />
            <label htmlFor="category3">Pharmacy</label>
          </div>
        </div>
        <div className="my-0 justify-between">
          <Button
            label="Update"
            className="p-button-success mr-2"
            onClick={saveStaff}
          />
        </div>
      </div>
    </div>
  )
}

export default Profile
