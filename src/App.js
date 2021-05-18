import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import Photo from './Photo';
// const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [queryString, setQueryString] = useState('');
  const pageUrl = `&page=${pageNum}`;
  const query = `&query=${queryString}`;
  const fetchData = async () => {
    setLoading(true);
    let url;
    if (queryString) {
      url = `${searchUrl}${clientID}${pageUrl}${query}`;
    } else {
      url = `${mainUrl}${clientID}${pageUrl}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      setPhotos((oldPhotos) => {
        if (queryString && pageNum === 1) {
          return data.results;
        } else if (queryString) {
          return [...oldPhotos, ...data.results];
        } else {
          return [...oldPhotos, ...data];
        }
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setPageNum(1);
    fetchData();
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [pageNum]);
  useEffect(() => {
    const scroll = window.addEventListener('scroll', () => {
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 50
      ) {
        setPageNum((oldPage) => {
          return oldPage + 1;
        });
      }
    });
    return () => {
      window.removeEventListener('scroll', scroll);
    };
    // eslint-disable-next-line
  }, []);
  return (
    <main>
      <section className='search'>
        <form className='search-form'>
          <input
            type='text'
            className='form-input'
            placeholder='search'
            value={queryString}
            onChange={(e) => setQueryString(e.target.value)}
          />
          <button type='submit' className='submit-btn' onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className='photos'>
        <div className='photos-center'>
          {photos.map((photo) => {
            return <Photo key={photo.id} {...photo} />;
          })}
        </div>
        {loading && <h2 className='loading'>Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
