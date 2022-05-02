import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useSnackbar } from "notistack";

import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Tooltip,
  IconButton,
  Typography,
} from "@mui/material";
import CopyIcon from "@src/assets/icons/Copy";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import MultiSelect from "@rowy/multiselect";

import {
  globalScope,
  rolesAtom,
  projectSettingsAtom,
  rowyRunAtom,
  openRowyRunModalAtom,
  UserSettings,
  updateUserAtom,
  confirmDialogAtom,
} from "@src/atoms/globalScope";
import { runRoutes } from "@src/constants/runRoutes";
import { USERS } from "@src/config/dbPaths";

export default function UserItem({
  _rowy_id,
  user,
  roles: rolesProp,
}: UserSettings) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const confirm = useSetAtom(confirmDialogAtom, globalScope);
  const openRowyRunModal = useSetAtom(openRowyRunModalAtom, globalScope);

  const [projectRoles] = useAtom(rolesAtom, globalScope);
  const [projectSettings] = useAtom(projectSettingsAtom, globalScope);
  const [rowyRun] = useAtom(rowyRunAtom, globalScope);
  const [updateUser] = useAtom(updateUserAtom, globalScope);

  const [value, setValue] = useState(Array.isArray(rolesProp) ? rolesProp : []);
  const allRoles = new Set(["ADMIN", ...(projectRoles ?? []), ...value]);

  const handleSave = async () => {
    try {
      if (!user) throw new Error("User is not defined");
      if (JSON.stringify(value) === JSON.stringify(rolesProp)) return;

      const loadingSnackbarId = enqueueSnackbar("Setting roles…");

      const res = await rowyRun?.({
        route: runRoutes.setUserRoles,
        body: { email: user!.email, roles: value },
      });
      if (res.success) {
        if (!updateUser) throw new Error("Could not update user document");
        await updateUser(_rowy_id!, { roles: value });
        closeSnackbar(loadingSnackbarId);
        enqueueSnackbar(`Set roles for ${user!.email}: ${value.join(", ")}`);
      }
    } catch (e: any) {
      console.error(e);
      enqueueSnackbar(`Failed to set roles for ${user!.email}: ${e.message}`);
    }
  };

  const listItemChildren = (
    <>
      <ListItemAvatar>
        <Avatar src={user?.photoURL}>
          {user?.displayName ? user.displayName[0] : undefined}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={user?.displayName}
        secondary={user?.email}
        sx={{
          overflowX: "hidden",
          "& > *": { userSelect: "all" },
        }}
        primaryTypographyProps={{ variant: "body1" }}
      />
    </>
  );

  const handleDelete = async () => {
    if (!projectSettings.rowyRunUrl) {
      openRowyRunModal({ feature: "User Management" });
      return;
    }

    confirm({
      open: true,
      title: "Delete user?",
      body: (
        <>
          <ListItem children={listItemChildren} disablePadding sx={{ mb: 3 }} />
          You will delete the user in Firebase Authentication and the
          corresponding user document in <code>{USERS}</code>.
        </>
      ),
      confirm: "Delete",
      confirmColor: "error",
      handleConfirm: async () => {
        if (!user) return;
        const loadingSnackbarId = enqueueSnackbar("Deleting user…");
        const response = await rowyRun({
          route: runRoutes.deleteUser,
          body: { email: user.email },
        });
        closeSnackbar(loadingSnackbarId);
        if (response) enqueueSnackbar(`Deleted user: ${user.email}`);
      },
    });
  };

  return (
    <ListItem
      children={listItemChildren}
      secondaryAction={
        <>
          <MultiSelect
            label="Roles"
            value={value}
            options={Array.from(allRoles)}
            onChange={setValue}
            freeText
            TextFieldProps={{
              SelectProps: {
                renderValue: () => {
                  if (Array.isArray(value)) {
                    if (value.length === 1) return value[0];
                    if (value.length > 1) return `${value.length} roles`;
                    return (
                      <Typography variant="inherit" color="text.disabled">
                        No roles
                      </Typography>
                    );
                  }
                  return null;
                },
              },

              fullWidth: false,
              sx: {
                mr: 0.5,

                "&& .MuiInputLabel-root": {
                  opacity: 0,
                  mt: -3,
                },

                "&& .MuiFilledInput-root": {
                  bgcolor: "transparent",
                  boxShadow: 0,
                  "&::before": { content: "none" },

                  "&:hover, &.Mui-focused": { bgcolor: "action.hover" },
                },
                "&& .MuiSelect-select.MuiFilledInput-input": {
                  typography: "button",
                  pl: 1,
                  pr: 3.25,
                },
                "&& .MuiSelect-icon": {
                  right: 2,
                },
              },
            }}
            onClose={handleSave}
          />

          <Tooltip title="Copy UID">
            <IconButton
              aria-label="Copy UID"
              onClick={async () => {
                if (!_rowy_id) return;
                await navigator.clipboard.writeText(_rowy_id);
                enqueueSnackbar(`Copied UID for ${user?.email}: ${_rowy_id}`);
              }}
            >
              <CopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete…">
            <IconButton
              aria-label="Delete…"
              color="error"
              onClick={handleDelete}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      }
      sx={{
        pr: 1,

        "& .MuiListItemSecondaryAction-root": {
          position: "static",
          transform: "none",
          marginLeft: "auto",

          display: "flex",
          alignItems: "center",
        },
      }}
    />
  );
}
