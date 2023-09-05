import React, { useState, useEffect, useRef, useNavigate } from 'react'
import classNames from 'classnames'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
//import { FileUpload } from 'primereact/fileupload'
//import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar'
import { RadioButton } from 'primereact/radiobutton'
//import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { StaffService } from '../service/StaffService'
import { Dropdown } from 'primereact/dropdown'
import { FilterMatchMode } from 'primereact/api'

import { useRecoilValue } from 'recoil'
import { authAtom } from '../States/Atoms/auth'
import  jwt_decode from 'jwt-decode';

const CrudStaffs = () => {
 // const navigate = useNavigate();
      //console.log(date)
  const auth = useRecoilValue(authAtom)

  const [gender, setGender] = useState('')
  //a simple date formatting function
  function dateFormat(inputDate, format) {
    //parse the input date
    const date = new Date(inputDate)

    //extract the parts of the date
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    //replace the month
    format = format.replace('MM', month.toString().padStart(2, '0'))

    //replace the year
    if (format.indexOf('yyyy') > -1) {
      format = format.replace('yyyy', year.toString())
    } else if (format.indexOf('yy') > -1) {
      format = format.replace('yy', year.toString().substr(2, 2))
    }

    //replace the day
    format = format.replace('dd', day.toString().padStart(2, '0'))

    //replace the day
    format = format.replace('hh', hours.toString().padStart(2, '0'))

    //replace the day
    format = format.replace('mm', minutes.toString().padStart(2, '0'))

    //replace the day
    format = format.replace('ss', seconds.toString().padStart(2, '0'))

    return format
  }
  const [date, setDate] = useState(dateFormat(Date(), 'yyyy-MM-dd hh:mm:ss'))



  let emptyStaff = {
    firstName: '',
    lastName: '',
    email: '',
    activate: 0,
    role: gender,
    birthday: date,
    country: 'Algeria',
    city: 'Bordj Bou Arreridj',
    address: 'Bordj Bou Arreridj',
    gender: '',
    phoneNumber: ''
  }

  const [staffs, setStaffs] = useState(null)
  const [StaffDialog, setStaffDialog] = useState(false)
  const [deleteStaffDialog, setDeleteStaffDialog] = useState(false)
  const [deleteStaffsDialog, setDeleteStaffsDialog] = useState(false)
  const [staff, setStaff] = useState(emptyStaff)
  const [selectedStaffs, setSelectedStaffs] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')
  const toast = useRef(null)
  const dt = useRef(null)

  const [genders] = useState([
    { name: 'Male', code: 'Mr' },
    { name: 'Female', code: 'MMe' }
  ])

  const staffService = new StaffService()

  useEffect(() => {
    const staffService = new StaffService()
    auth && staffService.getStaffs(auth['token']).then(data => setStaffs(data))
    //console.log(staffs)
  }, [auth, StaffDialog])

  useEffect(() => {
    for (let i = 0; i < genders.length; i++) {
      if (genders[i].name === staff.gender) {
        !gender && setGender(genders[i])
        break
      }
    }
  }, [genders, staff, gender])

  const openNew = () => {
    setStaff(emptyStaff)
    setGender([])
    setSubmitted(false)
    setStaffDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setStaffDialog(false)
  }

  const hideDeleteStaffDialog = () => {
    setDeleteStaffDialog(false)
  }

  const hideDeleteStaffsDialog = () => {
    setDeleteStaffsDialog(false)
  }

  const saveStaff = () => {
    setSubmitted(true)

    if (staff.email.trim()) {
      let _staffs = [...staffs]
      let _staff = { ...staff }
      if (staff.id) {
        const index = findIndexById(staff.id)
        //console.log(staff)
        _staffs[index] = _staff
        _staff.gender = gender.name
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
      } else {
        // _staff.id = createId()
        _staff.gender = gender.name
        _staff.birthday = date
        _staffs.push(_staff)
        staffService.createStaff(_staff, auth['token']).then(
          data => {} //console.log(data)
        )
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Profile Created',
          life: 3000
        })
      }

      setStaffs(_staffs)
      setStaffDialog(false)
      setStaff(emptyStaff)
    }
  }

  const editStaff = staff => {
    //console.log(staff)
    setDate(staff.birthday)
    setStaff({ ...staff })
    setStaffDialog(true)
  }

  const confirmDeleteStaff = staff => {
    setStaff(staff)
    setDeleteStaffDialog(true)
  }

  const deleteStaff = () => {
    let _staffs = staffs.filter(val => val.id !== staff.id)
    staffService.deleteStaff(staff.id, auth['token']).then(
      data => {} //console.log(data)
    )
    setStaffs(_staffs)
    setDeleteStaffDialog(false)
    setStaff(emptyStaff)
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Product Deleted',
      life: 3000
    })
  }

  const findIndexById = id => {
    let index = -1
    for (let i = 0; i < staffs.length; i++) {
      if (staffs[i].id === id) {
        index = i
        break
      }
    }

    return index
  }

  // const exportCSV = () => {
  //   dt.current.exportCSV()
  // }

  const confirmDeleteSelected = () => {
    setDeleteStaffsDialog(true)
  }

  const deleteSelectedStaffs = () => {
    let _staffs = staffs.filter(val => !selectedStaffs.includes(val))
    setStaffs(_staffs)
    setDeleteStaffsDialog(false)
    setSelectedStaffs(null)
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Products Deleted',
      life: 3000
    })
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

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-0">
          <Button
            label="New"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={openNew}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={confirmDeleteSelected}
            disabled={!selectedStaffs || !selectedStaffs.length}
          />
        </div>
      </React.Fragment>
    )
  }

  // const rightToolbarTemplate = () => {
  //   return (
  //     <React.Fragment>
  //       <FileUpload
  //         mode="basic"
  //         accept="image/*"
  //         maxFileSize={1000000}
  //         label="Import"
  //         chooseLabel="Import"
  //         className="mr-2 inline-block"
  //       />
  //       <Button
  //         label="Export"
  //         icon="pi pi-upload"
  //         className="p-button-help"
  //         onClick={exportCSV}
  //       />
  //     </React.Fragment>
  //   )
  // }

  const codeBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Code</span>
        {rowData.id}
      </>
    )
  }

  const firstNameBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">firstName</span>
        {rowData.firstName}
      </>
    )
  }
  const lastNameBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">lastName</span>
        {rowData.lastName}
      </>
    )
  }

  const emailBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Email</span>
        {rowData.email}
      </>
    )
  }

  const categoryBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Type</span>
        {rowData.role}
      </>
    )
  }

  const statusBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Status</span>
        <span
        //  className={`product-badge status-${rowData.gender.toLowerCase()}`}
        >
          {rowData.gender}
        </span>
      </>
    )
  }

  const phoneBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Phone</span>
        {rowData.phoneNumber}
      </>
    )
  }

  const actionBodyTemplate = rowData => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editStaff(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mt-2"
          onClick={() => confirmDeleteStaff(rowData)}
        />
      </div>
    )
  }

  const [filters2, setFilters2] = useState({
    global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    id: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'name.firstName': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'name.lastName': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    type: { value: null, matchMode: FilterMatchMode.CONTAINS },
    gender: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phone: { value: null, matchMode: FilterMatchMode.CONTAINS }
  })

  const onGlobalFilterChange = e => {
    const value = e.target.value
    console.log(value)
    let _filters2 = { ...filters2 }
    _filters2['global'].value = value
    console.log(_filters2)
    setFilters2(_filters2)
    setGlobalFilter(value)
  }
  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Staffs</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          autoFocus
          type="search"
          value={globalFilter}
          onChange={e => onGlobalFilterChange(e)}
          placeholder="Keyword Search"
        />
      </span>
    </div>
  )

  const staffDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveStaff}
      />
    </>
  )
  const deleteStaffDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteStaffDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteStaff}
      />
    </>
  )
  const deleteStaffsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteStaffsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedStaffs}
      />
    </>
  )
 
  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar
            className="mb-2"
            left={leftToolbarTemplate}
            // right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}
            value={staffs}
            selection={selectedStaffs}
            onSelectionChange={e => setSelectedStaffs(e.value)}
            dataKey="id"
            paginator
            rows={10}
            filters={filters2}
            globalFilterFields={[
              'id',
              'firstName',
              'lastName',
              'email',
              'type',
              'phoneNumber',
              'gender'
            ]}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} staffs"
            //globalFilter={globalFilter}
            emptyMessage="No staffs found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: '2rem' }}
            ></Column>
            <Column
              field="id"
              header="Code"
              sortable
              body={codeBodyTemplate}
            ></Column>
            <Column
              field="firstName"
              header="firstName"
              sortable
              body={firstNameBodyTemplate}
            ></Column>
            <Column
              field="lastName"
              header="lastName"
              sortable
              body={lastNameBodyTemplate}
            ></Column>
            <Column
              field="email"
              header="Email"
              body={emailBodyTemplate}
            ></Column>
            <Column
              field="type"
              header="Type"
              sortable
              body={categoryBodyTemplate}
            ></Column>
            <Column
              header="Phone Number"
              field="phoneNumber"
              body={phoneBodyTemplate}
            ></Column>
            <Column
              header="Gender"
              field="gender"
              body={statusBodyTemplate}
              sortable
            ></Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Dialog
            visible={StaffDialog}
            style={{ width: '850px' }}
            header="Staff Details"
            modal
            className="p-fluid"
            footer={staffDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <div className="formgrid grid">
                <div className="col-6">
                  <label htmlFor="name">First Name</label>
                  <InputText
                    id="firstName"
                    value={staff.firstName}
                    onChange={e => onInputChange(e, 'firstName')}
                    required
                    autoFocus
                    className={classNames({
                      'p-invalid': submitted && !staff.firstName
                    })}
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="name">Last Name</label>
                  <InputText
                    id="lastName"
                    value={staff.lastName}
                    onChange={e => onInputChange(e, 'lastName')}
                    required
                    className={classNames({
                      'p-invalid': submitted && !staff.lastName
                    })}
                  />
                </div>
              </div>
            </div>
            <div className="field">
              <div className="formgrid grid">
                <div className="col-6">
                  <label htmlFor="name">Address</label>
                  <InputText
                    id="address"
                    value={staff.address}
                    onChange={e => onInputChange(e, 'address')}
                    required
                    className={classNames({
                      'p-invalid': submitted && !staff.address
                    })}
                  />
                </div>
                <div className="col-6">
                  <label className="mb-3" htmlFor="dropdown">
                    Gender
                  </label>
                  <Dropdown
                    id="dropdown"
                    options={genders}
                    value={gender}
                    onChange={e => {
                      setGender(e.value)
                    }}
                    optionLabel="name"
                  />
                </div>
              </div>
            </div>

            {/* <Calendar hourFormat="24" dateFormat="yy-mm-dd" value={date} onChange={(e) =>setDate(dateFormat(e.value,"yyyy-MM-dd hh:mm:ss"))}></Calendar> */}

            <div className="field">
              <div className="formgrid grid">
                <div className="col-6">
                  <label htmlFor="name">Email</label>
                  <InputText
                    id="email"
                    value={staff.email}
                    onChange={e => onInputChange(e, 'email')}
                    required
                    className={classNames({
                      'p-invalid': submitted && !staff.email
                    })}
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="name">Phone Number</label>
                  <InputText
                    id="phoneNumber"
                    value={staff.phoneNumber}
                    onChange={e => onInputChange(e, 'phoneNumber')}
                    required
                    className={classNames({
                      'p-invalid': submitted && !staff.phoneNumber
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="field">
              <label className="mb-3">Type</label>
              <div className="formgrid grid">
                <div className="field-radiobutton col-2">
                  <RadioButton
                    inputId="category1"
                    name="category"
                    value="admin-tech"
                    onChange={onCategoryChange}
                    checked={staff.role === 'admin-tech'}
                  />
                  <label htmlFor="category1">Admin Tech</label>
                </div>
                <div className="field-radiobutton col-2">
                  <RadioButton
                    inputId="category2"
                    name="category"
                    value="admin-metier"
                    onChange={onCategoryChange}
                    checked={staff.role === 'admin-metier'}
                  />
                  <label htmlFor="category2">Admin Metier</label>
                </div>
                <div className="field-radiobutton col-2">
                  <RadioButton
                    inputId="category3"
                    name="category"
                    value="pharmacy"
                    onChange={onCategoryChange}
                    checked={staff.role === 'pharmacy'}
                  />
                  <label htmlFor="category3">Pharmacy</label>
                </div>
                <div className="field-radiobutton col-2">
                  <RadioButton
                    inputId="category4"
                    name="category"
                    value="doctor"
                    onChange={onCategoryChange}
                    checked={staff.role === 'doctor'}
                  />
                  <label htmlFor="category4">Doctor</label>
                </div>
                <div className="field-radiobutton col-2">
                  <RadioButton
                    inputId="category5"
                    name="category"
                    value="staff"
                    onChange={onCategoryChange}
                    checked={staff.role === 'staff'}
                  />
                  <label htmlFor="category5">Staff</label>
                </div>
              </div>
            </div>

            <Button
              label="Password"
              className="p-button-secondary p-button-outlined mr-3 mb-2"
              tooltip="Password Is 123456 you can change it in the profile section."
              tooltipOptions={{ className: 'blue-tooltip', position: 'bottom' }}
            />
          </Dialog>

          <Dialog
            visible={deleteStaffDialog}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteStaffDialogFooter}
            onHide={hideDeleteStaffDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: '2rem' }}
              />
              {staff && (
                <span>
                  Are you sure you want to delete <b>{staff.username}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteStaffsDialog}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteStaffsDialogFooter}
            onHide={hideDeleteStaffsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: '2rem' }}
              />
              {staff && (
                <span>
                  Are you sure you want to delete the selected staffs?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

const comparisonFn = function (prevProps, nextProps) {
  return prevProps.location.pathname === nextProps.location.pathname
}

export default React.memo(CrudStaffs, comparisonFn)
