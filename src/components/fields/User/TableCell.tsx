import { IHeavyCellProps } from "../types";

import { Tooltip, Chip, Avatar } from "@mui/material";

import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "constants/dates";

export default function User({ value }: IHeavyCellProps) {
  if (!value || !value.displayName) return null;

  const chip = (
    <Chip
      size="small"
      avatar={<Avatar alt="Avatar" src={value.photoURL} />}
      label={value.displayName}
      sx={{ mx: -0.25, height: 24 }}
    />
  );

  if (!value.timestamp) return chip;

  const dateLabel = format(
    value.timestamp.toDate ? value.timestamp.toDate() : value.timestamp,
    DATE_TIME_FORMAT
  );

  return <Tooltip title={dateLabel}>{chip}</Tooltip>;
}
