import React, { useState, useEffect } from "react";
import clsx from "clsx";
import _find from "lodash/find";

import {
  createStyles,
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import Breadcrumbs from "./Breadcrumbs";
import NavDrawer from "./NavDrawer";

import { DRAWER_COLLAPSED_WIDTH } from "components/SideDrawer";
import { useFiretableContext } from "contexts/firetableContext";
import UserMenu from "./UserMenu";

export const APP_BAR_HEIGHT = 56;

const useStyles = makeStyles((theme) =>
  createStyles({
    appBar: {
      paddingRight: DRAWER_COLLAPSED_WIDTH,
      height: APP_BAR_HEIGHT,

      [theme.breakpoints.down("sm")]: { paddingRight: 0 },
    },

    maxHeight: {
      height: APP_BAR_HEIGHT,
      minHeight: "auto",
      minWidth: 0,
      maxWidth: "none",
      padding: theme.spacing(0.75, 2),
    },

    toolbar: {
      padding: theme.spacing(0, 1.5),
    },

    breadcrumbs: {
      flex: 1,
    },
  })
);

export default function Navigation({
  children,
  tableCollection,
}: React.PropsWithChildren<{ tableCollection: string }>) {
  const { tables } = useFiretableContext();
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [tableCollection]);

  // Find the matching section for the current route
  const currentSection = _find(tables, [
    "collection",
    tableCollection?.split("/")[0],
  ])?.section;
  const currentTable = tableCollection?.split("/")[0];

  return (
    <>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={clsx(classes.maxHeight, classes.toolbar)}>
          <IconButton
            aria-label="Open navigation drawer"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Breadcrumbs className={classes.breadcrumbs} />

          <UserMenu />
        </Toolbar>
      </AppBar>

      <NavDrawer
        currentSection={currentSection}
        currentTable={currentTable}
        open={open}
        onClose={() => setOpen(false)}
      />

      {children}
    </>
  );
}
