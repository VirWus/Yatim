import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { FileUpload } from 'primereact/fileupload'
import { Rating } from 'primereact/rating'
import { Toolbar } from 'primereact/toolbar'
import { InputTextarea } from 'primereact/inputtextarea'
import { RadioButton } from 'primereact/radiobutton'
import { InputNumber } from 'primereact/inputnumber'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { ProductService } from '../service/ProductService'
import Barcode from 'react-barcode'
import { AutoComplete } from 'primereact/autocomplete'
import barcodeanimated from '../assets/barcode-scan.gif'
import { Tag } from 'primereact/tag'
import  ZebraBrowserPrintWrapper from 'zebra-browser-print-wrapper'

import { useRecoilState } from 'recoil'
import {
  productDialogAtom,
  fournisseurDialogAtom,
  categorieDialogAtom
} from '../States/Atoms/buttons'

const CrudProducts = () => {
  let emptyProduct = {
    id: null,
    name: '',
    image: null,
    description: '',
    categ_id: null,
    barcode: null,
    list_price: 0,
    quantity: 0,
    inventoryStatus: 'INSTOCK'
  }

  let emptyFournissuer = {
    id: null,
    name: '',
    company_type: '',
    adresse: '',
    phone: ''
    //another informations,
  }

  let emptyCategorie = {
    id: null,
    display_name: '',
    description: ''
    //another informations,
  }

  const Companytype = [
    { name: 'Individual', key: 'I', value: 'person' },
    { name: 'Company', key: 'C', value: 'company' }
  ]
  const [selectedType, setSelectedType] = useState({})

  const [products, setProducts] = useState(null)
  const [fournisseurs, setFournisseurs] = useState(null)
  const [productDialog, setProductDialog] = useRecoilState(productDialogAtom)
  const [fournisseurDialog, setFournisseurDialog] = useRecoilState(
    fournisseurDialogAtom
  )
  const [categorieDialog, setCategorieDialog] = useRecoilState(
    categorieDialogAtom
  )

  const [deleteProductDialog, setDeleteProductDialog] = useState(false)
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false)

  const [outOfstock, setoutOfstock] = useState([])
  const [LowStock, setLowStock] = useState([])
  const [NewOrder, setNewOrder] = useState([])

  const [product, setProduct] = useState(emptyProduct)
  const [fournisseur, setFournisseur] = useState(emptyFournissuer)
  const [categorie, setCategorie] = useState(emptyCategorie)

  const [selectedProducts, setSelectedProducts] = useState(null)
  const [submittedProduct, setSubmittedProduct] = useState(false)
  const [submittedFournisseur, setSubmittedFournisseur] = useState(false)
  const [submittedCategorie, setSubmittedCategorie] = useState(false)

  const [globalFilter, setGlobalFilter] = useState(null)
  const toast = useRef(null)
  const dt = useRef(null)
  const productService = new ProductService()
  const refInput = React.createRef()

  const [filteredCategories, setFilteredCategories] = useState(null)
  const [selectedCategorie, setSelectedCategorie] = useState(null)
  const [categories, setCategories] = useState([])

  const searchCategories = event => {
    setTimeout(() => {
      let _filteredCategories
      if (!event.query.trim().length) {
        _filteredCategories = [...categories]
      } else {
        _filteredCategories = categories.filter(category => {
          return category.display_name
            .toLowerCase()
            .startsWith(event.query.toLowerCase())
        })
      }

      setFilteredCategories(_filteredCategories)
    }, 250)
  }

  useEffect(() => {
    window.api.receive('fromMain', data => {
      console.log(`Received ${data} from main process`)
    })
    refInput.current.focus()
    productService.getCategories().then(data => setCategories(data))
    //console.log('cat:', categories)
    productService.getFournisseurs().then(data => setFournisseurs(data))
    productService.getProducts().then(data => {
      setProducts(data)
      Stockinfos()
    })
  }, [])

  const formatCurrency = value => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }

  const openNewFournisseur = () => {
    setFournisseur(emptyFournissuer)
    setSubmittedFournisseur(false)
    setFournisseurDialog(true)
  }

  const openNewCategorie = () => {
    setCategorie(emptyCategorie)
    setSubmittedCategorie(false)
    setCategorieDialog(true)
  }

  const openNew = code => {
    if (code) {
      emptyProduct.barcode = code
    }

    setProduct(emptyProduct)
    setSubmittedProduct(false)
    setProductDialog(true)
  }

  const hideDialogProduct = () => {
    setSubmittedProduct(false)
    setProductDialog(false)
  }
  const hideDialogFournisseur = () => {
    setSubmittedFournisseur(false)
    setFournisseurDialog(false)
  }
  const hideDialogCategorie = () => {
    setSubmittedCategorie(false)
    setCategorieDialog(false)
  }
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false)
  }

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false)
  }

  const saveProduct = () => {
    setSubmittedProduct(true)

    if (product.name.trim()) {
      let _products = [...products]
      let _product = { ...product }
      if (product.id) {
        const index = findIndexById(product.id)

        _products[index] = _product
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000
        })
      } else {
        _product.id = createId()
        _product.image = 'product-placeholder.svg'
        _products.push(_product)
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000
        })
      }

      productService.createProduct(_product).then(data => console.log(data))
      setProducts(_products)
      setProductDialog(false)
      setProduct(emptyProduct)
    }
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
          detail: 'Product Updated',
          life: 3000
        })
      } else {
        _fournisseur.id = createId()
        _fournisseur.image = 'product-placeholder.svg'
        _fournisseur.company_type = selectedType.value
        _fournisseurs.push(_fournisseur)
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000
        })
      }

      productService
        .createFournisseur(_fournisseur)
        .then(data => console.log(data))
      setFournisseurs(_fournisseurs)
      setFournisseurDialog(false)
      setFournisseur(emptyFournissuer)
    }
  }

  const saveCategorie = () => {
    setSubmittedCategorie(true)

    if (categorie.name.trim()) {
      let _categories = [...categories]
      let _categorie = { ...categorie }
      if (categorie.id) {
        const index = findIndexById(categorie.id)

        _categories[index] = _categorie
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000
        })
      } else {
        _categorie.id = createId()
        _categorie.image = 'product-placeholder.svg'
        _categories.push(_categorie)
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000
        })
      }

      productService.createCategorie(_categorie).then(data => console.log(data))
      setCategories(_categories)
      setCategorieDialog(false)
      setCategorie(emptyCategorie)
    }
  }
  
  const onInputChangeProductType = (e, name) => {
    const val = (e.value && e.target.value) || ''
    let _product = { ...product }
    _product[`${name}`] = val[0] ? val[0].id : val

    setProduct(_product)
  }

  const editProduct = product => {
    setProduct({ ...product })
    setProductDialog(true)
  }

  const confirmDeleteProduct = product => {
    setProduct(product)
    setDeleteProductDialog(true)
  }

  const deleteProduct = () => {
    let _products = products.filter(val => val.id !== product.id)
    setProducts(_products)
    setDeleteProductDialog(false)
    setProduct(emptyProduct)
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Product Deleted',
      life: 3000
    })
  }

  const Stockinfos = () => {
    if (products) {
      let _StockInfos = products.filter(val => val.qty_available === 0)
      setoutOfstock(_StockInfos.length)
      _StockInfos = products.filter(
        val => val.qty_available < 15 && val.qty_available !== 0
      )
      setLowStock(_StockInfos.length)
      _StockInfos = products.filter(val => val.qty_available > 123)
      setNewOrder(_StockInfos.length)
    }
  }

  const findIndexById = id => {
    let index = -1
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
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
    setDeleteProductsDialog(true)
  }

  const deleteSelectedProducts = () => {
    let _products = products.filter(val => !selectedProducts.includes(val))
    setProducts(_products)
    setDeleteProductsDialog(false)
    setSelectedProducts(null)
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Products Deleted',
      life: 3000
    })
  }

  const onInputChangeProduct = (e, name) => {
    const val = (e.target && e.target.value) || ''
    let _product = { ...product }
    _product[`${name}`] = val

    setProduct(_product)
  }

  const onInputChangeFournisseur = (e, name) => {
    const val = (e.target && e.target.value) || ''
    let _fournisseur = { ...fournisseur }
    _fournisseur[`${name}`] = val

    setFournisseur(_fournisseur)
  }

  const onInputChangeCategorie = (e, name) => {
    const val = (e.target && e.target.value) || ''
    let _categorie = { ...categorie }
    _categorie[`${name}`] = val

    setCategorie(_categorie)
  }
  const [barcodeInputValue, updateBarcodeInputValue] = useState('')

  const barcodeAutoFocus = () => {
    document.getElementById('barcode')?.focus()
  }
  const onKeyDown = e => {
    if (e.keyCode === 13) {
      setGlobalFilter(e.target.value)
      let filtred = products.filter((arr, index, self) =>
        arr.barcode.includes(e.target.value)
      )
      console.log(filtred)
      if (filtred.length === 1) {
        editProduct(filtred[0])
        console.log('just one')
      } else {
        if (filtred.length > 1) {
          console.log('moore')
        } else {
          openNew(e.target.value)
        }
      }
      updateBarcodeInputValue('')
    }
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
            label="Fournisseurs"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={openNewFournisseur}
          />
          <Button
            label="Categorie"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={openNewCategorie}
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

  const imageBodyTemplate = rowData => {
    return (
      <Barcode width={2} height={60} value={rowData.barcode} format="EAN13" />
    )
  }

  const priceBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Price</span>
        {formatCurrency(rowData.list_price)}
      </>
    )
  }

  const categoryBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Category</span>
        {rowData.categ_id && rowData.categ_id[1]
        //console.log(rowData.categ_id[1])
        }
      </>
    )
  }

  const itemTemplate = item => {
    return (
      <div className="country-item">
        <div>{item.display_name}</div>
      </div>
    )
  }
  const ratingBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Reviews</span>
        <Rating value={rowData.list_price} readonly cancel={false} />
      </>
    )
  }

  const statusBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">QTY available</span>
        <span className={`customer-badge status-${rowData.qty_available}`}>
          {rowData.qty_available < 15 ? (
            <Tag
              className="text-xl"
              severity="warning"
              value={rowData.qty_available}
            ></Tag>
          ) : (
            <Tag
              className="text-xl"
              severity="Primary"
              value={rowData.qty_available}
            ></Tag>
          )}
        </span>
      </>
    )
  }




  const onPrintBarcode = code => {

    const printBarcode = async (code) => {
        try {

            // Create a new instance of the object
            const browserPrint =  new ZebraBrowserPrintWrapper();
    
            // Select default printer
            const defaultPrinter =  await browserPrint.getDefaultPrinter();
       
            // Set the printer
            browserPrint.setPrinter(defaultPrinter);
    
            // Check printer status
            const printerStatus = await browserPrint.checkPrinterStatus();
        console.log(code)
            // Check if the printer is ready
            if(printerStatus.isReadyToPrint) {
    
                // ZPL script to print a simple barcode
                const zpl = `^XA^FO225,80^BY4
                ^BEN,80,Y,N
                ^FD${code}^XZ`;

                browserPrint.print(zpl);
            } else {
            console.log("Error/s", printerStatus.errors);
            }
    
        } catch (error) {
            throw new Error(error);
        }
    };

    printBarcode(code);

  }



  const actionBodyTemplate = rowData => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mr-2"
          onClick={() => confirmDeleteProduct(rowData)}
        />
        <Button
          icon="pi pi-print"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => onPrintBarcode(rowData.barcode)}
        />
      </div>
    )
  }

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
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
            disabled={!selectedProducts || !selectedProducts.length}
          />
        </div>
      </React.Fragment>
      <h5 className="m-0"> Stock</h5>
      <div className="flex flex-column justify-content-center border-round">
        <div className="text-center">
          <img width="90" src={barcodeanimated} alt="loading..." />
        </div>

        <span className="block justify-content-center mt-2 md:mt-0 p-input-icon-left">
          <i className="pi pi-search w-full" />
          <InputText
            autoFocus
            id="barcode"
            type="search"
            ref={refInput}
            onKeyDown={onKeyDown}
            // onInput={e => {
            //
            // }}
            onChange={e => {
              setGlobalFilter(e.target.value)
              updateBarcodeInputValue(e.target.value)
            }}
            value={barcodeInputValue}
            //onBlur={barcodeAutoFocus}
            placeholder="Search..."
          />
        </span>
      </div>
    </div>
  )

  const productDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialogProduct}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveProduct}
      />
    </>
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
  const categorieDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialogCategorie}
      />
      <Button
        label="Add"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveCategorie}
      />
    </>
  )
  const deleteProductDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteProduct}
      />
    </>
  )
  const deleteProductsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedProducts}
      />
    </>
  )

  return (
    <div className="grid crud-demo">
      {/* <div className="col-12 lg:col-4 xl:col-4">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block font-bold mb-3">Out of stock</span>
              <div className="text-900 font-medium text-xl">{outOfstock}</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-red-100 border-round"
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              <i className="pi pi-shopping-cart text-red-500 text-xl" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 lg:col-4 xl:col-4">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block font-bold mb-3">Low Stock</span>
              <div className="text-900 font-medium text-xl">{LowStock}</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-orange-100 border-round"
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              <i className="pi pi-shopping-cart text-orange-500 text-xl" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 lg:col-4 xl:col-4">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block font-bold mb-3">New Orders</span>
              <div className="text-900 font-medium text-xl">{NewOrder}</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-blue-100 border-round"
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              <i className="pi pi-shopping-cart text-blue-500 text-xl" />
            </div>
          </div>
        </div>
      </div> */}
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
            value={products}
            selection={selectedProducts}
            onSelectionChange={e => setSelectedProducts(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            globalFilter={globalFilter}
            emptyMessage="No products found."
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
            {/* 
            <Column
              field="list_price"
              header="Price"
              body={priceBodyTemplate}
              sortable
            ></Column> */}
            <Column
              field="type"
              header="Category"
              sortable
              body={categoryBodyTemplate}
            ></Column>

            {/* <Column
              field="qty_available"
              header="QTY available"
              body={statusBodyTemplate}
              sortable
            ></Column> */}
            <Column
              field="barcode"
              header="Barcode"
              body={imageBodyTemplate}
            ></Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          {/* product dialog */}

          <Dialog
            visible={productDialog}
            style={{ width: '580px' }}
            header="Product Details"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialogProduct}
          >
            <div className="field">
              <label htmlFor="name">Name</label>
              <InputText
                id="name"
                value={product.name}
                onChange={e => onInputChangeProduct(e, 'name')}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submittedProduct && !product.name
                })}
              />
              {submittedProduct && !product.name && (
                <small className="p-invalid">Name is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <InputTextarea
                id="description"
                value={product.description}
                onChange={e => onInputChangeProduct(e, 'description')}
                required
                rows={3}
                cols={20}
              />
            </div>

            <div className="field">
              <label className="mb-3">Type</label>

              <span className="p-fluid">
              <AutoComplete
                  placeholder="Search"
                  id="dd"
                  dropdown
                  multiple
                  value={
                    selectedCategorie
                  }
                  suggestions={filteredCategories}
                  completeMethod={searchCategories}
                  field="display_name"
                  //itemTemplate={itemTemplate}
                  onChange={e => {
                    //  e.value
                    // ? setSelectedCategorie(e.value.display_name)
                    console.log(e)  
                    setSelectedCategorie(e.target.value)
                  
                    onInputChangeProductType(e, 'categ_id')
                    console.log(product)
                  }
                    
                  }
                 
                  dropdownAriaLabel="Select Categorie"
                />
              </span>
              {/* <RadioButton inputId="category1" name="type" value="Accessories" onChange={onCategoryChange} checked={product.type === 'consu'} />
                                    <label htmlFor="category1">consu</label> */}
            </div>

            {/* <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="price">Price</label>
                <InputNumber
                  id="price"
                  value={product.list_price}
                  onValueChange={e => onInputNumberChange(e, 'list_price')}
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                />
              </div>
              <div className="field col">
                <label htmlFor="qty_available">Quantity</label>
                <InputNumber
                  id="qty_available"
                  value={product.qty_available}
                  onValueChange={e => onInputNumberChange(e, 'qty_available')}
                  integeronly
                />
              </div>
            </div> */}
            <div className="field flex justify-content-center justify-items-center">
              {product.barcode && (
                <Barcode
                  width={3}
                  height={100}
                  value={product.barcode}
                  format="EAN13"
                />
              )}
            </div>
          </Dialog>

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
              {Companytype.map(category => {
                return (
                  <div key={category.key} className="field-radiobutton px-2">
                    <RadioButton
                      inputId={category.key}
                      name="company_type"
                      value={category}
                      onChange={e => {
                        setSelectedType(e.value)
                        console.log(e.value)
                      }}
                      checked={selectedType.key === category.key}
                      disabled={category.key === 'R'}
                    />
                    <label htmlFor={category.key}>{category.name}</label>
                  </div>
                )
              })}
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

          {/* Categorie dialog */}
          <Dialog
            visible={categorieDialog}
            style={{ width: '580px' }}
            header="Add Categorie"
            modal
            className="p-fluid"
            footer={categorieDialogFooter}
            onHide={hideDialogCategorie}
          >
            <div>
              <div className="card">
                <label htmlFor="name">Categories</label>
                <DataTable value={categories} responsiveLayout="scroll">
                  <Column field="id" header="Code"></Column>
                  <Column field="display_name" header="Name"></Column>
                </DataTable>
              </div>
            </div>
            <div className="field">
              <label htmlFor="name">Name</label>
              <InputText
                id="name"
                value={categorie.name}
                onChange={e => onInputChangeCategorie(e, 'name')}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submittedCategorie && !categorie.name
                })}
              />
              {submittedCategorie && !categorie.name && (
                <small className="p-invalid">Name is required.</small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductDialog}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteProductDialogFooter}
            onHide={hideDeleteProductDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: '2rem' }}
              />
              {product && (
                <span>
                  Are you sure you want to delete <b>{product.title}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductsDialog}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteProductsDialogFooter}
            onHide={hideDeleteProductsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: '2rem' }}
              />
              {product && (
                <span>
                  Are you sure you want to delete the selected products?
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

export default React.memo(CrudProducts, comparisonFn)
