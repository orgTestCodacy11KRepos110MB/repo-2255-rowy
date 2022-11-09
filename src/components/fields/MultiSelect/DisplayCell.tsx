import { IDisplayCellProps } from "@src/components/fields/types";

import { ButtonBase, Grid } from "@mui/material";
import { ChevronDown } from "@src/assets/icons";

import { sanitiseValue } from "./utils";
import ChipList from "@src/components/Table/formatters/ChipList";
import FormattedChip from "@src/components/FormattedChip";

export default function MultiSelect({
  value,
  showPopoverCell,
  disabled,
}: IDisplayCellProps) {
  // if (typeof value === "string" && value !== "")
  // return <ConvertStringToArray value={value} onSubmit={onSubmit} />;

  return (
    <ButtonBase
      onClick={() => showPopoverCell(true)}
      disabled={disabled}
      style={{
        width: "100%",
        height: "100%",
        font: "inherit",
        color: "inherit !important",
        letterSpacing: "inherit",
        textAlign: "inherit",
        justifyContent: "flex-start",
      }}
    >
      <ChipList>
        {sanitiseValue(value).map(
          (item) =>
            typeof item === "string" && (
              <Grid item key={item}>
                <FormattedChip label={item} />
              </Grid>
            )
        )}
      </ChipList>

      {!disabled && <ChevronDown className="row-hover-iconButton end" />}
    </ButtonBase>
  );
}