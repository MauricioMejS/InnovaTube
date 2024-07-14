import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Grid,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
} from "@mui/material";

let timerId;
export async function fetchVideos(setVideos, search) {
  
  console.log(search);
  const apiKey = process.env.YOUTUBE_API_KEY;
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&maxResults=20&eventType=completed&type=video&q=dogs${search}`;
    const responseVideos = fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            
        },
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error al obtener videos");
    }
    return res.json(); 
    })
    .then((data) => {
      console.log(data);
      setVideos(data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        image: item.snippet.thumbnails.high.url,

      })));
    })
    .catch((error) => {
        console.error("Error al obtener videos", error);
    })
}

export default function MenuLayout({ children }) {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");


  useEffect(() => {
    fetchVideos(setVideos, search);
  }, [search]);
  console.log(videos);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleSearchChange = (event) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      setSearch(event.target.value);
    }, 500);
  };

  const handleFavoriteClick = (videoId) => {
    console.log(`Video ${videoId} marked as favorite.`);
  };
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar className="bg-gray-900" variant="dense">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleClick}
            >
              <MenuIcon />
            </IconButton>
            <label>InnovaTube</label>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              getContentAnchorEl={null}
            >
              <MenuItem onClick={handleClose}>Favoritos</MenuItem>
              <MenuItem onClick={handleClose}>Cerrar sesión</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </Box>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <input className="px-3 py-2 rounded-xl w-full mb-6" placeholder="Busqueda" type="text" onChange={handleSearchChange} />
        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item key={video.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="rounded-[12px]" >
                <CardActionArea>
                  <CardMedia
                    className="h-[150px]"
                    component="img"
                    height="100"
                    image={video.image}
                    alt={video.title}
                  />
                  <CardContent className="p-2">
                    <label className="label-container">
                      {video.title}
                    </label>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon onClick={() => handleFavoriteClick(video.id)} />
                </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
