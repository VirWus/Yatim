import React, { useState, useEffect, useMemo,useRef } from 'react'
import classNames from 'classnames'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { FileUpload } from 'primereact/fileupload'
import { Toolbar } from 'primereact/toolbar'
import { InputTextarea } from 'primereact/inputtextarea'
import { RadioButton } from 'primereact/radiobutton'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { ProductService } from '../service/ProductService'
import Barcode from 'react-barcode'
import { AutoComplete } from 'primereact/autocomplete'
import barcodeanimated from '../assets/barcode-scan.gif'
import { Tag } from 'primereact/tag'
import ZebraBrowserPrintWrapper from 'zebra-browser-print-wrapper'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

import { useRecoilValue } from 'recoil'
import { authAtom } from '../States/Atoms/auth'

import { useRecoilState } from 'recoil'

import { FilterMatchMode } from 'primereact/api'

import {
  productDialogAtom,
  fournisseurDialogAtom
  //categorieDialogAtom
} from '../States/Atoms/buttons'

const CrudPharm = () => {
  const auth = useRecoilValue(authAtom)
  //const [loading, setLoading] = useState(false)

  const confirm1 = code => {
    confirmDialog({
      message: 'This barcode Are you sure you want to add it to stock?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => accept(code),
      reject
    })
  }
  
  const accept = code => {
    openNew(code)
    toast.current.show({
      severity: 'info',
      summary: 'Confirmed',
      detail: 'You have accepted ' + code,
      life: 3000
    })
  }

  const reject = code => {
    toast.current.show({
      severity: 'warn',
      summary: 'Rejected',
      detail: 'You have rejected',
      life: 3000
    })
  }

  let emptyProduct = {
    id: '',
    NUM_ENREGISTREMENT: '',
    x_CODE: '',
    x_DCI: '',
    x_NOM_DE_MARQUE: '',
    x_FORME: '',
    x_DOSAGE: '',
    x_COND: '',
    LISTE: '',
    PRIX_PORTE_SUR_LA_DECISION_DENREGISTREMENT: '',
    x_LABORATOIRE: '',
    x_PRIX: '',
    REMBOURSEMENT: '',
    description: '',
    detailed_type: '',
    barcode: '',
    list_price: 0,
    quantity: 0
  }

  let emptyFournissuer = {
    id: null,
    name: '',
    company_type: '',
    adresse: '',
    phone: ''
    //another informations,
  }

  // let emptyCategorie = {
  //   id: null,
  //   display_name: '',
  //   description: ''
  //   //another informations,
  // }

  const Companytype = [
    { name: 'Individual', key: 'I', value: 'person' },
    { name: 'Company', key: 'C', value: 'company' }
  ]

  const [Articletype] = useState([
    { name: 'Medicament', key: 'M', value: 'med' },
    { name: 'Consumable', key: 'C', value: 'cons' }
  ])

  const [selectedType, setSelectedType] = useState('')

  const [proposeds, setProposeds] = useState(null)

  const [filteredProposeds, setFilteredProposeds] = useState(null)

  // const [
  //   filteredProposedsFournisseur,
  //   setFilteredProposedsFournisseur
  // ] = useState(null)

  const [selectedProposed, setSelectedProposed] = useState(null)

  // const [
  //   selectedProposedFournisseur,
  //   setSelectedProposedFournisseur
  // ] = useState(null)

  const searchProposed = event => {
    setTimeout(() => {
      let _filteredProposeds
      if (!event.query.trim().length) {
        _filteredProposeds = [...proposeds]
      } else {
        _filteredProposeds = proposeds.filter(Proposed => {
          return Proposed.x_NOM_DE_MARQUE
            .toLowerCase()
            .startsWith(event.query.toLowerCase())
        })
      }

      setFilteredProposeds(_filteredProposeds)
    }, 250)
  }

  // const searchProposedFournisseur = event => {
  //   setTimeout(() => {
  //     let _filteredProposeds
  //     if (!event.query.trim().length) {
  //       _filteredProposeds = [...fournisseurs]
  //     } else {
  //       _filteredProposeds = fournisseurs.filter(Proposed => {
  //         return Proposed.name
  //           .toLowerCase()
  //           .startsWith(event.query.toLowerCase())
  //       })
  //     }

  //     setFilteredProposedsFournisseur(_filteredProposeds)
  //   }, 250)
  // }


  const [products, setProducts] = useState(null)

  const [fournisseurs, setFournisseurs] = useState(null)
  const [productDialog, setProductDialog] = useRecoilState(productDialogAtom)
  const [fournisseurDialog, setFournisseurDialog] = useRecoilState(
    fournisseurDialogAtom
  )
  // const [setCategorieDialog] = useRecoilState(
  //   categorieDialogAtom
  // )

  const [deleteProductDialog, setDeleteProductDialog] = useState(false)
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false)

  const [outOfstock, setoutOfstock] = useState([])
  const [LowStock, setLowStock] = useState([])
  const [NewOrder, setNewOrder] = useState([])

  const [editing, setEditing] = useState(false)

  const [product, setProduct] = useState(emptyProduct)
  const [fournisseur, setFournisseur] = useState(emptyFournissuer)
  //const [categorie, setCategorie] = useState(emptyCategorie)

  const [selectedProducts, setSelectedProducts] = useState(null)
  const [sub, setSubmittedProduct] = useState(false)
  const [submittedFournisseur, setSubmittedFournisseur] = useState(false)
  //const [setSubmittedCategorie] = useState(false)

  const [globalFilter, setGlobalFilter] = useState(null)
  const toast = useRef(null)
  const dt = useRef(null)
  const productService = new ProductService()
  const refInput = React.createRef()

  //const [filteredCategories, setFilteredCategories] = useState(null)
  //const [selectedCategorie, setSelectedCategorie] = useState(null)
  //const [categories, setCategories] = useState(null)
  const isMounted = useRef(false)

  // const searchCategories = event => {
  //   setTimeout(() => {
  //     let _filteredCategories
  //     if (!event.query.trim().length) {
  //       _filteredCategories = [...categories]
  //     } else {
  //       _filteredCategories = categories.filter(category => {
  //         return category.display_name
  //           .toLowerCase()
  //           .startsWith(event.query.toLowerCase())
  //       })
  //     }

  //     setFilteredCategories(_filteredCategories)
  //   }, 250)
  // }

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
      //alert('just one')
    } else {
      if (filtred.length > 1) {
        //alert('more')
      } else { 
       // console.log('no product')
        confirm1(code)
       
      }
    }
    updateBarcodeInputValue('')
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

  // const [refresh,setRefresh] =  useState(false)

  // useEffect(() => {
  //  // setLoading(true)
  //  const productService = new ProductService()
  // categories && productService.getCategories(auth["token"]).then(data => setCategories(data))
  //  //console.log(categories)
  // }, [auth,categorieDialog,categories])

  useEffect(() => {
    const productService = new ProductService()
    !fournisseurs &&
      productService
        .getFournisseurs(auth['token'])
        .then(data => setFournisseurs(data))
  }, [auth, fournisseurDialog, fournisseurs])

  useEffect(() => {
    const productService = new ProductService()
    isMounted.current = true

    !proposeds && productService.getProposeds().then(data => setProposeds(data))

    productService.getData(auth['token']).then(data => {
      setProducts(data)
      //console.log(products)
      if (isMounted.current) {
        document.addEventListener('keypress', onKeyDown13)
      }
    })
    //console.log(products)
    return () => document.removeEventListener('keypress', onKeyDown13)
  }, [auth, productDialog, proposeds])

  useEffect(() => {
    const Stockinfos = () => {
      if (products) {
        // console.log(products)

        setoutOfstock(products.filter(val => val.qty_available === 0))
        setLowStock(
          products.filter(
            val => val.qty_available < 15 && val.qty_available !== 0
          )
        )
        setNewOrder(
          products.filter(val =>  {
            const date1 = new Date()
            const date2 = new Date(val.write_date)
            const diffTime = Math.abs(date2 - date1)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            //console.log(diffTime + ' milliseconds')
            //console.log(diffDays + ' days')
            return val.qty_available > 0 && diffDays < 1
          })
        )
      }
    }

    // setTimeout(() => {
    //     setRefresh(!refresh)
    // }, 25000)
    Stockinfos()
  }, [products])

  // const formatCurrency = value => {
  //   return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  // }

  const openNewFournisseur = () => {
    setFournisseur(emptyFournissuer)
    setSubmittedFournisseur(false)
    setFournisseurDialog(true)
  }

  // const openNewCategorie = () => {
  //   setCategorie(emptyCategorie)
  //   setSubmittedCategorie(false)
  //   setCategorieDialog(true)
  // }

  const openNew = code => {
    if (code) {
      emptyProduct.barcode = code
      //selectedProposed.barcode = code
    }
    setSelectedProposed(emptyProduct)
    //console.log(emptyProduct)
    setProduct(emptyProduct)
    setSubmittedProduct(false)
    setProductDialog(true)
  }

  const hideDialogProduct = () => {
    setSubmittedProduct(false)
    setEditing(false)
    setProductDialog(false)
    barcodeAutoFocus()
  }

  const hideDialogFournisseur = () => {
    setSubmittedFournisseur(false)
    setFournisseurDialog(false)
    barcodeAutoFocus()
  }

  // const hideDialogCategorie = () => {
  //   setSubmittedCategorie(false)
  //   setCategorieDialog(false)
  //   barcodeAutoFocus()
  // }

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false)
    barcodeAutoFocus()
  }

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false)
    barcodeAutoFocus()
  }

  const saveProduct = () => {
    setSubmittedProduct(true)
    //setProduct(selectedProposed)
    //let _product = { ...selectedProposed }
    //console.log(product)
    if (product.x_NOM_DE_MARQUE.trim()) {
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
        //_product.id = createId()
        // _product.fournisseur = selectedProposedFournisseur.id
        _product.name = selectedType.key
        if (selectedType.key === 'C') {
          _product.x_CODE = '.'
          _product.x_DCI = '.'
          _product.x_DOSAGE = '.'
          _product.x_FORME = '.'
          _product.x_LABORATOIRE = '.'
        }

        _products.push(_product)
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000
        })
      }

      productService.createProduct(_product, auth['token']).then(
        data => {} //console.log(data)
      )
      setProducts(_products)
      setProductDialog(false)
      setEditing(false)
      setProduct(emptyProduct)
      barcodeAutoFocus()
    }
  }

  const updateProduct = () => {
    setSubmittedProduct(true)
    //setProduct(selectedProposed)
    //let _product = { ...selectedProposed }
    //console.log(product)
    if (product.x_NOM_DE_MARQUE.trim()) {
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
      }
      //console.log(_product)
      productService.UpdateQtyProduct(_product, auth['token']).then(
        data => {} //console.log(data)
      )
      setProducts(_products)
      setProductDialog(false)
      setEditing(false)
      setProduct(emptyProduct)
      barcodeAutoFocus()
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

      productService.createFournisseur(_fournisseur, auth['token']).then(
        data => {} //console.log(data)
      )
      setFournisseurs(_fournisseurs)
      setFournisseurDialog(false)
      setFournisseur(emptyFournissuer)
      barcodeAutoFocus()
    }
  }

  // const saveCategorie = () => {
  //   setSubmittedCategorie(true)

  //   if (categorie.name.trim()) {
  //     let _categories = [...categories]
  //     let _categorie = { ...categorie }
  //     if (categorie.id) {
  //       const index = findIndexById(categorie.id)

  //       _categories[index] = _categorie
  //       toast.current.show({
  //         severity: 'success',
  //         summary: 'Successful',
  //         detail: 'Product Updated',
  //         life: 3000
  //       })
  //     } else {
  //       _categorie.id = createId()
  //       _categorie.image = 'product-placeholder.svg'
  //       _categories.push(_categorie)
  //       toast.current.show({
  //         severity: 'success',
  //         summary: 'Successful',
  //         detail: 'Product Created',
  //         life: 3000
  //       })
  //     }

  //     productService.createCategorie(_categorie, auth['token']).then(
  //       data => {} //console.log(data)
  //     )
  //     setCategories(_categories)
  //     setCategorieDialog(false)
  //     setCategorie(emptyCategorie)
  //     barcodeAutoFocus()
  //   }
  // }

  const editProduct = product => {
    //setSelectedCategorie(product.categ_id)
    //console.log(selectedCategorie)
    setProduct({ ...product })

    for (let i = 0; i < Articletype.length; i++) {
      //console.log(product)
      product.type === "consu" ? setSelectedType(Articletype[1]) : setSelectedType(Articletype[0])
      // if (Articletype[i].key === product.name) {
      //   setSelectedType(Articletype[i])
      //   break
      // }
    }
    // let _filteredProposeds
    //console.log(product)
    // _filteredProposeds = proposeds.filter(Proposed => {
    //   return Proposed.x_NOM_DE_MARQUE.toLowerCase().startsWith(
    //     product.x_NOM_DE_MARQUE.toLowerCase()
    //   )
    // })

    //setFilteredProposeds(_filteredProposeds)
    setSelectedProposed(product)
    //console.log(product)
    setEditing(true)
    setProductDialog(true)
  }

  const confirmDeleteProduct = product => {
    setProduct(product)
    setDeleteProductDialog(true)
  }

  const deleteProduct = val => {
    let _products = products.filter(val => val.id !== product.id)
    productService.DeleteArticle(product.id, auth['token']).then(
      data => {} //console.log(data)
    )

    setProducts(_products)
    setDeleteProductDialog(false)

    setProduct(emptyProduct)
    productService.DeleteArticle(val.id, auth['token']).then(res =>
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Product Deleted',
        life: 3000
      })
    )
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

  const onInputChangeProposedProduct = (e, name) => {
    const val = (e.target && e.target.value) || ''
    //console.log(val.x_NOM_DE_MARQUE)

    let _product = { ...product }
    //console.log(_product)
    if (val.x_NOM_DE_MARQUE) {
      _product.x_CODE = val.x_CODE
      _product.x_COND = val.x_COND
      _product.x_DCI = val.x_DCI
      _product.x_DOSAGE = val.x_DOSAGE
      _product.x_FORME = val.x_FORME
      _product.x_LABORATOIRE = val.x_LABORATOIRE
      _product.x_NOM_DE_MARQUE = val.x_NOM_DE_MARQUE
      _product.x_PRIX = val.x_PRIX
    } else {
      _product.x_NOM_DE_MARQUE = val
    }

    setSelectedProposed(_product)
    setProduct(_product)
    //console.log(_product)
  }

  const onInputChangeProduct = (e, name) => {
    const val = (e.target && e.target.value) || ''
    //console.log(val[`${name}`])
    let _product = { ...product }
    _product[`${name}`] = val

    setSelectedProposed(_product)
    setProduct(_product)
    //console.log(product)
  }

  // const onInputChangeProductType = (e, name) => {
  //   const val = (e.value && e.target.value) || ''
  //   let _product = { ...product }
  //   _product[`${name}`] = val[0] ? val[0].id : val

  //   setProduct(_product)
  // }

  const onInputChangeFournisseur = (e, name) => {
    const val = (e.target && e.target.value) || ''
    let _fournisseur = { ...fournisseur }
    _fournisseur[`${name}`] = val

    setFournisseur(_fournisseur)
  }

  // const onInputChangeCategorie = (e, name) => {
  //   const val = (e.target && e.target.value) || ''
  //   let _categorie = { ...categorie }
  //   _categorie[`${name}`] = val

  //   setCategorie(_categorie)
  // }

  const [barcodeInputValue, updateBarcodeInputValue] = useState('')

  const barcodeAutoFocus = () => {
    document.getElementById('barcode')?.focus()
  }

  // const onKeyDown = e => {
  //   if (e.keyCode === 13) {
  //     setGlobalFilter(e.target.value)
  //     //console.log(products)
  //     let filtred = products.filter((arr, index, self) =>
  //       //console.log(arr.barcode.includes(e.target.value))

  //       arr.barcode.includes(e.target.value)
  //     )
  //     //console.log(filtred)
  //     if (filtred.length === 1) {
  //       //setSelectedProposed(filtred[0])
  //       editProduct(filtred[0])
  //       //console.log('just one')
  //     } else {
  //       if (filtred.length > 1) {
  //         //console.log('moore')
  //       } else {
  //         //openNew(e.target.value)
  //       }
  //     }
  //     updateBarcodeInputValue('')
  //   }
  // }

  const onInputNumberChange = (e, name) => {
    const val = (e.target && e.target.value) || ''
    // console.log(e.target.value)
    let _product = { ...product }
    _product[`${name}`] = val

    setSelectedProposed(_product)
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
          {/* <Button
            label="Categorie"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={openNewCategorie}
          /> */}
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
        {rowData.x_NOM_DE_MARQUE}
      </>
    )
  }

  const imageBodyTemplate = rowData => {
    return (
      <Barcode width={1.5} height={40} value={rowData.barcode} format="EAN13" />
    )
  }

  // const priceBodyTemplate = rowData => {
  //   return (
  //     <>
  //       <span className="p-column-title">Price</span>
  //       {formatCurrency(rowData.list_price)}
  //     </>
  //   )
  // }

  // const categoryBodyTemplate = rowData => {
  //   return (
  //     <>
  //       <span className="p-column-title">Category</span>
  //       {rowData.categ_id[1]}
  //     </>
  //   )
  // }

  const itemTemplate = item => {
    return (
      <div className=" max-w-0">
        <div>{item.x_NOM_DE_MARQUE}</div>
        <div>{item.x_DCI}</div>
        <div>{item.x_DOSAGE}</div>
      </div>
    )
  }

  // const itemTemplateFournisseur = item => {
  //   return (
  //     <div className="">
  //       <div>{item.name}</div>
  //     </div>
  //   )
  // }

  // const ratingBodyTemplate = rowData => {
  //   return (
  //     <>
  //       <span className="p-column-title">Reviews</span>
  //       <Rating value={rowData.list_price} readonly cancel={false} />
  //     </>
  //   )
  // }

  // const expireBodyTemplate = rowData => {
  //   return (
  //     <>
  //       <span className="p-column-title">Expire</span>
  //       <span className={`customer-badge status-${rowData.expiration_time}`}>
  //         {rowData.expiration_time < 15 ? (
  //           <Tag
  //             className="text-xl"
  //             severity="warning"
  //             value={rowData.expiration_time}
  //           ></Tag>
  //         ) : (
  //           <Tag
  //             className="text-xl"
  //             severity="Primary"
  //             value={rowData.expiration_time}
  //           ></Tag>
  //         )}
  //       </span>
  //     </>
  //   )
  // }

  const onPrintBarcode = code => {
    const printBarcode = async code => {
      try {
        // Create a new instance of the object
        const browserPrint = new ZebraBrowserPrintWrapper()

        // Select default printer
        const defaultPrinter = await browserPrint.getDefaultPrinter()

        // Set the printer
        browserPrint.setPrinter(defaultPrinter)

        // Check printer status
        const printerStatus = await browserPrint.checkPrinterStatus()
        //console.log(code)
        // Check if the printer is ready
        if (printerStatus.isReadyToPrint) {
          // ZPL script to print a simple barcode
          const zpl = `^XA^FO225,80^BY4
                ^BEN,80,Y,N
                ^FD${code}^XZ`

          browserPrint.print(zpl)
        } else {
          // console.log('Error/s', printerStatus.errors)
        }
      } catch (error) {
        throw new Error(error)
      }
    }

    printBarcode(code)
  }

  const statusBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Quantitie</span>
        <span className={`customer-badge status-${rowData.qty_available}`}>
          {rowData && rowData.qty_available < 5 ? (
            <Tag
              className="text-xl"
              severity="danger"
              value={rowData.qty_available}
            ></Tag>
          ) : (
            <Tag
              className="text-xl"
              severity="info"
              value={rowData.qty_available}
            ></Tag>
          )}

          {/* {rowData && rowData.qty_available < 15 (
            <Tag
              className="text-xl"
              severity="warning"
              value={rowData.qty_available}
            ></Tag>
          )}
          
          {rowData && rowData.qty_available > 15 (
            <Tag
              className="text-xl"
              severity="info"
              value={rowData.qty_available}
            ></Tag>
          )} */}
        </span>
      </>
    )
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
    //console.log(value)
    let _filters2 = { ...filters2 }
    _filters2['global'].value = value
    //console.log(_filters2)
    setFilters2(_filters2)
    setGlobalFilter(value)
  }

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <React.Fragment>
        <div className="my-0">
          <Button
            label="New"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={() => {
              let barcode = '613'
              let chars = '0123456789'
              for (let i = 0; i < 9; i++) {
                barcode += chars.charAt(
                  Math.floor(Math.random() * chars.length)
                )
              }
              var checkSum = barcode.split('').reduce(function (p, v, i) {
                return i % 2 === 0 ? p + 1 * v : p + 3 * v
              }, 0)
              let lastdigit = 10 - (checkSum % 10)
              // console.log( 10 - (checkSum % 10) )
              barcode += lastdigit
              //console.log(barcode)
              // products.filter((arr, index, self) => arr.barcode.includes(barcode))
              openNew(barcode)
            }}
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
      <div className="text-center">
        <img width="50" src={barcodeanimated} alt="loading..." />
      </div>
      <div className="flex flex-column justify-content-center border-round">
        <span className="block justify-content-center mt-2 md:mt-0 p-input-icon-left">
          <i className="pi pi-search w-full" />
          <InputText
            autoFocus
            id="barcode"
            type="search"
            ref={refInput}
            //onKeyDown={onKeyDown13}
            onChange={e => {
              onGlobalFilterChange(e)
              updateBarcodeInputValue(e.target.value)
            }}
            value={barcodeInputValue}
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
        label={editing ? 'Update' : 'Save'}
        icon="pi pi-check"
        className="p-button-text"
        onClick={editing ? updateProduct : saveProduct}
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

  // const categorieDialogFooter = (
  //   <>
  //     <Button
  //       label="Cancel"
  //       icon="pi pi-times"
  //       className="p-button-text"
  //       onClick={hideDialogCategorie}
  //     />
  //     <Button
  //       label="Add"
  //       icon="pi pi-check"
  //       className="p-button-text"
  //       onClick={saveCategorie}
  //     />
  //   </>
  // )

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

  const [selectedStock, setSelectedStock] = useState([])

  const onRowSelect = event => {
    searchProductCodebar(event.data.barcode)
    toast.current.show({
      severity: 'info',
      summary: 'Product Selected',
      detail: `Name: ${event.data.x_NOM_DE_MARQUE}`,
      life: 3000
    })
  }

  const onRowUnselect = event => {
    toast.current.show({
      severity: 'warn',
      summary: 'Product Unselected',
      detail: `Name: ${event.data.name}`,
      life: 3000
    })
  }

  return (
    <div className="grid crud-demo">
      <div className="col-12 lg:col-4 xl:col-4">
        <div className="card mb-0">
          <span className="flex font-bold col-12">Out of stock</span>
          <div className="flex justify-content-between">
            <DataTable
              value={outOfstock}
              style={{ height: 'calc(150px)' }}
              scrollable
              scrollHeight="flex"
              selectionMode="single"
              selection={selectedStock}
              onSelectionChange={e => setSelectedStock(e.value)}
              dataKey="id"
              className="flex col-12 datatable-responsive"
              //responsiveLayout="scroll"
              onRowSelect={onRowSelect}
              onRowUnselect={onRowUnselect}
            >
              <Column field="x_NOM_DE_MARQUE" header="Name"></Column>
            </DataTable>
          </div>
        </div>
      </div>

      <div className="col-12 lg:col-4 xl:col-4">
        <div className="card mb-0">
          <span className="flex font-bold col-12">Low Stock</span>
          <div className="flex justify-content-between">
            <DataTable
              value={LowStock}
              style={{ height: 'calc(150px)' }}
              scrollable
              scrollHeight="flex"
              selectionMode="single"
              selection={selectedStock}
              onSelectionChange={e => setSelectedStock(e.value)}
              dataKey="id"
              className="flex col-12 datatable-responsive"
              //responsiveLayout="scroll"
              onRowSelect={onRowSelect}
              onRowUnselect={onRowUnselect}
            >
              <Column field="x_NOM_DE_MARQUE" header="Name"></Column>
              <Column field="qty_available" header="Quantity"></Column>
            </DataTable>
          </div>
        </div>
      </div>

      <div className="col-12 lg:col-4 xl:col-4">
        <div className="card mb-0">
          <span className="flex font-bold col-12">New Orders</span>
          <div className="flex justify-content-between">
            <DataTable
              value={NewOrder}
              style={{ height: 'calc(150px)' }}
              scrollable
              scrollHeight="flex"
              selectionMode="single"
              selection={selectedStock}
              onSelectionChange={e => setSelectedStock(e.value)}
              dataKey="id"
              className="flex col-12 datatable-responsive"
              responsiveLayout="scroll"
              onRowSelect={onRowSelect}
              onRowUnselect={onRowUnselect}
            >
              <Column field="x_NOM_DE_MARQUE" header="Name"></Column>
              <Column field="write_date" header="date"></Column>
            </DataTable>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <ConfirmDialog />
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
            // lazy
            rows={10}
            filters={filters2}
            globalFilterFields={[
              'id',
              'x_NOM_DE_MARQUE',
              'qty_available',
              'barcode'
            ]}
            // loading={loading && <span className="loader"></span>}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            //globalFilter={globalFilter}
            emptyMessage="No products found."
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
              field="x_NOM_DE_MARQUE"
              header="Name"
              sortable
              body={nameBodyTemplate}
            ></Column>

            {/* <Column
              field="list_price"
              header="Price"
              body={priceBodyTemplate}
              sortable
            ></Column> */}
            {/* <Column
              field="type"
              header="Category"
              sortable
              body={categoryBodyTemplate}
            ></Column> */}

            <Column
              field="qty_available"
              header="QTY available"
              body={statusBodyTemplate}
              sortable
            ></Column>

            {/* <Column
              field="expiration"
              header="Dates de péremption"
              body={expireBodyTemplate}
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
            header={editing ? 'Update Product' : 'Product Details'}
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialogProduct}
          >
            <div className="field flex justify-content-center justify-items-center">
              {product.barcode && (
                <Barcode
                  width={1.5}
                  height={40}
                  value={product.barcode}
                  format="EAN13"
                />
              )}
            </div>
            <div className="flex justify-content-between p-1">
              {Articletype.map(category => {
                return (
                  <div key={category.key} className="field-radiobutton px-2">
                    <RadioButton
                      inputId={category.key}
                      name="name"
                      value={category}
                      onChange={e => {
                        setSelectedType(e.value)
                        console.log(selectedType)
                      }}
                      checked={selectedType.key === category.key}
                      disabled={category.key === 'R'}
                    />
                    <label htmlFor={category.key}>{category.name}</label>
                  </div>
                )
              })}
            </div>
            <div className="formgrid grid">
              <div className="field col-12">
                <label htmlFor="x_NOM_DE_MARQUE">Name</label>
                <AutoComplete
                  value={selectedProposed}
                  suggestions={filteredProposeds}
                  //  multiple
                  completeMethod={searchProposed}
                  itemTemplate={itemTemplate}
                  field="x_NOM_DE_MARQUE"
                  onChange={e => {
                    //console.log(e)

                    // selectedProposed.x_NOM_DE_MARQUE ?
                    onInputChangeProposedProduct(e, 'x_NOM_DE_MARQUE')
                    // : onInputChangeProduct(e, 'x_NOM_DE_MARQUE')

                    setSelectedProposed(e.value)
                    //console.log(selectedProposed)
                  }}
                  aria-label="x_NOM_DE_MARQUE"
                  dropdownarialabel="Select x_NOM_DE_MARQUE"
                />
              </div>

              <div className="field col-6">
                <label htmlFor="DENOMINATION_COMMUNE_INTERNATIONALE">DCI</label>
                {/* <AutoComplete
                  value={selectedProposed}
                  suggestions={filteredProposeds}
                  //  multiple
                  completeMethod={searchProposed}
                  itemTemplate={itemTemplate}
                  field="x_DCI"
                  onChange={e => {
                    //console.log(e)

                    // selectedProposed.x_NOM_DE_MARQUE ?
                    onInputChangeProposedProduct(e, 'x_DCI')
                    // : onInputChangeProduct(e, 'x_NOM_DE_MARQUE')

                    setSelectedProposed(e.value)
                    console.log(selectedProposed)
                  }}
                  aria-label="Staffs"
                  dropdownAriaLabel="Select Staff"
                /> */}
                <InputText
                  disabled={selectedType.key === 'C' ? true : false}
                  id="x_DCI"
                  value={selectedProposed && selectedProposed.x_DCI}
                  onChange={e => onInputChangeProduct(e, 'x_DCI')}
                />
              </div>

              <div className="field col-3 di">
                <label htmlFor="x_CODE">Code</label>
                <InputText
                  disabled={selectedType.key === 'C' ? true : false}
                  id="x_CODE"
                  value={selectedProposed && selectedProposed.x_CODE}
                  onChange={e => onInputChangeProduct(e, 'x_CODE')}
                />
              </div>

              <div className="field col-3">
                <label htmlFor="x_COND">Cond</label>
                <InputText
                  id="x_COND"
                  value={selectedProposed && selectedProposed.x_COND}
                  onChange={e => onInputChangeProduct(e, 'x_COND')}
                />
              </div>

              <div className="field col-3">
                <label htmlFor="x_DOSAGE">Dosage</label>
                <InputText
                  disabled={selectedType.key === 'C' ? true : false}
                  id="x_DOSAGE"
                  value={selectedProposed && selectedProposed.x_DOSAGE}
                  onChange={e => onInputChangeProduct(e, 'x_DOSAGE')}
                />
              </div>

              <div className="field col-3">
                <label htmlFor="x_FORME">FORME</label>
                <InputText
                  disabled={selectedType.key === 'C' ? true : false}
                  id="x_FORME"
                  value={selectedProposed && selectedProposed.x_FORME}
                  onChange={e => onInputChangeProduct(e, 'x_FORME')}
                />
              </div>

              <div className="field col-6">
                <label htmlFor="x_LABORATOIRE">LABORATOIRE</label>
                <InputText
                  disabled={selectedType.key === 'C' ? true : false}
                  id="x_LABORATOIRE"
                  value={selectedProposed && selectedProposed.x_LABORATOIRE}
                  onChange={e => onInputChangeProduct(e, 'x_LABORATOIRE')}
                />
              </div>
              {/* 
              <div className="field col-6">
                <label htmlFor="x_PRIX">PRIX</label>
                <InputText
                  id="x_PRIX"
                  value={selectedProposed && selectedProposed.x_PRIX}
                  onChange={e => onInputChangeProduct(e, 'x_PRIX')}
                />
              </div> */}
              {/* 
              <div className="field col-6">
                <label htmlFor="fournisseur">Fournisseur</label>
                <AutoComplete
                  value={selectedProposedFournisseur}
                  suggestions={filteredProposedsFournisseur}
                  //  multiple
                  completeMethod={searchProposedFournisseur}
                  itemTemplate={itemTemplateFournisseur}
                  field="name"
                  onChange={e => {
                    //console.log(e)

                    // selectedProposed.x_NOM_DE_MARQUE ?
                    onInputChangeProduct(e, 'name')
                    // : onInputChangeProduct(e, 'x_NOM_DE_MARQUE')

                    setSelectedProposedFournisseur(e.value)
                    console.log(selectedProposedFournisseur)
                  }}
                  aria-label="Fournisseur"
                  dropdownarialabel="Select Fournisseur"
                />
              </div> */}

              <div className="field col-6">
                <label htmlFor="qty_available">Quantity Available</label>
                <InputText
                  id="qty_available"
                  disabled
                  value={
                    selectedProposed &&
                    (selectedProposed.quantity
                      ? eval(selectedProposed.quantity) +
                        eval(selectedProposed.qty_available || 0)
                      : selectedProposed.qty_available)
                  }
                  onChange={e => onInputNumberChange(e, 'qty_available')}
                />
              </div>

              <div className="field col-6">
                <label htmlFor="quantity">Quantity</label>
                <InputText
                  id="quantity"
                  value={selectedProposed && selectedProposed.quantity}
                  onChange={e => onInputNumberChange(e, 'quantity')}
                />
              </div>
            </div>
            {/*
            <div className="field">
              <label className="mb-3">Type</label>

              <span className="p-fluid">
                 <AutoComplete
                  placeholder="Search"
                  id="dd"
                  dropdown
                  multiple
                  value={selectedCategorie}
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
                  }}
                  dropdownAriaLabel="Select Categorie"
                /> 
              </span>
              {/* <RadioButton inputId="category1" name="type" value="Accessories" onChange={onCategoryChange} checked={product.type === 'consu'} />
                                    <label htmlFor="category1">consu</label>
            </div>*/}

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
                        //console.log(e.value)
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
          {/* <Dialog
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
          </Dialog> */}

          {/* Delete product dialog */}
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

          {/* Delete products dialog */}
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

export default React.memo(CrudPharm, comparisonFn)
