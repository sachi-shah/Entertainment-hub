import {
    Button,
    createMuiTheme,
    Tab,
    Tabs,
    TextField,
    ThemeProvider,
  } from "@material-ui/core";
  import SearchIcon from "@material-ui/icons/Search";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import SingleContent from "../../components/SingleContent/SingleContent";


const Search = () => {
    const [type, setType] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [content, setContent] = useState([]);
    const [page, setPage] = useState(1);




    const darkTheme = createMuiTheme({
        palette: {
          type: "dark",
          primary: {
            main: "#fff",
          },
        },
      });

      const fetchSearch = async () => {
        try {
          const { data } = await axios.get(
            `https://api.themoviedb.org/3/search/${type ? "tv" : "movie"}?api_key=${
              process.env.REACT_APP_API_KEY
            }&language=en-US&query=${searchText}&page=${page}&include_adult=false`
          );
          setContent(data.results);
          // console.log(data);
        } catch (error) {
          console.error(error);
        }
      };


      useEffect(() => {
        window.scroll(0, 0);
        fetchSearch();
        // eslint-disable-next-line
      }, [type, page]);
    

    return (
        <div>
            <ThemeProvider theme={darkTheme}>
                <div style={{ display:"flex", margin: "15px 0"}}>
            <TextField
            style={{ flex: 1, }}
            className="searchBox"
            label="Search"
            variant="filled"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            onClick={fetchSearch}
            variant="contained"
            style={{ marginLeft: 10 }}
          >
            <SearchIcon fontSize="large" />
          </Button>
          </div>

            <Tabs value={type} indicatorColor='primary' textColor='primary'
            onChange = {(event, newValue) => {
                setType(newValue);
            }}
            style = {{paddingBottom: 5}}
            >
            
            <Tab style={{ width: "50%" }} label="Search Movies" />
          <Tab style={{ width: "50%" }} label="Search TV Series" />
            </Tabs>

          </ThemeProvider>

          <div className="trending">
        {content &&
          content.map((c) => (
            <SingleContent
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.title || c.name}
              date={c.first_air_date || c.release_date}
              media_type={type ? "tv" : "movie"}
              vote_average={c.vote_average}
            />
          ))}
        {searchText &&
          !content &&
          (type ? <h2>No Series Found</h2> : <h2>No Movies Found</h2>)}
      </div>
     
    </div>
        
    )
}
export default Search;

// https://api.themoviedb.org/3/discover/movie?api_key=852e8d80c9674eeb5c44353dbf5e4148&language=en-US&sort_by=popularity.desc&page=1&primary_release_year=2020&with_original_language=hi|kn|ml|ta|te  
//https://api.themoviedb.org/3/discover/movie?api_key=852e8d80c9674eeb5c44353dbf5e4148&language=en-US&sort_by=popularity.desc&page=1&with_original_language=hi|kn|ml|ta|te  

