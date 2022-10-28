import RatingIcon from "@mui/icons-material/Star";
import RatingOutlineIcon from "@mui/icons-material/StarBorder"
import { get } from "lodash-es";


export default function Icon(config: any, isEmpty: Boolean) {
// console.log(config)
 if (isEmpty) {
    //console.log(getStateOutline(config))
    return getStateOutline(config.config)
 } else {
    return getStateIcon(config.config)
}
} 

const getStateIcon = (config: any) => {
    // only use the config to get the custom rating icon if enabled via toggle
    if (!get(config, "customIcons.enabled")) { return <RatingIcon /> }
    console.log(get(config, "customIcons.rating"))
    return get(config, "customIcons.rating") || <RatingIcon />;
  };
const getStateOutline = (config: any) => {
    if (!get(config, "customIcons.enabled")) { return <RatingOutlineIcon /> }
    return get(config, "customIcons.rating") || <RatingOutlineIcon />;
  }