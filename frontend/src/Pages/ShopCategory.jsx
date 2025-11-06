import React, { useEffect, useState } from 'react';
import './CSS/ShopCategory.css';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
  const [products, setProducts] = useState([]);

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/${props.category}`);
        console.log(process.env.REACT_APP_API_URL)
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [props.category]);

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt='' />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing {products.length}</span> products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt='' />
        </div>
      </div>

      <div className="shopcategory-products">
        {products.map((item, i) => (
          <Item
            key={i}
            id={item.id || item._id}
            image={item.image}
            name={item.name}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>

      <div className="shopcategory-loadmore">Explore More</div>
    </div>
  );
};

export default ShopCategory;
