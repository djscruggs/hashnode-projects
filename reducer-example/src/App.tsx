import { useState, useEffect, useReducer } from 'react'
import axios from 'axios'
import './App.css'
import DataTable from 'react-data-table-component';


// shape of a row in the table
interface Product {
  id: number
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}
// shape of the data returned from the API
interface FilteredSet {
  total:number
  skip: number
  limit: number
  products: Product[]
}
// shape of the params and data to be rendered and mutated in response to user events
interface DataParams {
  url: string
  status: 'idle' | 'loading' | 'error'
  error?: string
  searchTerm?: string
  queryParams: {skip: number, limit: number} // pagination params
  data: FilteredSet['products'] // data to be rendered
  totalRows: FilteredSet['total'] // total rows in unfiltered set for use in pagination
}


type Action = 
  { type: 'clear-search'}
| { type: 'reset'}
| { type: 'set-status', payload: DataParams['status'] }
| { type: 'set-search', payload: string }
| { type: 'set-page', payload: number }
| { type: 'set-rows-per-page', payload: number }
| { type: 'set-error', payload: string }
| { type: 'set-data', payload: FilteredSet }



function App() {
  const initialState: DataParams = {
    url: 'https://dummyjson.com/products',
    status: 'idle',
    data: [],
    queryParams: {skip:0, limit:20},
    totalRows: 0,
  }
  const reducer = (state: DataParams, action: Action): DataParams => {
    switch (action.type) {
      case 'reset': {
        const newQueryParams = {skip: 0, limit: state.queryParams?.limit || 20};
        return {...initialState, queryParams: newQueryParams};
      }
      case 'set-status': {
        return { ...state, status: action.payload };
      }
      case 'set-data': {
        const totalRows = action.payload.total
        return { ...state, data: action.payload.products, totalRows, status: 'idle' };
      }
      case 'set-rows-per-page': {
        const newQueryParams = {...state.queryParams, limit: action.payload}
        return {...state, queryParams: newQueryParams};
      }
      case 'set-page': {
        const newSkip = action.payload<=1 ? 0 : (action.payload-1) * state.queryParams.limit
        const newQueryParams = {...state.queryParams, skip: newSkip}
        return {...state, queryParams: newQueryParams};
      }
      case 'set-error': {
        return {...state, error: action.payload};
      }
      case 'clear-search': {
        const newQueryParams = {skip: 0, limit: state.queryParams?.limit || 20};
        const url = 'https://dummyjson.com/products'
        return {...state, url, queryParams: newQueryParams};
      }
      case 'set-search': {
        const url = 'https://dummyjson.com/products/search'
        const newQueryParams = {q: action.payload, skip: 0, limit: state.queryParams?.limit || 20 }
        const result =  {...state, url, queryParams: newQueryParams}
        return result
      }
      default: {
        throw new Error(`Invalid action called: ${(action as Action).type}`)
      }
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState)
  const [searchTerm, setSearchTerm] = useState('')
  const columns =[
    {
      name: 'Title',
      selector: (row: Product) => row.title,
    },
    {
      name: 'Description',
      selector: (row: Product) => row.description,
    },
    {
      name: 'Price',
      selector: (row: Product) => `$${(row.price/10).toFixed(2)}`,
    },
    {
      name: 'Picture',
      cell: (row: Product) => <img src={row.thumbnail} style={{height:'40px'}} alt={row.title} />,
    },
  ]
  
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'set-status', payload: 'loading'})
      const res = await axios.get(state.url, {params: state.queryParams})
      dispatch({ type: 'set-data', payload: res.data})
      dispatch({ type: 'set-status', payload: 'idle'})
    }
    fetchProducts()    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.queryParams])
  const handlePerRowsChange = (newPerPage: number) => {
    dispatch({ type: 'set-rows-per-page', payload: newPerPage });
  }
  function handlePageChange(page: number){
    
    dispatch({ type: 'set-page', payload: page })
  }
  const handleSearchTerm = (term: string) => {
    setSearchTerm(term)
    //if term is blank, clear search
    if(!term){  
      dispatch({ type: 'clear-search'})
    }
  }
  const triggerSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch({ type: 'set-search', payload: searchTerm });
  }
  const clearSearch = () => {
    setSearchTerm('')
    dispatch({ type: 'clear-search'})
  }
  
  return (
    <>
        <div style={{color:'black', height: '100%', minWidth: '90vw'}}>
          <form onSubmit={triggerSearch}>
          <input 
            type="text" 
            style={{color:'black', marginTop: "20px", marginRight: "20px", padding:'10px', width:"20vh"}}
            placeholder="Search products" 
            onChange = {(e) => handleSearchTerm(e.target.value)}
            value={searchTerm} 
          />
          <button type="submit">Search</button>
          </form>
          {state.queryParams.q && 
          <div>
            <p>Search results for "{state.queryParams.q}" 
            <span style={{fontSize: '12px', marginLeft: '10px',  cursor: 'pointer', textDecoration: 'underline', color:'blue'}} onClick={clearSearch}>clear search</span>
            </p>
            
          </div>
          }
          {state.status == 'loading' && <p>Loading...</p>}
          {state.status == 'error' && <p>Error: {state.error}</p>}
          
            <DataTable
              title="Products"
              style={{width: '100%', minWidth: '100vw'}}
              columns={columns}
              data={state.data}
              pagination
              paginationServer
              onChangePage={handlePageChange}
              paginationPerPage={state.queryParams.limit}
              onChangeRowsPerPage={handlePerRowsChange}
              paginationTotalRows={state.totalRows}
            />
          
        </div>
    </>
  )
}

export default App