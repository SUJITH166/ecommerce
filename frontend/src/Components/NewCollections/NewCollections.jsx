import React, { useEffect, useState } from 'react'
import './NewCollection.css'
// import new_collection from '../Assets/new_collections'
import Item from '../Item/Item'

const NewCollections = () => {
  const [new_collection,setNew_Collection]=useState([]);

  useEffect(()=>{
    fetch(`${process.env.REACT_APP_API_URL}/newcollections`)
    .then((response)=>response.json())
    .then((data)=>setNew_Collection(data))
  },[])
  return (
    <div className='new-collection'>
      <h1>New Collection</h1>
      <hr/>
      <div className="collections">
        {new_collection.map((item,i)=>{
            return <Item
             key={i}
              id={item.id}
              image={item.image}
              name={item.name}
              new_price={item.new_price}
              old_price={item.old_price}
              />
        })}
      </div>
    </div>
  )
}

export default NewCollections
