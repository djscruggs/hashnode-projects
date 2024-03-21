import { useState, useEffect, useReducer } from 'react'
import axios from 'axios'
import './App.css'
import DataTable from 'react-data-table-component';


interface Product {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}
interface DatasetState {
  mode: 'idle' | 'loading' | 'error'
  error?: string
  data: Product[]
  search?: string
  queryParams: {skip: number, limit: number}
  totalRows: number
}
interface FilteredSet {
  total:number
  skip: number
  limit: number
  products: Product[]
}

type DatasetAction = 
  { type: 'clear-search'}
| { type: 'reset'}
| { type: 'set-mode'; payload: DatasetState['mode'] }
| { type: 'set-search'; payload: string }
| { type: 'set-page'; payload: number }
| { type: 'set-rows-per-page'; payload: number }
| { type: 'set-error'; payload: string }
| { type: 'set-data'; payload: { data: FilteredSet} }

const DEFAULT_DATA_LIMIT = 20

function App() {
  const initialState: DatasetState = {
    mode: 'idle',
    data: [],
    queryParams: {skip:0, limit:DEFAULT_DATA_LIMIT},
    totalRows: 0,
  };
  const reducer = (state: DatasetState, action: DatasetAction): DatasetState | void => {
    switch (action.type) {
      case 'reset': {
        const newQueryParams = {skip: 0, limit: state.queryParams?.limit || DEFAULT_DATA_LIMIT};
        return {...initialState, queryParams: newQueryParams};
      }
      case 'set-mode': {
        if(state.mode == action.payload){
          return state
        }
        return { ...state, mode: action.payload };
      }
      case 'set-data': {
        const { data } = action.payload;
        const totalRows = data.total
        return { ...state, data: data.products, totalRows, mode: 'idle' };
      }
      case 'set-rows-per-page': {
        if(state.queryParams.limit === action.payload){
          return state
        }
        const newQueryParams = {...state.queryParams, limit: action.payload}
        return {...state, queryParams: newQueryParams};
      }
      case 'set-page': {
        const newSkip = (action.payload-1) * state.queryParams.limit
        if(newSkip == state.queryParams.skip){
          return state
        }
        const newQueryParams = {...state.queryParams, skip: newSkip}
        return {...state, queryParams: newQueryParams};
      }
      case 'set-error': {
        return {...state, error: action.payload};
      }
      case 'clear-search': {
        const newQueryParams = {skip: 0, limit: state.queryParams?.limit || DEFAULT_DATA_LIMIT};
        if(JSON.stringify(state.queryParams) == JSON.stringify(newQueryParams)){
          return state
        }
        return {...state, queryParams: newQueryParams};
      }
      case 'set-search': {
        if(state.search === action.payload) {
          return state
        }
        const newQueryParams = {name: action.payload, skip: 0, limit: state.queryParams?.skip || 0 }
        return {...state, queryParams: newQueryParams};
      }
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const columns =[
    {
      name: 'Title',
      selector: (row: any) => row.title,
    },
    {
      name: 'Description',
      selector: (row: any) => row.description,
    },
    {
      name: 'Price',
      selector: (row: any) => row.price/10,
    },
    {
      name: 'Picture',
      selector: (row: any) => <img src={row.thumbnail} style={{height:'40px'}} alt={row.title} />,
    },
  ]
  const fetchProducts = async () => {
    const res = await axios.get('https://dummyjson.com/products/?limit=20')
    console.log(res.data.products)
    setProducts(res.data.products)
  }
  useEffect(() => {
    fetchProducts()
    
  }, [])
  const handlePerRowsChange = (newPerPage: number) => {
    dispatch({ type: 'set-rows-per-page', payload: newPerPage });
  }
  function handlePageChange(page: number){
    dispatch({ type: 'set-page', payload: page });
  }
  const handleSearch = (term = '') => {
    if (term) {
      dispatch({ type: 'set-search', payload: term });
    } else {
      dispatch({ type: 'clear-search'})
      setSearchTerm('')
    }
  }
  const clearSearch = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    return handleSearch('')
  }
  return (
    <>
        <div style={{border: '1px solid red', backgroundColor: 'white', color:'black', height: '100%', width: '100%'}}>
        <input 
          type="text" 
          style={{backgroundColor: 'white', color:'black', marginTop: "20px", padding:'10px', width:"20%"}}
          placeholder="Search products" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <button onClick={handleSearch}>Search</button>
        {searchTerm && 
        <div>
          <p>Search results for "{searchTerm}" </p>
          <p><a href="#" onClick={clearSearch}>clear search</a></p>
        </div>
        }
        <DataTable
          title="Products"
          columns={columns}
          data={products}
          pagination
          paginationPerPage={state.queryParams.limit}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          paginationTotalRows={state.totalRows}
        />
        </div>
    </>
  )
}

export default App