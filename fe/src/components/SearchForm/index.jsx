import React,{useState} from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import './style.css'
function SearchForm() {
  const navigate = useNavigate();
  const [key,setKey]=useState('')
    const handleSearch=(e)=>{
      e.preventDefault();
      navigate(`/search?key=${key}`)
    }
  return (
    <form onSubmit={handleSearch} className='search'>
        <SearchIcon className="search_icon"/>
        <input  type="text" onChange={e=>setKey(e.target.value)} placeholder="Tìm kiếm ..." />
    </form>
  )
}

export default SearchForm