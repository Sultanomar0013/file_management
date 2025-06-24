import { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, useMediaQuery } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";
import { getMenuItems } from "./menuOption";

import getTheme from './theme/theme';


const drawerWidth = 240;

const SideBar = ({ open, toggleSidebar }) => {

  const location = useLocation(); 
  const theme = useTheme();
  const [openMenus, setOpenMenus] = useState({});

  const menuItems = getMenuItems(location.pathname);

  // const handleToggle = (segment) => {
  //   setOpenMenus((prev) => ({ ...prev, [segment]: !prev[segment] }));
  // };

  const handleToggle = (segment) => {
    setOpenMenus((prev) => {
      // Close all menus except the one being clicked
      const newOpenMenus = { [segment]: !prev[segment] };

      // Optionally, collapse any other open menus
      Object.keys(prev).forEach((key) => {
        if (key !== segment) {
          newOpenMenus[key] = false; // Close other menus
        }
      });

      return newOpenMenus;
    });
  };



  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));



  const handleClick = () => {
    if (isSmallScreen) {
      toggleSidebar();
      console.log("Sidebar toggled, new state:", !open);
    }
  };


  return (
    <Drawer
      sx={{

        width: open ? drawerWidth : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          mt: "64px",
        },
      }}
      variant={isSmallScreen ? "temporary" : "persistent"}
      anchor="left"
      open={open}
    >
      <List>
        {menuItems.map(({ segment, title, icon, path, children }) => (
          <div key={segment}>
            {path ? (
              // Regular menu item
              <ListItem
                component={Link}
                to={path}
                onClick={isSmallScreen ? () => handleClick() : undefined}
                sx={{
                  backgroundColor:
                  location.pathname === path
                      ? theme.palette.primary.main
                      : "",

                "&:hover": {
                  backgroundColor: theme.palette.secondary.main
                },
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={title} />
              </ListItem>
            ) : (
              // Parent menu item with children
              <>
                <ListItem onClick={() => handleToggle(segment)}   sx={{

                          backgroundColor: "inherit",
                            "&:hover": {
                              backgroundColor: theme.palette.secondary.main
                            },
                          textDecoration: "none",
                          color: "inherit",
                        }}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={title} />
                  {openMenus[segment] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openMenus[segment]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {children.map(({ segment: childSegment, title: childTitle, path: childPath, icon: childIcon }) => (
                      <ListItem
                        key={childSegment}
                        component={Link}
                        to={childPath}
                        onClick={isSmallScreen ? () => handleClick(): undefined}
                        sx={{
                          pl: 4,
                          backgroundColor:
                              location.pathname === childPath
                                  ? theme.palette.primary.main
                                  : "",

                            "&:hover": {
                              backgroundColor: theme.palette.secondary.main
                            },
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <ListItemIcon>{childIcon}</ListItemIcon>
                        <ListItemText primary={childTitle} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            )}
          </div>
        ))}
      </List>
    </Drawer>
  );
};

export default SideBar;
