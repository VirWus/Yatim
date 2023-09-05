import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import { InputText } from 'primereact/inputtext'
import { ProductService } from '../service/ProductService'

import { useRecoilValue } from 'recoil'
import { authAtom } from '../States/Atoms/auth'

const CrudStock = () => {
  const auth = useRecoilValue(authAtom)

  const [stocks, setStocks] = useState(null)
  //const [stockDialog, setStockDialog] = useRecoilState(stockDialogAtom)
  //const [deleteStockDialog, setDeleteStockDialog] = useState(false)
  // const [deleteStocksDialog, setDeleteStocksDialog] = useState(false)

  const [selectedStocks, setSelectedStocks] = useState(null)
  // const [submittedStock, setSubmittedStock] = useState(false)

  const [globalFilter, setGlobalFilter] = useState(null)
  const toast = useRef(null)
  const dt = useRef(null)


  useEffect(() => {
    //refInput.current.focus()
    const productService = new ProductService()


    auth &&
      productService.getStocks(auth['token']).then(data => {
        setStocks(data)
        //findIndexById(stocks)
      })

    //console.log('cat:', stocks)
    // productService.getProducts().then(data => setStocks(data))
  }, [auth])

  useEffect(() => {  
    
    const findIndexById = id => {
    for (let i = 0; i < stocks.length; i++) {
      stocks[i].id = i
    }
  }
    stocks && findIndexById(stocks)
    // console.log('cat:', stocks)
  }, [stocks])



  const codeBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Code</span>
        <div className="m-2">{rowData.__domain[0][2]} </div>
      </>
    )
  }

  const nameBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.product_id[1]}
      </>
    )
  }

  const statusBodyTemplate = rowData => {
    return (
      <>
        <span className="p-column-title">Inventory Difference QTY</span>
        <span
          className={`customer-badge status-${rowData.inventory_diff_quantity}`}
        >
          {rowData.inventory_diff_quantity}
        </span>
      </>
    )
  }

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0"> Stocks</h5>

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

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          {/* <Toolbar
            className="mb-2"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar> */}

          <DataTable
            ref={dt}
            value={stocks}
            selection={selectedStocks}
            onSelectionChange={e => {
              //console.log(e.value)
              setSelectedStocks(e.value)
            }}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} stocks"
            globalFilter={globalFilter}
            emptyMessage="No stocks found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: '3rem' }}
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
              field="qty_available"
              header="QTY available"
              body={statusBodyTemplate}
              sortable
            ></Column>
            {/* <Column
              field="list_price"
              header="Price"
              body={priceBodyTemplate}
              sortable
            ></Column>
            <Column
              field="type"
              header="Category"
              sortable
              body={categoryBodyTemplate}
            ></Column>

         
            <Column
              field="barcode"
              header="Barcode"
              body={imageBodyTemplate}
            ></Column> */}
          </DataTable>
        </div>
      </div>
    </div>
  )
}

const comparisonFn = function (prevProps, nextProps) {
  return prevProps.location.pathname === nextProps.location.pathname
}

export default React.memo(CrudStock, comparisonFn)
