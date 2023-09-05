import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { FileUpload } from 'primereact/fileupload'
import { Toolbar } from 'primereact/toolbar'
//import { InputTextarea } from 'primereact/inputtextarea'
//import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { ProductService } from '../service/ProductService'
import { StaffService } from '../service/StaffService'
import { MouvService } from '../service/MouvService'
//import { Dropdown } from 'primereact/dropdown'
import { AutoComplete } from 'primereact/autocomplete'

import { useRecoilValue } from 'recoil'
import { authAtom } from '../States/Atoms/auth'
import jwt_decode from 'jwt-decode'
//import { Barcode } from 'react-barcode'
import { InputNumber } from 'primereact/inputnumber'

import jsPDFInvoiceTemplate, { OutputType, jsPDF } from "jspdf-invoice-template";

const CrudMouv = () => {
  let emptyMouv = {
    orders: []
  }

  let emptyProduct = {
    id: null,
    name: '',
    quantity: 0
  }

  const auth = useRecoilValue(authAtom)
  const [loading, setLoading] = useState(false)

  const [barcodeInputValue, updateBarcodeInputValue] = useState('')
  //const [selectedCategorie, setSelectedCategorie] = useState(null)
  const [product, setProduct] = useState(emptyProduct)
  const [mouvId, setMouvId] = useState(null)
  const [productDialog, setProductDialog] = useState(false)

  const [filteredStaffs, setFilteredStaffs] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState(null)


  const [filteredProducts, setFilteredProducts] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  //const [products, setProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null)

  const isMounted = useRef(false)
  const productService = new ProductService()
  const staffService = new StaffService()
  const mouvService = new MouvService()

  const [mouvs, setMouvs] = useState(null)
  const [products, setProducts] = useState(null)
  const [staffs, setStaffs] = useState(null)
  const [MouvDialog, setMouvDialog] = useState(false)
  const [OrderDialog, setOrderDialog] = useState(false)
  const [deleteMouvDialog, setDeleteMouvDialog] = useState(false)
  const [deleteMouvsDialog, setDeleteMouvsDialog] = useState(false)
  const [mouv, setMouv] = useState(emptyMouv)
  const [selectedMouvs, setSelectedMouvs] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [globalFilter, setGlobalFilter] = useState(null)
  const [globalFilterOrder, setGlobalFilterOrder] = useState(null)
  const toast = useRef(null)
  const dt = useRef(null)
  //console.log(auth)
  if (auth) {
    var decoded = jwt_decode(auth['token'])
    //console.log(decoded);
  }

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

  const editProduct = product => {
    //setSelectedCategorie(product.categ_id)
    // console.log(selectedCategorie)
    //console.log(product)
    setProduct({ ...product })
    setOrderDialog(true)
  }

  const barcodeAutoFocus = () => {
    document.getElementById('barcode')?.focus()
  }

  const onKeyDown = e => {
    if (e.keyCode === 13) {
      //setGlobalFilter(e.target.value)
      searchProductCodebar(e.target.value)
    }
  }

  let str = ''
  const onKeyDown13 = e => {
    if (e.key === 'Enter') {
      //console.log(str)
      var temp = str
      searchProductCodebar(temp)

      str = ''
    } else {
      str += e.key
    }
  }

  const searchStaff = event => {
    setTimeout(() => {
      let _filteredStaffs
      if (!event.query.trim().length) {
        _filteredStaffs = [...staffs]
      } else {
        _filteredStaffs = staffs.filter(Staff => {
          return Staff.firstName
            .toLowerCase()
            .startsWith(event.query.toLowerCase())
        })
      }

      setFilteredStaffs(_filteredStaffs)
    }, 250)
  }

  const searchProduct = event => {
    setTimeout(() => {
      let _filteredProducts
      if (!event.query.trim().length) {
        _filteredProducts = [...products]
      } else {
        _filteredProducts = products.filter(Product => {
          return Product.x_NOM_DE_MARQUE
            .toLowerCase()
            .startsWith(event.query.toLowerCase())
        })
      }

      setFilteredProducts(_filteredProducts)
    }, 250)
  }

  const searchProductCodebar = code => {
    //console.log(code)
    let filtred = {}

    if (Array.isArray(products)) {
      filtred = products.filter((arr, index, self) =>
        arr.barcode.includes(code)
      )
    }

    // console.log(filtred)
    if (filtred.length === 1) {
      editProduct(filtred[0])
      //console.log('just one')
    } else {
      if (filtred.length > 1) {
        //console.log('moore')
      } else {
        alert('No Product please add it to the stock')
        //openNew(e.target.value)
      }
    }
    updateBarcodeInputValue('')
  }

  useEffect(() => {
    // console.log(expandedRows)

    if (isMounted.current) {
      document.addEventListener('keypress', onKeyDown13)

      // const summary =
      //   expandedRows !== null ? 'All Rows Expanded' : 'All Rows Collapsed'
      // toast.current.show({
      //   severity: 'success',
      //   summary: `${summary}`,
      //   life: 3000
      // })
    }
    return () => document.removeEventListener('keypress', onKeyDown13)
  }, [expandedRows])

  const onRowExpand = event => {
    setMouv(event.data)
    toast.current.show({
      severity: 'info',
      summary: 'Order Expanded',
      detail: event.data.name,
      life: 3000
    })
  }

  const onRowCollapse = event => {
    //setMouv(null)
    toast.current.show({
      severity: 'success',
      summary: 'Order Collapsed',
      detail: event.data.name,
      life: 3000
    })
  }

  const expandAll = () => {
    let _expandedRows = {}
    mouvs.forEach(p => (_expandedRows[`${p.id}`] = true))

    setExpandedRows(_expandedRows)
  }

  const collapseAll = () => {
    setExpandedRows(null)
  }

  const amountBodyTemplate = rowData => {
    return rowData.quantity
  }

  const statusOrderBodyTemplate = rowData => {
    return (
      <span className={`order-badge order-${rowData.quantity}`}>
        {rowData.quantity}
      </span>
    )
  }

  const searchBodyTemplate = () => {
    return <Button icon="pi pi-search" />
  }

  const quantityBodyTemplate = rowData => {
    return rowData.quantity
  }

  const roleBodyTemplate = rowData => {
    return <span>{rowData.role}</span>
  }

  const rowExpansionTemplate = data => {
    return (
      <div className="orders-subtable">
        <DataTable
          //globalFilter={globalFilterOrder}
          header={headerorders}
          value={data.orders}
          responsiveLayout="scroll"
        >
          <Column field="product_id" header="Id" sortable></Column>
          <Column
            field="name"
            body={nameBodyTemplate}
            header="Product Name"
            sortable
          ></Column>
          <Column
            field="quantity"
            header="Quantity"
            body={amountBodyTemplate}
            sortable
          ></Column>
{/* 
          <Column
            headerStyle={{ width: '4rem' }}
            body={searchBodyTemplate}
          ></Column> */}
        </DataTable>
      </div>
    )
  }

  const Mouvs = data => {
    setMouv(emptyMouv)

    let _mouvs = []
    let _mouv = { ...mouv }
    var _orders = []

    var results = data.reduce(function (results, org) {
      ;(results[org.OP_ID] = results[org.OP_ID] || []).push(org)
      return results
    }, {})

    Object.keys(results).forEach(function (key, index) {
      //console.log(index)
      let total = 0
      _mouv.id = key
      _mouv.responsable = results[key][0].responsable
      _mouv.distinataire = results[key][0].distinataire
      _mouv.date = results[key][0].date
      _mouv.user = results[key][0].user

      //console.log('orders', results[key])

      results[key].map(function (item, index) {
        //console.log("item",item)
        let _order = {} //console.log(item.product_id)
        _order.product_id = item.product_id

        _order.quantity = item.quantity
        total += _order.quantity
        _orders.push(_order)
      })
      //console.log("orders on the go; ",_orders)

      _mouv['orders'] = _orders
      _mouv.quantity = total

      _mouvs.push(_mouv)
      total = 0
      _orders = []
      _mouv = { ...mouv }
     // console.log('Mouv', _mouv)
    })

    //console.log(_mouvs)

    setMouvs(_mouvs)
    setMouv(emptyMouv)
    //console.log(data)
  }

  useEffect(() => {
    setLoading(true)

    isMounted.current = true
    mouvService.getMouvs().then(data => Mouvs(data))

    //console.log(mouvs)
    auth && productService.getProducts(auth['token']).then(data => {
      setProducts(data)
      setLoading(false)
    })
    auth && staffService.getStaffs(auth['token']).then(data => setStaffs(data))
    // mouvService.getMouvs().then(data => setMouvs(data));
    //console.log(mouvs)
  }, [auth])

  const openNew = () => {
    setMouv(emptyMouv)
    setSubmitted(false)
    setMouvDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setMouvDialog(false)
    setOrderDialog(false)
  }

  const hideOrderDialog = () => {
    // setSubmitted(false)
    setOrderDialog(false)
  }

  const orderDialog = () => {
    //setSubmitted(false)
    setOrderDialog(true)
  }

  const hideDeleteMouvDialog = () => {
    setDeleteMouvDialog(false)
  }

  const hideDeleteMouvsDialog = () => {
    setDeleteMouvsDialog(false)
  }

  const AddPOD = id => {
    // setSubmitted(true)
    console.log(id)
    if (product.id) {
      //console.log(mouv)
      //let _mouvs = [...mouvs]
      let _mouv = { ...mouv }
      if (_mouv.id) {
        //   const index = findIndexById(mouv.id)

        //   _mouvs[index] = _mouv
        _mouv.orders.push(product)

        mouvService.insertMouv(
          product.quantity,
          _mouv.responsable,
          product.id,
          _mouv.responsable,
          _mouv.distinataire,
          _mouv.id,
          auth['token']
        )

        //  _mouvs.push(_mouv)
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Mouv Updated',
          life: 3000
        })
      }
      setOrderDialog(false)
      // setMouvs(_mouvs)
      //setMouvDialog(false)
      //  setMouv(emptyMouv)
    }
  }

  const saveMouv = () => {
    setSubmitted(true)

    if (mouv.name) {
      let _mouvs = [...mouvs]
      let _mouv = { ...mouv }
      if (mouv.id) {
        const index = findIndexById(mouv.id)

        _mouvs[index] = _mouv
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000
        })
      } else {
        //console.log(mouv)
        _mouv.date = dateFormat(Date(), 'yyyy-MM-dd hh:mm:ss')
        _mouv.responsable = decoded.scopes[0]
        _mouv.distinataire = mouv.name
        _mouvs.push(_mouv)
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000
        })
      }

      setMouvs(_mouvs)
      setMouvDialog(false)
      setMouv(emptyMouv)
    }
  }

  const editMouv = mouv => {
    setMouv({ ...mouv })
    setMouvDialog(true)
  }

  const confirmDeleteMouv = mouv => {
    setMouv(mouv)
    setDeleteMouvDialog(true)
  }

  const deleteMouv = () => {
    let _mouvs = mouvs.filter(val => val.id !== mouv.id)
    setMouvs(_mouvs)
    setDeleteMouvDialog(false)
    setMouv(emptyMouv)
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Product Deleted',
      life: 3000
    })
  }

  const findIndexById = id => {
    let index = -1
    for (let i = 0; i < mouvs.length; i++) {
      if (mouvs[i].id === id) {
        index = i
        break
      }
    }

    return index
  }

  const findIndexDataById = (data, OP_ID) => {
    let order = []
    // for (let i = 0; i < data.length; i++) {
    //   if (data[i].OP_ID === OP_ID) {
    order.product_id = data.product_id
    order.quantity = data.quantity
    order.push(order)
    //   }
    // }

    return order
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

  const PrintInvoice = (order) => {
    console.log(order)
    
    var props = {
      outputType: OutputType.Save,
      returnJsPDFDocObject: true,
      fileName: order.date ,
      orientationLandscape: false,
      compress: true,
     
      stamp: {
          inAllPages: true, //by default = false, just in the last page
          src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/qr_code.jpg",
          type: 'JPG', //optional, when src= data:uri (nodejs case)
          width: 20, //aspect ratio = width/height
          height: 20,
          margin: {
              top: 0, //negative or positive num, from the current position
              left: 0 //negative or positive num, from the current position
          }
      },
      business: {
          name: "Clinique Akrouf",
          address: "Bordj Bou Arreridj, Algeria",
          phone: "",
          email: "",
          email_1: "",
          website: "",
      },
      contact: {
          label: "Invoice issued for:",
          name: order.distinataire,
          address: "",
          phone: "",
          email: "",
          otherInfo: "",
      },
      invoice: {
          label: "Invoice #: ",
          num: order.id,
          invDate: "Date: " + order.date,
          invGenDate: "",
          headerBorder: false,
          tableBodyBorder: false,
          header: [
            {
              title: "#", 
              style: { 
                width: 10 
              } 
            }, 
            { 
              title: "Name",
              style: {
                width: 30
              } 
            },
      
            { title: "Quantity"},
         
          ],
          table: order.orders.map((item, index)=>([
              index + 1,
              item.product_id,
             item.quantity,

          ])),
          additionalRows: [{
              col1: 'Total:',
              col2: `${order.quantity}`,
              col3: 'ALL',
              style: {
                  fontSize: 14 //optional, default 12
              }
          },
          {
              col1: '',
              col2: '',
              col3: '',
              style: {
                  fontSize: 10 //optional, default 12
              }
          },
          {
              col1: '',
              col2: '',
              col3: '',
              style: {
                  fontSize: 10 //optional, default 12
              }
          }],
          invDescLabel: "Invoice Note",
          invDesc: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.",
      },
      footer: {
          text: "The invoice is created on a computer and is valid without the signature and stamp.",
      },
      pageEnable: true,
      pageLabel: "Page ",
  };
  const pdfObject = jsPDFInvoiceTemplate(props); //returns number of pages created

  pdfObject.jsPDFDocObject.save();
}

  const confirmDeleteSelected = () => {
    setDeleteMouvsDialog(true)
  }

  const deleteSelectedMouvs = () => {
    let _mouvs = mouvs.filter(val => !selectedMouvs.includes(val))
    setMouvs(_mouvs)
    setDeleteMouvsDialog(false)
    setSelectedMouvs(null)
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Products Deleted',
      life: 3000
    })
  }

  const onCategoryChange = e => {
    let _mouv = { ...mouv }
    _mouv['type'] = e.value
    setMouv(_mouv)
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || ''
    let _mouv = { ...mouv }

    _mouv[`${name}`] = val
    setMouv(_mouv)
  }

  const onInputChangeName = (e, name) => {
    const val = (e.target && e.target.value) || ''
    let _mouv = { ...mouv }

    _mouv[`${name}`] = val.firstName + ' ' + val.lastName
    _mouv['role'] = val.role
    _mouv['phoneDemandeur'] = val.phoneNumber
   // console.log(_mouv)
    setMouv(_mouv)
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0
    let _product = { ...product }
    _product[`${name}`] = val

    setProduct(_product)
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
            disabled={!selectedMouvs || !selectedMouvs.length}
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
    let name = {}
    // name = products.filter(Product => {
    //   return Product.id === rowData.product_id
    // })[0]
    name = "sss"
    return <>{name && name.x_NOM_DE_MARQUE}</>
  }

  const DateBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Date</span>
        {rowData.date}
      </>
    )
  }

  const categoryBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Type</span>
        {rowData.type}
      </>
    )
  }

  const actionBodyTemplate = rowData => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editMouv(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mr-2"
          onClick={() => confirmDeleteMouv(rowData)}
        />
         <Button
          icon="pi pi-print"
          className="p-button-rounded p-button-info mr-2"
          onClick={() => PrintInvoice(rowData)}
        />
      </div>
    )
  }

  const itemTemplateStaff = item => {
    return (
      <div className="">
        <div>
          {item.firstName}, {item.lastName}
        </div>
        <div>{item.role} </div>
      </div>
    )
  }

  const itemTemplateProduct = item => {
    return (
      <div className="">
        <div>
          {item.x_NOM_DE_MARQUE}, {item.x_DCI}
        </div>

      </div>
    )
  }
  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <div className="table-header-container">
        <Button
          icon="pi pi-plus"
          label="Expand All"
          onClick={expandAll}
          className="mr-2"
        />
        <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} />
      </div>
      <h5 className="m-0">Manage Mouvement</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={e => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  )

  const headerorders = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Order</h5>{' '}
      <Button
        icon="pi pi-plus"
        label="ADD Prodcuts"
        onClick={orderDialog}
        className="mr-2"
      />
      {/*  <span className="block mt-2 md:mt-0 p-input-icon-left">
       <i className="pi pi-search" />
         <InputText
          type="search"
          onInput={e => setGlobalFilterOrder(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search..."
        /> 
      </span>*/}
    </div>
  )

  const mouvDialogFooter = (
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
        onClick={saveMouv}
      />
    </>
  )

  const AddPODDialogFooter = (
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
        onClick={AddPOD}
      />
    </>
  )

  const deleteMouvDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteMouvDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteMouv}
      />
    </>
  )

  const deleteMouvsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteMouvsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedMouvs}
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
            right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            value={mouvs}
            //lazy
            expandedRows={expandedRows}
            onRowToggle={e => setExpandedRows(e.data)}
            onRowExpand={onRowExpand}
            onRowCollapse={onRowCollapse}
            responsiveLayout="scroll"
            //loading={loading}
            globalFilter={globalFilter}
            //  className="datatable-responsive"
            // paginator
            emptyMessage="No products found."
            // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            // selection={selectedMouvs}
            //onSelectionChange={e => setSelectedMouvs(e.value)}
            rowExpansionTemplate={rowExpansionTemplate}
            dataKey="id"
            header={header}
          >
            <Column expander style={{ width: '3em' }} />
            {/* <Column field="id" header="id" sortable /> */}
            <Column field="distinataire" header="Demandeur" sortable />
            {/* <Column
              field="role"
              header="Role"
              sortable
              body={roleBodyTemplate}
            /> */}
            {/* <Column field="phoneDemandeur" header="Phone Number Demandeur" /> */}
            <Column header="Date" body={DateBodyTemplate} sortable />

            <Column field="responsable" header="Responsable" sortable />
            <Column
              field="quantity"
              header="Quantity"
              sortable
              body={quantityBodyTemplate}
            />

            <Column
              field="inventoryStatus"
              header="Status"
              sortable
              body={actionBodyTemplate}
            />
          </DataTable>

          <Dialog
            visible={MouvDialog}
            style={{ width: '850px' }}
            header="Mouv Details"
            modal
            className="p-fluid"
            footer={mouvDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label className="mb-3">Demandeur Name</label>

              <span className="p-fluid">
                <AutoComplete
                  value={selectedStaff}
                  suggestions={filteredStaffs}
                  completeMethod={searchStaff}
                  itemTemplate={itemTemplateStaff}
                  field="firstName"
                  onChange={e => {
                   // console.log(e)
                    onInputChangeName(e, 'name')
                   // console.log(mouv)
                    setSelectedStaff(e.value)
                  }}
                  aria-label="Staffs"
                  dropdownAriaLabel="Select Staff"
                />
              </span>
              {/* <RadioButton inputId="category1" name="type" value="Accessories" onChange={onCategoryChange} checked={product.type === 'consu'} />
                                    <label htmlFor="category1">consu</label> */}
            </div>
          </Dialog>

          <Dialog
            visible={OrderDialog}
            style={{ width: '850px' }}
            header="Add Product to order"
            modal
            className="p-fluid"
            footer={AddPODDialogFooter}
            onHide={hideOrderDialog}
          >
            <div className="formgrid grid">
              <div className="field col-12">
                <label htmlFor="name">Product</label>
                <AutoComplete
                  value={selectedProduct}
                  suggestions={filteredProducts}
                  completeMethod={searchProduct}
                  itemTemplate={itemTemplateProduct}
                  field="name"
                  onChange={e => {
                   // console.log(e)
                    //onInputChangeName(e, 'name')
                   // console.log(mouv)
                    setSelectedProduct(e.value)
                    setProduct({ ...e.value })
                  }}
                  autoFocus
                  aria-label="Products"
                  dropdownAriaLabel="Select Product"
                />
              
              </div>

              <div className="field col-6">
                <label htmlFor="qty_available">Quantity Available</label>
                <InputNumber
                  id="qty_available"
                  disabled
                  integeronly
                  value={
                    product.quantity
                      ?  eval(product.qty_available) - eval(product.quantity)
                      : product.qty_available
                  }
                  onChange={e => onInputNumberChange(e, 'qty_available')}
                />
              </div>

              <div className="field col-6">
                <label htmlFor="quantity">Quantity</label>
                <InputNumber
                  id="quantity"
                  integeronly
                  autoFocus
                  value={product && product.quantity}
                  onChange={e => {
                    (
                      eval(product.qty_available) - eval(product.quantity) < 0
                        ? alert('you need to add quantity')
                        : onInputNumberChange(
                      e,
                      'quantity'
                    )
                    )
                  }}
                />
              </div>
            </div>

            <div className="field flex justify-content-center justify-items-center">
              {/* {product.barcode && (
                <Barcode
                  width={3}
                  height={100}
                  value={product.barcode}
                  format="EAN13"
                />
              )} */}
            </div>
          </Dialog>

          <Dialog
            visible={deleteMouvDialog}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteMouvDialogFooter}
            onHide={hideDeleteMouvDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: '2rem' }}
              />
              {mouv && (
                <span>
                  Are you sure you want to delete <b>{mouv.username}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteMouvsDialog}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteMouvsDialogFooter}
            onHide={hideDeleteMouvsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: '2rem' }}
              />
              {mouv && (
                <span>Are you sure you want to delete the selected mouvs?</span>
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

export default React.memo(CrudMouv, comparisonFn)
