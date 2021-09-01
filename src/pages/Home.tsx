import { useState, useEffect } from "react";

import _find from "lodash/find";
import { makeStyles, createStyles } from "@material-ui/styles";
import {
  Container,
  Grid,
  Typography,
  Divider,
  Fab,
  Checkbox,
  Tooltip,
  IconButton,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
// import SettingsIcon from "@material-ui/icons/Settings";
import EditIcon from "@material-ui/icons/Edit";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

import HomeNavigation from "components/HomeNavigation";
import StyledCard from "components/StyledCard";

import routes from "constants/routes";
import { useRowyContext } from "contexts/RowyContext";
import { useAppContext } from "contexts/AppContext";
import useDoc, { DocActions } from "hooks/useDoc";
import TableSettingsDialog, {
  TableSettingsDialogModes,
} from "components/TableSettings";

import queryString from "query-string";
import ProjectSettings from "components/ProjectSettings";
import EmptyState from "components/EmptyState";
import WIKI_LINKS from "constants/wikiLinks";
import BuilderInstaller from "../components/BuilderInstaller";
import HomeWelcomePrompt from "components/HomeWelcomePrompt";

const useStyles = makeStyles((theme) =>
  createStyles({
    "@global": {
      html: { scrollBehavior: "smooth" },
    },

    root: {
      minHeight: "100vh",
      paddingBottom: theme.spacing(8),
    },

    section: {
      paddingTop: theme.spacing(10),
      "&:first-of-type": { marginTop: theme.spacing(2) },
    },
    sectionHeader: {
      color: theme.palette.text.secondary,
    },
    divider: { margin: theme.spacing(1, 0, 3) },

    cardGrid: {
      [theme.breakpoints.down("sm")]: { maxWidth: 360, margin: "0 auto" },
    },
    card: {
      height: "100%",
      [theme.breakpoints.up("md")]: { minHeight: 220 },
      [theme.breakpoints.down("lg")]: { minHeight: 180 },
    },
    favButton: {
      margin: theme.spacing(-0.5, -1, 0, 0),
    },
    configFab: {
      position: "fixed",
      bottom: theme.spacing(3),
      right: theme.spacing(12),
    },
    fab: {
      position: "fixed",
      bottom: theme.spacing(3),
      right: theme.spacing(3),
    },
  })
);

export default function HomePage() {
  const classes = useStyles();

  const [settingsDialogState, setSettingsDialogState] = useState<{
    mode: null | TableSettingsDialogModes;
    data: null | {
      collection: string;
      description: string;
      roles: string[];
      name: string;
      section: string;
      isCollectionGroup: boolean;
      tableType: string;
    };
  }>({
    mode: null,
    data: null,
  });

  const clearDialog = () =>
    setSettingsDialogState({
      mode: null,
      data: null,
    });

  useEffect(() => {
    const modal = decodeURIComponent(
      queryString.parse(window.location.search).modal as string
    );
    if (modal) {
      switch (modal) {
        case "settings":
          setOpenProjectSettings(true);
          break;
        default:
          break;
      }
    }
  }, [window.location.search]);
  const { sections } = useRowyContext();
  const { userDoc } = useAppContext();

  const favs = userDoc.state.doc?.favoriteTables
    ? userDoc.state.doc.favoriteTables
    : [];

  const handleCreateTable = () =>
    setSettingsDialogState({
      mode: TableSettingsDialogModes.create,
      data: null,
    });
  const [open, setOpen] = useState(false);
  const [openProjectSettings, setOpenProjectSettings] = useState(false);
  const [openBuilderInstaller, setOpenBuilderInstaller] = useState(false);

  const [settingsDocState, settingsDocDispatch] = useDoc({
    path: "_rowy_/settings",
  });
  useEffect(() => {
    if (!settingsDocState.loading && !settingsDocState.doc) {
      settingsDocDispatch({
        action: DocActions.update,
        data: { createdAt: new Date() },
      });
    }
  }, [settingsDocState]);
  if (settingsDocState.error?.code === "permission-denied") {
    return (
      <EmptyState
        fullScreen
        message="Access Denied"
        description={
          <>
            <Typography variant="overline">
              You do not have access to this project. Please contact the project
              owner.
            </Typography>
            <Typography variant="body2">
              If you are the project owner, please follow{" "}
              <a
                href={WIKI_LINKS.securityRules}
                target="_blank"
                rel="noopener noreferrer"
              >
                the instructions
              </a>{" "}
              to set up the project rules.
            </Typography>
          </>
        }
      />
    );
  }

  const TableCard = ({ table }) => {
    const checked = Boolean(_find(favs, table));
    return (
      <Grid
        key={table.name}
        item
        xs={12}
        sm={6}
        md={open ? 6 : 4}
        lg={4}
        xl={3}
      >
        <StyledCard
          className={classes.card}
          overline={table.section}
          title={table.name}
          headerAction={
            <Checkbox
              onClick={() => {
                userDoc.dispatch({
                  action: DocActions.update,
                  data: {
                    favoriteTables: checked
                      ? favs.filter((t) => t.collection !== table.collection)
                      : [...favs, table],
                  },
                });
              }}
              checked={checked}
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              name="checkedH"
              className={classes.favButton}
            />
          }
          bodyContent={table.description}
          primaryLink={{
            to: `${
              table.isCollectionGroup ? routes.tableGroup : routes.table
            }/${table.collection.replace(/\//g, "~2F")}`,
            label: "Open",
          }}
          secondaryAction={
            <IconButton
              onClick={() =>
                setSettingsDialogState({
                  mode: TableSettingsDialogModes.update,
                  data: table,
                })
              }
              aria-label="Edit table"
            >
              <EditIcon />
            </IconButton>
          }
        />
      </Grid>
    );
  };

  return (
    <HomeNavigation
      open={open}
      setOpen={setOpen}
      handleCreateTable={handleCreateTable}
    >
      <main className={classes.root}>
        {sections && Object.keys(sections).length > 0 ? (
          <Container>
            {favs.length !== 0 && (
              <section id="favorites" className={classes.section}>
                <Typography
                  variant="h6"
                  component="h1"
                  className={classes.sectionHeader}
                >
                  Favorites
                </Typography>
                <Divider className={classes.divider} />
                <Grid
                  container
                  spacing={4}
                  justifyContent="flex-start"
                  className={classes.cardGrid}
                >
                  {favs.map((table) => (
                    <TableCard key={table.collection} table={table} />
                  ))}
                </Grid>
              </section>
            )}

            {sections &&
              Object.keys(sections).length > 0 &&
              Object.keys(sections).map((sectionName) => (
                <section
                  key={sectionName}
                  id={sectionName}
                  className={classes.section}
                >
                  <Typography
                    variant="h6"
                    component="h1"
                    className={classes.sectionHeader}
                  >
                    {sectionName === "undefined" ? "Other" : sectionName}
                  </Typography>

                  <Divider className={classes.divider} />

                  <Grid
                    container
                    spacing={4}
                    justifyContent="flex-start"
                    className={classes.cardGrid}
                  >
                    {sections[sectionName].map((table, i) => (
                      <TableCard
                        key={`${i}-${table.collection}`}
                        table={table}
                      />
                    ))}
                  </Grid>
                </section>
              ))}

            <section className={classes.section}>
              <Tooltip title="Create Table">
                <Fab
                  className={classes.fab}
                  color="secondary"
                  aria-label="Create table"
                  onClick={handleCreateTable}
                >
                  <AddIcon />
                </Fab>
              </Tooltip>
              {/* <Tooltip title="Configure Rowy">
              <Fab
                className={classes.configFab}
                color="secondary"
                aria-label="Create table"
                onClick={() => setOpenProjectSettings(true)}
              >
                <SettingsIcon />
              </Fab>
            </Tooltip> */}
            </section>
          </Container>
        ) : (
          <Container>
            <HomeWelcomePrompt />
            <Fab
              className={classes.fab}
              color="secondary"
              aria-label="Create table"
              onClick={handleCreateTable}
            >
              <AddIcon />
            </Fab>
          </Container>
        )}
      </main>

      <TableSettingsDialog
        clearDialog={clearDialog}
        mode={settingsDialogState.mode}
        data={settingsDialogState.data}
      />
      {openProjectSettings && (
        <ProjectSettings
          handleClose={() => setOpenProjectSettings(false)}
          handleOpenBuilderInstaller={() => setOpenBuilderInstaller(true)}
        />
      )}
      {openBuilderInstaller && (
        <BuilderInstaller handleClose={() => setOpenBuilderInstaller(false)} />
      )}
    </HomeNavigation>
  );
}
