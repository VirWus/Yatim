import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { FileUpload } from 'primereact/fileupload'
import { Toolbar } from 'primereact/toolbar'
import { InputTextarea } from 'primereact/inputtextarea'
//import { InputNumber } from 'primereact/inputnumber'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { ProductService } from '../service/ProductService'
import { RadioButton } from 'primereact/radiobutton';

import { useRecoilValue } from 'recoil'
import { authAtom } from '../States/Atoms/auth'

import { useRecoilState } from 'recoil'
import {
  fournisseurDialogAtom,
} from '../States/Atoms/buttons'

const CrudFournisseurs = () => {
  const auth = useRecoilValue(authAtom)

  const Companytype = [{name: 'Individual', key: 'I',value:'person'}, {name: 'Company', key: 'C', value:'company'}];
  const [selectedType, setSelectedType] = useState({});

  let emptyFournissuer = {
    id: null,
    name: '',
    company_type: '',
    adresse: '',
    phone: ''
    //another informations,
  }

  
  const [fournisseurs, setFournisseurs] = useState(null)
  const [fournisseurDialog, setFournisseurDialog] = useRecoilState(
    fournisseurDialogAtom
  )
  const [deleteFournisseurDialog, setDeleteFournisseurDialog] = useState(false)
  const [deleteFournisseursDialog, setDeleteFournisseursDialog] = useState(false)


  const [fournisseur, setFournisseur] = useState(emptyFournissuer)


  const [selectedFournisseurs, setSelectedFournisseurs] = useState(null)
  const [submittedFournisseur, setSubmittedFournisseur] = useState(false)

  const [globalFilter, setGlobalFilter] = useState(null)
  const toast = useRef(null)
  const dt = useRef(null)
  const productService = new ProductService()
  const refInput = React.createRef()

  useEffect(() => {  
    const productService = new ProductService()

    auth && productService.getFournisseurs(auth["token"]).then(data => setFournisseurs(data))

  }, [auth,fournisseurDialog])

  const formatCurrency = value => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }

  const openNewFournisseur = () => {
    setFournisseur(emptyFournissuer)
    setSubmittedFournisseur(false)
    setFournisseurDialog(true)
  }

  const hideDialogFournisseur = () => {
    setSubmittedFournisseur(false)
    setFournisseurDialog(false)
  }

  const hideDeleteFournisseurDialog = () => {
    setDeleteFournisseurDialog(false)
  }

  const hideDeleteFournisseursDialog = () => {
    setDeleteFournisseursDialog(false)
  }

  const saveFournisseur = () => {
    setSubmittedFournisseur(true)

    if (fournisseur.name.trim()) {
      let _fournisseurs = [...fournisseurs]
      let _fournisseur = { ...fournisseur }
      if (fournisseur.id) {
        const index = findIndexById(fournisseur.id)

        _fournisseurs[index] = _fournisseur
        _fournisseur.company_type = selectedType.value
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Fournisseur Updated',
          life: 3000
        })
      } else {
        _fournisseur.id = createId()
        _fournisseur.company_type = selectedType.value
        _fournisseur.image = 'product-placeholder.svg'
        _fournisseurs.push(_fournisseur)
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Fournisseur Created',
          life: 3000
        })
      }

      productService
        .createFournisseur(_fournisseur,auth["token"])
        .then(data => console.log(data))
      setFournisseurs(_fournisseurs)
      setFournisseurDialog(false)
      setFournisseur(emptyFournissuer)
    }
  }

  const editFournisseur = fournisseur => {
    setFournisseur({ ...fournisseur })
    setFournisseurDialog(true)
  }

  const confirmDeleteFournisseur = fournisseur => {
    setFournisseur(fournisseur)
    setDeleteFournisseurDialog(true)
  }

  const deleteFournisseur = () => {
    let _fournisseurs = fournisseurs.filter(val => val.id !== fournisseur.id)
    setFournisseurs(_fournisseurs)
    setDeleteFournisseurDialog(false)
    setFournisseur(emptyFournissuer)
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Fournisseur Deleted',
      life: 3000
    })
  }

  const findIndexById = id => {
    let index = -1
    for (let i = 0; i < fournisseurs.length; i++) {
      if (fournisseurs[i].id === id) {
        index = i
        break
      }
    }

    return index
  }

  const createId = () => {
    let id = ''
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id
  }

  const exportCSV = () => {
    dt.current.exportCSV()
  }

  const confirmDeleteSelected = () => {
    setDeleteFournisseursDialog(true)
  }

  const deleteSelectedFournisseurs = () => {
    let _fournisseurs = fournisseurs.filter(val => !selectedFournisseurs.includes(val))
    setFournisseurs(_fournisseurs)
    setDeleteFournisseursDialog(false)
    setSelectedFournisseurs(null)
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Fournisseurs Deleted',
      life: 3000
    })
  }



  const onInputChangeFournisseur = (e, name) => {
    const val = (e.target && e.target.value) || ''
    let _fournisseur = { ...fournisseur }
    _fournisseur[`${name}`] = val

    setFournisseur(_fournisseur)
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
      <div className="my-0">
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={openNewFournisseur}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedFournisseurs || !selectedFournisseurs.length}
        />
      </div>
    </React.Fragment>
    )
  }

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <FileUpload
          mode="basic"
          accept="image/*"
          maxFileSize={1000000}
          label="Import"
          chooseLabel="Import"
          className="mr-2 inline-block"
        />
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
      </React.Fragment>
    )
  }

  const codeBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Code</span>
        {rowData.id}
      </>
    )
  }

  const nameBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.name}
      </>
    )
  }


  const priceBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Price</span>
        {formatCurrency(rowData.company_type)}
      </>
    )
  }

  const categoryBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Phone Number</span>
        {rowData.phone}
      </>
    )
  }

  const actionBodyTemplate = rowData => {
    return (
      <div className="actions">
        {/* <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editFournisseur(rowData)}
        /> */}
        {/* <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mt-2"
          onClick={() => confirmDeleteFournisseur(rowData)}
        /> */}
      </div>
    )
  }

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
   
      <h5 className="m-0"> Fournisseurs</h5>

      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          ref={refInput}
          onChange={e => {
            setGlobalFilter(e.target.value)
            // let filtred = fournisseurs.filter((arr, index, self) =>
            //   arr.includes(e.target.value)
            // )
            // console.log(filtred)
            // if (filtred.length === 1) {
            //   editFournisseur(filtred[0])
            //   console.log('just one')
            // } else {
            //   if (filtred.length > 1) {
            //     console.log('moore')
            //   } else {
            //     //openNewFournisseur(e.target.value)
            //   }
            // }
          }}
          placeholder="Search..."
        />
      </span>
    </div>
  )

  const fournisseurDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialogFournisseur}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveFournisseur}
      />
    </>
  )
 
  const deleteFournisseurDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteFournisseurDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteFournisseur}
      />
    </>
  )
  const deleteFournisseursDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteFournisseursDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedFournisseurs}
      />
    </>
  )

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}
            value={fournisseurs}
            selection={selectedFournisseurs}
            onSelectionChange={e => setSelectedFournisseurs(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} fournisseurs"
            globalFilter={globalFilter}
            emptyMessage="No fournisseurs found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: '2rem' }}
            ></Column>
            <Column
              field="code"
              header="Code"
              sortable
              body={codeBodyTemplate}
            ></Column>
            <Column
              field="name"
              header="Name"
              sortable
              body={nameBodyTemplate}
            ></Column>

             <Column
              field="company_type"
              header="Type"
              body={priceBodyTemplate}
              sortable
            ></Column>
           <Column
              field="phone"
              header="Phone Number"
              sortable
              body={categoryBodyTemplate}
            ></Column>
{/* 
            <Column
              field="qty_available"
              header="QTY available"
              body={statusBodyTemplate}
              sortable
            ></Column>
            <Column
              field="barcode"
              header="Barcode"
              body={imageBodyTemplate}
            ></Column> */}
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

        
          {/* Fournisseur dialog */}
          <Dialog
            visible={fournisseurDialog}
            style={{ width: '580px' }}
            header="Fournisseur Details"
            modal
            className="p-fluid"
            footer={fournisseurDialogFooter}
            onHide={hideDialogFournisseur}
          >
                <div className="flex p-1">
    {
                    Companytype.map((category) => {
                        return (
                            <div key={category.key} className="field-radiobutton px-2">
                                <RadioButton  inputId={category.key} name="company_type" value={category} onChange={(e) =>{
                                  setSelectedType(e.value)
                                  console.log(e.value)
                                } 
                                  }  checked={selectedType.key === category.key} disabled={category.key === 'R'} />
                                <label htmlFor={category.key}>{category.name}</label>
                            </div>
                        )
                    })
                }

                </div>
           
            <div className="field">
              <label htmlFor="name">Name</label>
              <InputText
                id="name"
                value={fournisseur.name}
                onChange={e => onInputChangeFournisseur(e, 'name')}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submittedFournisseur && !fournisseur.name
                })}
              />
              {submittedFournisseur && !fournisseur.name && (
                <small className="p-invalid">Name is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="adresse">Adresse</label>
              <InputTextarea
                id="adresse"
                value={fournisseur.adresse}
                onChange={e => onInputChangeFournisseur(e, 'adresse')}
                required
                rows={3}
                cols={20}
              />
            </div>

            <div className="field">
              <label htmlFor="name">Phone Number</label>
              <InputText
                id="phone"
                value={fournisseur.phone}
                onChange={e => onInputChangeFournisseur(e, 'phone')}
                required
                className={classNames({
                  'p-invalid': submittedFournisseur && !fournisseur.name
                })}
              />
              {submittedFournisseur && !fournisseur.name && (
                <small className="p-invalid">Phone is required.</small>
              )}
            </div>
            {/* <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="price">Date</label>
                <InputNumber
                  id="price"
                  value={fournisseur.list_price}
                  onValueChange={e => onInputNumberChange(e, 'list_price')}
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                />
              </div>
              <div className="field col">
                <label htmlFor="quantity">Valeur</label>
                <InputNumber
                  id="quantity"
                  value={fournisseur.quantity}
                  onValueChange={e => onInputNumberChange(e, 'quantity')}
                  integeronly
                />
              </div>
            </div> */}
          </Dialog>


          <Dialog
            visible={deleteFournisseurDialog}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteFournisseurDialogFooter}
            onHide={hideDeleteFournisseurDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: '2rem' }}
              />
              {fournisseur && (
                <span>
                  Are you sure you want to delete <b>{fournisseur.title}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteFournisseursDialog}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteFournisseursDialogFooter}
            onHide={hideDeleteFournisseursDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: '2rem' }}
              />
              {fournisseur && (
                <span>
                  Are you sure you want to delete the selected fournisseurs?
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

export default React.memo(CrudFournisseurs, comparisonFn)
