import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import SingleContent from '../../components/SingleContent/SingleContent';
import useGenre from '../../hooks/useGenre';
import Genres from '../../components/Genres/Genres';
import CustomPagination from "../../components/Pagination/CustomPagination";
import NavigationIcon from "@material-ui/icons/Whatshot";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Fab from '@material-ui/core/Fab';
import Button from "@material-ui/core/Button";
import Tooltip from '@material-ui/core/Tooltip';

// import { CenterFocusStrong } from "@material-ui/icons";

const region_list = ['India', 'Canada', 'China','Norway','Spain']

const regioncode = {'India':'hi|kn|ml|ta|te', 'Canada': 'en|fr', 'China':'cn|zh','Norway': 'nb|no','Spain':'ca|es|eu|gl'}

function getModalStyle() {

    return {
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
    };
}

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        position: 'absolute',
        width: 350,
        backgroundColor: "black",
        opacity:0.8,
        color:"white",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const Region = () => {
    const classes = useStyles();
    const [genres, setGenres] = useState([]);
    const [page, setPage] = useState(1);
    const [content, setContent] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const genreforURL = useGenre(selectedGenres);
    const [numOfPages, setNumOfPages] = useState();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [lang, setLang] = useState("hi");

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
   

    const fetchMovies = async () => {
        
        //  const { data } = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=primary_release_date.desc&primary_release_date.gte=2010-01-01&primary_release_date.lte=2020-12-01&vote_average.gte=7&include_adult=false&include_video=false&page=${page}&with_genres=${genreforURL}`);
        const { data } = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&page=1&with_original_language=${lang}&page=${page}}&with_genres=${genreforURL}`);
        setContent(data.results);
        setNumOfPages(data.total_pages);
    }

    function display(user) {
        setLang(regioncode[user]);
        console.log(regioncode[user])
    }

    useEffect(() => {
        fetchMovies();
    }, [lang, page, genreforURL])

    return (
        <div>

      <span className="pageTitle">Regional Hits - Movies</span>
      <Tooltip title="Explore Movies of your region" arrow placement="top-start" >
      <Fab variant="extended" color="li" aria-label="edit" onClick={handleOpen}>
        <NavigationIcon />
            Select Region
        </Fab>
      </Tooltip>
      
        <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
            >
                <div style={modalStyle} className={classes.paper}>
                    <h2>Select a region of your choice</h2>
                    <hr/>
                    
                    <React.Fragment>
                        <ul style={{listStyleType:"none"}}>
                            {region_list.map((user) => (
                        <p><Button style={{fontSize:'18px',color:'white',padding:'8px', fontWeight:'bold'}} onClick={() => display(user)}><li>{user}</li></Button></p> ))}
                        </ul>
                    </React.Fragment>
                </div>
            </Modal>

      <Genres
        type="movie"
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        genres={genres}
        setGenres={setGenres}
        setPage={setPage}
      />
      <div className="trending">
        {
        content &&
          content.map((c) => (

            <SingleContent
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.title || c.name}
              date={c.first_air_date || c.release_date}
              media_type="movie"
              vote_average={c.vote_average}
            />
          ))}
        
      </div>
      {numOfPages > 1 && (
        <CustomPagination setPage={setPage} numOfPages={numOfPages} />
      )}
      </div>
    )
}
export default Region;