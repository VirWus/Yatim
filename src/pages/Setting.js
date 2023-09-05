import React, { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
//import { Calendar } from 'primereact/calendar'
import { RadioButton } from 'primereact/radiobutton'
import { StaffService } from '../service/StaffService'
import { useRecoilValue } from 'recoil'
import { authAtom } from '../States/Atoms/auth'
import { Button } from 'primereact/button'
import { Password } from 'primereact/password'

const Setting = () => {
  const auth = useRecoilValue(authAtom)
  const [adress, setAdress] = useState('')

  const onInputChange = e => {
    const val = (e.target && e.target.value) || ''

    setAdress(val)
    console.log(adress)
  }

  const saveAdress = e => {
    if (auth['token']) {
      setAdress(e)
      localStorage.setItem('Ser', JSON.stringify(adress))
      console.log(adress)
    }
  }

  return (
    <div className="card">
      <div className="field">
        <div className="formgrid grid p-fluid ">
          <div className="col-12">
            <label htmlFor="name" className="block text-900 font-medium mb-2">
              Adresse Server
            </label>
            <InputText
              id="firstName"
              value={adress}
              onChange={e => onInputChange(e)}
              required
              autoFocus
            />
          </div>
        </div>
      </div>
      <div className="my-0 justify-between">
        <Button
          label="Update"
          className="p-button-success mr-2"
          onClick={() => saveAdress(adress)}
        />
      </div>
    </div>
  )
}

export default Setting
