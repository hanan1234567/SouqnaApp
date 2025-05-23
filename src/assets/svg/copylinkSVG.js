import * as React from "react";
import Svg, { Path } from "react-native-svg";
const CopyLinkSVG = (props) => (
  <Svg
    width="800px"
    height="800px"
    viewBox="0 0 36 36"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    aria-hidden="true"
    role="img"
    className="iconify iconify--twemoji"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <Path
      fill="#8899A6"
      d="M15 9l6-6s6-6 12 0s0 12 0 12l-8 8s-6 6-12 0c-1.125-1.125-1.822-2.62-1.822-2.62l3.353-3.348S14.396 18.396 16 20c0 0 3 3 6 0l8-8s3-3 0-6s-6 0-6 0l-3.729 3.729s-1.854-1.521-5.646-.354L15 9z"
    />
    <Path
      fill="#8899A6"
      d="M20.845 27l-6 6s-6 6-12 0s0-12 0-12l8-8s6-6 12 0c1.125 1.125 1.822 2.62 1.822 2.62l-3.354 3.349s.135-1.365-1.469-2.969c0 0-3-3-6 0l-8 8s-3 3 0 6s6 0 6 0l3.729-3.729s1.854 1.521 5.646.354l-.374.375z"
    />
  </Svg>
);
export default CopyLinkSVG;
