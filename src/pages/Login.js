import React, { useState, useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useFormik } from 'formik'
import { useUserActions } from '../Actions/users.actions'
import Logo from '../assets/logo.jpg'
import { BlockUI } from 'primereact/blockui'

import { Password } from 'primereact/password'

const Login = props => {
  const [checked, setChecked] = useState(false)
  const userActions = useUserActions()
  const [showMessage, setShowMessage] = useState(false)
  //const [formData, setFormData] = useState({})
  const toast = useRef(null)
  // const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      id: 1,
      username: '',
      password: '',
      type: ''
    },
    validate: data => {
      let errors = {}

      if (!data.username) {
        errors.name = 'Name is required.'
      }

      if (!data.password) {
        errors.password = 'Password is required.'
      }

      return errors
    },
    onSubmit: data => {
      // setFormData(data)
      //setShowMessage(true)

      setLoading(true)
   userActions.login(data).then(data => {
        //setShowMessage(data)
        setLoading(false)
        console.log(data)
        formik.resetForm()
      })
      // console.log(toast)

      //console.log(showMessage)    
    }

  })

  return (
    <div className="grid align-items-center justify-content-center">
      <Toast ref={toast} />
      {showMessage &&
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Login',
          life: 3000
        })}
      <BlockUI
        blocked={loading}
        template={<span className="z-10 loader"></span>}
        fullScreen
      />

      <div className="flex flex-column align-items-center justify-content-center">
        <div
          style={{
            borderRadius: '56px',
            padding: '0.3rem',
            background:
              'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
          }}
        >
          <div
            className="w-full surface-card py-8 px-5 sm:px-8"
            style={{ borderRadius: '53px' }}
          >
            <div className="text-center mb-5">
              <img
                src={Logo}
                width="250"
                style={{ position: 'relative' }}
                alt="login"
              />
              <div className="text-900 text-3xl font-medium mb-3">Welcome</div>
            </div>

            <div>
              <form onSubmit={formik.handleSubmit}>
                <label
                  htmlFor="email1"
                  className="block text-900 text-xl font-medium mb-2"
                >
                  Email
                </label>
                <InputText
                  id="username"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  autoFocus
                  placeholder="Email address"
                  className="w-full md:w-30rem mb-5"
                  style={{ padding: '1rem' }}
                />

                <label
                  htmlFor="password1"
                  className="block text-900 font-medium text-xl mb-2"
                >
                  Password
                </label>
                <Password
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  toggleMask
                  className="w-full mb-5"
                  inputClassName="w-full p-3 md:w-30rem"
                ></Password>

                <div className="flex align-items-center justify-content-between mb-5 gap-5">
                  <div className="flex align-items-center">
                    <Checkbox
                      id="rememberme"
                      onChange={e => setChecked(e.checked)}
                      checked={checked}
                      className="mr-2"
                    ></Checkbox>
                    <label htmlFor="rememberme1">Remember me</label>
                  </div>
                  <div
                    className="font-medium no-underline ml-2 text-right cursor-pointer"
                    style={{ color: 'var(--primary-color)' }}
                  >
                    Forgot password?
                  </div>
                </div>
                <Button
                  type="submit"
                  label="Sign In"
                  icon="pi pi-user"
                  className="w-full"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div onClick={()=>{ window.close()}} className="exit b-0 r-0" href="#">

          <span className="left">
            <span className="circle-left"></span>
            <span className="circle-right"></span>
          </span>
          <span className="right">
            <span className="circle-left"></span>
            <span className="circle-right"></span>
          </span> 
        </div>
      </div>   
     
    </div>
    // <div className="grid align-items-center justify-content-center">
    // <Toast ref={toast}/>
    //   <div className="grid col-12 justify-content-center">

    //     <img
    //       src={loginImg}
    //       width="300"
    //       style={{ position: 'relative' }}
    //       alt="login"
    //     />
    //   </div>
    //   <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
    //     <div className="text-center mb-5">
    //       <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
    //     </div>

    //     <div>
    //       <form onSubmit={formik.handleSubmit}>
    //         <label
    //           htmlFor="username"
    //           className="block text-900 font-medium mb-2"
    //         >
    //           username
    //         </label>
    //         <InputText
    //           id="username"
    //           name="username"
    //           value={formik.values.username}
    //           onChange={formik.handleChange}
    //           autoFocus
    //           className="w-full mb-3"
    //         />
    //         <label
    //           htmlFor="password"
    //           className="block text-900 font-medium mb-2"
    //         >
    //           Password
    //         </label>
    //         <InputText
    //           id="password"
    //           name="password"
    //           value={formik.values.password}
    //           onChange={formik.handleChange}
    //           toggleMask
    //           className="w-full mb-3"
    //         />
    //         <div className="flex align-items-center justify-content-between mb-6">
    //           <div className="flex align-items-center">
    //             <Checkbox
    //               id="rememberme"
    //               onChange={e => setChecked(e.checked)}
    //               checked={checked}
    //               className="mr-2"
    //             />
    //             <label htmlFor="rememberme">Remember me</label>
    //           </div>
    //         </div>
    //         {/* <InputText
    //           id="type"
    //           name="type"
    //           value={formik.values.type}
    //           onChange={formik.handleChange}
    //           toggleMask
    //           className="w-full mb-3"
    //         /> */}
    //         {/* [{"id":1,"username":"user","password":"password"}] */}

    //         <Button
    //           type="submit"
    //           label="Sign In"
    //           icon="pi pi-user"
    //           className="w-full"
    //         />
    //       </form>
    //     </div>
    //   </div>
    // </div>
  )
}

export default React.memo(Login)
