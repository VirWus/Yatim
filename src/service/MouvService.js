import React, { useState } from 'react'
import axios from 'axios'

export class MouvService {
  getMouvs() {
    return axios.get('http://127.0.0.1:5000/getMovement').then(res => res.data)
  }

  insertMouv(
    quantity,
    user,
    product_id,
    responsable,
    distinataire,
    OP_ID,
    token
  ) {
    return axios
      .get('http://127.0.0.1:5000/insertMovement', {
        params: {
          nature: 'Consomation',
          quantity: quantity,
          user: user,
          product_id: product_id,
          responsable: responsable,
          distinataire: distinataire,
          op_id: OP_ID
        }
      })
      .then(res =>{
       // console.log(res)
        axios.post(
          'http://127.0.0.1:8000/api/consomation',
          {
            //params: {
              quantity: quantity,
              product_id: product_id
            //}
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      }
        
        
      )
  }
}
