import axios from 'axios'

  const serverAdress = JSON.parse(localStorage.getItem('Ser'))
  //console.log(serverAdress)
  const baseUrl = `http://${serverAdress}/api` 
export class ProductService {

  getProposeds() {
    return axios.get('/assets/data/medicaments.json').then(
      (
        res //console.log(res.data["success"].articles)
      ) => res.data[1].data //console.log(res.data[1].data)
    )
  }

  DeleteArticle(id, token) {
    return axios
      .delete(
        `${baseUrl}/articles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(res => console.log(res))
  }


getData = async (token)=>{
    try{
        const response = await axios
        .get( `${baseUrl}/articles`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(
          (
            res //console.log(res.data["success"].articles)
          ) => res.data['success'].articles //res.data[1].articles 
        )
        // return the whole response object instead of only the data.
        // this helps in error handling in the component
        return response;
    }
    catch(error){}
   }

  getProducts(token) {
    return axios
      .get(`${baseUrl}/articles`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(
        (
          res //console.log(res.data["success"].articles)
        ) => res.data['success'].articles //res.data[1].articles 
      )
  }

  UpdateQtyProduct(article, token) {
    //console.log(article)
    return axios
      .post(
        `${baseUrl}/reception`,
        {
          //params: {
            quantity: article.quantity,
            product_id: article.id
          //}
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(
        res => console.log(res) //res.data[1].articles
      )
  }

  createProduct(article, token) {
    console.log(article)
    return axios
      .post(
        `${baseUrl}/articles`, //null,
        {
          //params: {
            //article : article,
            article_name: article.name === "M" ? "product" : "consu",
            article_barcode: article.barcode,
            article_categ_id: 1,
            article_x_CODE: article.x_CODE,
            article_x_COND: article.x_COND,
            article_x_DCI: article.x_DCI,
            article_x_DOSAGE: article.x_DOSAGE,
            article_x_FORME: article.x_FORME,
            article_x_LABORATOIRE: article.x_LABORATOIRE,
            article_x_NOM_DE_MARQUE: article.x_NOM_DE_MARQUE,
            article_x_PRIX: article.x_PRIX,
            article_fournisseur: article.fournisseur
        //  }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((
        res //console.log(res) //res.data[1].articles
      ) =>
        {
          //console.log(res) 
        axios.post(`${baseUrl}/reception`, {
        //  params: {
            quantity: article.quantity,
            product_id: res.data["success"][1].article
         // }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        } 
      )
  }

  createCategorie(categorie,token) {
    console.log(categorie)
    return axios
      .post(`${baseUrl}/categories`, //null,
       {
        //params: { 
          category_name: categorie.name 
       // }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(
        res =>  res //console.log(res)
      )
  }
  getCategories(token) {
    return axios.get(`${baseUrl}/categories`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(
      (
        res //console.log(res)
      ) => console.log(res) //res.data['success'].categories
      )  //console.log(res)
  }

  createFournisseur(vendor,token) {
    //console.log(article)
    return axios
      .post(`${baseUrl}/vendors`, //null,
       {
        //params: {
          vendor_name: vendor.name,
          vendor_adresse: vendor.adresse,
          vendor_type: vendor.company_type,
          vendor_phone: vendor.phone
       // }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(
        res => console.log(res) //res.data[1].articles
      )
  }

  getFournisseurs(token) {
    return axios.get(`${baseUrl}/vendors`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(
      (
        res //console.log(res)
      ) => res.data['success'].vendors
    )
  }

  getStocks(token) {
    return axios.get(`${baseUrl}/inventory`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(
      (
        res
      ) => //console.log(res)
       res.data['success'].inventory.groups
    )
  }
}
