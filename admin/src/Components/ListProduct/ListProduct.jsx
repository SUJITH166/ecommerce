import React from 'react'
import './ListProduct.css'
import { useState } from 'react'
import { useEffect } from 'react';
import cross_icon from '../../assets/cross_icon.png'
// import cross_icon from '../../'

const ListProduct = () => {
  const [allproduct,setAllProduct]=useState([]);
  const fetchInfo = async () => {
  try {
    const res = await fetch('http://localhost:4000/allproducts');
    const data = await res.json();
    setAllProduct(data);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
};

const remove_product = async (id) => {
  try {
    await fetch('http://localhost:4000/removeproduct', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    await fetchInfo();
  } catch (error) {
    console.error("Error removing product:", error);
  }
};


  useEffect(()=>{
    fetchInfo();
  },[])


  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproduct.map((product,index)=>{
          return <>
          <div key={index} className="listproduct-format-main listproduct-format">
            <img src={product.image} alt="" className="listproduct-product-icon" />
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <img onClick={()=>{remove_product(product.id)}} src={cross_icon} alt="remove" className="listproduct-remove-icon" />
          </div>
          <hr/>
          </>
        })}
      </div>
    </div>
  )
}

export default ListProduct
